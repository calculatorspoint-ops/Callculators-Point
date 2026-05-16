import { z } from 'zod';

export const Base64Schema = z.object({
  mode: z.enum(['encode', 'decode']),
  text: z.string().optional().default("")
});

export type Base64Form = z.infer<typeof Base64Schema>;
