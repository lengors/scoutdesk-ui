import { z } from "zod/mini";

export const Environment = z.readonly(
  z.object({
    RUNTIME_CONFIG_URL: z._default(z.string(), "/config.json"),
    SSO_URL: z._default(z.string(), "#"),
    VITE_STORAGE_NAMESPACE: z._default(
      z.string(),
      "io.github.lengors.scoutdesk-ui",
    ),
  }),
);

export type Environment = z.infer<typeof Environment>;
