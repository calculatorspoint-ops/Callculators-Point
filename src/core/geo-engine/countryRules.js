/**
 * @file countryRules.js
 * @description Worldwide geo-localization rules for CalcPoint.
 *   Each country record drives: currency, locale, number formatting,
 *   measurement system, tax label, date format, and week start day.
 *
 * Shape of each record:
 * {
 *   countryCode : ISO-3166-1 alpha-2  (key)
 *   countryName : string
 *   flag        : emoji
 *   currency    : ISO-4217 code
 *   currencySymbol: string
 *   locale      : BCP-47 locale tag
 *   numberFormat: "western" | "south-asian" | "eastern"
 *   measureSystem: "metric" | "imperial" | "mixed"
 *   taxRate     : number (%)
 *   taxLabel    : string  e.g. "VAT", "GST", "Sales Tax"
 *   dateFormat  : string  e.g. "MM/DD/YYYY"
 *   weekStart   : 0=Sun | 1=Mon | 6=Sat
 *   continent   : string
 * }
 */

export const COUNTRY_RULES = {
  // ── North America ────────────────────────────────────────────────────────────
  US: { countryName:"United States",    flag:"🇺🇸", currency:"USD", currencySymbol:"$",    locale:"en-US", numberFormat:"western",    measureSystem:"imperial", taxRate:0,    taxLabel:"Sales Tax",  dateFormat:"MM/DD/YYYY",   weekStart:0, continent:"North America" },
  CA: { countryName:"Canada",           flag:"🇨🇦", currency:"CAD", currencySymbol:"C$",   locale:"en-CA", numberFormat:"western",    measureSystem:"metric",   taxRate:5,    taxLabel:"GST",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"North America" },
  MX: { countryName:"Mexico",           flag:"🇲🇽", currency:"MXN", currencySymbol:"$",    locale:"es-MX", numberFormat:"western",    measureSystem:"metric",   taxRate:16,   taxLabel:"IVA",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"North America" },

  // ── South America ────────────────────────────────────────────────────────────
  BR: { countryName:"Brazil",           flag:"🇧🇷", currency:"BRL", currencySymbol:"R$",   locale:"pt-BR", numberFormat:"western",    measureSystem:"metric",   taxRate:17,   taxLabel:"ICMS",       dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"South America" },
  AR: { countryName:"Argentina",        flag:"🇦🇷", currency:"ARS", currencySymbol:"$",    locale:"es-AR", numberFormat:"western",    measureSystem:"metric",   taxRate:21,   taxLabel:"IVA",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"South America" },
  CO: { countryName:"Colombia",         flag:"🇨🇴", currency:"COP", currencySymbol:"$",    locale:"es-CO", numberFormat:"western",    measureSystem:"metric",   taxRate:19,   taxLabel:"IVA",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"South America" },
  CL: { countryName:"Chile",            flag:"🇨🇱", currency:"CLP", currencySymbol:"$",    locale:"es-CL", numberFormat:"western",    measureSystem:"metric",   taxRate:19,   taxLabel:"IVA",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"South America" },
  PE: { countryName:"Peru",             flag:"🇵🇪", currency:"PEN", currencySymbol:"S/",   locale:"es-PE", numberFormat:"western",    measureSystem:"metric",   taxRate:18,   taxLabel:"IGV",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"South America" },

  // ── Europe ───────────────────────────────────────────────────────────────────
  GB: { countryName:"United Kingdom",   flag:"🇬🇧", currency:"GBP", currencySymbol:"£",    locale:"en-GB", numberFormat:"western",    measureSystem:"mixed",    taxRate:20,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Europe" },
  DE: { countryName:"Germany",          flag:"🇩🇪", currency:"EUR", currencySymbol:"€",    locale:"de-DE", numberFormat:"western",    measureSystem:"metric",   taxRate:19,   taxLabel:"MwSt",       dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },
  FR: { countryName:"France",           flag:"🇫🇷", currency:"EUR", currencySymbol:"€",    locale:"fr-FR", numberFormat:"western",    measureSystem:"metric",   taxRate:20,   taxLabel:"TVA",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Europe" },
  IT: { countryName:"Italy",            flag:"🇮🇹", currency:"EUR", currencySymbol:"€",    locale:"it-IT", numberFormat:"western",    measureSystem:"metric",   taxRate:22,   taxLabel:"IVA",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Europe" },
  ES: { countryName:"Spain",            flag:"🇪🇸", currency:"EUR", currencySymbol:"€",    locale:"es-ES", numberFormat:"western",    measureSystem:"metric",   taxRate:21,   taxLabel:"IVA",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Europe" },
  NL: { countryName:"Netherlands",      flag:"🇳🇱", currency:"EUR", currencySymbol:"€",    locale:"nl-NL", numberFormat:"western",    measureSystem:"metric",   taxRate:21,   taxLabel:"BTW",        dateFormat:"DD-MM-YYYY",   weekStart:1, continent:"Europe" },
  BE: { countryName:"Belgium",          flag:"🇧🇪", currency:"EUR", currencySymbol:"€",    locale:"nl-BE", numberFormat:"western",    measureSystem:"metric",   taxRate:21,   taxLabel:"BTW",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Europe" },
  PL: { countryName:"Poland",           flag:"🇵🇱", currency:"PLN", currencySymbol:"zł",   locale:"pl-PL", numberFormat:"western",    measureSystem:"metric",   taxRate:23,   taxLabel:"VAT",        dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },
  SE: { countryName:"Sweden",           flag:"🇸🇪", currency:"SEK", currencySymbol:"kr",   locale:"sv-SE", numberFormat:"western",    measureSystem:"metric",   taxRate:25,   taxLabel:"Moms",       dateFormat:"YYYY-MM-DD",   weekStart:1, continent:"Europe" },
  NO: { countryName:"Norway",           flag:"🇳🇴", currency:"NOK", currencySymbol:"kr",   locale:"nb-NO", numberFormat:"western",    measureSystem:"metric",   taxRate:25,   taxLabel:"MVA",        dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },
  DK: { countryName:"Denmark",          flag:"🇩🇰", currency:"DKK", currencySymbol:"kr",   locale:"da-DK", numberFormat:"western",    measureSystem:"metric",   taxRate:25,   taxLabel:"Moms",       dateFormat:"DD-MM-YYYY",   weekStart:1, continent:"Europe" },
  FI: { countryName:"Finland",          flag:"🇫🇮", currency:"EUR", currencySymbol:"€",    locale:"fi-FI", numberFormat:"western",    measureSystem:"metric",   taxRate:24,   taxLabel:"ALV",        dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },
  PT: { countryName:"Portugal",         flag:"🇵🇹", currency:"EUR", currencySymbol:"€",    locale:"pt-PT", numberFormat:"western",    measureSystem:"metric",   taxRate:23,   taxLabel:"IVA",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Europe" },
  AT: { countryName:"Austria",          flag:"🇦🇹", currency:"EUR", currencySymbol:"€",    locale:"de-AT", numberFormat:"western",    measureSystem:"metric",   taxRate:20,   taxLabel:"MwSt",       dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },
  CH: { countryName:"Switzerland",      flag:"🇨🇭", currency:"CHF", currencySymbol:"Fr",   locale:"de-CH", numberFormat:"western",    measureSystem:"metric",   taxRate:7.7,  taxLabel:"MWST",       dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },
  IE: { countryName:"Ireland",          flag:"🇮🇪", currency:"EUR", currencySymbol:"€",    locale:"en-IE", numberFormat:"western",    measureSystem:"metric",   taxRate:23,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Europe" },
  GR: { countryName:"Greece",           flag:"🇬🇷", currency:"EUR", currencySymbol:"€",    locale:"el-GR", numberFormat:"western",    measureSystem:"metric",   taxRate:24,   taxLabel:"ΦΠΑ",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Europe" },
  CZ: { countryName:"Czech Republic",   flag:"🇨🇿", currency:"CZK", currencySymbol:"Kč",   locale:"cs-CZ", numberFormat:"western",    measureSystem:"metric",   taxRate:21,   taxLabel:"DPH",        dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },
  RO: { countryName:"Romania",          flag:"🇷🇴", currency:"RON", currencySymbol:"lei",  locale:"ro-RO", numberFormat:"western",    measureSystem:"metric",   taxRate:19,   taxLabel:"TVA",        dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },
  HU: { countryName:"Hungary",          flag:"🇭🇺", currency:"HUF", currencySymbol:"Ft",   locale:"hu-HU", numberFormat:"western",    measureSystem:"metric",   taxRate:27,   taxLabel:"ÁFA",        dateFormat:"YYYY.MM.DD",   weekStart:1, continent:"Europe" },
  TR: { countryName:"Turkey",           flag:"🇹🇷", currency:"TRY", currencySymbol:"₺",    locale:"tr-TR", numberFormat:"western",    measureSystem:"metric",   taxRate:18,   taxLabel:"KDV",        dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },
  RU: { countryName:"Russia",           flag:"🇷🇺", currency:"RUB", currencySymbol:"₽",    locale:"ru-RU", numberFormat:"western",    measureSystem:"metric",   taxRate:20,   taxLabel:"НДС",        dateFormat:"DD.MM.YYYY",   weekStart:1, continent:"Europe" },

  // ── Middle East ──────────────────────────────────────────────────────────────
  AE: { countryName:"United Arab Emirates", flag:"🇦🇪", currency:"AED", currencySymbol:"د.إ", locale:"ar-AE", numberFormat:"western", measureSystem:"metric",  taxRate:5,    taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:6, continent:"Middle East" },
  SA: { countryName:"Saudi Arabia",     flag:"🇸🇦", currency:"SAR", currencySymbol:"﷼",    locale:"ar-SA", numberFormat:"western",    measureSystem:"metric",   taxRate:15,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:6, continent:"Middle East" },
  QA: { countryName:"Qatar",            flag:"🇶🇦", currency:"QAR", currencySymbol:"﷼",    locale:"ar-QA", numberFormat:"western",    measureSystem:"metric",   taxRate:0,    taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:6, continent:"Middle East" },
  KW: { countryName:"Kuwait",           flag:"🇰🇼", currency:"KWD", currencySymbol:"د.ك",  locale:"ar-KW", numberFormat:"western",    measureSystem:"metric",   taxRate:0,    taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:6, continent:"Middle East" },
  BH: { countryName:"Bahrain",          flag:"🇧🇭", currency:"BHD", currencySymbol:"BD",   locale:"ar-BH", numberFormat:"western",    measureSystem:"metric",   taxRate:10,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:6, continent:"Middle East" },
  OM: { countryName:"Oman",             flag:"🇴🇲", currency:"OMR", currencySymbol:"ر.ع.", locale:"ar-OM", numberFormat:"western",    measureSystem:"metric",   taxRate:5,    taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:6, continent:"Middle East" },
  EG: { countryName:"Egypt",            flag:"🇪🇬", currency:"EGP", currencySymbol:"E£",   locale:"ar-EG", numberFormat:"western",    measureSystem:"metric",   taxRate:14,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:6, continent:"Middle East" },
  IL: { countryName:"Israel",           flag:"🇮🇱", currency:"ILS", currencySymbol:"₪",    locale:"he-IL", numberFormat:"western",    measureSystem:"metric",   taxRate:17,   taxLabel:"מע״מ",       dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Middle East" },

  // ── South Asia ───────────────────────────────────────────────────────────────
  IN: { countryName:"India",            flag:"🇮🇳", currency:"INR", currencySymbol:"₹",    locale:"en-IN", numberFormat:"south-asian", measureSystem:"metric",  taxRate:18,   taxLabel:"GST",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Asia" },
  PK: { countryName:"Pakistan",         flag:"🇵🇰", currency:"PKR", currencySymbol:"₨",    locale:"en-PK", numberFormat:"south-asian", measureSystem:"metric",  taxRate:17,   taxLabel:"GST",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Asia" },
  BD: { countryName:"Bangladesh",       flag:"🇧🇩", currency:"BDT", currencySymbol:"৳",    locale:"bn-BD", numberFormat:"south-asian", measureSystem:"metric",  taxRate:15,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Asia" },
  LK: { countryName:"Sri Lanka",        flag:"🇱🇰", currency:"LKR", currencySymbol:"Rs",   locale:"si-LK", numberFormat:"western",    measureSystem:"metric",   taxRate:18,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Asia" },
  NP: { countryName:"Nepal",            flag:"🇳🇵", currency:"NPR", currencySymbol:"Rs",   locale:"ne-NP", numberFormat:"south-asian", measureSystem:"metric",  taxRate:13,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Asia" },

  // ── East / SE Asia ───────────────────────────────────────────────────────────
  CN: { countryName:"China",            flag:"🇨🇳", currency:"CNY", currencySymbol:"¥",    locale:"zh-CN", numberFormat:"eastern",    measureSystem:"metric",   taxRate:13,   taxLabel:"VAT",        dateFormat:"YYYY/MM/DD",   weekStart:1, continent:"Asia" },
  JP: { countryName:"Japan",            flag:"🇯🇵", currency:"JPY", currencySymbol:"¥",    locale:"ja-JP", numberFormat:"eastern",    measureSystem:"metric",   taxRate:10,   taxLabel:"消費税",      dateFormat:"YYYY/MM/DD",   weekStart:0, continent:"Asia" },
  KR: { countryName:"South Korea",      flag:"🇰🇷", currency:"KRW", currencySymbol:"₩",    locale:"ko-KR", numberFormat:"eastern",    measureSystem:"metric",   taxRate:10,   taxLabel:"부가세",     dateFormat:"YYYY.MM.DD",   weekStart:0, continent:"Asia" },
  SG: { countryName:"Singapore",        flag:"🇸🇬", currency:"SGD", currencySymbol:"S$",   locale:"en-SG", numberFormat:"western",    measureSystem:"metric",   taxRate:9,    taxLabel:"GST",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Asia" },
  MY: { countryName:"Malaysia",         flag:"🇲🇾", currency:"MYR", currencySymbol:"RM",   locale:"ms-MY", numberFormat:"western",    measureSystem:"metric",   taxRate:6,    taxLabel:"SST",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Asia" },
  TH: { countryName:"Thailand",         flag:"🇹🇭", currency:"THB", currencySymbol:"฿",    locale:"th-TH", numberFormat:"western",    measureSystem:"metric",   taxRate:7,    taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Asia" },
  ID: { countryName:"Indonesia",        flag:"🇮🇩", currency:"IDR", currencySymbol:"Rp",   locale:"id-ID", numberFormat:"western",    measureSystem:"metric",   taxRate:11,   taxLabel:"PPN",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Asia" },
  VN: { countryName:"Vietnam",          flag:"🇻🇳", currency:"VND", currencySymbol:"₫",    locale:"vi-VN", numberFormat:"western",    measureSystem:"metric",   taxRate:10,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Asia" },
  PH: { countryName:"Philippines",      flag:"🇵🇭", currency:"PHP", currencySymbol:"₱",    locale:"en-PH", numberFormat:"western",    measureSystem:"metric",   taxRate:12,   taxLabel:"VAT",        dateFormat:"MM/DD/YYYY",   weekStart:0, continent:"Asia" },
  HK: { countryName:"Hong Kong",        flag:"🇭🇰", currency:"HKD", currencySymbol:"HK$",  locale:"zh-HK", numberFormat:"western",    measureSystem:"metric",   taxRate:0,    taxLabel:"N/A",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Asia" },
  TW: { countryName:"Taiwan",           flag:"🇹🇼", currency:"TWD", currencySymbol:"NT$",  locale:"zh-TW", numberFormat:"eastern",    measureSystem:"metric",   taxRate:5,    taxLabel:"VAT",        dateFormat:"YYYY/MM/DD",   weekStart:0, continent:"Asia" },

  // ── Oceania ──────────────────────────────────────────────────────────────────
  AU: { countryName:"Australia",        flag:"🇦🇺", currency:"AUD", currencySymbol:"A$",   locale:"en-AU", numberFormat:"western",    measureSystem:"metric",   taxRate:10,   taxLabel:"GST",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Oceania" },
  NZ: { countryName:"New Zealand",      flag:"🇳🇿", currency:"NZD", currencySymbol:"NZ$",  locale:"en-NZ", numberFormat:"western",    measureSystem:"metric",   taxRate:15,   taxLabel:"GST",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Oceania" },

  // ── Africa ───────────────────────────────────────────────────────────────────
  ZA: { countryName:"South Africa",     flag:"🇿🇦", currency:"ZAR", currencySymbol:"R",    locale:"en-ZA", numberFormat:"western",    measureSystem:"metric",   taxRate:15,   taxLabel:"VAT",        dateFormat:"YYYY/MM/DD",   weekStart:0, continent:"Africa" },
  NG: { countryName:"Nigeria",          flag:"🇳🇬", currency:"NGN", currencySymbol:"₦",    locale:"en-NG", numberFormat:"western",    measureSystem:"metric",   taxRate:7.5,  taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Africa" },
  KE: { countryName:"Kenya",            flag:"🇰🇪", currency:"KES", currencySymbol:"KSh",  locale:"sw-KE", numberFormat:"western",    measureSystem:"metric",   taxRate:16,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Africa" },
  GH: { countryName:"Ghana",            flag:"🇬🇭", currency:"GHS", currencySymbol:"₵",    locale:"en-GH", numberFormat:"western",    measureSystem:"metric",   taxRate:15,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Africa" },
  ET: { countryName:"Ethiopia",         flag:"🇪🇹", currency:"ETB", currencySymbol:"Br",   locale:"am-ET", numberFormat:"western",    measureSystem:"metric",   taxRate:15,   taxLabel:"VAT",        dateFormat:"DD/MM/YYYY",   weekStart:0, continent:"Africa" },
  MA: { countryName:"Morocco",          flag:"🇲🇦", currency:"MAD", currencySymbol:"MAD",  locale:"ar-MA", numberFormat:"western",    measureSystem:"metric",   taxRate:20,   taxLabel:"TVA",        dateFormat:"DD/MM/YYYY",   weekStart:1, continent:"Africa" },
};

// ── Derived lookups ──────────────────────────────────────────────────────────

/** All continent names (deduped, sorted) */
export const CONTINENTS = [...new Set(Object.values(COUNTRY_RULES).map(r => r.continent))].sort();

/** Group countries by continent */
export const COUNTRIES_BY_CONTINENT = CONTINENTS.reduce((acc, continent) => {
  acc[continent] = Object.entries(COUNTRY_RULES)
    .filter(([, r]) => r.continent === continent)
    .map(([code, r]) => ({ code, ...r }))
    .sort((a, b) => a.countryName.localeCompare(b.countryName));
  return acc;
}, {});

/** Flat sorted array of all countries */
export const ALL_COUNTRIES = Object.entries(COUNTRY_RULES)
  .map(([code, r]) => ({ code, ...r }))
  .sort((a, b) => a.countryName.localeCompare(b.countryName));

/**
 * Get rules for a country code; falls back to US defaults.
 * @param {string} countryCode - ISO-3166-1 alpha-2
 * @returns {object}
 */
export function getRules(countryCode) {
  return COUNTRY_RULES[countryCode?.toUpperCase()] || COUNTRY_RULES.US;
}

/**
 * Format a number according to country locale and number-format style.
 * @param {number} value
 * @param {string} countryCode
 * @param {object} [options] - Intl.NumberFormat options
 */
export function formatNumber(value, countryCode, options = {}) {
  const { locale } = getRules(countryCode);
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Format a monetary value using the country's currency.
 * @param {number} value
 * @param {string} countryCode
 */
export function formatCurrency(value, countryCode) {
  const { locale, currency } = getRules(countryCode);
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency', currency, maximumFractionDigits: 2,
    }).format(value);
  } catch {
    const { currencySymbol } = getRules(countryCode);
    return `${currencySymbol}${value.toFixed(2)}`;
  }
}

/**
 * Format a date string using the country's preferred date format.
 * @param {Date|string} date
 * @param {string} countryCode
 */
export function formatDate(date, countryCode) {
  const { locale } = getRules(countryCode);
  try {
    return new Intl.DateTimeFormat(locale).format(new Date(date));
  } catch {
    return String(date);
  }
}
