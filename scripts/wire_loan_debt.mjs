import { readFileSync, writeFileSync } from 'fs';

const widgetPath = 'src/components/calculator-core/CalculatorWidget.jsx';
let content = readFileSync(widgetPath, 'utf8');

const FORMS = ['AutoLoanForm', 'PersonalLoanForm', 'StudentLoanForm', 'CreditCardForm', 'DebtPayoffForm'];

FORMS.forEach(formName => {
  const old = `import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.${formName} }))`;
  const updated = `import("./forms/LoanDebtForms.jsx").then(m => ({ default: m.${formName} }))`;
  if (content.includes(old)) { content = content.replace(old, updated); console.log('Migrated:', formName); }
  else { console.log('WARNING: Could not migrate', formName); }
});

writeFileSync(widgetPath, content, 'utf8');
console.log('Done. Verifying...');
FORMS.forEach(form => console.log(form + ':', content.includes(`LoanDebtForms.jsx").then(m => ({ default: m.${form} }))`) ? 'OK -> LoanDebtForms' : 'FAILED'));
