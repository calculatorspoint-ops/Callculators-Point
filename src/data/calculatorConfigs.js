import { financeCalculators } from './categories/finance.js';
import { healthCalculators } from './categories/health.js';
import { mathCalculators } from './categories/math.js';
import { educationCalculators } from './categories/education.js';
import { convertersCalculators } from './categories/converters.js';
import { everydayCalculators } from './categories/everyday.js';
import { futureCalculators } from './categories/future.js';
import { constructionCalculators } from './categories/construction.js';
import { technologyCalculators } from './categories/technology.js';
import { businessCalculators } from './categories/business.js';

export const CATEGORIES = [
  { id:"finance",      name:"Finance & Money",     icon:"💰", color:"#1d4ed8", bg:"#eff6ff", desc:"Loans, investments, savings, tax & more" },
  { id:"health",       name:"Health & Fitness",     icon:"❤️", color:"#dc2626", bg:"#fef2f2", desc:"BMI, calories, BMR, body fat & nutrition" },
  { id:"math",         name:"Math & Science",       icon:"📐", color:"#7c3aed", bg:"#f5f3ff", desc:"Algebra, geometry, statistics & science" },
  { id:"education",    name:"Education & GPA",      icon:"🎓", color:"#c2410c", bg:"#fff7ed", desc:"GPA, grades, marks & academic planning" },
  { id:"converters",   name:"Unit Converters",      icon:"🔄", color:"#065f46", bg:"#f0fdf4", desc:"Length, weight, temp, speed, data & more" },
  { id:"everyday",     name:"Everyday Tools",       icon:"🏠", color:"#b45309", bg:"#fffbeb", desc:"Age, dates, fuel, passwords & daily tools" },
  { id:"construction", name:"Construction",         icon:"🏗️", color:"#92400e", bg:"#fef3c7", desc:"Concrete, materials, area, cost & engineering" },
  { id:"technology",   name:"Technology",           icon:"💻", color:"#1e40af", bg:"#dbeafe", desc:"Binary, hex, subnet, network & developer tools" },
  { id:"business",     name:"Business",             icon:"📊", color:"#065f46", bg:"#d1fae5", desc:"Profit, break-even, ROI, payroll & productivity" },
];

export const ALL_CALCULATORS = [
  ...financeCalculators,
  ...healthCalculators,
  ...mathCalculators,
  ...educationCalculators,
  ...convertersCalculators,
  ...everydayCalculators,
  ...futureCalculators,
  ...constructionCalculators,
  ...technologyCalculators,
  ...businessCalculators
];

export const BY_CATEGORY = ALL_CALCULATORS.reduce((acc, c) => {
  if (!acc[c.cat]) acc[c.cat] = [];
  acc[c.cat].push(c);
  return acc;
}, {});

export const POPULAR   = ALL_CALCULATORS.filter(c => c.popular);
export const NEW_CALCS = ALL_CALCULATORS.filter(c => c.isNew);

export function getCalcBySlug(slug) {
  return ALL_CALCULATORS.find(c => c.slug === slug) || null;
}
export function getRelated(calc, limit = 7) {
  return ALL_CALCULATORS.filter(c => c.cat === calc.cat && c.id !== calc.id).slice(0, limit);
}
