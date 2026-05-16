import { z } from 'zod';

export const RetirementSchema = z.object({
  currentPortfolio: z.number({ required_error: "Portfolio balance required" } as any).min(0, "Balance cannot be negative"),
  annualWithdrawal: z.number({ required_error: "Withdrawal amount required" } as any).min(0, "Withdrawal cannot be negative"),
  inflationRate: z.number().min(0).max(20).default(3),
  volatility: z.number().min(1).max(50).default(15),
  expectedReturn: z.number().min(0).max(30).default(8),
  yearsInRetirement: z.number().int().min(5).max(60).default(30)
});

export type RetirementForm = z.infer<typeof RetirementSchema>;
