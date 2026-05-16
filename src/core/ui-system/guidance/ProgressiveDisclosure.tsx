import React, { useState, ReactNode } from 'react';

interface ProgressiveSection {
  /** Icon emoji or short label shown in the trigger */
  icon?: string;
  /** Title shown in the accordion header */
  title: string;
  /** Whether section starts expanded */
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * ProgressiveDisclosure — groups advanced inputs under a collapsible panel.
 * Keeps the basic mode clean while making power features accessible.
 */
export function ProgressiveDisclosure({ icon = '⚙️', title, defaultOpen = false, children }: ProgressiveSection) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        className="
          w-full flex items-center justify-between
          px-4 py-3
          bg-[var(--surface2)] hover:bg-[var(--surface)]
          text-left transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--brand)]
        "
      >
        <span className="flex items-center gap-2 text-sm font-bold text-[var(--text2)] uppercase tracking-wider">
          <span>{icon}</span>
          <span>{title}</span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 text-[var(--text3)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col gap-4 p-4 border-t border-[var(--border)]">
          {children}
        </div>
      </div>
    </div>
  );
}
