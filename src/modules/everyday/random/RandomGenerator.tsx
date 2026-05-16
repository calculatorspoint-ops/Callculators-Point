import { z } from 'zod';
import { CalculatorFactory } from '../../../core/calculator-factory';

const RandomSchema = z.object({
  min: z.number(),
  max: z.number(),
  count: z.number().min(1).max(500),
  type: z.enum(['integer', 'decimal']),
});

type FormValues = z.infer<typeof RandomSchema>;

interface RandomResult {
  numbers: number[];
  sum: number;
  avg: number;
}

function calculateRandom(data: FormValues): RandomResult {
  const mn = data.min;
  const mx = data.max;
  const cnt = Math.min(data.count, 500);
  
  if (mn >= mx) {
    throw new Error("Minimum value must be less than maximum value.");
  }
  
  const gen = () => {
    if (data.type === "decimal") {
      return Number((Math.random() * (mx - mn) + mn).toFixed(4));
    }
    return Math.floor(Math.random() * (mx - mn + 1)) + mn;
  };
  
  const nums = Array.from({ length: cnt }, gen);
  const sum = Number(nums.reduce((a, b) => a + b, 0).toFixed(4));
  const avg = Number((sum / cnt).toFixed(4));
  
  return { numbers: nums, sum, avg };
}

export const RandomGenerator = CalculatorFactory.createSimple<FormValues, RandomResult>({
  id: 'random-number-generator',
  domain: 'everyday',
  title: 'Random Number Generator',
  schema: RandomSchema,
  defaultValues: { min: 1, max: 100, count: 1, type: 'integer' },
  engine: calculateRandom,
  fields: [
    { name: 'min', label: 'Minimum', type: 'numeric' },
    { name: 'max', label: 'Maximum', type: 'numeric' },
    { name: 'count', label: 'How many numbers?', type: 'numeric', tooltip: 'Generate up to 500 numbers at once' },
    { name: 'type', label: 'Number Type', type: 'select', options: [{label: 'Integer (Whole)', value: 'integer'}, {label: 'Decimal', value: 'decimal'}] }
  ],
  resultLabel: 'Random Numbers',
  resultFormatter: (res) => res.numbers.join(', '),
  stats: (res) => [
    { label: 'Count', value: res.numbers.length.toString() },
    { label: 'Sum', value: res.sum.toString() },
    { label: 'Average', value: res.avg.toString() },
  ],
  insights: (res) => [
    { type: 'info' as const, message: `Generated ${res.numbers.length} random number(s).` }
  ]
});
