/**
 * @file geoStore.js
 * @description Zustand persistent store for worldwide geo-localisation.
 *
 * Detection chain (first success wins):
 *   1. Persisted user-manual selection  → skip detection entirely
 *   2. ipapi.co/json  (primary, 4 s timeout)
 *   3. ip-api.com     (secondary — higher rate limit)
 *   4. navigator.language  ("en-PK" → "PK")
 *   5. Hard fallback  → "US"
 *
 * KEY FIX: autoDetected is NEVER persisted to localStorage.
 * This ensures every page load re-runs IP detection, so users in Pakistan
 * see PKR and users in India see INR — not a cached "US" from a prior session.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  COUNTRY_RULES,
  getRules,
  formatCurrency,
  formatNumber,
  formatDate,
} from './countryRules.js';

// ── IP detection helpers ─────────────────────────────────────────────────────

const TIMEOUT_MS = 4000;

async function tryIpApiCo() {
  try {
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`ipapi.co HTTP ${res.status}`);
    const data = await res.json();
    const code = data?.country_code?.toUpperCase();
    if (code && COUNTRY_RULES[code]) return code;
  } catch { /* silent */ }
  return null;
}

async function tryIpApiDotCom() {
  try {
    // ip-api.com allows 45 requests/minute on free tier — good secondary
    const res = await fetch('https://ip-api.com/json/?fields=countryCode', {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`ip-api.com HTTP ${res.status}`);
    const data = await res.json();
    const code = data?.countryCode?.toUpperCase();
    if (code && COUNTRY_RULES[code]) return code;
  } catch { /* silent */ }
  return null;
}

function detectFromLocale() {
  try {
    const langs = [navigator.language, ...(navigator.languages || [])];
    for (const lang of langs) {
      const code = lang?.split('-')[1]?.toUpperCase();
      if (code && COUNTRY_RULES[code]) return code;
    }
  } catch { /* silent */ }
  return null;
}

// ── Zustand store ─────────────────────────────────────────────────────────────

export const useGeoStore = create(
  persist(
    (set, get) => ({
      // ── Core state ──────────────────────────────────────────────────────────
      countryCode   : 'US',
      rules         : COUNTRY_RULES.US,
      autoDetected  : false,   // ephemeral — NOT persisted (see partialize)
      userSelected  : false,   // persisted — manual user override
      detecting     : false,
      detectionError: null,

      // ── Formatting helpers ───────────────────────────────────────────────────
      formatMoney: (value)       => formatCurrency(value, get().countryCode),
      formatNum  : (value, opts) => formatNumber(value, get().countryCode, opts),
      formatDate : (date)        => formatDate(date, get().countryCode),

      // ── Actions ──────────────────────────────────────────────────────────────

      /** User-initiated country override — persisted. */
      setCountry: (code) => {
        const upper = code?.toUpperCase();
        if (!upper || !COUNTRY_RULES[upper]) {
          console.warn('[GeoStore] Unknown country code:', code);
          return;
        }
        set({ countryCode: upper, rules: getRules(upper), userSelected: true, detectionError: null });
      },

      /** Clear manual override and re-detect from IP. */
      resetToAuto: async () => {
        set({ userSelected: false, autoDetected: false });
        await get().detectRegion();
      },

      /**
       * Full IP-detection chain.
       * Blocked only by userSelected (manual pick) or concurrent detecting.
       * NOT blocked by autoDetected — we always re-detect on load.
       */
      detectRegion: async () => {
        if (get().userSelected) return;
        if (get().detecting)    return;

        set({ detecting: true, detectionError: null });

        let code =
          (await tryIpApiCo())    ||
          (await tryIpApiDotCom()) ||
          detectFromLocale()       ||
          'US';

        set({
          countryCode   : code,
          rules         : getRules(code),
          autoDetected  : true,
          detecting     : false,
          detectionError: null,
        });
      },
    }),
    {
      name: 'CalcPoint-geo-v2',
      // ⚠️ NEVER persist autoDetected — must always re-detect on page load
      partialize: (s) => ({
        countryCode : s.countryCode,
        userSelected: s.userSelected,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          // Re-attach rules after localStorage restore (set() triggers re-renders)
          useGeoStore.setState({ rules: getRules(state.countryCode) });
        }
      },
    }
  )
);

// ── Bootstrap (call once in App.tsx via useEffect) ───────────────────────────

/**
 * Always re-runs IP detection on every page load unless user explicitly
 * chose a country. This is the only correct behaviour — cached locale
 * would leave Pakistan/India users stuck showing "US".
 */
export function initGeoDetection() {
  const { userSelected, detecting, detectRegion } = useGeoStore.getState();
  if (!userSelected && !detecting) {
    detectRegion();
  }
}
