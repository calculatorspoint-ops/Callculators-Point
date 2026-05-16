import Decimal from "decimal.js";

export function numericBlurFormatter(value: string | number | null | undefined, decimals = 2, padDecimals = false): string {
  if (value === null || value === undefined || value === '' || value === '-' || value === '.' || value === '-.') return '';
  
  try {
    // Strip anything that isn't a digit, minus, or period (to parse safely)
    // Note: We strip commas and spaces because liveFormatter might have added them
    const sanitized = String(value).replace(/[^\d.-]/g, '');
    if (!sanitized) return '';
    
    const dec = new Decimal(sanitized);
    if (dec.isNaN()) return String(value);

    // Get the browser's preferred locale (fallback to 'en-US' for SSR/tests)
    const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';

    const targetDecimals = padDecimals ? decimals : Math.min(decimals, dec.decimalPlaces());

    // Use Intl.NumberFormat for proper internationalization
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: targetDecimals,
      maximumFractionDigits: targetDecimals,
      useGrouping: true,
    }).format(dec.toNumber());

  } catch {
    return String(value);
  }
}
