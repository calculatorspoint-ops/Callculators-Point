import { BMRForm } from '../schemas/bmrSchema';

export interface BMRResult {
  bmr: number;
  tdee: number;
}

export function calculateBMR(params: BMRForm): BMRResult {
  // Mifflin-St Jeor Equation
  let bmr = (10 * params.weight) + (6.25 * params.height) - (5 * params.age);
  bmr += (params.gender === 'male' ? 5 : -161);
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(bmr * params.activityLevel)
  };
}
