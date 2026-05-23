import React from 'react';

export interface InsightCardProps {
  type: 'good' | 'warn' | 'bad' | 'info';
  message: string;
}

export function InsightCard({ type, message }: InsightCardProps) {
  const styles = {
    good: "bg-[#f0fdf4]/80 border-[#bbf7d0]/60 text-[#166534] backdrop-blur-md shadow-[0_8px_16px_rgba(22,101,52,0.06)] dark:bg-[rgba(22,101,52,0.15)] dark:border-[rgba(34,197,94,0.3)] dark:text-[#4ade80]",
    warn: "bg-[#fffbeb]/80 border-[#fde68a]/60 text-[#92400e] backdrop-blur-md shadow-[0_8px_16px_rgba(146,64,14,0.06)] dark:bg-[rgba(146,64,14,0.15)] dark:border-[rgba(234,179,8,0.3)] dark:text-[#facc15]",
    bad: "bg-[#fef2f2]/80 border-[#fecaca]/60 text-[#991b1b] backdrop-blur-md shadow-[0_8px_16px_rgba(153,27,27,0.06)] dark:bg-[rgba(153,27,27,0.15)] dark:border-[rgba(248,113,113,0.3)] dark:text-[#f87171]",
    info: "bg-[#eff6ff]/80 border-[#bfdbfe]/60 text-[#1e40af] backdrop-blur-md shadow-[0_8px_16px_rgba(30,64,175,0.06)] dark:bg-[rgba(30,64,175,0.15)] dark:border-[rgba(96,165,250,0.3)] dark:text-[#60a5fa]",
  };

  const icons = {
    good: "✅",
    warn: "⚠️",
    bad: "🚨",
    info: "💡"
  };

  return (
    <div 
      className={`p-5 rounded-2xl border flex items-start gap-4 text-sm font-medium leading-relaxed ${styles[type]} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`} 
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
