import { z } from 'zod';

export const PercentageSchema = z.object({
  baseValue: z.number({ invalid_type_error: "Must be a valid number", required_error: "Base value required" } as any),
  percentage: z.number({ invalid_type_error: "Must be a valid number", required_error: "Percentage required" } as any),
});

export type PercentageForm = z.infer<typeof PercentageSchema>;

