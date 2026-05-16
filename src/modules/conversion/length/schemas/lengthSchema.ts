import { z } from 'zod';

export const LengthSchema = z.object({
  value: z.number(),
  fromUnit: z.enum(['meters', 'kilometers', 'centimeters', 'millimeters', 'miles', 'yards', 'feet', 'inches']),
  toUnit: z.enum(['meters', 'kilometers', 'centimeters', 'millimeters', 'miles', 'yards', 'feet', 'inches']),
});

export type LengthForm = z.infer<typeof LengthSchema>;
