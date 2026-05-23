import React from 'react';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, icon, className = '', ...props }: SectionHeaderProps) {
  return (
    <div className={`mb-6 ${className}`} {...props}>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        {icon && <span className="text-blue-600 dark:text-blue-400">{icon}</span>}
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1.5 text-sm text-gray-600 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
