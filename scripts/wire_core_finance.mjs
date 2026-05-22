import { readFileSync, writeFileSync } from 'fs';

const widgetPath = 'src/components/calculator-core/CalculatorWidget.jsx';
let content = readFileSync(widgetPath, 'utf8');

// Replace all imports from FinanceForms.jsx (not FinanceFormsNew.jsx) with CoreFinanceForms.jsx
// for the specific forms we rewrote
const MIGRATED_FORMS = [
  'EMIForm', 'CompoundForm', 'SIPForm', 'SimpleInterestForm', 'ROIForm',
  'TaxForm', 'DiscountForm', 'ProfitMarginForm', 'BreakEvenForm', 'GSTForm',
  'PPFForm', 'TipForm', 'FDForm', 'LoanCompareForm'
];

// Replace each form's import line to use CoreFinanceForms.jsx
MIGRATED_FORMS.forEach(formName => {
  const oldPattern = new RegExp(
    `(${formName}:\\s*lazy\\(\\(\\)\\s*=>\\s*import\\(")\\./forms/FinanceForms\\.jsx("\\)\\.then\\(m\\s*=>\\s*\\(\\{\\s*default:\\s*m\\.${formName}\\s*\\}\\)\\)\\))`,
    'g'
  );
  const newStr = `$1./forms/CoreFinanceForms.jsx$2`;
  const updated = content.replace(oldPattern, newStr);
  if (updated !== content) {
    console.log('Migrated:', formName);
    content = updated;
  } else {
    // Try alternative pattern with single quotes or slight variation
    const alt = content.replace(
      `import("./forms/FinanceForms.jsx").then(m => ({ default: m.${formName} }))`,
      `import("./forms/CoreFinanceForms.jsx").then(m => ({ default: m.${formName} }))`
    );
    if (alt !== content) {
      console.log('Migrated (alt):', formName);
      content = alt;
    } else {
      console.log('WARNING: Could not migrate', formName);
    }
  }
});

writeFileSync(widgetPath, content, 'utf8');
console.log('CalculatorWidget.jsx updated. Verifying...');

// Verify
const finalContent = readFileSync(widgetPath, 'utf8');
MIGRATED_FORMS.forEach(form => {
  const hasCoreRef = finalContent.includes(`CoreFinanceForms.jsx").then(m => ({ default: m.${form} }))`);
  console.log(form + ':', hasCoreRef ? 'OK -> CoreFinanceForms' : 'STILL -> FinanceForms');
});
