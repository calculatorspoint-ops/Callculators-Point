import React from 'react';
import { CalculatorFactory } from '../../../core/calculator-factory';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';

import { BMISchema } from './schemas/bmiSchema';
import { calculateBMI, BMIResult } from './engine/bmiEngine';
import { generateBMIInsights } from './insights/bmiInsights';
import { InterpretationCardProps } from '../../../core/ui-system';

function BMIFormUI({ control }: { control: any }) {
  return (
    <div className="flex flex-col gap-4">
      <NumericInput
        name="weight"
        control={control}
        label="Body Weight"
        unit="kg"
        tooltip="Your current body weight in kilograms. If you know it in pounds, divide by 2.205."
        placeholder="70"
        decimals={1}
      />
      <NumericInput
        name="height"
        control={control}
        label="Height"
        unit="cm"
        tooltip="Your height in centimetres. If you know it in feet/inches, multiply feet by 30.48 and add inches × 2.54."
        placeholder="175"
        decimals={0}
      />
    </div>
  );
}

const CATEGORY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Underweight: { color: 'text-blue-700',  bg: 'bg-blue-50  dark:bg-blue-900/20',  border: 'border-blue-200  dark:border-blue-700' },
  Normal:      { color: 'text-green-700', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700' },
  Overweight:  { color: 'text-yellow-700',bg: 'bg-yellow-50 dark:bg-yellow-900/20',border: 'border-yellow-200 dark:border-yellow-700' },
  Obese:       { color: 'text-red-700',   bg: 'bg-red-50   dark:bg-red-900/20',   border: 'border-red-200   dark:border-red-700' },
};

function BMIResultUI({ result }: { result: BMIResult }) {
  const style = CATEGORY_COLORS[result.category] ?? CATEGORY_COLORS.Normal;

  return (
    <div className={`${style.bg} p-6 rounded-2xl border ${style.border} flex flex-col items-center justify-center text-center transition-colors duration-300`}>
      <div className={`text-xs font-bold uppercase tracking-widest mb-2 opacity-70 ${style.color}`}>
        Body Mass Index · WHO Classification
      </div>
      <div className={`text-7xl font-black ${style.color}`}>{result.bmi}</div>
      <div className={`mt-3 font-bold text-lg ${style.color} px-5 py-1.5 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm`}>
        {result.category}
      </div>
      <div className={`text-xs mt-3 opacity-75 ${style.color}`}>
        Healthy range for your height: {result.healthyWeightRange[0]}–{result.healthyWeightRange[1]} kg
      </div>
    </div>
  );
}

function interpretBMI(result: BMIResult): InterpretationCardProps | null {
  const { bmi, category, healthyWeightRange } = result;

  if (category === 'Normal') {
    return {
      tone: 'positive',
      headline: `A BMI of ${bmi} places you firmly in the Healthy Weight range (18.5–24.9). Well done.`,
      detail: `The WHO considers this range associated with the lowest risk of weight-related health problems.`,
      action: 'Maintain your current weight through balanced nutrition and regular physical activity.'
    };
  }

  if (category === 'Underweight') {

    return {
      tone: 'warning',
      headline: `A BMI of ${bmi} indicates Underweight (below 18.5). Your healthy target weight is ${healthyWeightRange[0]}–${healthyWeightRange[1]} kg.`,
      detail: `Being underweight can signal nutritional deficiencies or underlying health conditions and may affect bone density and immunity.`,
      action: 'Consult a nutritionist. Focus on calorie-dense whole foods and strength training.'
    };
  }

  if (category === 'Overweight') {
    return {
      tone: 'warning',
      headline: `A BMI of ${bmi} places you in the Overweight range (25–29.9). Your healthy target is ${healthyWeightRange[0]}–${healthyWeightRange[1]} kg.`,
      detail: `Overweight is associated with increased risk of type-2 diabetes, hypertension, and cardiovascular disease. Note: BMI does not distinguish between muscle and fat mass.`,
      action: 'Reducing BMI by just 1–2 points through diet and exercise measurably lowers cardiovascular risk.'
    };
  }

  // Obese
  return {
    tone: 'critical',
    headline: `A BMI of ${bmi} indicates Obesity (30+). This significantly elevates risk for serious chronic conditions.`,
    detail: `WHO categorises BMI ≥ 30 as Obesity Class I–III. Associated risks include heart disease, type-2 diabetes, sleep apnea, and joint problems. Your healthy weight target is ${healthyWeightRange[0]}–${healthyWeightRange[1]} kg.`,
    action: 'Please consult a healthcare provider. Structured, professionally guided programmes achieve the safest and most sustainable outcomes.'
  };
}

export const BMICalculator = CalculatorFactory.create({
  id: 'bmi-calculator',
  domain: 'health',
  title: 'BMI Calculator',
  schema: BMISchema,
  defaultValues: { weight: 70, height: 175 },
  engine: calculateBMI,
  insights: generateBMIInsights,
  interpretation: interpretBMI,
  formLayout: BMIFormUI,
  resultLayout: BMIResultUI
});
