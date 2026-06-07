import type { ThemeContext } from "../contexts/theme-context";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ContextType,
} from "react";
import { useLocalStorage } from "./use-local-storage";
import { ThemePreference } from "../models/theme/theme-preference";

export function useThemeContextProvider(property: string = "theme-preference") {
  const [themePreference, setThemePreference] = useLocalStorage(
    property,
    ThemePreference.parse,
  );

  const togglePreference = useCallback(() => {
    if (themePreference === "system") {
      setThemePreference("dark");
    } else {
      setThemePreference(themePreference === "dark" ? "light" : "system");
    }
  }, [setThemePreference, themePreference]);

  const themeMatchMedia = useMemo(
    () => globalThis.matchMedia("(prefers-color-scheme: dark)"),
    [],
  );
  const [systemTheme, setSystemTheme] = useState(() => themeMatchMedia.matches);
  const themeMatchMediaHandler = useCallback(
    (event: MediaQueryListEvent) => setSystemTheme(event.matches),
    [setSystemTheme],
  );
  const theme = useMemo(() => {
    if (themePreference !== "system") {
      return themePreference;
    }

    return systemTheme ? "dark" : "light";
  }, [systemTheme, themePreference]);

  useEffect(() => {
    if (themePreference !== "system") {
      return;
    }

    themeMatchMedia.addEventListener("change", themeMatchMediaHandler);
    return () =>
      themeMatchMedia.removeEventListener("change", themeMatchMediaHandler);
  }, [themeMatchMedia, themeMatchMediaHandler, themePreference]);
  useEffect(() => {
    document.documentElement.dataset.bsTheme = theme;
  }, [theme]);

  return {
    theme,
    themePreference,
    togglePreference,
  } as const satisfies ContextType<typeof ThemeContext>;
}
