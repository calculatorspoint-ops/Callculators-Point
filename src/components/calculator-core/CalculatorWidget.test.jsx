import { describe, it, expect } from 'vitest';
import { FORMS } from './CalculatorWidget.jsx';
import { ALL_CALCULATORS } from '@/data/calculatorConfigs.js';

describe('CalculatorWidget Registry', () => {
  it('should have a mapped component for every calculator slug in ALL_CALCULATORS', () => {
    const missingSlugs = [];

    ALL_CALCULATORS.forEach((calc) => {
      if (!FORMS[calc.slug]) {
        missingSlugs.push(calc.slug);
      }
    });

    expect(missingSlugs).toEqual([]);
  });
});
