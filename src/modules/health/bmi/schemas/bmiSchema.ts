import { z } from 'zod';

export const BMISchema = z.object({
  weight: z.number({ required_error: "Weight is required" } as any).min(2, "Weight too low").max(500, "Weight too high"),
  height: z.number({ required_error: "Height is required" } as any).min(30, "Height too low").max(300, "Height too high"), // in cm
});

export type BMIForm = z.infer<typeof BMISchema>;

