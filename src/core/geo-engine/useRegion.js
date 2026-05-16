/**
 * @file useRegion.js
 * @description Convenience React hook that wraps useGeoStore and exposes a
 *   clean, stable API for any component that needs region-aware data.
 *
 * Usage:
 *   const { countryCode, currency, locale, formatMoney, setCountry } = useRegion();
 *
 * The hook is memo-safe: each field is selected individually so that
 * components only re-render when the piece of state they use changes.
 */

import { useMemo } from 'react';
import { useGeoStore } from './geoStore.js';
import {
  getRules,
  formatCurrency,
  formatNumber,
  formatDate,
  ALL_COUNTRIES,
  COUNTRIES_BY_CONTINENT,
  CONTINENTS,
} from './countryRules.js';

/**
 * @typedef {Object} RegionAPI
 * @property {string}   countryCode      - ISO-3166-1 alpha-2  ("PK", "US" …)
 * @property {string}   countryName      - Full English name
 * @property {string}   flag             - Emoji flag
 * @property {string}   continent        - Continent name
 * @property {object}   rules            - Full COUNTRY_RULES entry
 * @property {string}   currency         - ISO-4217 code ("PKR", "USD" …)
 * @property {string}   currencySymbol   - "₨", "$" …
 * @property {string}   locale           - BCP-47 locale ("en-PK", "en-US" …)
 * @property {number}   taxRate          - Tax % (0–27)
 * @property {string}   taxLabel         - "GST", "VAT", "Sales Tax" …
 * @property {string}   dateFormat       - "DD/MM/YYYY" etc.
 * @property {string}   measureSystem    - "metric" | "imperial" | "mixed"
 * @property {boolean}  isMetric         - true if metric system
 * @property {boolean}  autoDetected     - Whether region was auto-detected
 * @property {boolean}  userSelected     - Whether user overrode the region
 * @property {boolean}  detecting        - Detection in progress
 *
 * @property {Function} formatMoney      - (value: number) => string
 * @property {Function} formatNum        - (value: number, opts?) => string
 * @property {Function} formatDate       - (date: Date|string) => string
 * @property {Function} formatTax        - (subtotal: number) => { tax, total, label }
 * @property {Function} setCountry       - (code: string) => void
 * @property {Function} resetToAuto      - () => Promise<void>
 * @property {Function} detectRegion     - () => Promise<void>
 *
 * @property {Array}    allCountries     - Sorted array of all countries
 * @property {Object}   byContinent      - Countries grouped by continent
 * @property {Array}    continents       - Sorted continent names
 */

/**
 * Main geo-region hook.
 * @returns {RegionAPI}
 */
export function useRegion() {
  const countryCode    = useGeoStore(s => s.countryCode);
  const rules          = useGeoStore(s => s.rules);
  const autoDetected   = useGeoStore(s => s.autoDetected);
  const userSelected   = useGeoStore(s => s.userSelected);
  const detecting      = useGeoStore(s => s.detecting);
  const setCountry     = useGeoStore(s => s.setCountry);
  const resetToAuto    = useGeoStore(s => s.resetToAuto);
  const detectRegion   = useGeoStore(s => s.detectRegion);

  // Stable derived values — only re-computed when countryCode changes
  const derived = useMemo(() => {
    const r = rules || getRules(countryCode);
    return {
      countryName   : r.countryName    ?? 'United States',
      flag          : r.flag           ?? '🌐',
      continent     : r.continent      ?? 'Global',
      currency      : r.currency       ?? 'USD',
      currencySymbol: r.currencySymbol ?? '$',
      locale        : r.locale         ?? 'en-US',
      taxRate       : r.taxRate        ?? 0,
      taxLabel      : r.taxLabel       ?? 'Tax',
      dateFormat    : r.dateFormat     ?? 'MM/DD/YYYY',
      measureSystem : r.measureSystem  ?? 'metric',
      isMetric      : r.measureSystem !== 'imperial',

      // Formatting helpers (stable references per countryCode)
      formatMoney: (value) => formatCurrency(value, countryCode),
      formatNum  : (value, opts) => formatNumber(value, countryCode, opts),
      formatDate : (date) => formatDate(date, countryCode),

      /**
       * Compute tax breakdown from a subtotal.
       * @param {number} subtotal
       * @returns {{ tax: number, total: number, label: string, rate: number }}
       */
      formatTax: (subtotal) => {
        const tax   = subtotal * ((r.taxRate ?? 0) / 100);
        const total = subtotal + tax;
        return {
          tax,
          total,
          label: r.taxLabel ?? 'Tax',
          rate : r.taxRate  ?? 0,
          taxFormatted  : formatCurrency(tax,   countryCode),
          totalFormatted: formatCurrency(total, countryCode),
        };
      },
    };
  }, [countryCode, rules]);

  return {
    // Identity
    countryCode,
    rules,
    autoDetected,
    userSelected,
    detecting,

    // Derived (stable per country)
    ...derived,

    // Actions
    setCountry,
    resetToAuto,
    detectRegion,

    // Static data (same reference every render — no useMemo needed)
    allCountries  : ALL_COUNTRIES,
    byContinent   : COUNTRIES_BY_CONTINENT,
    continents    : CONTINENTS,
  };
}

// ── Specialised sub-hooks ───────────────────────────────────────────────────

/**
 * Lightweight hook — only subscribes to currency-related state.
 * Use in components that just need to format money.
 * @returns {{ currency, currencySymbol, formatMoney, locale, countryCode }}
 */
export function useRegionCurrency() {
  const countryCode     = useGeoStore(s => s.countryCode);
  const currency        = useGeoStore(s => s.rules?.currency       ?? 'USD');
  const currencySymbol  = useGeoStore(s => s.rules?.currencySymbol ?? '$');
  const locale          = useGeoStore(s => s.rules?.locale         ?? 'en-US');

  const formatMoney = useMemo(
    () => (value) => formatCurrency(value, countryCode),
    [countryCode]
  );

  return { countryCode, currency, currencySymbol, locale, formatMoney };
}

/**
 * Lightweight hook — only subscribes to tax-related state.
 * @returns {{ taxRate, taxLabel, computeTax }}
 */
export function useRegionTax() {
  const countryCode = useGeoStore(s => s.countryCode);
  const taxRate     = useGeoStore(s => s.rules?.taxRate  ?? 0);
  const taxLabel    = useGeoStore(s => s.rules?.taxLabel ?? 'Tax');

  const computeTax = useMemo(
    () => (subtotal) => {
      const tax   = subtotal * (taxRate / 100);
      return { tax, total: subtotal + tax, rate: taxRate, label: taxLabel };
    },
    [taxRate, taxLabel]
  );

  return { countryCode, taxRate, taxLabel, computeTax };
}

/**
 * Lightweight hook — measurement system.
 * @returns {{ isMetric, measureSystem }}
 */
export function useRegionMeasure() {
  const measureSystem = useGeoStore(s => s.rules?.measureSystem ?? 'metric');
  return {
    measureSystem,
    isMetric  : measureSystem !== 'imperial',
    isImperial: measureSystem === 'imperial',
    isMixed   : measureSystem === 'mixed',
  };
}
