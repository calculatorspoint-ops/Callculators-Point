// ══════════════════════════════════════════════════════════════════════
// INPUT VALIDATION & SANITIZATION — XSS / Injection prevention
// ══════════════════════════════════════════════════════════════════════

/**
 * Sanitize any user text — strips HTML/script tags, trims, limits length
 */
export function sanitizeText(input, maxLen = 500) {
  if (typeof input !== "string") return "";
  return input
    .slice(0, maxLen)
    .replace(/[<>'"]/g, (c) => ({ "<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;" }[c]))
    .trim();
}

/**
 * Parses a localized string (e.g. "1,000.50" or "1.000,50") into a raw JavaScript number.
 * Gracefully handles varied localizations (European comma vs US decimal formats).
 */
export function parseLocalizedNumber(str) {
  if (typeof str === "number") return str;
  if (!str || typeof str !== "string") return 0;

  // 1. Remove all spaces and currency symbols/letters
  let cleaned = str.replace(/[^\d.,-]/g, "");
  if (!cleaned || cleaned === "-") return 0;

  // 2. Determine localization based on last separator
  const lastDot = cleaned.lastIndexOf(".");
  const lastComma = cleaned.lastIndexOf(",");

  if (lastComma > lastDot) {
    // European format: "1.234.567,89" -> dots are thousands, comma is decimal
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    // US/UK/IN format: "1,234,567.89" -> commas are thousands, dot is decimal
    cleaned = cleaned.replace(/,/g, "");
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Formats a raw number for display in input fields, supporting localization.
 */
export function formatInputNumber(num, locale = "en-US", maxDecimals = 10) {
  if (num === null || num === undefined || isNaN(num)) return "";
  const n = Number(num);
  // Avoid scientific notation formatting issues
  if (Math.abs(n) >= 1e21) return n.toString();
  return new Intl.NumberFormat(locale, { maximumFractionDigits: maxDecimals }).format(n);
}

/**
 * Parse a numeric input safely — returns NaN if invalid or out of range
 */
export function safeNum(val, { min = -Infinity, max = Infinity, fallback = 0 } = {}) {
  const n = Number(val);
  if (!isFinite(n)) return fallback;
  if (n < min || n > max) return fallback;
  return n;
}

/**
 * Validate number is within safe bounds for financial calculations
 */
export function validateFinancial(val, name = "value") {
  const n = typeof val === "string" ? parseLocalizedNumber(val) : Number(val);
  const MAX = 1_000_000_000_000_000; // 1 quadrillion
  if (!isFinite(n))      return { valid: false, error: `${name} must be a valid number` };
  if (n < 0)             return { valid: false, error: `${name} cannot be negative` };
  if (n > MAX)           return { valid: false, error: `${name} is too large (max 1 quadrillion)` };
  return { valid: true, value: n };
}

/**
 * Validate percentage (0-100 or 0-custom max)
 */
export function validatePercent(val, max = 100) {
  const n = typeof val === "string" ? parseLocalizedNumber(val) : Number(val);
  if (!isFinite(n))  return { valid: false, error: "Must be a valid percentage" };
  if (n < 0)         return { valid: false, error: "Percentage cannot be negative" };
  if (n > max)       return { valid: false, error: `Percentage cannot exceed ${max}%` };
  return { valid: true, value: n };
}

/**
 * Sanitize a mathematical expression for scientific calculator
 * Prevents code injection — only allows safe math chars
 */
export function sanitizeExpression(expr) {
  if (typeof expr !== "string") return "";
  // Only allow: digits, operators, parentheses, dots, commas and safe math functions
  const SAFE_PATTERN = /^[0-9+\-*/().,%^a-zA-Z\s]+$/;
  const cleaned      = expr.slice(0, 200).trim();
  if (!SAFE_PATTERN.test(cleaned)) return "";
  
  // Prevent arbitrary JS execution
  const INVALID_TOKENS = /eval|function|window|document|setTimeout|setInterval|Math\.(?!sin|cos|tan|log|ln|sqrt|abs|PI|E|pow|exp)/i;
  if (INVALID_TOKENS.test(cleaned)) return "";
  
  return cleaned;
}

/**
 * Validate date string is a real, reasonable date
 */
export function validateDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { valid: false, error: "Invalid date" };
  const year = d.getFullYear();
  if (year < 1900 || year > 2200) return { valid: false, error: "Date out of supported range" };
  return { valid: true, value: d };
}

/**
 * Clamp a number between min and max
 */
export const clamp = (n, min, max) => Math.min(Math.max(Number(n) || 0, min), max);

/**
 * Rate limit helper (client-side) — prevent rapid-fire calculation spam
 */
const _lastCalc = {};
export function rateLimit(key, ms = 50) {
  const now = Date.now();
  if (_lastCalc[key] && now - _lastCalc[key] < ms) return false;
  _lastCalc[key] = now;
  return true;
}
