import React from 'react';

export interface InterpretationCardProps {
  /** Primary plain-English sentence summarising the result */
  headline: string;
  /** Optional deeper elaboration (1-2 sentences) */
  detail?: string;
  /** Optional recommended action the user should consider */
  action?: string;
  /** Colour tone of the card */
  tone?: 'neutral' | 'positive' | 'warning' | 'critical';
}

const TONE_STYLES: Record<NonNullable<InterpretationCardProps['tone']>, string> = {
  neutral:  'bg-[var(--surface2)] border-[var(--border)] text-[var(--text)]',
  positive: 'bg-[#f0fdf4] dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100',
  warning:  'bg-[#fffbeb] dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100',
  critical: 'bg-[#fef2f2] dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100',
};

const TONE_ICONS: Record<NonNullable<InterpretationCardProps['tone']>, string> = {
  neutral:  '💬',
  positive: '🎯',
  warning:  '⚠️',
  critical: '🚨',
};

/**
 * InterpretationCard — renders a plain-English result summary below
 * a calculator result. Used by every CalculatorFactory-generated component.
 */
export function InterpretationCard({
  headline,
  detail,
  action,
  tone = 'neutral',
}: InterpretationCardProps) {
  return (
    <div
      className={`w-full rounded-2xl border p-5 flex flex-col gap-2 shadow-sm ${TONE_STYLES[tone]}`}
      role="region"
      aria-label="Result interpretation"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0" aria-hidden="true">{TONE_ICONS[tone]}</span>
        <p className="font-semibold text-sm leading-relaxed m-0">{headline}</p>
      </div>

      {detail && (
        <p className="text-sm leading-relaxed opacity-80 pl-9 m-0">{detail}</p>
      )}

      {action && (
        <div className="pl-9 pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/40 dark:bg-black/20 border border-current/20 rounded-lg px-3 py-1.5">
            <span>💡</span>
            <span>Tip: {action}</span>
          </span>
        </div>
      )}
    </div>
  );
}
