import { z } from 'zod';
import { CalculatorFactory } from '../../../core/calculator-factory';

const RomanSchema = z.object({
  mode: z.enum(['toRoman', 'toNumber']),
  input: z.string().min(1, 'Input is required'),
});

type FormValues = z.infer<typeof RomanSchema>;

interface RomanResult {
  result: string;
  isError?: boolean;
}

function calculateRoman(data: FormValues): RomanResult {
  const { mode, input } = data;
  
  if (mode === 'toRoman') {
    const n = parseInt(input, 10);
    if (isNaN(n) || n < 1 || n > 3999) {
      return { result: "Invalid: Enter a number between 1 and 3999.", isError: true };
    }
    const map: [number, string][] = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
    let r = "";
    let tempN = n;
    for (const [v, s] of map) {
      while (tempN >= v) { r += s; tempN -= v; }
    }
    return { result: r };
  } else {
    const s = input.toUpperCase();
    if (!/^[MDCLXVI]+$/.test(s)) {
      return { result: "Invalid Roman Numeral.", isError: true };
    }
    const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
    let r = 0, prev = 0;
    for (const c of s.split("").reverse()) {
      const v = map[c] || 0;
      r += v < prev ? -v : v;
      prev = v;
    }
    return { result: r.toString() };
  }
}

export const RomanConverter = CalculatorFactory.createSimple<FormValues, RomanResult>({
  id: 'roman-numeral-converter',
  domain: 'conversion',
  title: 'Roman Numeral Converter',
  schema: RomanSchema,
  defaultValues: { mode: 'toRoman', input: '2026' },
  engine: calculateRoman,
  fields: [
    {
      name: 'mode',
      label: 'Operation',
      type: 'select',
      options: [
        { label: 'Number to Roman', value: 'toRoman' },
        { label: 'Roman to Number', value: 'toNumber' }
      ]
    },
    { 
      name: 'input', 
      label: 'Value to Convert', 
      type: 'text',
      placeholder: 'e.g. 2026 or MMXXVI' 
    }
  ],
  resultLabel: 'Converted Value',
  resultFormatter: (res) => res.result,
  insights: (res) => {
    if (res.isError) return [{ type: 'warn' as const, message: res.result }];
    return [{ type: 'good' as const, message: `Successfully converted.` }];
  }
});
