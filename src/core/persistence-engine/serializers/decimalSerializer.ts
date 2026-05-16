import Decimal from "decimal.js";

/**
 * Safely serializes objects containing Decimal.js instances into a JSON string.
 */
export function serializeDecimalSafe(payload: any): string {
  return JSON.stringify(payload, (_, value) => {
    // Detect Decimal.js instance properties
    if (value !== null && typeof value === 'object' && value.d && value.e && value.s !== undefined) {
      return { _type: 'Decimal', value: new Decimal(value).toString() };
    }
    // Detect direct instanceof if applicable
    if (value instanceof Decimal) {
      return { _type: 'Decimal', value: value.toString() };
    }
    return value;
  });
}

/**
 * Parses a JSON string and securely re-instantiates Decimal.js objects to prevent floating point drift.
 */
export function hydrateDecimalSafe(serialized: string): any {
  return JSON.parse(serialized, (_, value) => {
    if (value !== null && typeof value === 'object' && value._type === 'Decimal') {
      return new Decimal(value.value);
    }
    return value;
  });
}
