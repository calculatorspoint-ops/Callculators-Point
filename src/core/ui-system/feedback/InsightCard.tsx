import React from 'react';

export interface InsightCardProps {
  type: 'good' | 'warn' | 'bad' | 'info';
  message: string;
}

export function InsightCard({ type, message }: InsightCardProps) {
  const styles = {
    good: "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]",
    warn: "bg-[#fffbeb] border-[#fde68a] text-[#92400e]",
    bad: "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]",
    info: "bg-[#eff6ff] border-[#bfdbfe] text-[#1e40af]",
  };

  const icons = {
    good: "✅",
    warn: "⚠️",
    bad: "🚨",
    info: "💡"
  };

  return (
    <div 
      className={`p-4 rounded-xl border flex items-start gap-3 text-sm font-medium leading-relaxed ${styles[type]} shadow-sm transition-all duration-200 hover:shadow-md`} 
      role="alert" 
      aria-live="polite"
    >
      <span className="shrink-0 text-base leading-none pt-0.5">{icons[type]}</span>
      <p className="m-0">{message}</p>
    </div>
  );
}

export function InsightWorkspace({ insights }: { insights: InsightCardProps[] }) {
  if (!insights || insights.length === 0) return null;
  
  return (
    <div className="flex flex-col gap-3 w-full">
      <h4 className="text-xs font-bold text-[var(--text3)] uppercase tracking-widest pl-1">Analytical Insights</h4>
      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => (
          <InsightCard key={i} {...insight} />
        ))}
      </div>
    </div>
  );
}
