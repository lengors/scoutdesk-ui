import { useLayoutEffect, useMemo, useState } from "react";

export function useRectSize<T extends HTMLElement>() {
  const [ref, setRef] = useState<T | null>(null);
  const [observedRectSize, setObservedRectSize] = useState<{
    readonly height: number;
    readonly width: number;
  }>();

  useLayoutEffect(() => {
    if (ref === null) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === ref) {
          const { height, width } = entry.target.getBoundingClientRect();
          setObservedRectSize({ height, width });
        }
      }
    });
    resizeObserver.observe(ref);

    return () => resizeObserver.unobserve(ref);
  }, [ref, setObservedRectSize]);

  const rectSize = useMemo(() => {
    if (observedRectSize !== undefined) {
      return observedRectSize;
    }

    if (ref === null) {
      return { height: 0, width: 0 };
    }

    const { height, width } = ref.getBoundingClientRect();
    return { height, width };
  }, [observedRectSize, ref]);

  return [setRef, rectSize] as const;
}
