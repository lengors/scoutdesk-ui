import { useEffect, useRef, useState } from "react";

export function useDebounce<TValue>(value: TValue, delay: number): TValue {
  const [debouncedValue, setDebouncedValue] = useState<TValue>(value);

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutId.current === value) {
      return;
    }

    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setDebouncedValue(value);
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    }, delay);
  }, [debouncedValue, delay, value]);

  return debouncedValue;
}
