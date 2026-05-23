import React, { useState, useId } from 'react';
import { useController, Control, Path, FieldValues } from 'react-hook-form';

export function TextInput<T extends FieldValues>({
  name, control, label, placeholder, isTextArea = false, tooltip
}: { name: Path<T>, control: Control<T>, label: string, placeholder?: string, isTextArea?: boolean, tooltip?: string }) {
  const { field } = useController({ name, control });
  const [showTooltip, setShowTooltip] = useState(false);
  const inputId = useId();
  const tooltipId = useId();
  
  return (
    <div className="flex flex-col gap-1 w-full mt-2">
      <div className="relative floating-label-wrap">
        {isTextArea ? (
          <textarea 
            id={inputId}
            {...field} 
            placeholder={placeholder || ' '} 
            className="glass-input w-full px-4 py-3.5 text-[var(--text)] rounded-xl font-mono resize-y min-h-[120px] outline-none" 
          />
        ) : (
          <input 
            id={inputId}
            type="text" 
            {...field} 
            placeholder={placeholder || ' '} 
            className="glass-input w-full px-4 py-3.5 text-[var(--text)] rounded-xl font-mono outline-none" 
          />
        )}
        <label htmlFor={inputId} className="floating-label">
          {label}
          {tooltip && (
            <button
              type="button"
              aria-label={`Explain: ${label}`}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="inline-block ml-1 text-[var(--text3)] hover:text-[var(--brand)] transition-colors focus:outline-none pointer-events-auto"
              aria-expanded={showTooltip}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 translate-y-[2px]">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </button>
          )}
        </label>
        {showTooltip && tooltip && (
          <div
            id={tooltipId}
            role="tooltip"
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-[var(--surface-overlay)] text-[var(--text)] text-xs rounded-md shadow-lg z-50 pointer-events-none"
          >
            {tooltip}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[var(--surface-overlay)]"></div>
          </div>
        )}
      </div>
    </div>
  );
}
