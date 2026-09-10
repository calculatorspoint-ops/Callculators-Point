/**
 * src/utils/ptBrFormat.ts
 *
 * Brazilian Portuguese number and currency formatting utilities.
 *
 * Brazilian conventions:
 *   - Decimal separator: comma  (,)
 *   - Thousands separator: period (.)
 *   - Currency: R$ (BRL)
 *   - Example: R$ 1.234,56
 */

export const BRL_LOCALE = 'pt-BR';
export const BRL_CURRENCY = 'BRL';

/**
 * Format a number as Brazilian Real (BRL).
 * e.g. 1234.56 → "R$ 1.234,56"
 */
export function formatBRL(value: number, decimals = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a plain number with Brazilian separators.
 * e.g. 1234567.89 → "1.234.567,89"
 */
export function formatNumberBR(value: number, decimals = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a percentage in Brazilian style.
 * e.g. 0.0856 → "8,56%"
 */
export function formatPercentBR(value: number, decimals = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Parse a Brazilian-formatted number string back to a JS number.
 * Handles: "1.234,56" → 1234.56
 * Handles: "R$ 1.234,56" → 1234.56
 * Handles: "1234,56" → 1234.56
 */
export function parseBRNumber(str: string): number {
  if (!str) return NaN;
  // Remove currency symbol, spaces
  const cleaned = str.replace(/R\$\s?/g, '').trim();
  // Remove thousands separators (periods), then replace decimal comma with period
  const normalized = cleaned.replace(/\./g, '').replace(',', '.');
  return parseFloat(normalized);
}

/**
 * Format a compact number (thousands → "mil", millions → "milhões").
 * e.g. 1500000 → "R$ 1,5 milhão"
 */
export function formatBRLCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `R$ ${formatNumberBR(value / 1_000_000_000, 1)} bilhão`;
  }
  if (value >= 1_000_000) {
    return `R$ ${formatNumberBR(value / 1_000_000, 1)} milhão`;
  }
  if (value >= 1_000) {
    return `R$ ${formatNumberBR(value / 1_000, 1)} mil`;
  }
  return formatBRL(value);
}
