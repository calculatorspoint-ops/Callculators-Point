import { z } from 'zod';

export const BMRSchema = z.object({
  gender: z.enum(['male', 'female']),
  weight: z.number().min(2, "Weight too low").max(500, "Weight too high"),
  height: z.number().min(30, "Height too low").max(300, "Height too high"),
  age: z.number().int().min(1).max(120),
  activityLevel: z.coerce.number() // Handle strings from <select> being cast to numbers
});

export type BMRForm = z.infer<typeof BMRSchema>;
