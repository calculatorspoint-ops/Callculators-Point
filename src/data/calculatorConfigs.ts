import { financeCalculators } from './categories/finance';
import { healthCalculators } from './categories/health';
import { mathCalculators } from './categories/math';
import { educationCalculators } from './categories/education';
import { convertersCalculators } from './categories/converters';
import { everydayCalculators } from './categories/everyday';
import { constructionCalculators } from './categories/construction';
import { technologyCalculators } from './categories/technology';
import { businessCalculators } from './categories/business';

export interface CalculatorCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  desc: string;
}

export interface CalculatorConfig {
  id: string;
  slug: string;
  name: string;
  desc: string;
  cat: string;
  icon?: string;
  popular?: boolean;
  isNew?: boolean;
  hasChart?: boolean;
  hasSteps?: boolean;
  formula?: string;
  tips?: string[];
  tags?: string[];
  keywords?: string[];
  status?: "live" | "draft" | "coming-soon";
  disclaimer?: string;
  privacy?: "normal" | "sensitive";
  howToUse?: string[];
  examples?: { scenario: string; result: string }[];
  limitations?: string[];
  whenToUse?: string;
  resultMeaning?: string;
  about?: string;
}

export const CATEGORIES: CalculatorCategory[] = [
  { id:"finance",      name:"Finance & Money",     icon:"💰", color:"#1d4ed8", bg:"#eff6ff", desc:"Loans, investments, savings, tax & more" },
  { id:"health",       name:"Health & Fitness",     icon:"❤️", color:"#b91c1c", bg:"#fef2f2", desc:"BMI, calories, BMR, body fat & nutrition" },
  { id:"math",         name:"Math & Science",       icon:"📐", color:"#6d28d9", bg:"#f5f3ff", desc:"Algebra, geometry, statistics & science" },
  { id:"education",    name:"Education & GPA",      icon:"🎓", color:"#c2410c", bg:"#fff7ed", desc:"GPA, grades, marks & academic planning" },
  { id:"converters",   name:"Unit Converters",      icon:"🔄", color:"#065f46", bg:"#f0fdf4", desc:"Length, weight, temp, speed, data & more" },
  { id:"everyday",     name:"Everyday Tools",       icon:"🏠", color:"#b45309", bg:"#fffbeb", desc:"Age, dates, fuel, passwords & daily tools" },
  { id:"construction", name:"Construction",         icon:"🏗️", color:"#92400e", bg:"#fef3c7", desc:"Concrete, materials, area, cost & engineering" },
  { id:"technology",   name:"Technology",           icon:"💻", color:"#1e40af", bg:"#dbeafe", desc:"Binary, hex, subnet, network & developer tools" },
  { id:"business",     name:"Business",             icon:"📊", color:"#065f46", bg:"#d1fae5", desc:"Profit, break-even, ROI, payroll & productivity" },
];

export const ALL_CALCULATORS: CalculatorConfig[] = [
  ...financeCalculators,
  ...healthCalculators,
  ...mathCalculators,
  ...educationCalculators,
  ...convertersCalculators,
  ...everydayCalculators,
  ...constructionCalculators,
  ...technologyCalculators,
  ...businessCalculators
];

export const BY_CATEGORY: Record<string, CalculatorConfig[]> = ALL_CALCULATORS.reduce((acc: Record<string, CalculatorConfig[]>, c) => {
  if (!acc[c.cat]) acc[c.cat] = [];
  acc[c.cat].push(c);
  return acc;
}, {});

export const POPULAR: CalculatorConfig[] = ALL_CALCULATORS.filter(c => c.popular);
export const NEW_CALCS: CalculatorConfig[] = ALL_CALCULATORS.filter(c => c.isNew);

export function getCalcBySlug(slug: string): CalculatorConfig | null {
  return ALL_CALCULATORS.find(c => c.slug === slug) || null;
}
export function getRelated(calc: CalculatorConfig, limit = 7): CalculatorConfig[] {
  return ALL_CALCULATORS.filter(c => c.cat === calc.cat && c.id !== calc.id).slice(0, limit);
}

/**
 * SINGLE SOURCE OF TRUTH for calculator count.
 *
 * Use CALC_COUNT_LABEL (e.g. "183+") everywhere you need to display
 * the count in UI copy, metadata titles, and descriptions.
 *
 * Do NOT hardcode "180+", "195+", or any other count string anywhere.
 * Import CALC_COUNT_LABEL and use it instead.
 */
export const LIVE_CALC_COUNT: number = ALL_CALCULATORS.filter(
  (c) => c.status !== 'coming-soon' && c.status !== 'draft'
).length;

/** User-facing label, e.g. "183+" */
export const CALC_COUNT_LABEL: string = `${LIVE_CALC_COUNT}+`;
