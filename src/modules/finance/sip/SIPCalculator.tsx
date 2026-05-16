import React, { useMemo } from 'react';
import {
  CalculatorShell, InputWorkspace, ResultWorkspace, InsightWorkspace,
  ProgressiveDisclosure, InterpretationCard, GlossaryTooltip
} from '../../../core/ui-system';
import { useFormEngine } from '../../../core/form-engine';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';
import { ProjectionChart, buildProjectionChart } from '../../../core/chart-engine';
import { SIPSchema, SIPForm } from './schemas/sipSchema';
import { calculateProbabilisticSIP } from './engine/sipEngine';
import { generateSIPInsights } from './insights/sipInsights';
import { SIPResult } from './types';
import { useRegionCurrency } from '../../../core/geo-engine/useRegion.js';

export function SIPCalculator() {
  const { currencySymbol, locale } = useRegionCurrency();
  const sym = currencySymbol || '₹';
  const { form, derivedState, isCalculating } = useFormEngine<SIPForm, SIPResult>({
    schema: SIPSchema,
    defaultValues: {
      monthlyInvestment: 5000,
      expectedReturnRate: 12,
      tenureYears: 10,
      stepUpRate: 0,
      inflationRate: 6,
      volatility: 15,
      currentSalary: 0,
      salaryGrowthRate: 5
    },
    debounceMs: 300,
    onDerive: async (values) => {
      return calculateProbabilisticSIP(values);
    }
  });

  const chartDataset = useMemo(() => {
    if (!derivedState) return null;
    return buildProjectionChart({
      id: 'sip-projection',
      schedule: derivedState.schedule.map(s => ({
        period: s.year,
        primary: s.wealth,
        secondary: s.p90Wealth,
        tertiary: s.p10Wealth,
        balance: s.invested
      })),
      labels: { primary: "Median (P50)", secondary: "Optimistic (P90)", tertiary: "Pessimistic (P10)", balance: "Total Invested" },
      colors: { primary: "var(--brand)", secondary: "#34d399", tertiary: "#f87171", balance: "#cbd5e1" }
    });
  }, [derivedState]);

  const insights = useMemo(() => {
    if (!derivedState) return [];
    return generateSIPInsights(derivedState, form.getValues());
  }, [derivedState, form]);

  const interpretation = useMemo(() => {
    if (!derivedState) return null;
    const { expectedWealth, inflationAdjustedWealth, totalInvestment, p10Wealth, p90Wealth } = derivedState;
    const gain = expectedWealth - totalInvestment;
    const gainPct = totalInvestment > 0 ? ((gain / totalInvestment) * 100).toFixed(0) : '0';
    const fmt = (v: number) => new Intl.NumberFormat(locale || 'en-IN', { maximumFractionDigits: 0, notation: 'compact' }).format(v);

    if (inflationAdjustedWealth < totalInvestment) {
      return {
        tone: 'critical' as const,
        headline: `After ${form.getValues().tenureYears} years, your real purchasing power (${sym}${fmt(inflationAdjustedWealth)}) will be lower than what you invested (${sym}${fmt(totalInvestment)}). Inflation is outpacing your returns.`,
        detail: `Your nominal corpus of ${sym}${fmt(expectedWealth)} sounds positive, but in today's money it is worth less than you put in.`,
        action: "Consider increasing your expected return rate or your annual step-up percentage to beat inflation."
      };
    }

    const spreadPct = expectedWealth > 0 ? (((p90Wealth - p10Wealth) / expectedWealth) * 100).toFixed(0) : '0';
    const tone: 'positive' | 'warning' = Number(gainPct) > 100 ? 'positive' : 'warning';
    return {
      tone,
      headline: `At the median (P50), your ${sym}${fmt(totalInvestment)} investment grows to ${sym}${fmt(expectedWealth)} — a ${gainPct}% gain over your invested capital.`,
      detail: `Due to market volatility, outcomes range from ${sym}${fmt(p10Wealth)} (pessimistic) to ${sym}${fmt(p90Wealth)} (optimistic) — a ±${spreadPct}% spread. The real inflation-adjusted value is ${sym}${fmt(inflationAdjustedWealth)}.`,
      action: "Focus on the inflation-adjusted figure as your true financial goal, not the nominal number."
    };
  }, [derivedState, form]);

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined) return '0';
    return new Intl.NumberFormat(locale || 'en-IN', { maximumFractionDigits: 0 }).format(val);
  };

  return (
    <CalculatorShell isLoading={isCalculating}>
      <InputWorkspace>
        <NumericInput
          name="monthlyInvestment"
          control={form.control}
          label="Monthly Investment"
          unit={sym}
          tooltip="The fixed amount you invest every month into a mutual fund SIP."
          placeholder="5,000"
          decimals={0}
        />
        <NumericInput
          name="expectedReturnRate"
          control={form.control}
          label="Expected Annual Return"
          unit="%"
          tooltip="The average yearly growth rate you expect from your investment. Indian large-cap equity historically returned ~12-14% annually over long periods."
          decimals={1}
          placeholder="12"
        />
        <NumericInput
          name="tenureYears"
          control={form.control}
          label="Investment Period"
          unit="Yrs"
          tooltip="How many years you plan to keep investing. Longer periods benefit most from compounding."
          decimals={0}
          placeholder="10"
        />

        <ProgressiveDisclosure icon="📈" title="Growth Assumptions">
          <NumericInput
            name="stepUpRate"
            control={form.control}
            label="Annual Step-Up"
            unit="%"
            tooltip="Percentage by which you increase your SIP amount each year. Aligns investments with income growth."
            decimals={1}
            hint="e.g. 10% step-up doubles your SIP in ~7 years"
          />
          <NumericInput
            name="inflationRate"
            control={form.control}
            label="Expected Inflation"
            unit="%"
            tooltip="The long-run average inflation rate. Used to show the real (purchasing-power) value of your wealth. India's average CPI inflation is ~6%."
            decimals={1}
          />
        </ProgressiveDisclosure>

        <ProgressiveDisclosure icon="⚡" title="Risk & Sustainability">
          <NumericInput
            name="volatility"
            control={form.control}
            label="Expected Volatility"
            unit="%"
            tooltip="Standard deviation of annual returns — a measure of market risk. Equity funds typically have 15-20% volatility. Higher = wider range of outcomes."
            decimals={1}
            hint="Equity ~15-20%, Balanced ~10%, Debt ~4-6%"
          />
          <NumericInput
            name="currentSalary"
            control={form.control}
            label="Monthly Salary (Optional)"
            unit={sym}
            tooltip="Your current monthly take-home pay. Used to estimate whether your step-up SIP remains affordable relative to your income."
            hint="Used for contribution sustainability analysis"
          />
          <NumericInput
            name="salaryGrowthRate"
            control={form.control}
            label="Expected Salary Growth"
            unit="%"
            tooltip="How much your salary grows each year. Compared against your step-up rate to flag when SIP contributions may become unaffordable."
            decimals={1}
          />
        </ProgressiveDisclosure>
      </InputWorkspace>

      <ResultWorkspace>
        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-xl flex flex-col shadow-sm">
            <span className="text-xs text-[var(--text3)] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
              Nominal Future Value
              <GlossaryTooltip term="Nominal" explanation="The total money in your account without adjusting for inflation. This number looks larger but doesn't reflect real purchasing power." />
            </span>
            <span className="text-2xl font-black text-[var(--text)]">{sym}{formatCurrency(derivedState?.expectedWealth)}</span>
            <span className="text-xs text-[var(--text2)] mt-1">Median (P50) outcome</span>
          </div>
          <div className="bg-[var(--brand)]/10 border border-[var(--brand)] p-4 rounded-xl flex flex-col shadow-sm">
            <span className="text-xs text-[var(--brand)] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
              Today's Purchasing Power
              <GlossaryTooltip term="Real Value" explanation="Your future corpus expressed in today's money, after stripping out inflation. This is the actual lifestyle you can afford." />
            </span>
            <span className="text-2xl font-black text-[var(--brand)]">{sym}{formatCurrency(derivedState?.inflationAdjustedWealth)}</span>
            <span className="text-xs text-[var(--brand)] opacity-80 mt-1">Real value after inflation</span>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex flex-col shadow-sm">
            <span className="text-xs text-red-600 dark:text-red-400 uppercase font-bold tracking-wider mb-1">
              Inflation Erosion
            </span>
            <span className="text-2xl font-black text-red-600 dark:text-red-400">
              -{sym}{formatCurrency((derivedState?.expectedWealth || 0) - (derivedState?.inflationAdjustedWealth || 0))}
            </span>
            <span className="text-xs text-red-600 dark:text-red-400 opacity-80 mt-1">Loss in purchasing power</span>
          </div>
        </div>

        {/* Plain-English interpretation */}
        {interpretation && (
          <div className="mb-6">
            <InterpretationCard
              tone={interpretation.tone}
              headline={interpretation.headline}
              detail={interpretation.detail}
              action={interpretation.action}
            />
          </div>
        )}

        {/* Monte Carlo chart */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-xl font-bold text-[var(--text)]">Probabilistic Wealth Projection</h2>
            <span className="text-xs bg-[var(--surface2)] px-2 py-1 rounded text-[var(--text2)] border border-[var(--border)] shrink-0 ml-2">
              Monte Carlo · 500 paths
            </span>
          </div>
          <p className="text-xs text-[var(--text2)] mb-4 leading-relaxed">
            Green band = optimistic 90th percentile · Blue = most-likely median · Red = pessimistic 10th percentile
          </p>
          {chartDataset && <ProjectionChart dataset={chartDataset} />}
        </div>

        <InsightWorkspace insights={insights} />
      </ResultWorkspace>
    </CalculatorShell>
  );
}
