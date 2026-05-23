/**
 * @file geoStore.js
 * @description Zustand persistent store for worldwide geo-localisation.
 *
 * Detection chain (first success wins):
 *   1. Persisted user-manual selection  → skip detection entirely
 *   2. Server/CDN headers (CF-IPCountry, x-vercel-ip-country, x-country-code)
 *      — only available via /api/geo on a server-side render; for pure SPA we skip
 *   3. ipapi.co/json  (primary IP geolocation, 4 s timeout)
 *   4. ip-api.com     (secondary IP geolocation — higher rate limit)
 *   5. navigator.language  ("en-PK" → "PK")
 *   6. Intl timezone map  ("Asia/Karachi" → "PK")
 *   7. Hard fallback  → "US"
 *
 * KEY FIXES (v3):
 *   - autoDetected is NEVER persisted to localStorage.
 *   - detectionSource is tracked and exposed.
 *   - Full debug console logs during detection.
 *   - Timezone-to-country fallback added.
 *   - userSelected persisted — manual override survives refresh.
 *   - Rules are always re-attached after rehydration.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  COUNTRY_RULES,
  getRules,
  formatCurrency,
  formatNumber,
  formatDate,
} from './countryRules';

// ── Debug logger ─────────────────────────────────────────────────────────────

const DEV = (process.env.NODE_ENV !== 'production');

function geoLog(...args) {
  if (DEV) console.log('[GeoEngine]', ...args);
}
function geoWarn(...args) {
  if (DEV) console.warn('[GeoEngine]', ...args);
}

// ── Timezone → Country mapping (common timezones) ────────────────────────────

const TIMEZONE_COUNTRY_MAP = {
  'Asia/Karachi'          : 'PK',
  'Asia/Kolkata'          : 'IN',
  'Asia/Calcutta'         : 'IN',
  'Asia/Dhaka'            : 'BD',
  'Asia/Colombo'          : 'LK',
  'Asia/Kathmandu'        : 'NP',
  'Asia/Dubai'            : 'AE',
  'Asia/Riyadh'           : 'SA',
  'Asia/Qatar'            : 'QA',
  'Asia/Kuwait'           : 'KW',
  'Asia/Bahrain'          : 'BH',
  'Asia/Muscat'           : 'OM',
  'Asia/Cairo'            : 'EG',
  'Asia/Jerusalem'        : 'IL',
  'Asia/Shanghai'         : 'CN',
  'Asia/Tokyo'            : 'JP',
  'Asia/Seoul'            : 'KR',
  'Asia/Singapore'        : 'SG',
  'Asia/Kuala_Lumpur'     : 'MY',
  'Asia/Bangkok'          : 'TH',
  'Asia/Jakarta'          : 'ID',
  'Asia/Ho_Chi_Minh'      : 'VN',
  'Asia/Manila'           : 'PH',
  'Asia/Hong_Kong'        : 'HK',
  'Asia/Taipei'           : 'TW',
  'America/New_York'      : 'US',
  'America/Chicago'       : 'US',
  'America/Denver'        : 'US',
  'America/Los_Angeles'   : 'US',
  'America/Phoenix'       : 'US',
  'America/Anchorage'     : 'US',
  'Pacific/Honolulu'      : 'US',
  'America/Toronto'       : 'CA',
  'America/Vancouver'     : 'CA',
  'America/Halifax'       : 'CA',
  'America/Mexico_City'   : 'MX',
  'America/Sao_Paulo'     : 'BR',
  'America/Buenos_Aires'  : 'AR',
  'America/Bogota'        : 'CO',
  'America/Santiago'      : 'CL',
  'America/Lima'          : 'PE',
  'Europe/London'         : 'GB',
  'Europe/Berlin'         : 'DE',
  'Europe/Paris'          : 'FR',
  'Europe/Rome'           : 'IT',
  'Europe/Madrid'         : 'ES',
  'Europe/Amsterdam'      : 'NL',
  'Europe/Brussels'       : 'BE',
  'Europe/Warsaw'         : 'PL',
  'Europe/Stockholm'      : 'SE',
  'Europe/Oslo'           : 'NO',
  'Europe/Copenhagen'     : 'DK',
  'Europe/Helsinki'       : 'FI',
  'Europe/Lisbon'         : 'PT',
  'Europe/Vienna'         : 'AT',
  'Europe/Zurich'         : 'CH',
  'Europe/Dublin'         : 'IE',
  'Europe/Athens'         : 'GR',
  'Europe/Prague'         : 'CZ',
  'Europe/Bucharest'      : 'RO',
  'Europe/Budapest'       : 'HU',
  'Europe/Istanbul'       : 'TR',
  'Europe/Moscow'         : 'RU',
  'Australia/Sydney'      : 'AU',
  'Australia/Melbourne'   : 'AU',
  'Australia/Brisbane'    : 'AU',
  'Australia/Perth'       : 'AU',
  'Pacific/Auckland'      : 'NZ',
  'Africa/Johannesburg'   : 'ZA',
  'Africa/Lagos'          : 'NG',
  'Africa/Nairobi'        : 'KE',
  'Africa/Accra'          : 'GH',
  'Africa/Addis_Ababa'    : 'ET',
  'Africa/Casablanca'     : 'MA',
};

// ── IP detection helpers ─────────────────────────────────────────────────────

const TIMEOUT_MS = 4000;

async function tryIpApiCo() {
  try {
    geoLog('Trying ipapi.co …');
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const code = data?.country_code?.toUpperCase();
    if (code && COUNTRY_RULES[code]) {
      geoLog(`ipapi.co → ${code}`);
      return { code, source: 'ipapi.co' };
    }
    geoWarn('ipapi.co returned unknown country:', code);
  } catch (err) {
    geoWarn('ipapi.co failed:', err?.message);
  }
  return null;
}

async function tryIpApiDotCom() {
  try {
    geoLog('Trying ip-api.com …');
    const res = await fetch('https://ip-api.com/json/?fields=countryCode', {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const code = data?.countryCode?.toUpperCase();
    if (code && COUNTRY_RULES[code]) {
      geoLog(`ip-api.com → ${code}`);
      return { code, source: 'ip-api.com' };
    }
    geoWarn('ip-api.com returned unknown country:', code);
  } catch (err) {
    geoWarn('ip-api.com failed:', err?.message);
  }
  return null;
}

function detectFromLocale() {
  try {
    const langs = [navigator.language, ...(navigator.languages || [])];
    geoLog('Browser locales:', langs);
    for (const lang of langs) {
      const code = lang?.split('-')[1]?.toUpperCase();
      if (code && COUNTRY_RULES[code]) {
        geoLog(`navigator.language → ${code} (from "${lang}")`);
        return { code, source: 'browser-locale' };
      }
    }
  } catch (err) {
    geoWarn('locale detection failed:', err?.message);
  }
  return null;
}

function detectFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    geoLog('Detected timezone:', tz);
    const code = TIMEZONE_COUNTRY_MAP[tz];
    if (code && COUNTRY_RULES[code]) {
      geoLog(`Timezone ${tz} → ${code}`);
      return { code, source: 'timezone' };
    }
    geoWarn('No country mapping for timezone:', tz);
  } catch (err) {
    geoWarn('timezone detection failed:', err?.message);
  }
  return null;
}

// ── Zustand store ─────────────────────────────────────────────────────────────

export const useGeoStore = create(
  persist(
    (set, get) => ({
      // ── Core state ──────────────────────────────────────────────────────────
      countryCode     : 'US',
      rules           : COUNTRY_RULES.US,
      autoDetected    : false,   // ephemeral — NOT persisted (see partialize)
      userSelected    : false,   // persisted — manual user override
      detecting       : false,
      detectionSource : null,    // 'ipapi.co' | 'ip-api.com' | 'browser-locale' | 'timezone' | 'fallback'
      detectionError  : null,

      // ── Formatting helpers ───────────────────────────────────────────────────
      formatMoney: (value)       => formatCurrency(value, get().countryCode),
      formatNum  : (value, opts) => formatNumber(value, get().countryCode, opts),
      formatDate : (date)        => formatDate(date, get().countryCode),

      // ── Actions ──────────────────────────────────────────────────────────────

      /** User-initiated country override — persisted. */
      setCountry: (code) => {
        const upper = code?.toUpperCase();
        if (!upper || !COUNTRY_RULES[upper]) {
          geoWarn('Unknown country code:', code);
          return;
        }
        geoLog(`Manual override → ${upper} (${COUNTRY_RULES[upper].countryName})`);
        geoLog('Applied config:', COUNTRY_RULES[upper]);
        set({
          countryCode    : upper,
          rules          : getRules(upper),
          userSelected   : true,
          autoDetected   : false,
          detectionSource: 'manual',
          detectionError : null,
        });
      },

      /** Clear manual override and re-detect from IP. */
      resetToAuto: async () => {
        geoLog('Resetting to auto-detect…');
        set({ userSelected: false, autoDetected: false, detectionSource: null });
        await get().detectRegion();
      },

      /**
       * Full IP-detection chain (multi-layer).
       * Skips if: userSelected (manual pick) OR concurrent detecting.
       * Re-runs every page load (autoDetected is NOT persisted).
       */
      detectRegion: async () => {
        if (get().userSelected) {
          geoLog('Skipping detection — manual override active:', get().countryCode);
          return;
        }
        if (get().detecting) {
          geoLog('Skipping detection — already in progress.');
          return;
        }

        geoLog('Starting geo-detection chain…');
        set({ detecting: true, detectionError: null });

        // Layer 1: ipapi.co
        let result = await tryIpApiCo();

        // Layer 2: ip-api.com (if layer 1 failed)
        if (!result) result = await tryIpApiDotCom();

        // Layer 3: browser locale
        if (!result) result = detectFromLocale();

        // Layer 4: timezone
        if (!result) result = detectFromTimezone();

        // Layer 5: hard fallback
        if (!result) {
          geoWarn('All detection layers failed — falling back to US');
          result = { code: 'US', source: 'fallback' };
        }

        const { code, source } = result;
        const rules = getRules(code);

        geoLog(`✅ Detection complete → ${code} (${rules.countryName}) via [${source}]`);
        geoLog('Applied region config:', {
          countryCode    : code,
          currency       : rules.currency,
          locale         : rules.locale,
          taxLabel       : rules.taxLabel,
          taxRate        : rules.taxRate,
          measureSystem  : rules.measureSystem,
          dateFormat     : rules.dateFormat,
          detectionSource: source,
        });

        set({
          countryCode    : code,
          rules,
          autoDetected   : true,
          detecting      : false,
          detectionSource: source,
          detectionError : null,
        });
      },
    }),
    {
      name: 'CalcPoint-geo-v3',
      // ⚠️ NEVER persist autoDetected — must always re-detect on page load
      // ⚠️ DO persist userSelected and countryCode — survives refresh
      partialize: (s) => ({
        countryCode : s.countryCode,
        userSelected: s.userSelected,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          geoWarn('localStorage rehydration error:', error);
          return;
        }
        if (state) {
          // Rules are NOT persisted (they're derived from countryCode).
          // We recompute them synchronously here and patch the hydrated state in-place.
          // This callback runs AFTER the store is created, so useGeoStore is available.
          // Using a lazy reference avoids TDZ issues.
          const code  = state.countryCode || 'US';
          const rules = getRules(code);
          // Direct mutation of the state object provided by Zustand is safe here —
          // Zustand will apply these merged values after onRehydrateStorage returns.
          state.rules = rules;
          geoLog(
            `Rehydrated → ${code} (${rules.countryName})`,
            state.userSelected ? '— manual override, skipping auto-detect' : '— will auto-detect',
          );
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
  const { userSelected, detecting, detectRegion, countryCode } = useGeoStore.getState();

  if (userSelected) {
    geoLog(`initGeoDetection: manual override active (${countryCode}) — skipping auto-detect.`);
    return;
  }
  if (detecting) {
    geoLog('initGeoDetection: detection already running — skipping.');
    return;
  }

  geoLog('initGeoDetection: starting detection…');
  detectRegion();
}
