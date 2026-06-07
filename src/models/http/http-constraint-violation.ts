import { z } from "zod/mini";

export const HttpConstraintViolation = z.readonly(
  z.object({
    property: z.string(),
    message: z.string(),
    category: z.string(),
  }),
);

export type HttpConstraintViolation = z.infer<typeof HttpConstraintViolation>;
