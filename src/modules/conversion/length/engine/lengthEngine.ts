import Decimal from "decimal.js";
import { LengthForm } from '../schemas/lengthSchema';

const conversionRatesToMeters: Record<string, number> = {
  meters: 1,
  kilometers: 1000,
  centimeters: 0.01,
  millimeters: 0.001,
  miles: 1609.344,
  yards: 0.9144,
  feet: 0.3048,
  inches: 0.0254
};

export interface LengthResult {
  convertedValue: number;
  formula: string;
}

export function calculateLengthConversion(params: LengthForm): LengthResult {
  if (params.value === null || params.value === undefined) return { convertedValue: 0, formula: '' };
  
  const value = new Decimal(params.value);
  const rateToMeters = new Decimal(conversionRatesToMeters[params.fromUnit]);
  const rateFromMeters = new Decimal(conversionRatesToMeters[params.toUnit]);

  // Convert to base unit (meters) then to target unit
  const valueInMeters = value.times(rateToMeters);
  const finalValue = valueInMeters.div(rateFromMeters);

  return {
    convertedValue: finalValue.toDecimalPlaces(6).toNumber(),
    formula: `Multiply by ${rateToMeters.div(rateFromMeters).toDecimalPlaces(6).toNumber()}`
  };
}
