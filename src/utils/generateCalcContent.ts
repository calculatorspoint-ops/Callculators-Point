/**
 * src/utils/generateCalcContent.ts
 *
 * Auto-generates SEO content for every calculator from its config fields:
 * desc, formula, tips, cat, name, tags.
 *
 * No manual writing required. Generates ~400-600 words of unique content per page.
 */
import { ALL_CALCULATORS, CATEGORIES } from '@/data/calculatorConfigs';
import type { CalculatorConfig } from '@/data/calculatorConfigs';

export interface CalcContent {
  about: string;
  formulaExplained: string | null;
  howToUse: string[];
  tips: string[];
  faq: { q: string; a: string }[];
  examples: { scenario: string; result: string }[];
  limitations: string[];
  whenToUse: string | null;
  resultMeaning: string | null;
}

const CATEGORY_CONTEXT: Record<string, string> = {
  finance: 'financial planning, budgeting, and investment decisions',
  health: 'health monitoring, fitness tracking, and wellness management',
  math: 'mathematical problem solving, academic study, and scientific calculations',
  education: 'academic planning, grade tracking, and educational goal setting',
  converters: 'unit conversion, measurement translation, and international compatibility',
  everyday: 'daily tasks, personal planning, and practical life calculations',
  construction: 'building projects, material estimation, and construction planning',
  technology: 'programming, networking, and technical problem solving',
  business: 'business analytics, financial modeling, and operational decision making',
};

const CATEGORY_AUDIENCE: Record<string, string> = {
  finance: 'individuals, investors, and finance professionals',
  health: 'fitness enthusiasts, healthcare professionals, and individuals monitoring their health',
  math: 'students, teachers, engineers, and scientists',
  education: 'students, parents, and academic advisors',
  converters: 'engineers, scientists, travelers, and international professionals',
  everyday: 'anyone who wants quick answers for common daily calculations',
  construction: 'contractors, builders, architects, and DIY enthusiasts',
  technology: 'developers, network engineers, and IT professionals',
  business: 'entrepreneurs, managers, accountants, and business analysts',
};

const GENERIC_HOW_TO = (name: string): string[] => [
  `Enter your values into the ${name} input fields above.`,
  'Review the input labels to ensure you are using the correct units.',
  'Click the "Calculate" button to get your instant result.',
  'Use the step-by-step breakdown to understand how the result was calculated.',
  'Export or copy your result to use in reports or share with others.',
];

const GENERIC_FAQ = (calc: CalculatorConfig): { q: string; a: string }[] => {
  const catLabel = CATEGORIES.find(c => c.id === calc.cat)?.name ?? calc.cat;
  return [
    {
      q: `Is the ${calc.name} free to use?`,
      a: `Yes, the ${calc.name} on Calculators Point is completely free with no signup, no ads blocking usage, and no limits on how many times you can calculate.`,
    },
    {
      q: `How accurate is this ${calc.name}?`,
      a: `Our ${calc.name} uses the standard mathematical formula${calc.formula ? ' shown on this page' : ''} and is accurate to multiple decimal places. Results should be used as guidance and verified by a professional for critical decisions.`,
    },
    {
      q: `Can I use this calculator on my mobile phone?`,
      a: `Yes. The ${calc.name} is fully mobile-optimized and works on all smartphones, tablets, and desktop browsers without any download or installation.`,
    },
    {
      q: `What is ${calc.name} used for?`,
      a: `The ${calc.name} is used for ${CATEGORY_CONTEXT[calc.cat] ?? 'solving calculations quickly and accurately'}. It is especially useful for ${CATEGORY_AUDIENCE[calc.cat] ?? 'anyone needing quick calculations'}.`,
    },
    {
      q: `Does this calculator work offline?`,
      a: `Calculators Point is a Progressive Web App (PWA). Once visited, many calculators continue to work even without an internet connection. You can also add Calculators Point to your home screen for quick access.`,
    },
    {
      q: `Are there other ${catLabel} calculators available?`,
      a: `Yes! Calculators Point has a full suite of ${catLabel} calculators. Visit our ${catLabel} category page to explore all available tools.`,
    },
  ];
};

function generateAbout(calc: CalculatorConfig): string {
  const catCtx = CATEGORY_CONTEXT[calc.cat] ?? 'complex calculations';
  const audience = CATEGORY_AUDIENCE[calc.cat] ?? 'users';

  // Use the unique calculator description to ensure the first paragraph is distinct for every page
  const uniqueDesc = calc.desc.charAt(0).toUpperCase() + calc.desc.slice(1);
  const intro = uniqueDesc.endsWith('.') ? uniqueDesc : `${uniqueDesc}.`;

  return `${intro} The ${calc.name} is designed to help ${audience} with ${catCtx}.\n\n` +
    `Instead of complex manual computation, you can use this tool to get instant, accurate results. ` +
    `Simply enter your values to see a step-by-step breakdown of how the answer was reached.\n\n` +
    `This utility works directly in your browser without any sign-ups or downloads.`;
}

function generateFormulaExplained(calc: CalculatorConfig): string | null {
  if (!calc.formula) return null;
  return calc.formula;
}

function generateHowTo(calc: CalculatorConfig): string[] {
  if (calc.howToUse && calc.howToUse.length > 0) return calc.howToUse;
  return GENERIC_HOW_TO(calc.name);
}

function generateTips(calc: CalculatorConfig): string[] {
  const baseTips = calc.tips ?? [];
  const genericTips = [
    `Double-check your input units before calculating — using the wrong unit is the most common source of errors.`,
    `Bookmark this ${calc.name} for quick access next time you need it.`,
    `Use the share button to send your results to a colleague or save them for later reference.`,
  ];
  return [...baseTips, ...genericTips].slice(0, 5);
}

function generateExamples(calc: CalculatorConfig): { scenario: string; result: string }[] {
  if (calc.examples && calc.examples.length > 0) return calc.examples;
  
  if (calc.cat === 'finance') {
    return [
      { scenario: 'Comparing multiple scenarios before making a final decision.', result: 'Identify the most cost-effective long-term option.' },
      { scenario: 'Adjusting parameters to meet a specific budget target.', result: 'Find exactly what rate or term is required to fit your constraints.' }
    ];
  }
  
  return [
    { scenario: `Using the ${calc.name} for a real-world project`, result: 'Enter your specific values above to see your personalized result instantly.' },
  ];
}

export function generateCalcContent(calc: CalculatorConfig): CalcContent {
  return {
    about: generateAbout(calc),
    formulaExplained: generateFormulaExplained(calc),
    howToUse: generateHowTo(calc),
    tips: generateTips(calc),
    faq: GENERIC_FAQ(calc),
    examples: generateExamples(calc),
    limitations: calc.limitations || [],
    whenToUse: calc.whenToUse || null,
    resultMeaning: calc.resultMeaning || null,
  };
}

// Pre-compute content for all calculators (used at build time in SSG)
export const ALL_CALC_CONTENT: Record<string, CalcContent> = Object.fromEntries(
  ALL_CALCULATORS.map(calc => [calc.slug, generateCalcContent(calc)])
);
