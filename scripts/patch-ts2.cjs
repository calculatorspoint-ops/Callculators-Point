const fs = require('fs');

const replace = (file, replacements) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  fs.writeFileSync(file, content, 'utf8');
};

// 1. SalaryCalculator.tsx
replace('src/modules/finance/salary/SalaryCalculator.tsx', [
  { from: /function interpretSalary\(result: SalaryResult, form: SalaryForm\)/g, to: "function interpretSalary(result: SalaryResult, _form: SalaryForm)" }
]);

// 2. sipEngine.ts
replace('src/modules/finance/sip/engine/sipEngine.ts', [
  { from: /import Decimal from 'decimal\.js';/g, to: "" }
]);

// 3. BMICalculator.tsx
replace('src/modules/health/bmi/BMICalculator.tsx', [
  { from: /import \{ ProgressiveDisclosure \} from '@\/core\/ui-system\/layout\/ProgressiveDisclosure';/g, to: "" },
  { from: /import \{ ProgressiveDisclosure, /g, to: "import { " },
  { from: /const weightToGain = targetWeight - currentWeightKg;/g, to: "" }
]);

// 4. BMRCalculator.tsx
replace('src/modules/health/bmr/BMRCalculator.tsx', [
  { from: /const \{ form, derivedState, isCalculating \} = useFormEngine/g, to: "const { derivedState, isCalculating } = useFormEngine" },
  { from: /const \{ derivedState, isCalculating, form \} = useFormEngine/g, to: "const { derivedState, isCalculating } = useFormEngine" }
]);

console.log("TS files patched completely");
