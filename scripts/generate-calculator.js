import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const title = args[0];
const domain = args[1] || 'everyday';

if (!title) {
  console.error("❌ Usage: node scripts/generate-calculator.js <\"Calculator Title\"> <domain>");
  console.log("Domains: finance | health | math | conversion | everyday");
  process.exit(1);
}

// Convert "Mortgage Amortization" -> "mortgage-amortization"
const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Convert "Mortgage Amortization" -> "mortgageAmortization"
const camelCase = title.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
  return index === 0 ? word.toLowerCase() : word.toUpperCase();
}).replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');

// Convert "Mortgage Amortization" -> "MortgageAmortization"
const PascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);

const modulePath = path.join(process.cwd(), `src/modules/${domain}/${id}`);

if (fs.existsSync(modulePath)) {
  console.error(`❌ Module already exists at ${modulePath}`);
  process.exit(1);
}

console.log(`\n🚀 Initializing Factory Scaffolder for: ${title}`);
console.log(`📂 Target Directory: src/modules/${domain}/${id}\n`);

// Create Architecture Directories
['', 'schemas', 'engine', 'insights'].forEach(dir => {
  fs.mkdirSync(path.join(modulePath, dir), { recursive: true });
});

// 1. Write Schema Barrier
const schemaContent = `import { z } from 'zod';

export const ${PascalCase}Schema = z.object({
  // TODO: Map inputs from legacy calculationEngine.js
  amount: z.number().min(0, "Amount cannot be negative")
});

export type ${PascalCase}Form = z.infer<typeof ${PascalCase}Schema>;
`;
fs.writeFileSync(path.join(modulePath, `schemas/${camelCase}Schema.ts`), schemaContent);

// 2. Write Pure Engine
const engineContent = `import Decimal from "decimal.js";
import { ${PascalCase}Form } from '../schemas/${camelCase}Schema';

export interface ${PascalCase}Result {
  // TODO: Define output contract
  resultValue: number;
}

/**
 * Pure deterministic mathematical engine.
 * Warning: Do not import React or UI components here.
 */
export function calculate${PascalCase}(params: ${PascalCase}Form): ${PascalCase}Result {
  // TODO: Paste legacy math here and update to Decimal.js
  const value = new Decimal(params.amount || 0).times(2);

  return {
    resultValue: value.toNumber()
  };
}
`;
fs.writeFileSync(path.join(modulePath, `engine/${camelCase}Engine.ts`), engineContent);

// 3. Write Insight Generator
const insightContent = `import { InsightCardProps } from '../../../../core/ui-system';
import { ${PascalCase}Result } from '../engine/${camelCase}Engine';

export function generate${PascalCase}Insights(result: ${PascalCase}Result): InsightCardProps[] {
  const insights: InsightCardProps[] = [];
  
  // TODO: Define semantic warnings and thresholds
  if (result.resultValue <= 0) {
    insights.push({ type: 'warn', message: 'Result is zero or negative. Please verify inputs.' });
  }

  return insights;
}
`;
fs.writeFileSync(path.join(modulePath, `insights/${camelCase}Insights.ts`), insightContent);

// 4. Write Factory Integration
const calculatorContent = `import React from 'react';
import { CalculatorFactory } from '../../../../core/calculator-factory';
import { NumericInput } from '../../../../core/form-engine/components/NumericInput';
import { ${PascalCase}Schema } from './schemas/${camelCase}Schema';
import { calculate${PascalCase}, ${PascalCase}Result } from './engine/${camelCase}Engine';
import { generate${PascalCase}Insights } from './insights/${camelCase}Insights';

function ${PascalCase}FormUI({ control }: { control: any }) {
  return (
    <div className="flex flex-col gap-4">
      {/* TODO: Bind inputs to schema */}
      <NumericInput name="amount" control={control} label="Base Amount" placeholder="1000" />
    </div>
  );
}

function ${PascalCase}ResultUI({ result }: { result: ${PascalCase}Result }) {
  return (
    <div className="bg-[#f8fafc] p-6 rounded-xl border border-[var(--border)] text-center shadow-sm">
      <div className="text-sm font-bold text-[var(--text3)] uppercase tracking-wider mb-2">Calculated Output</div>
      <div className="text-5xl font-black text-[var(--brand)]">{result.resultValue}</div>
    </div>
  );
}

export const ${PascalCase}Calculator = CalculatorFactory.create({
  id: '${id}',
  domain: '${domain}',
  title: '${title}',
  schema: ${PascalCase}Schema,
  defaultValues: { amount: 1000 },
  engine: calculate${PascalCase},
  insights: generate${PascalCase}Insights,
  formLayout: ${PascalCase}FormUI,
  resultLayout: ${PascalCase}ResultUI
});
`;
fs.writeFileSync(path.join(modulePath, `${PascalCase}Calculator.tsx`), calculatorContent);

console.log(`✅ Module Generation Complete!`);
console.log(`\nNext Steps:`);
console.log(`1. Move legacy math into src/modules/${domain}/${id}/engine/${camelCase}Engine.ts`);
console.log(`2. Update schemas/${camelCase}Schema.ts`);
console.log(`3. Export ${PascalCase}Calculator from your router.\\n`);
