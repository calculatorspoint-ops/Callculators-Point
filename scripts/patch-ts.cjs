const fs = require('fs');

const replace = (file, replacements) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  fs.writeFileSync(file, content, 'utf8');
};

// 1. CalculatorFactory.tsx
replace('src/core/calculator-factory/builders/CalculatorFactory.tsx', [
  { from: /import \{ Control \} from 'react-hook-form';/g, to: '' },
  { from: /import \{ useForm, Control \} from 'react-hook-form';/g, to: "import { useForm } from 'react-hook-form';" },
  { from: /import \{ Control, /g, to: "import { " }
]);

// 2. ConfigValidator.ts
replace('src/core/calculator-factory/validators/ConfigValidator.ts', [
  { from: /static validate<TForm, TResult>/g, to: "static validate<TForm extends Record<string, any>, TResult>" }
]);

// 3. EngineInput.tsx
replace('src/core/form-engine/components/EngineInput.tsx', [
  { from: /const nonDigitsBeforeOld = oldVal.slice\(0, selectionStart\).replace\(\/\\d\/g, ''\).length;/g, to: "" },
  { from: /\.catch\(\(e\) => \{ \}\)/g, to: ".catch(() => { })" }
]);

// 4. NumericInput.tsx
replace('src/core/form-engine/components/NumericInput.tsx', [
  { from: /const inputRef = useRef<HTMLInputElement \| null>\(null\);/g, to: "const inputRef = useRef<HTMLInputElement>(null);" }
]);

// 5. useFormEngine.ts
replace('src/core/form-engine/hooks/useFormEngine.ts', [
  { from: /resolver: zodResolver\(schema\) as any,/g, to: "resolver: zodResolver(schema as any)," }
]);

// 6. InterpretationCard.tsx
replace('src/core/ui-system/guidance/InterpretationCard.tsx', [
  { from: /import React, \{ ReactNode \} from 'react';/g, to: "import React from 'react';" },
  { from: /import \{ ReactNode \} from 'react';/g, to: "" }
]);

// 7. RequiredGradeCalculator.tsx
replace('src/modules/education/required-grade/RequiredGradeCalculator.tsx', [
  { from: /const contributionPct = \(ass\.weight \/ 100\) \* 100;/g, to: "" },
  { from: /const contributionPct = [^;]+;/g, to: "" }
]);

// 8. SATScoreCalculator.tsx
replace('src/modules/education/sat/SATScoreCalculator.tsx', [
  { from: /const \[mode, setMode\] = useState/g, to: "const [mode] = useState" }
]);

// 9. StudyTimer.tsx
replace('src/modules/education/study-timer/StudyTimer.tsx', [
  { from: /const \[streakDays, setStreakDays\] = useState\(0\);/g, to: "const [streakDays] = useState(0);" },
  { from: /const productivity = sessionDuration > 0 \? Math.round\(\(focusedMinutes \/ sessionDuration\) \* 100\) : 0;/g, to: "" }
]);

// 10. SalaryCalculator.tsx
replace('src/modules/finance/salary/SalaryCalculator.tsx', [
  { from: /const \{ form, isCalculating \} = useFormEngine/g, to: "const { isCalculating } = useFormEngine" },
  { from: /const \{ form \} = useFormEngine/g, to: "const {} = useFormEngine" }
]);

// 11. sipEngine.ts
replace('src/modules/finance/sip/engine/sipEngine.ts', [
  { from: /import Decimal from 'decimal.js';/g, to: "" }
]);

// 12. BMICalculator.tsx
replace('src/modules/health/bmi/BMICalculator.tsx', [
  { from: /import \{ ProgressiveDisclosure \} from '@\/core\/ui-system\/layout\/ProgressiveDisclosure';/g, to: "" },
  { from: /import \{ ProgressiveDisclosure, /g, to: "import { " },
  { from: /const weightToGain = targetWeight - currentWeightKg;/g, to: "" }
]);

// 13. BMRCalculator.tsx
replace('src/modules/health/bmr/BMRCalculator.tsx', [
  { from: /const \{ form, derivedState, isCalculating \} = useFormEngine/g, to: "const { derivedState, isCalculating } = useFormEngine" },
  { from: /const \{ derivedState, isCalculating, form \} = useFormEngine/g, to: "const { derivedState, isCalculating } = useFormEngine" }
]);

console.log("TS files patched");
