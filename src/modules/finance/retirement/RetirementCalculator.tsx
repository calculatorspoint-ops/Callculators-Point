import React from 'react';
import { CalculatorFactory } from '../../../core/calculator-factory';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';
import { ProgressiveDisclosure, InterpretationCardProps, GlossaryTooltip } from '../../../core/ui-system';
import { RetirementSchema, RetirementForm } from './schemas/retirementSchema';
import { calculateRetirementSimulation, RetirementResult } from './engine/retirementEngine';
import { generateRetirementInsights } from './insights/retirementInsights';

function RetirementFormUI({ control }: { control: any }) {
  return (
    <div className="flex flex-col gap-4">
      <NumericInput
        name="currentPortfolio"
        control={control}
        label="Current Portfolio Balance"
        unit="$"
        tooltip="The total value of your retirement savings right now."
        placeholder="1,000,000"
        decimals={0}
      />
      <NumericInput
        name="annualWithdrawal"
        control={control}
        label="First Year Withdrawal"
        unit="$"
        tooltip="How much money you plan to withdraw in your first year of retirement. This amount will be adjusted for inflation in subsequent years."
        placeholder="40,000"
        decimals={0}
      />
      <NumericInput
        name="yearsInRetirement"
        control={control}
        label="Retirement Duration"
        unit="Yrs"
        tooltip="How many years you expect to live off this portfolio. Planning for 30 years is standard for a retirement age of 60-65."
        placeholder="30"
        decimals={0}
      />
      
      <ProgressiveDisclosure icon="🎲" title="Monte Carlo Assumptions">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <NumericInput
            name="expectedReturn"
            control={control}
            label="Expected Return"
            unit="%"
            tooltip="The average annual growth rate of your portfolio before inflation."
            decimals={1}
            placeholder="8.0"
          />
          <NumericInput
            name="volatility"
            control={control}
            label="Volatility"
            unit="%"
            tooltip="Standard deviation of returns. Higher volatility means wider swings in year-to-year portfolio value."
            decimals={1}
            placeholder="15.0"
          />
        </div>
        <NumericInput
          name="inflationRate"
          control={control}
          label="Annual Inflation"
          unit="%"
          tooltip="The average rate at which prices rise. Your annual withdrawal will increase by this rate every year to maintain purchasing power."
          decimals={1}
          placeholder="3.0"
        />
      </ProgressiveDisclosure>
    </div>
  );
}

function RetirementResultUI({ result }: { result: RetirementResult }) {
  let color = "text-green-700 dark:text-green-400";
  let bg = "bg-green-50 dark:bg-green-900/20";
  let border = "border-green-200 dark:border-green-800";

  if (result.successRate < 80) {
    color = "text-red-700 dark:text-red-400";
    bg = "bg-red-50 dark:bg-red-900/20";
    border = "border-red-200 dark:border-red-800";
  } else if (result.successRate < 95) {
    color = "text-yellow-700 dark:text-yellow-400";
    bg = "bg-yellow-50 dark:bg-yellow-900/20";
    border = "border-yellow-200 dark:border-yellow-800";
  }

  const fmt = (v: number) => Math.round(v).toLocaleString();

  return (
    <div className="flex flex-col gap-4">
      <div className={`${bg} p-6 rounded-2xl border ${border} flex flex-col items-center justify-center text-center transition-colors duration-500`}>
        <div className={`text-xs font-bold uppercase tracking-widest mb-2 opacity-80 ${color} flex items-center gap-1`}>
          Portfolio Success Probability
          <GlossaryTooltip term="Success Probability" explanation="The percentage of Monte Carlo simulated paths where your portfolio did not run out of money before the end of your retirement duration." />
        </div>
        <div className={`text-7xl font-black ${color}`}>{result.successRate.toFixed(1)}%</div>
        <div className={`text-xs mt-4 font-bold ${color} opacity-70 uppercase tracking-widest`}>
          Based on 5,000 Monte Carlo Iterations
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--surface2)] p-5 rounded-xl border border-[var(--border)] text-center sm:text-left shadow-sm">
          <div className="text-xs font-bold text-[var(--text3)] uppercase mb-1 flex items-center gap-1">
            Median Ending Balance
            <GlossaryTooltip term="Median" explanation="The middle outcome. 50% of simulations ended with more money than this, and 50% ended with less." />
          </div>
          <div className="text-xl font-black text-[var(--text)]">${fmt(result.medianEndingBalance)}</div>
        </div>
        <div className="bg-red-50/50 dark:bg-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/30 text-center sm:text-left shadow-sm">
          <div className="text-xs font-bold text-red-600/80 uppercase mb-1 flex items-center gap-1">
            Worst Case <GlossaryTooltip term="5th Percentile" explanation="A severely pessimistic outcome. 95% of simulations performed better than this." />
          </div>
          <div className="text-xl font-black text-red-700 dark:text-red-400">${fmt(result.worstCaseEndingBalance)}</div>
        </div>
      </div>
    </div>
  );
}

function interpretRetirement(result: RetirementResult, form: RetirementForm): InterpretationCardProps {
  const { successRate, safeWithdrawalRate } = result;
  const { yearsInRetirement } = form;

  if (successRate >= 95) {
    return {
      tone: 'positive',
      headline: `Your retirement plan is highly robust, surviving ${successRate.toFixed(1)}% of all simulated market conditions over ${yearsInRetirement} years.`,
      detail: `Your initial withdrawal rate is ${safeWithdrawalRate.toFixed(1)}%, which historically offers excellent safety margins against inflation and market crashes.`,
      action: "You may actually have room to spend slightly more in early retirement without significantly jeopardizing your portfolio."
    };
  }

  if (successRate >= 80) {
    return {
      tone: 'warning',
      headline: `Your plan has a decent ${successRate.toFixed(1)}% survival rate, but carries some sequence-of-returns risk.`,
      detail: `If a severe market downturn occurs early in your retirement, your portfolio could deplete prematurely. Your initial withdrawal rate is ${safeWithdrawalRate.toFixed(1)}%.`,
      action: "Consider a dynamic spending strategy: be prepared to reduce your withdrawals during bad market years to improve longevity."
    };
  }

  return {
    tone: 'critical',
    headline: `High Risk: Your portfolio runs out of money in ${(100 - successRate).toFixed(1)}% of simulated scenarios over ${yearsInRetirement} years.`,
    detail: `An initial withdrawal rate of ${safeWithdrawalRate.toFixed(1)}% is statistically unsustainable against normal market volatility and inflation.`,
    action: "You must lower your annual withdrawal, delay retirement to grow the portfolio further, or plan to supplement your income."
  };
}

export const RetirementCalculator = CalculatorFactory.create({
  id: 'retirement-simulator',
  domain: 'finance',
  title: 'Retirement Monte Carlo Simulator',
  schema: RetirementSchema,
  defaultValues: { currentPortfolio: 1000000, annualWithdrawal: 40000, yearsInRetirement: 30, expectedReturn: 8, volatility: 15, inflationRate: 3 },
  engine: calculateRetirementSimulation,
  insights: generateRetirementInsights,
  interpretation: interpretRetirement,
  formLayout: RetirementFormUI,
  resultLayout: RetirementResultUI
});

