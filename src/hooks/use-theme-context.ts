import { type ContextType, useContext } from "react";
import { ThemeContext } from "../contexts/theme-context";

export function useThemeContext(): Exclude<
  ContextType<typeof ThemeContext>,
  undefined
> {
  return (
    useContext(ThemeContext) ?? { theme: "light", themePreference: "system" }
  );
}
