import { ThemeContext } from "../../contexts/theme-context";
import { type ReactNode, useContext, useEffect, useRef } from "react";
import { useThemeContextProvider } from "../../hooks/use-theme-context-provider";

export interface ThemeProviderProps {
  readonly children?: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeContext = useContext(ThemeContext);
  const value = useThemeContextProvider();
  const exceptionTriggered = useRef(false);

  useEffect(() => {
    if (themeContext !== undefined && !exceptionTriggered.current) {
      exceptionTriggered.current = true;
      throw new ReferenceError(
        "ThemeProvider should not be nested. Use useThemeContext() to access the theme context.",
      );
    }
  }, [themeContext]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
