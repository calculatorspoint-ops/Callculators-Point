/**
 * URL Parameter Sharing Engine
 * Enables shareable calculator links with pre-filled inputs.
 * 
 * Usage in calculator forms:
 *   const params = useCalcParams({ p: 5000000, r: 8.5, y: 20 });
 *   // params.p, params.r, params.y are initialized from URL if present
 *   // Call generateShareURL({ p, r, y }) to get a shareable link
 */

/**
 * Read URL search params and return matching values with type coercion
 * @param {Object} defaults - { paramName: defaultValue } map
 * @returns {Object} merged values (URL params override defaults)
 */
export function readCalcParams(defaults) {
  if (typeof window === 'undefined') return defaults;
  const url = new URL(window.location.href);
  const result = { ...defaults };
  
  for (const [key, defaultVal] of Object.entries(defaults)) {
    const urlVal = url.searchParams.get(key);
    if (urlVal === null) continue;
    
    if (typeof defaultVal === 'number') {
      const parsed = parseFloat(urlVal);
      if (!isNaN(parsed)) result[key] = parsed;
    } else if (typeof defaultVal === 'boolean') {
      result[key] = urlVal === 'true' || urlVal === '1';
    } else {
      result[key] = urlVal;
    }
  }
  return result;
}

/**
 * Generate a shareable URL with calculator params encoded
 * @param {Object} params - current calculator input values
 * @param {string} [baseUrl] - base URL (defaults to current page)
 * @returns {string} full URL with search params
 */
export function generateShareURL(params, baseUrl) {
  const url = new URL(baseUrl || window.location.href.split('?')[0]);
  for (const [key, val] of Object.entries(params)) {
    if (val !== '' && val !== null && val !== undefined) {
      url.searchParams.set(key, String(val));
    }
  }
  return url.toString();
}

/**
 * Copy shareable link to clipboard and show toast
 * @param {Object} params - current calculator input values
 */
export async function copyShareLink(params) {
  const url = generateShareURL(params);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
}
