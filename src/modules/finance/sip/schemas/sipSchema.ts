import { z } from 'zod';
import { zFinance } from '../../../../core/form-engine';

export const SIPSchema = z.object({
  monthlyInvestment: zFinance.currency.min(100, "Minimum investment is 100").max(10000000, "Maximum investment is 1 Crore"),
  expectedReturnRate: zFinance.rate.max(50, "Return rate cannot exceed 50%"),
  tenureYears: zFinance.tenure.max(50, "Tenure cannot exceed 50 years"),
  stepUpRate: z.number().min(0).max(100).optional().default(0),
  inflationRate: z.number().min(0).max(30).optional().default(6),
  volatility: z.number().min(0).max(100).optional().default(15),
  currentSalary: z.number().min(0).optional().default(0),
  salaryGrowthRate: z.number().min(0).max(100).optional().default(5),
});

export type SIPForm = z.infer<typeof SIPSchema>;
