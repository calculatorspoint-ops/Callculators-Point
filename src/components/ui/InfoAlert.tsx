import React from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface InfoAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'danger' | 'success';
}

export function InfoAlert({ title, children, variant = 'info', className = '', ...props }: InfoAlertProps) {
  const styles = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-800/50",
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      titleColor: "text-blue-800 dark:text-blue-300",
      textColor: "text-blue-700 dark:text-blue-200"
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-800/50",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      titleColor: "text-amber-800 dark:text-amber-300",
      textColor: "text-amber-700 dark:text-amber-200"
    },
    danger: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-100 dark:border-red-800/50",
      icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      titleColor: "text-red-800 dark:text-red-300",
      textColor: "text-red-700 dark:text-red-200"
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-100 dark:border-green-800/50",
      icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
      titleColor: "text-green-800 dark:text-green-300",
      textColor: "text-green-700 dark:text-green-200"
    }
  };

  const current = styles[variant];

  return (
    <div className={`rounded-xl border p-4 flex gap-3 ${current.bg} ${current.border} ${className}`} {...props}>
      <div className="flex-shrink-0 mt-0.5">
        {current.icon}
      </div>
      <div>
        {title && <h4 className={`text-sm font-bold mb-1 ${current.titleColor}`}>{title}</h4>}
        <div className={`text-sm leading-relaxed ${current.textColor}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
