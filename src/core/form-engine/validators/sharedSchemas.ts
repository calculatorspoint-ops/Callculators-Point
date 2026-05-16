import { z } from 'zod';

export const zFinance = {
  currency: z.number({ invalid_type_error: "Must be a valid number", required_error: "Amount is required" } as any)
             .min(0, "Amount cannot be negative"),
  rate: z.number({ invalid_type_error: "Must be a valid number", required_error: "Rate is required" } as any)
         .min(0, "Rate cannot be negative")
         .max(100, "Rate cannot exceed 100%"),
  tenure: z.number({ invalid_type_error: "Must be a valid number", required_error: "Tenure is required" } as any)
           .int("Tenure must be in whole numbers")
           .min(1, "Tenure must be at least 1")
           .max(100, "Tenure cannot exceed 100"),
};
