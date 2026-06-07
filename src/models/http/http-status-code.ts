import { z } from "zod/mini";

export const HttpStatusCode = z.int().check(z.gte(100), z.lt(600));

export type HttpStatusCode = z.infer<typeof HttpStatusCode>;
