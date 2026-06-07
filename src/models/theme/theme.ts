import type { ThemePreference } from "./theme-preference";

export type Theme = Exclude<ThemePreference, "system">;
