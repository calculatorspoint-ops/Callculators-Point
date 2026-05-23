import { CalculatorConfig } from '../types/blueprint';

export class ConfigValidator {
  static validate<TForm extends Record<string, any>, TResult>(config: CalculatorConfig<TForm, TResult>) {
    const errors: string[] = [];

    // 1. Schema Validity Gate
    if (!config.schema) errors.push("Critical: Missing Zod schema definition.");
    if (!config.defaultValues) errors.push("Critical: Missing default values.");
    if (!config.id) errors.push("Critical: Calculator ID is required for persistence targeting.");

    // 2. Engine Purity Gate
    if (typeof config.engine !== 'function') {
      errors.push("Critical: Engine must be a pure mathematical function.");
    }

    // 3. Insight Structure Gate
    if (config.insights && typeof config.insights !== 'function') {
        errors.push("Critical: Insights property must be a function returning InsightCardProps[].");
    }

    // 4. Chart Contract Gate
    if (config.chartBuilder && typeof config.chartBuilder !== 'function') {
        errors.push("Critical: Chart builder must be a function returning a NormalizedDataset.");
    }

    // 5. Presentation Layer Gate
    if (!config.formLayout) {
        errors.push("Critical: A UI layout component for the form is strictly required.");
    }

    if (errors.length > 0) {
      throw new Error(`\n[CALCULATOR FACTORY GATE FAILURE - ${config.id}]\n` + errors.join('\n'));
    }
  }
}
