import { readFileSync, writeFileSync } from 'fs';

const widgetPath = 'src/components/calculator-core/CalculatorWidget.jsx';
let content = readFileSync(widgetPath, 'utf8');

// Wire InvestmentForms - these are NEW forms being added
// First add import entries after LoanCompareForm
const insertAfter = `  LoanCompareForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then(m => ({ default: m.LoanCompareForm }))),`;
const newImports = `  StockReturnForm: lazy(() => import("./forms/InvestmentForms.jsx").then(m => ({ default: m.StockReturnForm }))),
  NPVForm: lazy(() => import("./forms/InvestmentForms.jsx").then(m => ({ default: m.NPVForm }))),
  PortfolioRebalanceForm: lazy(() => import("./forms/InvestmentForms.jsx").then(m => ({ default: m.PortfolioRebalanceForm }))),
  DividendYieldForm: lazy(() => import("./forms/InvestmentForms.jsx").then(m => ({ default: m.DividendYieldForm }))),`;

if (content.includes(insertAfter)) {
  content = content.replace(insertAfter, insertAfter + '\n' + newImports);
  console.log('Investment form imports added.');
} else {
  console.log('WARNING: Could not find insert point. Searching for alternative...');
  console.log('Looking for:', insertAfter.substring(0, 50));
}

// Also wire them in the FORMS_MAP section
const mapInsertAfter = `"loan-compare-calculator":           Finance.LoanCompareForm,`;
const newMapEntries = `  "stock-return-calculator":           Finance.StockReturnForm,
  "npv-calculator":                    Finance.NPVForm,
  "portfolio-rebalance-calculator":    Finance.PortfolioRebalanceForm,
  "dividend-yield-calculator":         Finance.DividendYieldForm,`;

if (content.includes(mapInsertAfter)) {
  content = content.replace(mapInsertAfter, mapInsertAfter + '\n' + newMapEntries);
  console.log('Investment form map entries added.');
} else {
  console.log('WARNING: Could not find map insert point for investment forms.');
}

writeFileSync(widgetPath, content, 'utf8');
console.log('CalculatorWidget updated with InvestmentForms.');

// Verify
const final = readFileSync(widgetPath, 'utf8');
['StockReturnForm', 'NPVForm', 'PortfolioRebalanceForm', 'DividendYieldForm'].forEach(form => {
  console.log(form + ':', final.includes(form) ? 'OK' : 'MISSING');
});
