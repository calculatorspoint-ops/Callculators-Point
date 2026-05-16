import { z } from 'zod';

export const TipSchema = z.object({
  billAmount: z.number({ required_error: "Bill amount required" } as any).min(0, "Bill cannot be negative"),
  tipPercentage: z.number().min(0).max(200, "Tip percentage is unreasonably high"),
  splitCount: z.number().int().min(1, "Must split by at least 1 person")
});

export type TipForm = z.infer<typeof TipSchema>;

