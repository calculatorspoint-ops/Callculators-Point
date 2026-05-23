import React, { useState, useId } from 'react';
import { Control, Path, FieldValues, useFormState } from 'react-hook-form';
import { EngineInput } from './EngineInput';
import { parseNumericString } from '../parsers/numericParser';
import { numericLiveFormatter } from '../formatters/liveFormatter';
import { numericBlurFormatter } from '../formatters/blurFormatter';

interface NumericInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  hint?: string;
  /** Short plain-English tooltip explaining what this field means */
  tooltip?: string;
  placeholder?: string;
  decimals?: number;
  padDecimals?: boolean;
  /** Optional unit label rendered inside the right side of the input */
  unit?: string;
}

export function NumericInput<T extends FieldValues>({
  name,
  control,
  label,
  hint,
  tooltip,
  placeholder,
  decimals = 2,
  padDecimals = false,
  unit,
}: NumericInputProps<T>) {
  const [showTooltip, setShowTooltip] = useState(false);
  const inputId = useId();
  const tooltipId = useId();
  const { errors } = useFormState({ control, name });
  const error = (errors as any)[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1 w-full mt-2">
      <div className="relative floating-label-wrap">
        <EngineInput
          name={name}
          control={control}
          parser={parseNumericString}
          liveFormatter={numericLiveFormatter}
          blurFormatter={(val) => numericBlurFormatter(val, decimals, padDecimals)}
          render={({ value, onChange, onBlur, onFocus, ref }) => (
            <>
              <input
                id={inputId}
                ref={ref}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                placeholder={placeholder || ' '}
                aria-invalid={!!error}
                aria-describedby={[
                  error ? `${inputId}-error` : undefined,
                  hint && !error ? `${inputId}-hint` : undefined,
                  tooltip ? tooltipId : undefined
                ].filter(Boolean).join(' ') || undefined}
                className={`
                  glass-input w-full px-4 py-3.5 pr-${unit ? '12' : '4'}
                  text-[var(--text)] rounded-xl
                  font-mono text-lg outline-none
                  ${error
                    ? 'border-red-400 focus:ring-red-400'
                    : ''}
                `}
              />
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 translate-y-[2px]">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </label>
              
              {showTooltip && tooltip && (
                <span
                  id={tooltipId}
                  role="tooltip"
                  className="absolute z-50 bottom-full left-4 mb-2 w-56 max-w-xs bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-xl text-xs text-[var(--text)] leading-relaxed pointer-events-none"
                >
                  {tooltip}
                  <span className="absolute left-6 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[var(--border)]" />
                </span>
              )}
            </>
          )}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text3)] pointer-events-none select-none">
            {unit}
          </span>
        )}
      </div>

      {/* Human-readable validation error */}
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs text-red-500 font-medium mt-0.5 flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}

      {/* Contextual hint shown when no error */}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--text2)] mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
}
