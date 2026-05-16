import React, { useState, useId } from 'react';
import { useController, Control, Path, FieldValues } from 'react-hook-form';

export function SelectInput<T extends FieldValues>({
  name, control, label, options, tooltip
}: { name: Path<T>, control: Control<T>, label: string, options: { label: string, value: string }[], tooltip?: string }) {
  const { field } = useController({ name, control });
  const [showTooltip, setShowTooltip] = useState(false);
  const inputId = useId();
  const tooltipId = useId();
  
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-1.5">
        <label htmlFor={inputId} className="text-xs font-bold text-[var(--text3)] uppercase tracking-wide">
          {label}
        </label>
        
        {tooltip && (
          <span className="relative">
            <button
              type="button"
              aria-label={`Explain: ${label}`}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="text-[var(--text3)] hover:text-[var(--brand)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-sm"
              aria-expanded={showTooltip}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
            {showTooltip && (
              <span
                id={tooltipId}
                role="tooltip"
                className="
                  absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
                  w-56 max-w-xs
                  bg-[var(--surface)] border border-[var(--border)]
                  rounded-xl px-3 py-2 shadow-xl
                  text-xs text-[var(--text)] leading-relaxed pointer-events-none
                "
              >
                {tooltip}
                <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[var(--border)]" />
              </span>
            )}
          </span>
        )}
      </div>
      
      <select 
        id={inputId}
        {...field} 
        aria-describedby={tooltip ? tooltipId : undefined}
        className="w-full px-3 py-2 bg-[var(--surface2)] text-[var(--text)] rounded-lg border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand)] font-medium appearance-none cursor-pointer"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
