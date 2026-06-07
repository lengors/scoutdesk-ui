/// <reference types="vitest/config" />
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
    test: {
      environment: "jsdom",
      setupFiles: ["./test/__setup.ts"],
      include: ["test/**/*.{spec,test}.{ts,tsx}"],
      exclude: ["node_modules", "dist"],
      globals: true,
      css: true,
      coverage: {
        provider: "v8",
        // Include all source files in coverage, not just those touched by tests
        include: ["src/**/*.{ts,tsx}"],

        // Exclude test files and generated files from coverage
        exclude: [
          // test files and helpers
          "src/**/__tests__/**",
          "src/**/*.{spec,test}.{ts,tsx}",

          // generated files
          "src/**/routeTree.gen.{ts,tsx}",
        ],
        reporter: ["text", "lcov"],
        thresholds: {
          lines: 10,
          functions: 10,
          branches: 10,
          statements: 10,
        },
      },
    },
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
