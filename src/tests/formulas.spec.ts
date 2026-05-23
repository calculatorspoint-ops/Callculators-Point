import { describe, it, expect } from 'vitest';
import { calculateBMI } from '../modules/health/bmi/engine/bmiEngine';
import { calculateBMR } from '../modules/health/bmr/engine/bmrEngine';

describe('Formula Engines', () => {
  describe('BMI Engine', () => {
    it('should correctly calculate BMI for normal weight', () => {
      const result = calculateBMI({ height: 175, weight: 70, system: 'metric' });
      expect(result.bmi).toBe(22.9);
      expect(result.category).toBe('Normal');
      expect(result.healthyWeightRange[0]).toBe(56.7);
      expect(result.healthyWeightRange[1]).toBe(76.3);
    });

    it('should correctly calculate BMI for underweight', () => {
      const result = calculateBMI({ height: 175, weight: 50, system: 'metric' });
      expect(result.bmi).toBe(16.3);
      expect(result.category).toBe('Underweight');
    });

    it('should correctly calculate BMI for overweight', () => {
      const result = calculateBMI({ height: 175, weight: 85, system: 'metric' });
      expect(result.bmi).toBe(27.8);
      expect(result.category).toBe('Overweight');
    });

    it('should correctly calculate BMI for obese', () => {
      const result = calculateBMI({ height: 175, weight: 100, system: 'metric' });
      expect(result.bmi).toBe(32.7);
      expect(result.category).toBe('Obese');
    });
  });

  describe('BMR Engine', () => {
    it('should correctly calculate BMR and TDEE for a male', () => {
      const result = calculateBMR({ height: 180, weight: 80, age: 30, gender: 'male', activityLevel: 1.2 });
      // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
      expect(result.bmr).toBe(1780);
      expect(result.tdee).toBe(2136); // 1780 * 1.2 = 2136
    });

    it('should correctly calculate BMR and TDEE for a female', () => {
      const result = calculateBMR({ height: 165, weight: 65, age: 25, gender: 'female', activityLevel: 1.55 });
      // 10*65 + 6.25*165 - 5*25 - 161 = 650 + 1031.25 - 125 - 161 = 1395.25
      expect(result.bmr).toBe(1395);
      expect(result.tdee).toBe(2163);
    });
  });
});
