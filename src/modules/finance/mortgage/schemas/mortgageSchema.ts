import { z } from 'zod';

export const MortgageSchema = z.object({
  homePrice: z.number({ required_error: "Home price required" } as any).min(10000, "Minimum home price is 10,000"),
  downPayment: z.number().min(0),
  interestRate: z.number().min(0.1, "Minimum interest rate is 0.1%").max(30, "Maximum interest rate is 30%"),
  loanTerm: z.number().int().min(1).max(50),
  propertyTax: z.number().min(0).default(0), // annual
  homeInsurance: z.number().min(0).default(0), // annual
});

export type MortgageForm = z.infer<typeof MortgageSchema>;
