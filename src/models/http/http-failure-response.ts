import { z } from "zod/mini";
import { HttpConstraintViolation } from "./http-constraint-violation";

export const HttpFailureResponse = z.union([
  z.string(),
  z.readonly(z.array(HttpConstraintViolation)),
  z.readonly(
    z.union([
      z.object({
        message: z.string(),
      }),
      z.object({
        error: z.string(),
      }),
    ]),
  ),
]);

export type HttpFailureResponse = z.infer<typeof HttpFailureResponse>;
