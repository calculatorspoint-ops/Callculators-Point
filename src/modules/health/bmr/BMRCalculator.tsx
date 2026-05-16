import React from 'react';
import { CalculatorFactory } from '../../../core/calculator-factory';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';
import { SelectInput } from '../../../core/form-engine/components/SelectInput';
import { GlossaryTooltip, InterpretationCardProps } from '../../../core/ui-system';
import { BMRSchema, BMRForm } from './schemas/bmrSchema';
import { calculateBMR, BMRResult } from './engine/bmrEngine';

function BMRFormUI({ control }: { control: any }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <SelectInput
          name="gender"
          control={control}
          label="Biological Sex"
          tooltip="The Mifflin-St Jeor formula uses biological sex (male/female) to adjust for differences in muscle mass and hormones."
          options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]}
        />
        <NumericInput
          name="age"
          control={control}
          label="Age"
          unit="Yrs"
          tooltip="Your metabolic rate naturally declines with age. BMR decreases by roughly 1–2% per decade after age 20."
          placeholder="30"
          decimals={0}
        />
      </div>
      <NumericInput
        name="weight"
        control={control}
        label="Body Weight"
        unit="kg"
        tooltip="Your current weight. If you know it in pounds, divide by 2.205."
        placeholder="70"
        decimals={1}
      />
      <NumericInput
        name="height"
        control={control}
        label="Height"
        unit="cm"
        tooltip="Your height. If you know it in feet/inches: multiply feet × 30.48 and add inches × 2.54."
        placeholder="175"
        decimals={0}
      />
      <SelectInput
        name="activityLevel"
        control={control}
        label="Activity Level"
        tooltip="Your average physical activity multiplied with your BMR gives TDEE — your total daily calorie burn."
        options={[
          { label: 'Sedentary (desk job, little/no exercise)', value: '1.2' },
          { label: 'Lightly active (light exercise 1–3 days/week)', value: '1.375' },
          { label: 'Moderately active (moderate exercise 3–5 days/week)', value: '1.55' },
          { label: 'Very active (hard exercise 6–7 days/week)', value: '1.725' },
          { label: 'Super active (physical job + hard training)', value: '1.9' },
        ]}
      />
    </div>
  );
}

function BMRResultUI({ result }: { result: BMRResult }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[var(--surface2)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="text-sm font-bold text-[var(--text3)] uppercase mb-1 flex items-center gap-1 tracking-widest">
          Basal Metabolic Rate
          <GlossaryTooltip
            term="BMR"
            explanation="Basal Metabolic Rate — the calories your body burns at complete rest just to keep your organs functioning. This is your baseline floor."
          />
        </div>
        <div className="text-4xl font-black text-[var(--text)]">
          {result.bmr.toLocaleString()}
          <span className="text-base font-medium text-[var(--text3)] ml-2">kcal/day</span>
        </div>
        <p className="text-xs text-[var(--text2)] mt-2">Calories burned at rest — breathing, heartbeat, organ function.</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm">
        <div className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase mb-1 flex items-center gap-1 tracking-widest">
          Total Daily Energy Expenditure
          <GlossaryTooltip
            term="TDEE"
            explanation="TDEE (Total Daily Energy Expenditure) is how many calories you actually burn in a day, accounting for your activity level. Eat at TDEE to maintain weight, below to lose, above to gain."
          />
        </div>
        <div className="text-5xl font-black text-blue-900 dark:text-blue-200">
          {result.tdee.toLocaleString()}
          <span className="text-base font-medium opacity-70 ml-2">kcal/day</span>
        </div>
        <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-2 font-medium">
          Eat at this level to maintain your current weight.
        </p>
      </div>
    </div>
  );
}

function interpretBMR(result: BMRResult, form: BMRForm): InterpretationCardProps {
  const { tdee, bmr } = result;
  const deficit500 = tdee - 500;
  const surplus250 = tdee + 250;

  return {
    tone: 'neutral',
    headline: `Your body burns approximately ${tdee.toLocaleString()} kcal/day at your current activity level.`,
    detail: `Your BMR (${bmr.toLocaleString()} kcal) is what you'd burn in a coma. Your TDEE adds your real-world movement on top. These numbers are estimates (±10%) based on the Mifflin-St Jeor formula.`,
    action: `To lose ~0.5 kg/week: eat around ${deficit500.toLocaleString()} kcal/day. To gain muscle: aim for ${surplus250.toLocaleString()} kcal/day with strength training.`
  };
}

export const BMRCalculator = CalculatorFactory.create({
  id: 'bmr-calculator',
  domain: 'health',
  title: 'BMR & TDEE Calculator',
  schema: BMRSchema,
  defaultValues: { gender: 'male', weight: 70, height: 175, age: 30, activityLevel: 1.2 },
  engine: calculateBMR,
  interpretation: interpretBMR,
  formLayout: BMRFormUI,
  resultLayout: BMRResultUI
});
