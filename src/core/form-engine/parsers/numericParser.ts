import Decimal from "decimal.js";

/**
 * Parses a string input safely into a number.
 * Handles localized grouping, decimal separators, and transient states gracefully.
 */
export function parseNumericString(val: string | number | null | undefined): number | string {
  if (val === null || val === undefined || val === '') return '';
  if (typeof val === 'number') return val;

  // Detect browser locale separators
  const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';
  const parts = new Intl.NumberFormat(locale).formatToParts(1111.1);
  const groupChar = parts.find(p => p.type === 'group')?.value || ',';
  const decimalChar = parts.find(p => p.type === 'decimal')?.value || '.';

  // Sanitize: strip localized group chars and spaces
  // Then convert the localized decimal char to a standard JS dot
  const strippedGroup = val.replace(new RegExp(`\\${groupChar}`, 'g'), '').replace(/\s/g, '');
  const sanitized = strippedGroup.replace(decimalChar, '.');
  
  // Allow negative sign or decimal dot to be returned as-is to not break live typing cursor
  if (sanitized === '-' || sanitized === '.' || sanitized.endsWith('.')) {
    return sanitized; // Will trigger validation error if submitted like this, which is correct
  }

  // Parse to Decimal to prevent floating point issues, then to number
  try {
    const dec = new Decimal(sanitized);
    if (dec.isNaN()) return val; // Let Zod catch invalid formats natively
    return dec.toNumber();
  } catch {
    return val; // Let Zod handle the validation error
  }
}
