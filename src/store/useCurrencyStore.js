/**
 * @file useCurrencyStore.js
 * @description Thin bridge: re-exports the geo-store's currency slice so that
 *   all legacy components importing from useCurrencyStore continue to work
 *   without modification, while the REAL currency is now driven by the
 *   geo-engine (IP-detected country → correct currency).
 *
 *   This also keeps CURRENCIES and formatMoney available for backward-compat.
 */

import { useGeoStore } from '../core/geo-engine/geoStore.js';
import { COUNTRY_RULES, getRules, formatCurrency } from '../core/geo-engine/countryRules.js';

// ── Re-export CURRENCIES in the old shape so CurrencyBanner still works ─────

export const CURRENCIES = {};
Object.entries(COUNTRY_RULES).forEach(([, r]) => {
  if (!CURRENCIES[r.currency]) {
    CURRENCIES[r.currency] = {
      symbol    : r.currencySymbol,
      code      : r.currency,
      name      : `${r.countryName} (${r.currency})`,
      flag      : r.flag,
      rate      : 1,             // live rates not tracked; use formatCurrency
      locale    : r.locale,
      taxRate   : r.taxRate,
      vatLabel  : r.taxLabel,
      dateFormat: r.dateFormat,
    };
  }
});

// Fill well-known names more precisely
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
  ETB:'Ethiopian Birr', MAD:'Moroccan Dirham', ARS:'Argentine Peso',
  COP:'Colombian Peso', CLP:'Chilean Peso', PEN:'Peruvian Sol',
  NZD:'New Zealand Dollar',
};
Object.entries(PRETTY_NAMES).forEach(([code, name]) => {
  if (CURRENCIES[code]) CURRENCIES[code].name = name;
});

// ── COUNTRY_CURRENCY mapping (for backward compat) ───────────────────────────
export const COUNTRY_CURRENCY = {};
Object.entries(COUNTRY_RULES).forEach(([cc, r]) => {
  COUNTRY_CURRENCY[cc] = r.currency;
});

// ── formatMoney backward compat ───────────────────────────────────────────────
export function formatMoney(amount, currencyCode = 'USD') {
  return formatCurrency(amount, Object.keys(COUNTRY_RULES).find(cc => COUNTRY_RULES[cc].currency === currencyCode) || 'US');
}

export function toLocal(usdAmount, currencyCode = 'USD') {
  const cur = CURRENCIES[currencyCode];
  return usdAmount * (cur?.rate || 1);
}

// ── Bridge hook — reads from geo-store, writes back to it ───────────────────

/**
 * Drop-in replacement for the old useCurrencyStore hook.
 * Now powered by the real geo-detection engine.
 */
export function useCurrencyStore() {
  const countryCode    = useGeoStore(s => s.countryCode);
  const rules          = useGeoStore(s => s.rules);
  const setCountryFull = useGeoStore(s => s.setCountry);

  // Find the currency code from the geo store
  const currency = rules?.currency ?? 'USD';

  // setCurrency: map currencyCode → best country code with that currency
  const setCurrency = (currencyCode) => {
    // Find the first country using this currency (prefer major ones)
    const preferredCountry = {
      USD:'US', EUR:'DE', GBP:'GB', PKR:'PK', INR:'IN', AED:'AE', SAR:'SA',
      CAD:'CA', AUD:'AU', CNY:'CN', JPY:'JP', CHF:'CH', BDT:'BD', MYR:'MY',
      SGD:'SG', TRY:'TR', NGN:'NG', ZAR:'ZA', BRL:'BR', MXN:'MX',
      KRW:'KR', THB:'TH', IDR:'ID', VND:'VN', PHP:'PH', HKD:'HK',
      TWD:'TW', PLN:'PL', SEK:'SE', NOK:'NO', DKK:'DK', CZK:'CZ',
      RON:'RO', HUF:'HU', RUB:'RU', ILS:'IL', EGP:'EG', QAR:'QA',
      KWD:'KW', BHD:'BH', OMR:'OM', LKR:'LK', NPR:'NP', KES:'KE',
      GHS:'GH', NZD:'NZ', ARS:'AR', COP:'CO', CLP:'CL', PEN:'PE',
    };
    const cc = preferredCountry[currencyCode];
    if (cc) setCountryFull(cc);
  };

  return { currency, setCurrency };
}

// Named export for components using destructured import
useCurrencyStore.getState = () => useGeoStore.getState();
