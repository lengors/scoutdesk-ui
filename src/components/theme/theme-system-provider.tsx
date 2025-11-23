import { ThemeContext } from "../../contexts/theme-context";
import { type ReactNode, useCallback, useEffect, useState } from "react";

export interface ThemeSystemProviderProps {
  readonly children?: ReactNode;
  readonly togglePreference: () => void;
}

export function ThemeSystemProvider({
  children,
  togglePreference,
}: ThemeSystemProviderProps) {
  const themeMatchMedia = window.matchMedia("(prefers-color-scheme: dark)");
  const [systemTheme, setSystemTheme] = useState(() => themeMatchMedia.matches);
  const themeMatchMediaHandler = useCallback(
    (event: MediaQueryListEvent) => setSystemTheme(event.matches),
    [setSystemTheme],
  );

  useEffect(() => {
    themeMatchMedia.addEventListener("change", themeMatchMediaHandler);
    return () =>
      themeMatchMedia.removeEventListener("change", themeMatchMediaHandler);
  }, [themeMatchMedia, themeMatchMediaHandler]);
  useEffect(
    () =>
      document.documentElement.setAttribute(
        "data-bs-theme",
        systemTheme ? "dark" : "light",
      ),
    [systemTheme],
  );

  return (
    <ThemeContext.Provider
      value={{
        theme: systemTheme ? "dark" : "light",
        themePreference: "system",
        togglePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
