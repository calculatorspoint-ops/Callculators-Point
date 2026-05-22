import { readFileSync, writeFileSync } from 'fs';

const widgetPath = 'src/components/calculator-core/CalculatorWidget.jsx';
let content = readFileSync(widgetPath, 'utf8');

// 1. Replace RetirementForm import 
const oldRetirement = `RetirementForm: lazy(() => import("../../modules/finance/retirement/RetirementCalculator.tsx").then(m => ({ default: m.RetirementCalculator }))),`;
const newRetirement = `RetirementForm: lazy(() => import("./forms/RetirementForms.jsx").then(m => ({ default: m.RetirementPlanForm }))),
  NPSForm: lazy(() => import("./forms/RetirementForms.jsx").then(m => ({ default: m.NPSForm }))),
  EPFForm: lazy(() => import("./forms/RetirementForms.jsx").then(m => ({ default: m.EPFForm }))),`;

if (content.includes(oldRetirement)) {
  content = content.replace(oldRetirement, newRetirement);
  console.log('Retirement imports updated.');
} else {
  console.log('WARNING: Could not find RetirementCalculator.tsx import');
}

// 2. Add NPS and EPF to form map after retirement-calculator
const oldMap = `"retirement-calculator":             Finance.RetirementForm,`;
const newMap = `"retirement-calculator":             Finance.RetirementForm,
  "nps-calculator":                    Finance.NPSForm,
  "epf-calculator":                    Finance.EPFForm,`;

if (content.includes(oldMap)) {
  content = content.replace(oldMap, newMap);
  console.log('Retirement map entries added.');
} else {
  console.log('WARNING: Could not find retirement-calculator map entry');
}

writeFileSync(widgetPath, content, 'utf8');
console.log('Widget updated with RetirementForms.');

// Verify
const final = readFileSync(widgetPath, 'utf8');
['RetirementPlanForm', 'NPSForm', 'EPFForm'].forEach(form => {
  console.log(form + ':', final.includes(form) ? 'OK' : 'MISSING');
});
