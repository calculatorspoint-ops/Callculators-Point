import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipProps {
  term: string;
  explanation: string;
  example?: string;
  children?: ReactNode;
}

/**
 * GlossaryTooltip — wraps a technical term and shows a plain-English
 * explanation on hover/focus. Fully keyboard accessible.
 */
export function GlossaryTooltip({ term, explanation, example, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <span className="relative inline-flex items-baseline" ref={ref}>
      {children ?? (
        <span className="font-semibold text-[var(--brand)] cursor-help border-b border-dashed border-[var(--brand)]">
          {term}
        </span>
      )}
      <button
        aria-label={`Explain term: ${term}`}
        aria-expanded={isOpen}
        className="ml-1 text-[var(--text3)] hover:text-[var(--brand)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--brand)] rounded-full leading-none"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen(v => !v)}
        tabIndex={0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5 inline"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <span
          role="tooltip"
          className="
            absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
            w-64 max-w-xs
            bg-[var(--surface)] border border-[var(--border)]
            rounded-xl p-3 shadow-xl
            text-left pointer-events-none
          "
        >
          <span className="block text-xs font-bold text-[var(--brand)] uppercase tracking-wider mb-1">
            {term}
          </span>
          <span className="block text-xs text-[var(--text)] leading-relaxed">
            {explanation}
          </span>
          {example && (
            <span className="block mt-2 text-xs text-[var(--text2)] bg-[var(--surface2)] rounded-lg px-2 py-1 font-mono leading-relaxed">
              {example}
            </span>
          )}
          {/* Arrow */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[var(--border)]" />
        </span>
      )}
    </span>
  );
}
