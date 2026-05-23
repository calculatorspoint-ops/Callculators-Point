import { describe, it, expect } from "vitest";
import { ALL_CALCULATORS } from "@/data/calculatorConfigs";
import { FORMS } from "@/components/calculator-core/CalculatorWidget";

describe("calculator form registry", () => {
  it("has a form for every calculator", () => {
    for (const calc of ALL_CALCULATORS) {
      expect(FORMS[calc.slug], `${calc.slug} is missing a form`).toBeTruthy();
    }
  });
});
