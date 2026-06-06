'use client';
import React, { ReactNode } from 'react';

export interface CalculatorShellProps {
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function CalculatorShell({ children, isLoading, isError, onRetry }: CalculatorShellProps) {
  if (isError) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl border border-red-200" role="alert">
        <h3 className="font-bold mb-2">Failed to load analytical workspace.</h3>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Retry Engine Initialization
        </button>
      </div>
    );
  }

  return (
    /* position:relative via BOTH Tailwind and inline style ensures the absolute inset-0
       loading overlay is ALWAYS contained within this shell — never escaping to viewport */
    <div className="w-full animate-fade-in relative" style={{ position: 'relative' }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8" style={{ position: 'relative' }}>
        {children}
        
        {/* Render Isolation Layer for heavy calculations */}
        {isLoading && (
          <div 
            className="absolute inset-0 bg-[var(--surface)]/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl transition-all duration-300"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="w-10 h-10 border-4 border-[var(--surface2)] border-t-[var(--brand)] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}

