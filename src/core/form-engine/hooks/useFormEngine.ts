import { useState, useEffect, useRef } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormEngineConfig, UseFormEngineReturn } from '../types';

export function useFormEngine<TForm extends FieldValues, TDerived = any>(
  config: FormEngineConfig<TForm, TDerived>
): UseFormEngineReturn<TForm, TDerived> {
  const { schema, defaultValues, debounceMs = 150, onDerive, mode = 'onChange' } = config;

  const form = useForm<TForm>({
    resolver: zodResolver(schema as any),
    defaultValues,
    mode
  });

  const [derivedState, setDerivedState] = useState<TDerived | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Watch all values
  const watchedValues = form.watch();

  useEffect(() => {
    if (!onDerive) return;

    // Check if form has validation errors before calculating
    if (Object.keys(form.formState.errors).length > 0) {
      // Ensure loading is cleared if we bail out due to errors
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      setIsCalculating(false);
      return;
    }

    // Only show loading spinner if calculation takes > 80ms (avoids flash for fast calcs)
    loadingTimerRef.current = setTimeout(() => {
      setIsCalculating(true);
    }, 80);

    const calcTimer = setTimeout(async () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      try {
        const result = await onDerive(watchedValues as TForm);
        setDerivedState(result);
      } catch (error) {
        console.error("Derived calculation failed:", error);
      } finally {
        setIsCalculating(false);
      }
    }, debounceMs);

    return () => {
      // Cleanup: cancel both timers, reset loading state
      clearTimeout(calcTimer);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      setIsCalculating(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues), debounceMs]);

  const resetEngine = (values?: Partial<TForm>) => {
    form.reset(values as any);
    setDerivedState(null);
  };

  return {
    form: form as any,
    derivedState,
    isCalculating,
    resetEngine
  };
}
