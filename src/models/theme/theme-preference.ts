import { z } from "zod/mini";

export const ThemePreference = z._default(
  z.enum(["light", "dark", "system"]),
  "system",
);

export type ThemePreference = z.infer<typeof ThemePreference>;
