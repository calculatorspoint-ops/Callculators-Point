/**
 * @file geoStore.js
 * @description Zustand persistent store for worldwide geo-localisation.
 *
 * Detection chain (first success wins):
 *   1. Previously persisted user selection (localStorage)
 *   2. IP-based geolocation  → ipapi.co/json  (3 s timeout)
 *   3. Browser navigator.language  ("en-PK" → "PK")
 *   4. Hard fallback  → "US"
 *
 * Exported selectors (pick inside components to avoid re-renders):
 *   useGeoStore(s => s.countryCode)
 *   useGeoStore(s => s.rules)          // full COUNTRY_RULES entry
 *   useGeoStore(s => s.currency)       // shorthand
 *   useGeoStore(s => s.locale)         // shorthand
 *   useGeoStore(s => s.setCountry)     // manual override
 *   useGeoStore(s => s.formatMoney)    // (value) => string
 *   useGeoStore(s => s.formatNum)      // (value, opts?) => string
 *   useGeoStore(s => s.formatDate)     // (date) => string
 *   useGeoStore(s => s.detectRegion)   // re-run detection
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

// ── IP detection ─────────────────────────────────────────────────────────────

const IP_API_URL  = 'https://ipapi.co/json/';
const IP_API_TIMEOUT_MS = 3500;

/**
 * Attempt to resolve country code from IP geolocation API.
 * Returns ISO-3166-1 alpha-2 string or null on failure.
 */
async function detectFromIP() {
  try {
    const res = await fetch(IP_API_URL, {
      signal: AbortSignal.timeout(IP_API_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const code = data?.country_code?.toUpperCase();
    if (code && COUNTRY_RULES[code]) return code;
  } catch { /* silent */ }
  return null;
}

/**
 * Attempt to resolve country code from navigator.language.
 * e.g. "en-PK" → "PK", "en-US" → "US"
 */
function detectFromLocale() {
  try {
    const lang = navigator.language || navigator.languages?.[0] || '';
    const code = lang.split('-')[1]?.toUpperCase();
    if (code && COUNTRY_RULES[code]) return code;
  } catch { /* silent */ }
  return null;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useGeoStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      countryCode   : 'US',
      rules         : COUNTRY_RULES.US,
      autoDetected  : false,
      userSelected  : false,
      detecting     : false,
      detectionError: null,

      // ── Formatting helpers (always read countryCode fresh via get()) ───────
      formatMoney: (value) => formatCurrency(value, get().countryCode),
      formatNum  : (value, opts) => formatNumber(value, get().countryCode, opts),
      formatDate : (date) => formatDate(date, get().countryCode),

      // ── Actions ───────────────────────────────────────────────────────────

      /**
       * Manually set the country (user override).
       * Marks userSelected=true so auto-detection won't override it next time.
       * @param {string} code - ISO-3166-1 alpha-2
       */
      setCountry: (code) => {
        const upper = code?.toUpperCase();
        if (!upper || !COUNTRY_RULES[upper]) {
          console.warn(`[GeoStore] Unknown country code: ${code}`);
          return;
        }
        set({
          countryCode  : upper,
          rules        : getRules(upper),
          userSelected : true,
          detectionError: null,
        });
      },

      /**
       * Reset to auto-detection (clears userSelected flag then re-detects).
       */
      resetToAuto: async () => {
        set({ userSelected: false, autoDetected: false });
        await get().detectRegion();
      },

      /**
       * Run the full detection chain.
       * Skipped if user has already made a manual selection.
       */
      detectRegion: async () => {
        if (get().userSelected) return;    // respect user choice
        if (get().detecting)    return;    // prevent concurrent runs

        set({ detecting: true, detectionError: null });

        let code = null;

        // 1️⃣  IP API
        code = await detectFromIP();

        // 2️⃣  Browser locale fallback
        if (!code) code = detectFromLocale();

        // 3️⃣  Hard fallback
        if (!code) code = 'US';

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
      name: 'CalcPoint-geo-v1',
      // Only persist the country selection; rules are re-derived on rehydrate
      partialize: (s) => ({
        countryCode : s.countryCode,
        userSelected: s.userSelected,
        autoDetected: s.autoDetected,
      }),
      // After localStorage restore, push updated rules through set() so all
      // subscribers re-render with the correct rules object.
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          // Use the store's own set to trigger subscriber notifications
          useGeoStore.setState({ rules: getRules(state.countryCode) });
        }
      },
    }
  )
);

// ── Bootstrap helper (call once in main.tsx / App.tsx) ─────────────────────

/**
 * Trigger region detection once on app startup.
 * Safe to call multiple times — internally guarded.
 */
export function initGeoDetection() {
  const { autoDetected, userSelected, detectRegion } = useGeoStore.getState();
  if (!autoDetected && !userSelected) {
    detectRegion();
  }
}
