import { describe, it, expect } from "vitest";
import { calcEMI, calcCompound, calcBMI } from "./calculationEngine";

describe("Calculation Engine Core Functions", () => {
  it("calculates EMI correctly for standard loan", () => {
    // 5 Lakhs, 10% interest, 5 years (60 months)
    const result = calcEMI({ principal: 500000, interestRate: 10, tenure: 5 });
    
    expect(result).toBeDefined();
    expect(result.emi).toBeCloseTo(10623.52, 1); 
    expect(result.total).toBeCloseTo(637411.34, 1);
    expect(result.interest).toBeCloseTo(137411.34, 1);
    expect(result.schedule.length).toBeGreaterThan(0);
  });

  it("calculates EMI correctly with extra payments", () => {
    const regular = calcEMI({ principal: 500000, interestRate: 10, tenure: 5 });
    const withExtra = calcEMI({ principal: 500000, interestRate: 10, tenure: 5, extraPayment: 5000 });

    expect(withExtra.actualMonths).toBeLessThan(regular.actualMonths);
    expect(withExtra.savedMonths).toBeGreaterThan(0);
    expect(withExtra.interest).toBeLessThan(regular.interest);
    expect(withExtra.savedInterest).toBeCloseTo(regular.interest - withExtra.interest, 1);
  });

  it("calculates BMI correctly", () => {
    // 70kg, 175cm -> BMI = 70 / (1.75 * 1.75) = 22.85 -> 22.9
    const result = calcBMI({ weight: 70, height: 175, unit: "metric", gender: "male" });
    
    expect(result.bmi).toBe(22.9);
    expect(result.category).toBe("Normal Weight");
  });

  it("calculates compound interest correctly", () => {
    // 10000 at 5% for 10 years, annual compound
    const result = calcCompound({ principal: 10000, rate: 5, years: 10, frequency: "1" });
    
    expect(result.final).toBeCloseTo(16288.95, 1);
    expect(result.gains).toBeCloseTo(6288.95, 1);
  });

  it("treats recurring compound-interest contributions as monthly under annual compounding", () => {
    const result = calcCompound({
      principal: 10000,
      rate: 12,
      years: 1,
      frequency: "1",
      contribution: 100,
    });
    const monthlyRate = Math.pow(1.12, 1 / 12) - 1;
    const expectedContributions = 100 * (Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate;

    expect(result.final).toBeCloseTo(10000 * 1.12 + expectedContributions, 1);
    expect(result.invested).toBe(11200);
  });
});
