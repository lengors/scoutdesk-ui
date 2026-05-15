import { z } from "zod/mini";

export const RuntimeEnvironment = z.readonly(
  z.object({
    SSO_URL: z.optional(z.string()),
    VITE_STORAGE_NAMESPACE: z.optional(z.string()),
  }),
);

export type RuntimeEnvironment = z.infer<typeof RuntimeEnvironment>;
