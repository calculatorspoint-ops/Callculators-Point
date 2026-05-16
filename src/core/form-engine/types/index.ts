import { UseFormReturn, DefaultValues, FieldValues } from 'react-hook-form';
import { ZodSchema } from 'zod';

export interface FormEngineConfig<TForm extends FieldValues, TDerived = any> {
  schema: ZodSchema<TForm>;
  defaultValues: DefaultValues<TForm>;
  debounceMs?: number;
  onDerive?: (values: TForm) => TDerived | Promise<TDerived>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

export interface UseFormEngineReturn<TForm extends FieldValues, TDerived> {
  form: UseFormReturn<TForm>;
  derivedState: TDerived | null;
  isCalculating: boolean;
  resetEngine: (values?: Partial<TForm>) => void;
}
