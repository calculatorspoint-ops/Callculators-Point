/**
 * @file useCurrencyStore.js
 * @description Bridge: wraps the geo-engine so all legacy components
 *   importing { useCurrencyStore, CURRENCIES } continue to work unchanged.
 *
 *   Key guarantees:
 *   - useCurrencyStore()         → { currency, setCurrency, autoDetected, detectFromIP }
 *   - useCurrencyStore.getState()→ { currency, ... }   (static read, safe outside React)
 *   - CURRENCIES                 → shape identical to old store: { USD:{symbol,code,name,flag,...}, ... }
 *   - COUNTRY_CURRENCY           → { US:'USD', PK:'PKR', ... }
 *   - formatMoney(n, code)       → locale-formatted string
 *   - toLocal(amount, code)      → amount (rates not tracked)
 */

import { useGeoStore } from '../core/geo-engine/geoStore.js';
import { COUNTRY_RULES, formatCurrency } from '../core/geo-engine/countryRules.js';

// ── CURRENCIES — legacy shape ─────────────────────────────────────────────────
export const CURRENCIES = {};

Object.entries(COUNTRY_RULES).forEach(([, r]) => {
  if (!CURRENCIES[r.currency]) {
    CURRENCIES[r.currency] = {
      symbol    : r.currencySymbol,
      code      : r.currency,
      name      : r.countryName,
      flag      : r.flag,
      rate      : 1,
      locale    : r.locale,
      taxRate   : r.taxRate,
      vatLabel  : r.taxLabel,
      dateFormat: r.dateFormat,
    };
  }
});

// Pretty display names for well-known currencies
const PRETTY_NAMES = {
  USD:'US Dollar', EUR:'Euro', GBP:'British Pound', PKR:'Pakistani Rupee',
  INR:'Indian Rupee', AED:'UAE Dirham', SAR:'Saudi Riyal', CAD:'Canadian Dollar',
  AUD:'Australian Dollar', CNY:'Chinese Yuan', JPY:'Japanese Yen', CHF:'Swiss Franc',
  BDT:'Bangladeshi Taka', MYR:'Malaysian Ringgit', SGD:'Singapore Dollar',
  TRY:'Turkish Lira', NGN:'Nigerian Naira', ZAR:'South African Rand',
  BRL:'Brazilian Real', MXN:'Mexican Peso', KRW:'South Korean Won',
  THB:'Thai Baht', IDR:'Indonesian Rupiah', VND:'Vietnamese Dong',
  PHP:'Philippine Peso', HKD:'Hong Kong Dollar', TWD:'New Taiwan Dollar',
  PLN:'Polish Złoty', SEK:'Swedish Krona', NOK:'Norwegian Krone',
  DKK:'Danish Krone', CZK:'Czech Koruna', RON:'Romanian Leu',
  HUF:'Hungarian Forint', RUB:'Russian Ruble', ILS:'Israeli Shekel',
  EGP:'Egyptian Pound', QAR:'Qatari Riyal', KWD:'Kuwaiti Dinar',
  BHD:'Bahraini Dinar', OMR:'Omani Rial', LKR:'Sri Lankan Rupee',
  NPR:'Nepalese Rupee', KES:'Kenyan Shilling', GHS:'Ghanaian Cedi',
  NZD:'New Zealand Dollar', ARS:'Argentine Peso', COP:'Colombian Peso',
  CLP:'Chilean Peso', PEN:'Peruvian Sol',
};
Object.entries(PRETTY_NAMES).forEach(([code, name]) => {
  if (CURRENCIES[code]) CURRENCIES[code].name = name;
});

// ── COUNTRY_CURRENCY — backward compat ───────────────────────────────────────
export const COUNTRY_CURRENCY = {};
Object.entries(COUNTRY_RULES).forEach(([cc, r]) => {
  COUNTRY_CURRENCY[cc] = r.currency;
});

// ── preferredCountry — maps currencyCode → ISO country code ─────────────────
const PREFERRED_COUNTRY = {
  USD:'US', EUR:'DE', GBP:'GB', PKR:'PK', INR:'IN', AED:'AE', SAR:'SA',
  CAD:'CA', AUD:'AU', CNY:'CN', JPY:'JP', CHF:'CH', BDT:'BD', MYR:'MY',
  SGD:'SG', TRY:'TR', NGN:'NG', ZAR:'ZA', BRL:'BR', MXN:'MX',
  KRW:'KR', THB:'TH', IDR:'ID', VND:'VN', PHP:'PH', HKD:'HK',
  TWD:'TW', PLN:'PL', SEK:'SE', NOK:'NO', DKK:'DK', CZK:'CZ',
  RON:'RO', HUF:'HU', RUB:'RU', ILS:'IL', EGP:'EG', QAR:'QA',
  KWD:'KW', BHD:'BH', OMR:'OM', LKR:'LK', NPR:'NP', KES:'KE',
  GHS:'GH', NZD:'NZ', ARS:'AR', COP:'CO', CLP:'CL', PEN:'PE',
};

// ── formatMoney — backward compat ─────────────────────────────────────────────
export function formatMoney(amount, currencyCode = 'USD') {
  const cc = PREFERRED_COUNTRY[currencyCode] || 'US';
  return formatCurrency(amount, cc);
}

export function toLocal(usdAmount, currencyCode = 'USD') {
  const cur = CURRENCIES[currencyCode];
  return usdAmount * (cur?.rate || 1);
}

// ── useCurrencyStore hook — full backward-compat API ─────────────────────────
/**
 * Replaces the old useCurrencyStore hook.
 * Returns all fields the legacy components used to destructure.
 */
export function useCurrencyStore() {
  const countryCode      = useGeoStore(s => s.countryCode);
  const rules            = useGeoStore(s => s.rules);
  const autoDetected     = useGeoStore(s => s.autoDetected);
  const detecting        = useGeoStore(s => s.detecting);
  const detectionSource  = useGeoStore(s => s.detectionSource);
  const setCountryFull   = useGeoStore(s => s.setCountry);
  const detectRegion     = useGeoStore(s => s.detectRegion);

  const currency = rules?.currency ?? 'USD';

  const setCurrency = (currencyCode) => {
    const cc = PREFERRED_COUNTRY[currencyCode];
    if (cc) setCountryFull(cc);
  };

  return {
    currency,
    setCurrency,
    autoDetected,
    detecting,
    detectionSource,
    // legacy alias: some components call detectFromIP
    detectFromIP : detectRegion,
    detectRegion,
    countryCode,
    rules,
  };
}

// ── useCurrencyStore.getState() — safe static read outside React ──────────────
// Used by SharedComponents.jsx line 15:
//   formatMoney = (n) => _fmtMoney(n, useCurrencyStore.getState().currency)
useCurrencyStore.getState = () => {
  const state = useGeoStore.getState();
  return {
    currency       : state.rules?.currency ?? 'USD',
    currencyCode   : state.countryCode ?? 'US',
    rules          : state.rules,
    autoDetected   : state.autoDetected,
    userSelected   : state.userSelected,
    detectionSource: state.detectionSource,
  };
};
