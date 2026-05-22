import { readFileSync, writeFileSync } from 'fs';

const widgetPath = 'src/components/calculator-core/CalculatorWidget.jsx';
let content = readFileSync(widgetPath, 'utf8');

const MIGRATIONS = [
  { name: 'APRForm',           src: 'FinanceFormsNew.jsx', export: 'APRForm',           tgt: 'ExtraFinanceForms.jsx', tgtExport: 'APRForm' },
  { name: 'MortgagePayoffForm',src: 'FinanceFormsNew.jsx', export: 'MortgagePayoffForm', tgt: 'ExtraFinanceForms.jsx', tgtExport: 'MortgagePayoffForm' },
  { name: 'BudgetForm',        src: 'FinanceFormsNew.jsx', export: 'BudgetForm',         tgt: 'ExtraFinanceForms.jsx', tgtExport: 'BudgetForm' },
  { name: 'PresentValueForm',  src: 'FinanceFormsNew.jsx', export: 'PresentValueForm',   tgt: 'ExtraFinanceForms.jsx', tgtExport: 'PresentValueForm' },
  { name: 'DownPaymentForm',   src: 'FinanceFormsNew.jsx', export: 'DownPaymentForm',    tgt: 'ExtraFinanceForms.jsx', tgtExport: 'DownPaymentForm' },
  { name: 'CommissionForm',    src: 'FinanceFormsNew.jsx', export: 'CommissionForm',     tgt: 'ExtraFinanceForms.jsx', tgtExport: 'CommissionForm' },
];

let migratedCount = 0;
for (const m of MIGRATIONS) {
  const oldStr = `import("./forms/${m.src}").then(m => ({ default: m.${m.export} }))`;
  const newStr = `import("./forms/${m.tgt}").then(m => ({ default: m.${m.tgtExport} }))`;
  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    console.log('Migrated:', m.name, '->', m.tgt);
    migratedCount++;
  } else {
    console.log('WARNING: not found:', m.name);
  }
}

writeFileSync(widgetPath, content, 'utf8');
console.log('Done. Migrated', migratedCount, 'of', MIGRATIONS.length);
