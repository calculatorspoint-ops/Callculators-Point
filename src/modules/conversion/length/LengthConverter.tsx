import React from 'react';
import { CalculatorFactory } from '../../../core/calculator-factory';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';
import { SelectInput } from '../../../core/form-engine/components/SelectInput';
import { LengthSchema } from './schemas/lengthSchema';
import { calculateLengthConversion, LengthResult } from './engine/lengthEngine';

const UNITS = [
  { label: 'Meters (m)', value: 'meters' },
  { label: 'Kilometers (km)', value: 'kilometers' },
  { label: 'Centimeters (cm)', value: 'centimeters' },
  { label: 'Millimeters (mm)', value: 'millimeters' },
  { label: 'Miles (mi)', value: 'miles' },
  { label: 'Yards (yd)', value: 'yards' },
  { label: 'Feet (ft)', value: 'feet' },
  { label: 'Inches (in)', value: 'inches' }
];

function LengthFormUI({ control }: { control: any }) {
  return (
    <div className="flex flex-col gap-4">
      <NumericInput name="value" control={control} label="Value to Convert" />
      <div className="grid grid-cols-2 gap-4">
        <SelectInput name="fromUnit" control={control} label="From Unit" options={UNITS} />
        <SelectInput name="toUnit" control={control} label="To Unit" options={UNITS} />
      </div>
    </div>
  );
}

function LengthResultUI({ result }: { result: LengthResult }) {
  return (
    <div className="bg-[#f0fdf4] p-6 rounded-xl border border-[#bbf7d0] flex flex-col items-center justify-center text-center">
      <div className="text-sm font-bold text-[#166534] mb-2 uppercase tracking-wider">Converted Value</div>
      <div className="text-4xl font-black text-[#14532d]">{result.convertedValue}</div>
      <div className="text-xs text-[#166534]/70 mt-4 font-mono">{result.formula}</div>
    </div>
  );
}

export const LengthConverter = CalculatorFactory.create({
  id: 'length-converter',
  domain: 'conversion',
  title: 'Length Converter',
  schema: LengthSchema,
  defaultValues: { value: 1, fromUnit: 'meters', toUnit: 'feet' },
  engine: calculateLengthConversion,
  formLayout: LengthFormUI,
  resultLayout: LengthResultUI
});

