import React, { useMemo } from 'react';
import { FieldValues, FormProvider, Control } from 'react-hook-form';
import { NumericInput } from '../../form-engine/components/NumericInput';
import { TextInput } from '../../form-engine/components/TextInput';
import { SelectInput } from '../../form-engine/components/SelectInput';
import { CalculatorShell, InputWorkspace, ResultWorkspace, InsightWorkspace, InterpretationCard } from '../../ui-system';
import { useFormEngine } from '../../form-engine';
import { ProjectionChart } from '../../chart-engine';
import { usePersistenceEngine } from '../../persistence-engine';
import { SEOHelmet } from '../../seo-engine/SEOHelmet';
import { CalculatorConfig } from '../types/blueprint';
import { ConfigValidator } from '../validators/ConfigValidator';

/**
 * Configuration for the auto-generated simple calculators
 */
export interface SimpleFieldDef<TForm> {
  name: keyof TForm;
  label: string;
  type?: 'numeric' | 'text' | 'select';
  tooltip?: string;
  unit?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  isTextArea?: boolean;
}

export interface SimpleCalculatorConfig<TForm extends FieldValues, TResult> extends Omit<CalculatorConfig<TForm, TResult>, 'formLayout' | 'resultLayout'> {
  fields: SimpleFieldDef<TForm>[];
  resultLabel: string;
  resultUnit?: string;
  resultFormatter?: (val: TResult) => string | number;
  /** Optional secondary stats displayed below the primary result */
  stats?: (result: TResult) => { label: string; value: string }[];
}

/**
 * The CalculatorFactory orchestrates the core platform engines.
 * It ingests a strictly typed Declarative Config and outputs a fully hydrated,
 * UX-compliant React workspace — including interpretation, charts, and insights.
 */
export class CalculatorFactory {
  /**
   * Shortcut for extremely simple calculators (e.g. Addition, Base64).
   * Eliminates the "Factory Tax" by auto-generating the form and result UI.
   */
  static createSimple<TForm extends FieldValues, TResult>(config: SimpleCalculatorConfig<TForm, TResult>) {
    const autoConfig: CalculatorConfig<TForm, TResult> = {
      ...config,
      formLayout: ({ control }) => (
        <div className="flex flex-col gap-4">
          {config.fields.map(f => {
            if (f.type === 'select') {
              return <SelectInput key={f.name as string} name={f.name as any} control={control as any} label={f.label} tooltip={f.tooltip} options={f.options || []} />;
            }
            if (f.type === 'text') {
              return <TextInput key={f.name as string} name={f.name as any} control={control as any} label={f.label} tooltip={f.tooltip} placeholder={f.placeholder} isTextArea={f.isTextArea} />;
            }
            return (
              <NumericInput
                key={f.name as string}
                name={f.name as any}
                control={control as any}
                label={f.label}
                tooltip={f.tooltip}
                unit={f.unit}
                placeholder={f.placeholder}
              />
            );
          })}
        </div>
      ),
      resultLayout: ({ result }) => {
        const val = config.resultFormatter ? config.resultFormatter(result) : String(result);
        const statItems = config.stats ? config.stats(result) : [];
        return (
          <div>
            <div className="bg-[var(--brand-l)] dark:bg-[var(--brand-ll)] rounded-xl p-6 text-center border border-[var(--brand)] mb-4">
              <h3 className="text-[var(--brand)] text-sm font-bold uppercase tracking-widest mb-2">{config.resultLabel}</h3>
              <div className="text-4xl font-black text-[var(--text)] tracking-tight">
                {config.resultUnit && <span className="text-2xl mr-1 text-[var(--text3)]">{config.resultUnit}</span>}
                {val}
              </div>
            </div>
            {statItems.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {statItems.map((s, i) => (
                  <div key={i} className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-3 text-center">
                    <div className="text-xs font-bold text-[var(--text3)] uppercase tracking-wide mb-1">{s.label}</div>
                    <div className="text-lg font-black text-[var(--text)]">{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
    };
    return this.create(autoConfig);
  }
  static create<TForm extends FieldValues, TResult>(config: CalculatorConfig<TForm, TResult>) {
    // ENFORCEMENT LAYER: Run the Factory Admission Gate
    ConfigValidator.validate(config);

    return function GeneratedCalculator() {
      // 1. Initialize Form & Validation Engine
      const { form, derivedState, isCalculating } = useFormEngine<TForm, TResult>({
        schema: config.schema,
        defaultValues: config.defaultValues as any,
        debounceMs: config.debounceMs || 300,
        onDerive: config.engine
      });

      // 2. Initialize Persistence Engine (Offline Sync Layer)
      const { saveSnapshot } = usePersistenceEngine<TForm>({
        calculatorId: config.id,
        schemaVersion: 1
      });

      // Auto-save form parameters to the persistence sync queue upon successful calculation
      React.useEffect(() => {
        if (derivedState) {
          saveSnapshot(form.getValues());
        }
      }, [derivedState, saveSnapshot, form]);

      // 3. Mount Visualization Builder
      const chartDataset = useMemo(() => {
        if (!derivedState || !config.chartBuilder) return null;
        return config.chartBuilder(derivedState);
      }, [derivedState]);

      // 4. Generate Semantic Insights
      const insights = useMemo(() => {
        if (!derivedState || !config.insights) return [];
        return config.insights(derivedState);
      }, [derivedState]);

      // 5. Generate Plain-English Interpretation
      const interpretation = useMemo(() => {
        if (!derivedState || !config.interpretation) return null;
        return config.interpretation(derivedState, form.getValues());
      }, [derivedState]);

      // 6. Mount Universal UX Architecture
      return (
        <>
          {config.seo && (
            <SEOHelmet 
              title={config.title} 
              description={config.seo.description} 
              applicationCategory={`${config.domain}Application`} 
            />
          )}
          <CalculatorShell isLoading={isCalculating}>
            {/* FormProvider makes form context available to all child hooks */}
            {/* (useController, useWatch, useFormContext all require this) */}
            <FormProvider {...form}>
              <InputWorkspace>
                <h2 className="text-xl font-bold text-[var(--text)] mb-1">{config.title}</h2>
                <div className="w-full h-px bg-[var(--border)] mb-4"></div>
                <config.formLayout control={form.control} />
              </InputWorkspace>
            </FormProvider>

            <ResultWorkspace>
              {config.resultLayout && derivedState && (
                <div className="mb-6">
                  <config.resultLayout result={derivedState} />
                </div>
              )}

              {/* Plain-English Interpretation — shown after the primary result */}
              {interpretation && (
                <div className="mb-6">
                  <InterpretationCard {...interpretation} />
                </div>
              )}
              
              {chartDataset && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm mb-6">
                   <h3 className="text-lg font-bold text-[var(--text)] mb-4">Visualization Analysis</h3>
                   <ProjectionChart dataset={chartDataset} />
                </div>
              )}
              
              <InsightWorkspace insights={insights} />
            </ResultWorkspace>
          </CalculatorShell>
        </>
      );
    };
  }
}
