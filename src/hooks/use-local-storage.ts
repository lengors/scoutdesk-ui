import { useEffect, useState } from "react";
import { ENVIRONMENT_CONFIG } from "../configs/environment-config";

export function useLocalStorage<TValue>(
  property: string,
  parser: (_?: string) => TValue,
) {
  const namespacedProperty = `${ENVIRONMENT_CONFIG.VITE_STORAGE_NAMESPACE}.${property}`;
  const [value, setValue] = useState(() =>
    parser(localStorage.getItem(namespacedProperty) ?? undefined),
  );

  useEffect(
    () =>
      localStorage.setItem(
        namespacedProperty,
        typeof value === "string" ? value : JSON.stringify(value),
      ),
    [namespacedProperty, value],
  );

  return [value, setValue] as const;
}
