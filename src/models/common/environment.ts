import { z } from "zod/mini";

export const Environment = z.readonly(
  z.object({
    VITE_STORAGE_NAMESPACE: z._default(
      z.string(),
      "io.github.lengors.scoutdesk-ui",
    ),
  }),
);

export type Environment = z.infer<typeof Environment>;
