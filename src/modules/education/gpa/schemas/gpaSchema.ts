import { z } from 'zod';

export const GPASchema = z.object({
  courses: z.array(z.object({
    name: z.string().optional(),
    credits: z.coerce.number().min(0.5, "Minimum 0.5 credits").max(10, "Maximum 10 credits"),
    grade: z.enum(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'])
  })).min(1, "Add at least one course"),
  deansThreshold: z.coerce.number().min(2.0).max(4.0).default(3.5).optional(),
});

export type GPAForm = z.infer<typeof GPASchema>;
