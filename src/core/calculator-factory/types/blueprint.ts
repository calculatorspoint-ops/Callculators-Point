import { ZodSchema } from 'zod';
import { FieldValues, Control } from 'react-hook-form';
import { InsightCardProps } from '../../ui-system';
import { InterpretationCardProps } from '../../ui-system';
import { NormalizedDataset } from '../../chart-engine';

export type DomainType = 'finance' | 'health' | 'math' | 'science' | 'conversion' | 'everyday' | 'education' | 'utility';

export interface CalculatorConfig<TForm extends FieldValues, TResult> {
  id: string;
  domain: DomainType;
  title: string;
  schema: ZodSchema<TForm>;
  defaultValues: TForm;
  engine: (params: TForm) => TResult | Promise<TResult>;
  insights?: (result: TResult) => InsightCardProps[];
  /** Plain-English result interpretation shown directly below the result panel */
  interpretation?: (result: TResult, form: TForm) => InterpretationCardProps | null;
  chartBuilder?: (result: TResult) => NormalizedDataset | null;
  formLayout: React.ComponentType<{ control: Control<TForm> }>;
  resultLayout?: React.ComponentType<{ result: TResult }>;
  debounceMs?: number;
  seo?: {
    description: string;
  };
}
