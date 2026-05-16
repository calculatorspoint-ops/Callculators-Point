import { useState, useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormEngineConfig, UseFormEngineReturn } from '../types';

export function useFormEngine<TForm extends FieldValues, TDerived = any>(
  config: FormEngineConfig<TForm, TDerived>
): UseFormEngineReturn<TForm, TDerived> {
  const { schema, defaultValues, debounceMs = 150, onDerive, mode = 'onChange' } = config;

  const form = useForm<TForm>({
    resolver: zodResolver(schema) as any,
    defaultValues,
    mode
  });

  const [derivedState, setDerivedState] = useState<TDerived | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Watch all values
  const watchedValues = form.watch();

  useEffect(() => {
    if (!onDerive) return;

    // Check if form has validation errors before calculating
    if (Object.keys(form.formState.errors).length > 0) {
      return; // Do not recalculate if invalid
    }

    const timer = setTimeout(async () => {
      setIsCalculating(true);
      try {
        const result = await onDerive(watchedValues as TForm);
        setDerivedState(result);
      } catch (error) {
        console.error("Derived calculation failed:", error);
      } finally {
        setIsCalculating(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [JSON.stringify(watchedValues), debounceMs, onDerive, Object.keys(form.formState.errors).length]);

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
