import Decimal from "decimal.js";
import { BMIForm } from '../schemas/bmiSchema';

export interface BMIResult {
  bmi: number;
  category: string;
  healthyWeightRange: [number, number];
}

export function calculateBMI(params: BMIForm): BMIResult {
  const heightM = new Decimal(params.height).div(100);
  const weight = new Decimal(params.weight);
  
  const bmi = weight.div(heightM.pow(2)).toDecimalPlaces(1);
  const bmiVal = bmi.toNumber();

  let category = "Normal";
  if (bmiVal < 18.5) category = "Underweight";
  else if (bmiVal >= 25 && bmiVal < 30) category = "Overweight";
  else if (bmiVal >= 30) category = "Obese";

  const minWeight = new Decimal(18.5).times(heightM.pow(2)).toDecimalPlaces(1).toNumber();
  const maxWeight = new Decimal(24.9).times(heightM.pow(2)).toDecimalPlaces(1).toNumber();

  return {
    bmi: bmiVal,
    category,
    healthyWeightRange: [minWeight, maxWeight]
  };
}
