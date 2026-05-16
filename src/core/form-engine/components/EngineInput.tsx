import React, { useRef, useEffect, useState } from 'react';
import { useController, Control, Path, FieldValues } from 'react-hook-form';

export interface EngineInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  parser: (val: string) => number | string | null;
  liveFormatter?: (val: string) => string;
  blurFormatter?: (val: number | string) => string;
  render: (props: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    ref: React.RefObject<HTMLInputElement | null>;
  }) => React.ReactElement;
}

export function EngineInput<T extends FieldValues>({
  name,
  control,
  parser,
  liveFormatter,
  blurFormatter,
  render
}: EngineInputProps<T>) {
  const { field } = useController({ name, control });
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  // Local state to hold the formatted string representation for the UI
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Sync external RHF value to internal display value (e.g., resets, default values)
  useEffect(() => {
    if (!isFocused) {
      if (field.value !== undefined && field.value !== null && field.value !== '') {
        const formatted = blurFormatter ? blurFormatter(field.value) : String(field.value);
        setDisplayValue(formatted);
      } else {
        setDisplayValue('');
      }
    }
  }, [field.value, blurFormatter, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const element = e.target;
    const selectionStart = element.selectionStart || 0;
    
    // 1. Snapshot cursor state context
    const textBeforeCursorOld = displayValue.substring(0, selectionStart);
    const nonDigitsBeforeOld = (textBeforeCursorOld.match(/[^0-9.-]/g) || []).length;
    
    // 2. Apply Live Formatting
    const formatted = liveFormatter ? liveFormatter(rawVal) : rawVal;
    setDisplayValue(formatted);
    
    // 3. Send Pure Parsed Value to React Hook Form
    const parsedVal = parser(formatted);
    field.onChange(parsedVal);

    // 4. Reconcile Cursor Position mathematically
    window.requestAnimationFrame(() => {
      if (inputRef.current) {
        // We find the new position by counting actual typed characters (digits, minus, dots) 
        // that existed before the cursor in the old unformatted string.
        let digitsSeen = 0;
        let newPos = 0;
        const targetDigits = (textBeforeCursorOld.match(/[0-9.-]/g) || []).length;
        
        // Count forward in the new formatted string to find where that many valid chars are
        for (let i = 0; i < formatted.length; i++) {
          if (/[0-9.-]/.test(formatted[i])) digitsSeen++;
          newPos = i + 1;
          if (digitsSeen === targetDigits) break;
        }

        // Handle edge cases like backspacing over a comma
        if (targetDigits === 0 && rawVal.length < displayValue.length) newPos = 0;

        inputRef.current.setSelectionRange(newPos, newPos);
      }
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    field.onBlur();
    
    if (field.value !== undefined && field.value !== null && field.value !== '') {
      const formatted = blurFormatter ? blurFormatter(field.value) : String(field.value);
      setDisplayValue(formatted);
      // Ensure RHF captures any final coerced data from the blur cycle
      const parsedVal = parser(formatted);
      field.onChange(parsedVal);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return render({
    value: displayValue,
    onChange: handleChange,
    onBlur: handleBlur,
    ref: inputRef,
    // Injecting onFocus purely into the render wrapper logic
    ...{ onFocus: handleFocus }
  });
}
