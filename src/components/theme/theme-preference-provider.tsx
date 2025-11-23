import type { Theme } from "../../models/theme/theme";

import { type ReactNode, useEffect } from "react";
import { ThemeContext } from "../../contexts/theme-context";

export interface ThemePreferenceProviderProps {
  readonly children?: ReactNode;
  readonly themePreference: Theme;
  readonly togglePreference: () => void;
}

export function ThemePreferenceProvider({
  children,
  themePreference,
  togglePreference,
}: ThemePreferenceProviderProps) {
  useEffect(
    () =>
      document.documentElement.setAttribute("data-bs-theme", themePreference),
    [themePreference],
  );

  return (
    <ThemeContext.Provider
      value={{
        theme: themePreference,
        themePreference,
        togglePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
