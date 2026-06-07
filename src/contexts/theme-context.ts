import type { Theme } from "../models/theme/theme";
import type { ThemePreference } from "../models/theme/theme-preference";

import { createContext } from "react";

export const ThemeContext = createContext<
  | {
      theme: Theme;
      themePreference: ThemePreference;
      togglePreference?: () => void;
    }
  | undefined
>(undefined);
