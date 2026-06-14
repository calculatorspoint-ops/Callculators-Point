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
  intro: string | null;
  formulaExplained: string | null;
  howToUse: string[];
  tips: string[];
  faq: { q: string; a: string }[];
  examples: { scenario: string; result: string }[];
  limitations: string[];
  whenToUse: string | null;
  resultMeaning: string | null;
  workedExample: {
    title: string;
    inputs: string[];
    steps: string[];
    result: string;
  } | null;
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
  // If a manually-written about paragraph is provided in the calculator config,
  // always use it — these are the unique, authoritative descriptions for each tool.
  if (calc.about) {
    return calc.about;
  }

  // Fallback: auto-generate from the calc's own fields so at minimum every
  // page's opening sentence is unique (it comes from calc.desc, which is unique per tool).
  // This avoids the previous "designed to help [audience] with [category context]"
  // template that sounded identical across hundreds of pages.
  const audience = CATEGORY_AUDIENCE[calc.cat] ?? 'users';
  const catCtx   = CATEGORY_CONTEXT[calc.cat] ?? 'solving calculations quickly and accurately';

  // Paragraph 1: unique lead from the calculator's own description + formula signal
  const uniqueDesc = calc.desc.charAt(0).toUpperCase() + calc.desc.slice(1);
  const leadSentence = uniqueDesc.endsWith('.') ? uniqueDesc : `${uniqueDesc}.`;

  // If a formula is defined, name it explicitly — signals that the implementation
  // is based on a real mathematical method, not an arbitrary approximation.
  const formulaSignal = calc.formula
    ? ` The underlying formula is displayed on this page so you can verify every calculation.`
    : '';

  // Paragraph 2: practical use context derived from category + tags
  const tagContext = calc.tags && calc.tags.length > 0
    ? `Commonly used by ${audience} for ${calc.tags.slice(0, 3).join(', ').toLowerCase()}.`
    : `Useful for ${audience} working on ${catCtx}.`;

  // Paragraph 3: trust/accessibility signal (only when there's no formula to discuss)
  const accessSignal = calc.formula
    ? `Results are instant and include a step-by-step breakdown so you can follow the calculation from input to answer.`
    : `Works directly in your browser — no download, no signup, and no ads blocking the tool. Results are shown instantly.`;

  return `${leadSentence}${formulaSignal}\n\n${tagContext}\n\n${accessSignal}`;
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
      { 
        scenario: `Using the ${calc.name} with real loan or investment figures to model a specific financial decision.`,
        result: `Enter your exact principal, rate, and term above — the calculator shows the precise figures, not estimates, so you can confidently move forward.`
      },
      { 
        scenario: `Comparing two scenarios side-by-side: one with a higher rate and shorter term vs a lower rate over a longer period.`,
        result: `The ${calc.name} reveals the true cost difference so you can choose the option that saves the most money over the full term.`
      }
    ];
  }

  if (calc.cat === 'health') {
    return [
      { 
        scenario: `Entering your current measurements into the ${calc.name} to establish a personal baseline.`,
        result: `The result gives you a starting number to track over time — even a small improvement each month adds up to significant progress over a year.`
      }
    ];
  }

  if (calc.cat === 'math') {
    return [
      { 
        scenario: `Applying the ${calc.name} to a textbook problem or real-world measurement scenario.`,
        result: `Enter your values above to get the answer and the step-by-step formula breakdown — useful for double-checking manual calculations.`
      }
    ];
  }

  if (calc.cat === 'construction') {
    return [
      { 
        scenario: `Calculating materials needed for a standard room or project using the ${calc.name}.`,
        result: `The calculator outputs both the quantity needed and a waste buffer (typically 10%), so you don't run short mid-project.`
      }
    ];
  }

  if (calc.cat === 'business') {
    return [
      { 
        scenario: `Running the ${calc.name} before a pricing or investment decision to see the numbers before committing.`,
        result: `Even a 1–2% change in the key input variable can shift the outcome significantly — enter your specific figures to see the exact impact.`
      }
    ];
  }
  
  return [
    { scenario: `Using the ${calc.name} for a real-world calculation`, result: 'Enter your specific values above to see your personalized result instantly.' },
  ];
}

export function generateCalcContent(calc: CalculatorConfig): CalcContent {
  return {
    about: generateAbout(calc),
    intro: calc.intro ?? null,
    formulaExplained: generateFormulaExplained(calc),
    howToUse: generateHowTo(calc),
    tips: generateTips(calc),
    faq: GENERIC_FAQ(calc),
    examples: generateExamples(calc),
    limitations: calc.limitations || [],
    whenToUse: calc.whenToUse || null,
    resultMeaning: calc.resultMeaning || null,
    workedExample: calc.workedExample ?? null,
  };
}

// Pre-compute content for all calculators (used at build time in SSG)
export const ALL_CALC_CONTENT: Record<string, CalcContent> = Object.fromEntries(
  ALL_CALCULATORS.map(calc => [calc.slug, generateCalcContent(calc)])
);
