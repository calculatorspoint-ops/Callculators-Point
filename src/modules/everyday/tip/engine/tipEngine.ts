import Decimal from "decimal.js";
import { TipForm } from '../schemas/tipSchema';

export interface TipResult {
  tipAmount: number;
  totalBill: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

export function calculateTip(params: TipForm): TipResult {
  const bill = new Decimal(params.billAmount || 0);
  const tipPct = new Decimal(params.tipPercentage || 0);
  const split = new Decimal(params.splitCount || 1);

  const tipAmount = bill.times(tipPct).div(100);
  const totalBill = bill.plus(tipAmount);

  return {
    tipAmount: tipAmount.toDecimalPlaces(2).toNumber(),
    totalBill: totalBill.toDecimalPlaces(2).toNumber(),
    tipPerPerson: tipAmount.div(split).toDecimalPlaces(2).toNumber(),
    totalPerPerson: totalBill.div(split).toDecimalPlaces(2).toNumber()
  };
}
