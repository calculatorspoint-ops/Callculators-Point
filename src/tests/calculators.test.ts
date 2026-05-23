import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS } from '../data/calculatorConfigs';
import { FORMS } from '../components/calculator-core/CalculatorWidget';

describe('Calculators Configuration', () => {
  it('should not have duplicate ids', () => {
    const ids = ALL_CALCULATORS.map(c => c.id);
    const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
    expect(duplicates, `Duplicate IDs found: ${duplicates.join(', ')}`).toHaveLength(0);
  });

  it('should not have duplicate slugs', () => {
    const slugs = ALL_CALCULATORS.map(c => c.slug);
    const duplicates = slugs.filter((item, index) => slugs.indexOf(item) !== index);
    expect(duplicates, `Duplicate slugs found: ${duplicates.join(', ')}`).toHaveLength(0);
  });

  it('should have name and description for all calculators', () => {
    ALL_CALCULATORS.forEach(calc => {
      expect(calc.name, `Missing name for ${calc.id}`).toBeTruthy();
      expect(calc.desc, `Missing description for ${calc.id}`).toBeTruthy();
    });
  });

  it('every live calculator must have a matching form component in FORMS registry', () => {
    const liveCalculators = ALL_CALCULATORS.filter(c => c.status === 'live' || !c.status);
    liveCalculators.forEach(calc => {
      const hasForm = !!FORMS[calc.slug];
      expect(hasForm, `Missing React component mapping in FORMS for live calculator: ${calc.slug}`).toBe(true);
    });
  });
});
