export function numericLiveFormatter(value: string | number): string {
  if (value === null || value === undefined) return '';
  const str = String(value);

  // Get localized separators (fallback to en-US)
  const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';
  const parts = new Intl.NumberFormat(locale).formatToParts(1111.1);
  const groupChar = parts.find(p => p.type === 'group')?.value || ',';
  const decimalChar = parts.find(p => p.type === 'decimal')?.value || '.';

  // Strip all valid and invalid localized formatting to get raw string
  const rawStr = str.replace(new RegExp(`\\${groupChar}`, 'g'), '');

  // Allow transient states completely (using dot universally for JS logic)
  // We internally parse using standard dot
  const normalizedStr = rawStr.replace(decimalChar, '.');
  if (normalizedStr === '-' || normalizedStr === '.' || normalizedStr === '-.') {
    return normalizedStr.replace('.', decimalChar);
  }
  if (/^[-]?\d+e[-+]?\d*$/i.test(normalizedStr)) return rawStr; // Scientific notation transient state

  // Split integer and decimal parts
  const [intPart, decPart] = normalizedStr.split('.');
  
  // Format integer part with localized thousands separators
  const isNegative = intPart.startsWith('-');
  const rawInt = intPart.replace(/\D/g, '');
  
  // Apply standard grouping logic, then replace commas with localized groupChar
  let formattedInt = rawInt.replace(/\B(?=(\d{3})+(?!\d))/g, groupChar);
  
  if (isNegative) formattedInt = '-' + formattedInt;
  if (!rawInt && isNegative) formattedInt = '-'; // Handle "-" typing before numbers
  if (!rawInt && !isNegative && decPart !== undefined) formattedInt = '0'; // Handle ".5" -> "0.5"

  // Reconstruct using the localized decimal character
  if (decPart !== undefined) {
    // Preserve exact typed decimals, even if empty (e.g. "12.")
    return `${formattedInt}${decimalChar}${decPart.replace(/[^0-9]/g, '')}`;
  }
  
  return formattedInt;
}
