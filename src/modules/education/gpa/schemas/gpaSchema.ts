import { z } from 'zod';

export const GPASchema = z.object({
  courses: z.array(z.object({
    name: z.string().optional(),
    credits: z.coerce.number().min(0.5, "Minimum 0.5 credits").max(10, "Maximum 10 credits"),
    grade: z.enum(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'])
  })).min(1, "Add at least one course")
});

export type GPAForm = z.infer<typeof GPASchema>;
