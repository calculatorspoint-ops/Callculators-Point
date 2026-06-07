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
    <div className="w-full animate-fade-in relative" style={{ position: 'relative' }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8" style={{ position: 'relative' }}>
        {children}
        
        {/* Calculating indicator — pointer-events:none means it NEVER blocks ANY click/tap.
            This is the definitive fix: even if CSS containment fails, this div physically
            cannot intercept mouse/touch events because of pointer-events:none. */}
        {isLoading && (
          <div
            aria-busy="true"
            aria-live="polite"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',  /* ← THE KEY: zero click blocking guaranteed */
              zIndex: 5,
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              padding: '10px',
            }}
          >
            {/* Tiny spinner badge in corner — visible but non-intrusive */}
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '3px solid var(--border, #e2e8f0)',
              borderTopColor: 'var(--brand, #2563eb)',
              animation: 'calc-spin 0.7s linear infinite',
              flexShrink: 0,
            }} />
          </div>
        )}
      </div>
      <style>{`@keyframes calc-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
