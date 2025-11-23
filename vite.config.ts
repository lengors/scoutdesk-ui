import react from "@vitejs/plugin-react";
import tanstackRouter from "@tanstack/router-plugin/vite";

import { z } from "zod/mini";
import { defineConfig, loadEnv } from "vite";
import { Environment } from "./src/models/common/environment";

// https://vite.dev/config/

export default ({ mode }: { mode: string }) => {
  const env = z
    .readonly(
      z.object({
        ...Environment.def.innerType.shape,
        API_URL: z._default(
          z.pipe(z.string(), z.url()),
          "http://localhost:8080",
        ),
        AUTHENTIK_IMPERSONATED_USER:
          mode === "development"
            ? z._default(z.string(), "scoutdesk-developer")
            : z.optional(z.string()),
        HOST: z._default(z.string(), "localhost"),
        PORT: z._default(z.coerce.number(), 5173),
      }),
    )
    .parse({
      ...process.env,
      ...loadEnv(mode, process.cwd()),
    });

  return defineConfig({
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        verboseFileRoutes: false,
      }),
      react(),
    ],
    server: {
      host: env.HOST,
      port: env.PORT,
      proxy: {
        "/api": {
          target: env.API_URL,
          changeOrigin: true,
          ...(env.AUTHENTIK_IMPERSONATED_USER !== undefined
            ? {
                headers: {
                  "X-authentik-username": env.AUTHENTIK_IMPERSONATED_USER,
                },
              }
            : {}),
        },
      },
    },
  });
};
