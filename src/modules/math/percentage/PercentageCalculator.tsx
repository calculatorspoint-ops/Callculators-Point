import React from 'react';
import { CalculatorFactory } from '../../../core/calculator-factory';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';
import { InterpretationCardProps, GlossaryTooltip } from '../../../core/ui-system';
import { PercentageSchema, PercentageForm } from './schemas/percentageSchema';
import { calculatePercentage, PercentageResult } from './engine/percentageEngine';

function PercentageFormUI({ control }: { control: any }) {
  return (
    <div className="flex flex-col gap-4">
      <NumericInput 
        name="percentage" 
        control={control} 
        label="Percentage" 
        unit="%"
        tooltip="The fraction or share out of 100."
      />
      <NumericInput 
        name="baseValue" 
        control={control} 
        label="Of Value" 
        tooltip="The total original amount."
      />
    </div>
  );
}

function PercentageResultUI({ result }: { result: PercentageResult }) {
  const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 4 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm col-span-1 sm:col-span-3">
        <div className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-1 uppercase tracking-widest flex justify-center items-center gap-1">
          Exact Result <GlossaryTooltip term="Percentage Value" explanation="The calculated portion." />
        </div>
        <div className="text-4xl font-black text-blue-900 dark:text-blue-300 text-center">{fmt(result.value)}</div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm col-span-1 sm:col-span-1 sm:col-start-1">
        <div className="text-xs font-bold text-green-700 dark:text-green-400 mb-1 uppercase tracking-wider flex items-center gap-1">
          Added <GlossaryTooltip term="Markup" explanation="The base value plus the percentage. Useful for calculating total price after tax." />
        </div>
        <div className="text-2xl font-bold text-green-900 dark:text-green-300">{fmt(result.added)}</div>
      </div>
      <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-200 dark:border-red-800 shadow-sm col-span-1 sm:col-span-1 sm:col-start-3">
        <div className="text-xs font-bold text-red-700 dark:text-red-400 mb-1 uppercase tracking-wider flex items-center gap-1">
          Subtracted <GlossaryTooltip term="Discount" explanation="The base value minus the percentage. Useful for calculating sale prices." />
        </div>
        <div className="text-2xl font-bold text-red-900 dark:text-red-300">{fmt(result.subtracted)}</div>
      </div>
    </div>
  );
}

function interpretPercentage(result: PercentageResult, form: PercentageForm): InterpretationCardProps {
  const { percentage, baseValue } = form;
  const { value, added, subtracted } = result;

  return {
    tone: 'neutral',
    headline: `${percentage}% of ${baseValue} is exactly ${value}.`,
    detail: `If this is a markup (like tax or tip), the new total is ${added}. If this is a discount (like a sale), the new total is ${subtracted}.`,
    action: "You can copy the 'Added' or 'Subtracted' numbers directly depending on your use-case."
  };
}

export const PercentageCalculator = CalculatorFactory.create({
  id: 'percentage-calculator',
  domain: 'math',
  title: 'Percentage Configuration',
  schema: PercentageSchema,
  defaultValues: { percentage: 10, baseValue: 1000 },
  engine: calculatePercentage,
  interpretation: interpretPercentage,
  formLayout: PercentageFormUI,
  resultLayout: PercentageResultUI
});

