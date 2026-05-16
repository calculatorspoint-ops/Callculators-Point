import { z } from 'zod';

export const SalarySchema = z.object({
  grossSalary:  z.number({ required_error: "Gross salary required" } as any).min(0),
  payFrequency: z.enum(['annual', 'monthly', 'biweekly', 'weekly']),
  country:      z.string().default('us'),
  deductions:   z.number().min(0).default(0),
  // Only used when country === 'custom'
  customTaxRate: z.number().min(0).max(100).default(20),
});

export type SalaryForm = z.infer<typeof SalarySchema>;
