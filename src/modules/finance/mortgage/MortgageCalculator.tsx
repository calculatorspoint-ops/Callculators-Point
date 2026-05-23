import React from 'react';
import { CalculatorFactory } from '../../../core/calculator-factory';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';
import { ProgressiveDisclosure, InterpretationCardProps } from '../../../core/ui-system';
import { buildProjectionChart } from '../../../core/chart-engine';
import { MortgageSchema } from './schemas/mortgageSchema';
import { calculateMortgage, MortgageResult } from './engine/mortgageEngine';
import { generateMortgageInsights } from './insights/mortgageInsights';
import { useRegionCurrency } from '../../../core/geo-engine/useRegion';
import { useGeoStore } from '../../../core/geo-engine/geoStore';

// ── Form ──────────────────────────────────────────────────────────────────────
function MortgageFormUI({ control }: { control: any }) {
  // ✅ Hook called at top of React component — correct
  const { currencySymbol } = useRegionCurrency();
  const sym = currencySymbol || '$';

  return (
    <div className="flex flex-col gap-4">
      <NumericInput
        name="homePrice"
        control={control}
        label="Home Price"
        unit={sym}
        tooltip="The full listing or agreed purchase price of the property."
        placeholder="300,000"
        decimals={0}
      />
      <NumericInput
        name="downPayment"
        control={control}
        label="Down Payment"
        unit={sym}
        tooltip="The upfront amount you pay out of pocket. The rest is financed by the loan. Most lenders require at least 3–20% of the home price."
        placeholder="60,000"
        decimals={0}
      />
      <div className="grid grid-cols-2 gap-4">
        <NumericInput
          name="interestRate"
          control={control}
          label="Interest Rate"
          unit="%"
          tooltip="The annual interest rate on your mortgage. Rates change based on your credit score, lender, and market conditions."
          decimals={2}
          placeholder="6.5"
        />
        <NumericInput
          name="loanTerm"
          control={control}
          label="Loan Term"
          unit="Yrs"
          tooltip="The number of years over which you repay the loan. 30-year terms have lower monthly payments but much higher total interest than 15-year terms."
          decimals={0}
          placeholder="30"
        />
      </div>

      <ProgressiveDisclosure icon="🏠" title="Escrow (Tax & Insurance)">
        <NumericInput
          name="propertyTax"
          control={control}
          label="Annual Property Tax"
          unit={sym}
          tooltip="Your yearly property tax bill. This is added to your monthly payment via an escrow account by most lenders."
        />
        <NumericInput
          name="homeInsurance"
          control={control}
          label="Annual Home Insurance"
          unit={sym}
          tooltip="Your yearly homeowner's insurance premium. Also typically escrowed alongside property tax."
        />
      </ProgressiveDisclosure>
    </div>
  );
}

// ── Result ────────────────────────────────────────────────────────────────────
function MortgageResultUI({ result }: { result: MortgageResult }) {
  // ✅ Hook ALWAYS called first — no conditional hook call
  const { currencySymbol } = useRegionCurrency();
  const sym = currencySymbol || '$';
  const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Guard AFTER all hooks
  if (result.principal <= 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[var(--surface2)] p-5 rounded-xl border border-[var(--border)]">
        <div className="text-xs font-bold text-[var(--text3)] uppercase mb-1 tracking-widest">
          Monthly Payment (PITI)
        </div>
        <div className="text-4xl font-black text-[var(--brand)]">{sym}{fmt(result.monthlyPayment)}</div>
        <p className="text-xs font-semibold text-[var(--text2)] mt-2 flex justify-between">
          <span>Loan Paid Off:</span>
          <span className="text-[var(--text)]">{result.payoffDate}</span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-700">
          <div className="text-xs font-bold text-red-600 uppercase mb-1">Total Interest</div>
          <div className="text-xl font-black text-red-700 dark:text-red-400">{sym}{fmt(result.totalInterest)}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
          <div className="text-xs font-bold text-green-700 uppercase mb-1">Total Cost (P+I)</div>
          <div className="text-xl font-black text-green-800 dark:text-green-300">{sym}{fmt(result.totalPayment)}</div>
        </div>
      </div>
    </div>
  );
}

// ── Interpretation ────────────────────────────────────────────────────────────
// Pure function — NO hooks. Reads currency symbol via .getState() (safe outside React)
function interpretMortgage(result: MortgageResult): InterpretationCardProps | null {
  if (result.principal <= 0) return null;

  // .getState() is the Zustand static accessor — safe to call in any plain function
  const sym = useGeoStore.getState()?.rules?.currencySymbol || '$';

  const interestRatio = result.principal > 0 ? result.totalInterest / result.principal : 0;
  const pct = (interestRatio * 100).toFixed(0);
  const fmt = (v: number) => `${sym}${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  if (interestRatio > 1) {
    return {
      tone: 'critical',
      headline: `You will pay ${pct}% of your loan amount again purely in interest — ${fmt(result.totalInterest)} on top of your ${fmt(result.principal)} principal.`,
      detail: `Over a ${result.payoffDate} timeline, more than half your total payments go to the bank, not your equity.`,
      action: `Adding extra payments towards principal each month can shorten your loan by years and save significantly in interest.`
    };
  }

  if (interestRatio > 0.5) {
    return {
      tone: 'warning',
      headline: `You will pay ${fmt(result.totalInterest)} in total interest — ${pct}% of your original loan amount.`,
      detail: `This is normal for a long-term mortgage, but the actual cost of the home is ${fmt(result.totalPayment)}, not just the sticker price.`,
      action: `Consider a shorter loan term if you can afford higher monthly payments — it typically halves the total interest paid.`
    };
  }

  return {
    tone: 'positive',
    headline: `Your total interest of ${fmt(result.totalInterest)} is ${pct}% of the loan — relatively efficient for a mortgage.`,
    detail: `A shorter tenure or lower rate means more of each payment goes directly to your equity.`,
    action: `Continue making on-time payments. Any extra towards principal builds home equity faster.`
  };
}

export const MortgageCalculator = CalculatorFactory.create({
  id: 'mortgage-calculator',
  domain: 'finance',
  title: 'Mortgage Amortization',
  schema: MortgageSchema,
  defaultValues: { homePrice: 300000, downPayment: 60000, interestRate: 6.5, loanTerm: 30, propertyTax: 2400, homeInsurance: 1200 },
  engine: calculateMortgage,
  insights: generateMortgageInsights,
  interpretation: interpretMortgage,
  chartBuilder: (result: MortgageResult) => {
    if (result.schedule.length === 0) return null;
    return buildProjectionChart({
      id: 'mortgage-chart',
      schedule: result.schedule.map(s => ({
        period: s.year,
        primary: s.remainingBalance,
        secondary: s.cumulativeInterest,
        balance: 0
      })),
      labels: { primary: "Remaining Balance", secondary: "Cumulative Interest" },
      colors: { primary: "var(--brand)", secondary: "#ef4444" }
    });
  },
  formLayout: MortgageFormUI,
  resultLayout: MortgageResultUI
});
