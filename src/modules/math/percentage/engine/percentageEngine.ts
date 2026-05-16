import Decimal from "decimal.js";
import { PercentageForm } from '../schemas/percentageSchema';

export interface PercentageResult {
  value: number;
  added: number;
  subtracted: number;
}

export function calculatePercentage(params: PercentageForm): PercentageResult {
  const base = new Decimal(params.baseValue || 0);
  const pct = new Decimal(params.percentage || 0);
  
  const value = base.times(pct).div(100);
  const added = base.plus(value);
  const subtracted = base.minus(value);

  return {
    value: value.toNumber(),
    added: added.toNumber(),
    subtracted: subtracted.toNumber()
  };
}
