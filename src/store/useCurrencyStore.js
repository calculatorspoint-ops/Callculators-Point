import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Currency definitions ──────────────────────────────────────────────────────
export const CURRENCIES = {
  USD: { symbol:"$",  code:"USD", name:"US Dollar",          flag:"🇺🇸", rate:1,       locale:"en-US", taxRate:0,    vatLabel:"Sales Tax",   dateFormat:"MM/DD/YYYY" },
  EUR: { symbol:"€",  code:"EUR", name:"Euro",                flag:"🇪🇺", rate:0.92,    locale:"de-DE", taxRate:19,   vatLabel:"VAT",         dateFormat:"DD/MM/YYYY" },
  GBP: { symbol:"£",  code:"GBP", name:"British Pound",       flag:"🇬🇧", rate:0.79,    locale:"en-GB", taxRate:20,   vatLabel:"VAT",         dateFormat:"DD/MM/YYYY" },
  PKR: { symbol:"₨",  code:"PKR", name:"Pakistani Rupee",     flag:"🇵🇰", rate:278.5,   locale:"en-PK", taxRate:17,   vatLabel:"GST",         dateFormat:"DD/MM/YYYY" },
  INR: { symbol:"₹",  code:"INR", name:"Indian Rupee",        flag:"🇮🇳", rate:83.2,    locale:"en-IN", taxRate:18,   vatLabel:"GST",         dateFormat:"DD/MM/YYYY" },
  AED: { symbol:"د.إ",code:"AED", name:"UAE Dirham",          flag:"🇦🇪", rate:3.67,    locale:"ar-AE", taxRate:5,    vatLabel:"VAT",         dateFormat:"DD/MM/YYYY" },
  SAR: { symbol:"﷼",  code:"SAR", name:"Saudi Riyal",         flag:"🇸🇦", rate:3.75,    locale:"ar-SA", taxRate:15,   vatLabel:"VAT",         dateFormat:"DD/MM/YYYY" },
  CAD: { symbol:"C$", code:"CAD", name:"Canadian Dollar",     flag:"🇨🇦", rate:1.36,    locale:"en-CA", taxRate:5,    vatLabel:"GST",         dateFormat:"DD/MM/YYYY" },
  AUD: { symbol:"A$", code:"AUD", name:"Australian Dollar",   flag:"🇦🇺", rate:1.52,    locale:"en-AU", taxRate:10,   vatLabel:"GST",         dateFormat:"DD/MM/YYYY" },
  CNY: { symbol:"¥",  code:"CNY", name:"Chinese Yuan",        flag:"🇨🇳", rate:7.24,    locale:"zh-CN", taxRate:13,   vatLabel:"VAT",         dateFormat:"YYYY/MM/DD" },
  JPY: { symbol:"¥",  code:"JPY", name:"Japanese Yen",        flag:"🇯🇵", rate:149.5,   locale:"ja-JP", taxRate:10,   vatLabel:"CT",          dateFormat:"YYYY/MM/DD" },
  CHF: { symbol:"Fr", code:"CHF", name:"Swiss Franc",         flag:"🇨🇭", rate:0.90,    locale:"de-CH", taxRate:7.7,  vatLabel:"VAT",         dateFormat:"DD.MM.YYYY" },
  BDT: { symbol:"৳",  code:"BDT", name:"Bangladeshi Taka",   flag:"🇧🇩", rate:110,     locale:"bn-BD", taxRate:15,   vatLabel:"VAT",         dateFormat:"DD/MM/YYYY" },
  MYR: { symbol:"RM", code:"MYR", name:"Malaysian Ringgit",   flag:"🇲🇾", rate:4.72,    locale:"ms-MY", taxRate:6,    vatLabel:"SST",         dateFormat:"DD/MM/YYYY" },
  SGD: { symbol:"S$", code:"SGD", name:"Singapore Dollar",    flag:"🇸🇬", rate:1.34,    locale:"en-SG", taxRate:9,    vatLabel:"GST",         dateFormat:"DD/MM/YYYY" },
  TRY: { symbol:"₺",  code:"TRY", name:"Turkish Lira",        flag:"🇹🇷", rate:32.1,    locale:"tr-TR", taxRate:18,   vatLabel:"KDV",         dateFormat:"DD.MM.YYYY" },
  NGN: { symbol:"₦",  code:"NGN", name:"Nigerian Naira",      flag:"🇳🇬", rate:1550,    locale:"en-NG", taxRate:7.5,  vatLabel:"VAT",         dateFormat:"DD/MM/YYYY" },
  ZAR: { symbol:"R",  code:"ZAR", name:"South African Rand",  flag:"🇿🇦", rate:18.6,    locale:"en-ZA", taxRate:15,   vatLabel:"VAT",         dateFormat:"YYYY/MM/DD" },
  BRL: { symbol:"R$", code:"BRL", name:"Brazilian Real",      flag:"🇧🇷", rate:4.97,    locale:"pt-BR", taxRate:17,   vatLabel:"ICMS",        dateFormat:"DD/MM/YYYY" },
  MXN: { symbol:"$",  code:"MXN", name:"Mexican Peso",        flag:"🇲🇽", rate:17.2,    locale:"es-MX", taxRate:16,   vatLabel:"IVA",         dateFormat:"DD/MM/YYYY" },
};

// ── IP → Currency mapping ─────────────────────────────────────────────────────
export const COUNTRY_CURRENCY = {
  US:"USD", GB:"GBP", DE:"EUR", FR:"EUR", IT:"EUR", ES:"EUR", NL:"EUR", BE:"EUR",
  AT:"EUR", PT:"EUR", IE:"EUR", FI:"EUR", GR:"EUR", PK:"PKR", IN:"INR", AE:"AED",
  SA:"SAR", CA:"CAD", AU:"AUD", CN:"CNY", JP:"JPY", CH:"CHF", BD:"BDT", MY:"MYR",
  SG:"SGD", TR:"TRY", NG:"NGN", ZA:"ZAR", BR:"BRL", MX:"MXN", PL:"EUR", CZ:"EUR",
  RO:"EUR", HU:"EUR", BG:"EUR", HR:"EUR", SK:"EUR", SI:"EUR",
};

// ── Format money using detected currency ──────────────────────────────────────
export function formatMoney(amount, currencyCode = "USD") {
  const cur = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  const sym  = cur.symbol;

  // Compact formatting for large numbers
  if (abs >= 1_000_000_000) return `${sign}${sym}${(abs/1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000)     return `${sign}${sym}${(abs/1_000_000).toFixed(2)}M`;

  // PKR/INR lakhs/crores style
  if (["PKR","INR"].includes(currencyCode)) {
    if (abs >= 1_00_00_000) return `${sign}${sym}${(abs/1_00_00_000).toFixed(2)}Cr`;
    if (abs >= 1_00_000)    return `${sign}${sym}${(abs/1_00_000).toFixed(2)}L`;
    if (abs >= 1_000)       return `${sign}${sym}${Math.round(abs).toLocaleString("en-IN")}`;
    return `${sign}${sym}${abs.toFixed(2)}`;
  }

  // Standard formatting
  if (abs >= 1_000) return `${sign}${sym}${Math.round(abs).toLocaleString()}`;
  return `${sign}${sym}${abs.toFixed(2)}`;
}

// ── Convert amount from USD base to current currency ──────────────────────────
export function toLocal(usdAmount, currencyCode = "USD") {
  const rate = CURRENCIES[currencyCode]?.rate || 1;
  return usdAmount * rate;
}

// ── Zustand store ─────────────────────────────────────────────────────────────
export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency:        "USD",   // default
      autoDetected:    false,
      userSelected:    false,

      setCurrency: (code) => set({ currency: code, userSelected: true }),

      // Auto-detect from IP using free API
      detectFromIP: async () => {
        if (get().autoDetected || get().userSelected) return; // already ran or manually set
        try {
          const res  = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
          if (!res.ok) throw new Error("API failed");
          const data = await res.json();
          const code = data.country_code;
          const cur  = COUNTRY_CURRENCY[code] || "USD";
          set({ currency: cur, autoDetected: true });
        } catch {
          // Fallback to browser locale
          try {
            const locale = navigator.language || "en-US";
            const countryCode = locale.split("-")[1]?.toUpperCase();
            const cur = COUNTRY_CURRENCY[countryCode] || "USD";
            set({ currency: cur, autoDetected: true });
          } catch (e) {
            set({ currency: "USD", autoDetected: true }); // Ultimate fallback
          }
        }
      },
    }),
    {
      name: "CalculatorsPoint-currency-v2",
      partialize: (s) => ({ currency: s.currency, userSelected: s.userSelected, autoDetected: s.autoDetected }),
    }
  )
);
