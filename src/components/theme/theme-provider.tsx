import {
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { ThemeContext } from "../../contexts/theme-context";
import { ThemeSystemProvider } from "./theme-system-provider";
import { useLocalStorage } from "../../hooks/use-local-storage";
import { ThemePreference } from "../../models/theme/theme-preference";
import { ThemePreferenceProvider } from "./theme-preference-provider";

export interface ThemeProviderProps {
  readonly children?: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeContext = useContext(ThemeContext);
  const [themePreference, setThemePreference] = useLocalStorage(
    "theme-preference",
    ThemePreference.parse,
  );
  const togglePreference = useCallback(() => {
    if (themePreference === "system") {
      setThemePreference("dark");
    } else {
      setThemePreference(themePreference === "dark" ? "light" : "system");
    }
  }, [setThemePreference, themePreference]);

  const exceptionTriggered = useRef(false);

  useEffect(() => {
    if (themeContext !== undefined && !exceptionTriggered.current) {
      exceptionTriggered.current = true;
      throw new ReferenceError(
        "ThemeProvider should not be nested. Use useThemeContext() to access the theme context.",
      );
    }
  }, [themeContext]);

  return themePreference === "system" ? (
    <ThemeSystemProvider togglePreference={togglePreference}>
      {children}
    </ThemeSystemProvider>
  ) : (
    <ThemePreferenceProvider
      themePreference={themePreference}
      togglePreference={togglePreference}
    >
      {children}
    </ThemePreferenceProvider>
  );
}
