/**
 * src/data/pt-br/index.ts
 *
 * Central hub for all Brazilian Portuguese translation data.
 * Exports getPtBrCalc() — primary lookup function for pt-BR calculator metadata.
 */
import type { CalculatorConfig } from '@/data/calculatorConfigs';

/**
 * Partial override type for pt-BR translations.
 * Only translated fields are required; all others fall back to English config.
 */
export interface PtBrCalcOverride {
  /** Portuguese name (e.g. "Calculadora de IMC") */
  name: string;
  /** Portuguese short description */
  desc: string;
  /** Portuguese intro paragraph */
  intro?: string;
  /** Portuguese meta title */
  metaTitle?: string;
  /** Portuguese meta description */
  metaDescription?: string;
  /** Portuguese tips array */
  tips?: string[];
  /** Portuguese howToUse steps */
  howToUse?: string[];
  /** Portuguese examples */
  examples?: { scenario: string; result: string }[];
  /** Portuguese limitations */
  limitations?: string[];
  /** Portuguese workedExample */
  workedExample?: {
    title: string;
    inputs: string[];
    steps: string[];
    result: string;
  };
  /** Portuguese about text */
  about?: string;
  /** Portuguese whenToUse */
  whenToUse?: string;
  /** Portuguese resultMeaning */
  resultMeaning?: string;
  /** Portuguese formula explanation (if different from EN) */
  formula?: string;
  /** Portuguese disclaimer */
  disclaimer?: string;
}

/** Registry: slug → pt-BR override */
export type PtBrRegistry = Record<string, PtBrCalcOverride>;

// Lazy-loaded category registries — imported only when needed
let _registry: PtBrRegistry | null = null;

async function buildRegistry(): Promise<PtBrRegistry> {
  const [
    { healthPtBr },
    { educationPtBr },
    { constructionPtBr },
    { everydayPtBr },
    { convertersPtBr },
    { technologyPtBr },
    { businessPtBr },
    { financePtBr },
    { mathPtBr },
  ] = await Promise.all([
    import('./calculators/health'),
    import('./calculators/education'),
    import('./calculators/construction'),
    import('./calculators/everyday'),
    import('./calculators/converters'),
    import('./calculators/technology'),
    import('./calculators/business'),
    import('./calculators/finance'),
    import('./calculators/math'),
  ]);

  return {
    ...healthPtBr,
    ...educationPtBr,
    ...constructionPtBr,
    ...everydayPtBr,
    ...convertersPtBr,
    ...technologyPtBr,
    ...businessPtBr,
    ...financePtBr,
    ...mathPtBr,
  };
}

/**
 * Get pt-BR translation for a calculator slug.
 * Returns the override object or null if not translated yet.
 */
export async function getPtBrCalcAsync(slug: string): Promise<PtBrCalcOverride | null> {
  if (!_registry) {
    _registry = await buildRegistry();
  }
  return _registry[slug] ?? null;
}

/**
 * Synchronous version — only works after the registry has been populated.
 * Used in Server Components where the registry is pre-populated during build.
 */
export function getPtBrCalcSync(slug: string): PtBrCalcOverride | null {
  return _registry?.[slug] ?? null;
}

/**
 * Merge English CalculatorConfig with pt-BR override.
 * Falls back to English fields for any untranslated fields.
 */
export function mergePtBrCalc(
  enCalc: CalculatorConfig,
  ptBr: PtBrCalcOverride | null
): CalculatorConfig {
  if (!ptBr) return enCalc;
  return {
    ...enCalc,
    name: ptBr.name,
    desc: ptBr.desc,
    ...(ptBr.intro !== undefined && { intro: ptBr.intro }),
    ...(ptBr.metaTitle !== undefined && { metaTitle: ptBr.metaTitle }),
    ...(ptBr.metaDescription !== undefined && { metaDescription: ptBr.metaDescription }),
    ...(ptBr.tips !== undefined && { tips: ptBr.tips }),
    ...(ptBr.howToUse !== undefined && { howToUse: ptBr.howToUse }),
    ...(ptBr.examples !== undefined && { examples: ptBr.examples }),
    ...(ptBr.limitations !== undefined && { limitations: ptBr.limitations }),
    ...(ptBr.workedExample !== undefined && { workedExample: ptBr.workedExample }),
    ...(ptBr.about !== undefined && { about: ptBr.about }),
    ...(ptBr.whenToUse !== undefined && { whenToUse: ptBr.whenToUse }),
    ...(ptBr.resultMeaning !== undefined && { resultMeaning: ptBr.resultMeaning }),
    ...(ptBr.formula !== undefined && { formula: ptBr.formula }),
    ...(ptBr.disclaimer !== undefined && { disclaimer: ptBr.disclaimer }),
  };
}
