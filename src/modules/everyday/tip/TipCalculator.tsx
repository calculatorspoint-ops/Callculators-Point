import React from 'react';
import { CalculatorFactory } from '../../../core/calculator-factory';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';
import { ProgressiveDisclosure, InterpretationCardProps } from '../../../core/ui-system';
import { TipSchema, TipForm } from './schemas/tipSchema';
import { calculateTip, TipResult } from './engine/tipEngine';

function TipFormUI({ control }: { control: any }) {
  return (
    <div className="flex flex-col gap-4">
      <NumericInput
        name="billAmount"
        control={control}
        label="Bill Amount"
        unit="$"
        tooltip="The total amount on your bill before any tip is added."
        placeholder="100.00"
        decimals={2}
      />
      <NumericInput
        name="tipPercentage"
        control={control}
        label="Tip Percentage"
        unit="%"
        tooltip="Standard tipping guide: 15% = good, 18% = great, 20% = excellent. For exceptional service, 25%+ is common."
        placeholder="15"
        decimals={1}
      />
      <ProgressiveDisclosure icon="👥" title="Split the Bill">
        <NumericInput
          name="splitCount"
          control={control}
          label="Number of People"
          tooltip="Divide the total bill equally among this many people."
          placeholder="1"
          decimals={0}
        />
      </ProgressiveDisclosure>
    </div>
  );
}

function TipResultUI({ result }: { result: TipResult }) {
  const fmt = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--surface2)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="text-xs font-bold text-[var(--text3)] uppercase mb-1 tracking-widest">Total Tip</div>
          <div className="text-2xl font-black text-[var(--brand)]">{fmt(result.tipAmount)}</div>
        </div>
        <div className="bg-[var(--surface2)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="text-xs font-bold text-[var(--text3)] uppercase mb-1 tracking-widest">Total Bill</div>
          <div className="text-2xl font-black text-[var(--text)]">{fmt(result.totalBill)}</div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm">
        <div className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase mb-3 tracking-widest">
          Per Person Breakdown
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Tip per person:</span>
          <span className="font-bold text-blue-900 dark:text-blue-200">{fmt(result.tipPerPerson)}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-blue-200 dark:border-blue-700">
          <span className="text-blue-700 dark:text-blue-300 font-bold">Total per person:</span>
          <span className="font-black text-2xl text-blue-900 dark:text-blue-200">{fmt(result.totalPerPerson)}</span>
        </div>
      </div>
    </div>
  );
}

function interpretTip(result: TipResult, form: TipForm): InterpretationCardProps {
  const { tipPercentage, splitCount } = form;
  const { tipAmount, totalPerPerson } = result;

  const quality = tipPercentage >= 20 ? 'excellent' : tipPercentage >= 18 ? 'great' : tipPercentage >= 15 ? 'good' : 'below standard';
  const tone: 'positive' | 'warning' | 'neutral' = tipPercentage >= 18 ? 'positive' : tipPercentage < 15 ? 'warning' : 'neutral';

  const splitNote = splitCount > 1
    ? ` Split ${splitCount} ways, each person owes $${totalPerPerson.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
    : '';

  return {
    tone,
    headline: `A ${tipPercentage}% tip is considered ${quality} service recognition.`,
    detail: `Your $${tipAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tip represents ${tipPercentage}% of the bill.${splitNote}`,
    action: tipPercentage < 15
      ? "Industry standard is a minimum of 15% for sit-down restaurants. Consider rounding up for good service."
      : "A tip of 18–20%+ is the gold standard for excellent service in North America."
  };
}

export const TipCalculator = CalculatorFactory.create({
  id: 'tip-calculator',
  domain: 'math',
  title: 'Tip Calculator',
  schema: TipSchema,
  defaultValues: { billAmount: 0, tipPercentage: 15, splitCount: 1 },
  engine: calculateTip,
  interpretation: interpretTip,
  formLayout: TipFormUI,
  resultLayout: TipResultUI
});
