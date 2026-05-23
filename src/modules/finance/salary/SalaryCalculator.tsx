import React from 'react';
import { CalculatorFactory } from '../../../core/calculator-factory';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';
import { SelectInput } from '../../../core/form-engine/components/SelectInput';
import { ProgressiveDisclosure, InterpretationCardProps, GlossaryTooltip } from '../../../core/ui-system';
import { SalarySchema, SalaryForm } from './schemas/salarySchema';
import { calculateSalary, SalaryResult, COUNTRY_TAX_CONFIGS } from './engine/salaryEngine';

// Build country options sorted by name
const COUNTRY_OPTIONS = [
  ...Object.entries(COUNTRY_TAX_CONFIGS)
    .filter(([k]) => k !== 'custom')
    .sort(([, a], [, b]) => a.name.localeCompare(b.name))
    .map(([k, v]) => ({ value: k, label: `${v.name} (${v.currency})` })),
  { value: 'custom', label: 'Custom / Other Country' },
];

function SalaryFormUI({ control }: { control: any }) {
  const country = control._defaultValues?.country ?? 'us';
  const cfg = COUNTRY_TAX_CONFIGS[country] ?? COUNTRY_TAX_CONFIGS['us'];

  return (
    <div className="flex flex-col gap-4">
      {/* Country selector */}
      <SelectInput
        name="country"
        control={control}
        label="Country / Tax Region"
        tooltip="Select your country to automatically apply official tax slabs and social security rates."
        options={COUNTRY_OPTIONS}
      />

      {/* Tax rule info banner */}
      {cfg && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          <span className="font-bold">📋 {cfg.name} tax rules:</span> {cfg.notes}
        </div>
      )}

      {/* Gross salary */}
      <NumericInput
        name="grossSalary"
        control={control}
        label="Gross Salary"
        unit={cfg?.currencySymbol ?? '$'}
        tooltip="Your total pay before any taxes or deductions. Enter for the period selected below."
        placeholder="60000"
      />

      {/* Pay frequency */}
      <SelectInput
        name="payFrequency"
        control={control}
        label="Pay Frequency"
        tooltip="How often you get paid. The engine annualises your salary first, then divides it back per period."
        options={[
          { label: 'Per Year (Annual)', value: 'annual' },
          { label: 'Per Month', value: 'monthly' },
          { label: 'Bi-Weekly (Every 2 Weeks)', value: 'biweekly' },
          { label: 'Per Week', value: 'weekly' },
        ]}
      />

      {/* Custom tax rate — only for "custom" country */}
      {country === 'custom' && (
        <NumericInput
          name="customTaxRate"
          control={control}
          label="Flat Tax Rate"
          unit="%"
          tooltip="Enter your effective income tax rate as a percentage (e.g. 20 for 20%)."
          decimals={1}
          placeholder="20"
        />
      )}

      {/* Optional deductions */}
      <ProgressiveDisclosure icon="➖" title="Other Deductions (per pay period)">
        <NumericInput
          name="deductions"
          control={control}
          label="Fixed Deductions"
          unit={cfg?.currencySymbol ?? '$'}
          tooltip="Any fixed amounts taken out per paycheck — health insurance, retirement contributions, loan repayments, etc. Enter per pay period."
          placeholder="0"
        />
      </ProgressiveDisclosure>
    </div>
  );
}

function fmt(v: number, sym: string) {
  return `${sym}${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SalaryResultUI({ result }: { result: SalaryResult }) {
  const sym = result.currencySymbol;
  const hasSS = result.annual.socialSecurity > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Hero take-home */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800 text-center shadow-sm">
        <div className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest mb-1 flex justify-center items-center gap-1">
          Annual Take-Home (Net)
          <GlossaryTooltip term="Net Pay" explanation="The actual money deposited to your account after all taxes, social security, and deductions." />
        </div>
        <div className="text-5xl font-black text-green-900 dark:text-green-300">
          {fmt(result.annual.net, sym)}
        </div>
        <div className="flex justify-center gap-4 mt-3 flex-wrap">
          <span className="text-xs font-bold text-green-700/70 dark:text-green-400/70">
            Effective Tax: <strong>{result.effectiveTaxRate}%</strong>
          </span>
          <span className="text-xs font-bold text-green-700/70 dark:text-green-400/70">
            Marginal Rate: <strong>{result.marginalRate}%</strong>
          </span>
        </div>
      </div>

      {/* Period breakdown table */}
      <div className="overflow-x-auto border border-[var(--border)] rounded-xl shadow-sm bg-[var(--surface)]">
        <table className="w-full text-sm text-left">
          <thead className="bg-[var(--surface2)] text-[var(--text3)] uppercase text-xs tracking-wider border-b border-[var(--border)]">
            <tr>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3 text-right">Gross</th>
              <th className="px-4 py-3 text-right">Income Tax</th>
              {hasSS && <th className="px-4 py-3 text-right">{result.countryConfig.socialSecurityLabel?.split('(')[0].trim() ?? 'Social Sec.'}</th>}
              {result.annual.deductions > 0 && <th className="px-4 py-3 text-right">Other Deduct.</th>}
              <th className="px-4 py-3 text-right font-bold text-[var(--text)]">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {([
              { label: 'Annual',    data: result.annual },
              { label: 'Monthly',   data: result.monthly },
              { label: 'Bi-Weekly', data: result.biweekly },
              { label: 'Weekly',    data: result.weekly },
            ] as const).map(row => (
              <tr key={row.label} className="hover:bg-[var(--surface2)] transition-colors">
                <td className="px-4 py-3 font-bold text-[var(--text)]">{row.label}</td>
                <td className="px-4 py-3 text-right text-[var(--text2)] font-mono">{fmt(row.data.gross, sym)}</td>
                <td className="px-4 py-3 text-right text-red-500 font-mono">−{fmt(row.data.tax, sym)}</td>
                {hasSS && <td className="px-4 py-3 text-right text-orange-500 font-mono">−{fmt(row.data.socialSecurity, sym)}</td>}
                {result.annual.deductions > 0 && <td className="px-4 py-3 text-right text-red-400 font-mono">−{fmt(row.data.deductions, sym)}</td>}
                <td className="px-4 py-3 text-right font-black text-[var(--brand)] font-mono bg-[var(--brand)]/5">{fmt(row.data.net, sym)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tax slab breakdown */}
      {result.slabBreakdown.length > 0 && (
        <ProgressiveDisclosure icon="📊" title="Progressive Tax Slab Breakdown">
          <div className="flex flex-col gap-2 pt-1">
            {result.slabBreakdown.map((slab, i) => (
              <div key={i} className="flex justify-between items-center text-sm py-2 px-3 rounded-lg bg-[var(--surface2)] border border-[var(--border)]">
                <span className="text-[var(--text2)] text-xs">{slab.label}</span>
                <div className="text-right">
                  <div className="font-bold text-red-500 text-xs font-mono">{fmt(slab.tax, sym)}</div>
                  <div className="text-[var(--text3)] text-xs">on {sym}{slab.taxable.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center text-sm py-2 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 font-bold mt-1">
              <span className="text-red-700 dark:text-red-400">Total Income Tax</span>
              <span className="text-red-700 dark:text-red-400 font-mono">{fmt(result.annual.tax, sym)}</span>
            </div>
            {hasSS && (
              <div className="flex justify-between items-center text-sm py-2 px-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 font-bold">
                <span className="text-orange-700 dark:text-orange-400 text-xs">{result.countryConfig.socialSecurityLabel}</span>
                <span className="text-orange-700 dark:text-orange-400 font-mono">{fmt(result.annual.socialSecurity, sym)}</span>
              </div>
            )}
          </div>
        </ProgressiveDisclosure>
      )}
    </div>
  );
}

function interpretSalary(result: SalaryResult, _form: SalaryForm): InterpretationCardProps {
  const sym = result.currencySymbol;
  const { annual, effectiveTaxRate, marginalRate, countryConfig } = result;
  const retentionPct = annual.gross > 0 ? ((annual.net / annual.gross) * 100).toFixed(1) : '0';
  const totalOut = annual.tax + annual.socialSecurity + annual.deductions;
  const totalOutPct = annual.gross > 0 ? ((totalOut / annual.gross) * 100).toFixed(1) : '0';

  // UAE / Saudi / 0% tax
  if (effectiveTaxRate === 0) {
    return {
      tone: 'positive',
      headline: `In ${countryConfig.name}, there is no personal income tax — you keep 100% of your gross salary.`,
      detail: `Your full ${sym}${annual.gross.toLocaleString(undefined, { maximumFractionDigits: 0 })} annual gross becomes take-home pay.`,
      action: "Consider investing or saving the tax-equivalent amount you would have paid in a high-tax jurisdiction."
    };
  }

  if (Number(totalOutPct) > 45) {
    return {
      tone: 'warning',
      headline: `${totalOutPct}% of your gross salary is withheld — you take home only ${retentionPct}%.`,
      detail: `Your effective income tax rate is ${effectiveTaxRate}% and your marginal (top) rate is ${marginalRate}%. Total annual deductions: ${sym}${totalOut.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`,
      action: "Explore tax-advantaged accounts (pension, 401k, ISA, etc.) in your country to reduce taxable income and lower your effective rate."
    };
  }

  return {
    tone: 'neutral',
    headline: `In ${countryConfig.name}, you keep ${retentionPct}% of your gross as take-home pay.`,
    detail: `Effective tax rate: ${effectiveTaxRate}% · Marginal rate: ${marginalRate}%. Your monthly net salary is ${sym}${result.monthly.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
    action: "Use the monthly net figure as your hard budget ceiling — not your gross."
  };
}

export const SalaryCalculator = CalculatorFactory.create({
  id: 'salary-calculator',
  domain: 'finance',
  title: 'Salary & Tax Breakdown',
  schema: SalarySchema,
  defaultValues: {
    grossSalary: 60000,
    payFrequency: 'annual',
    country: 'us',
    deductions: 0,
    customTaxRate: 20,
  },
  engine: calculateSalary,
  interpretation: interpretSalary,
  formLayout: SalaryFormUI,
  resultLayout: SalaryResultUI,
});
