import type { ReactNode } from "react";

export function isEmpty(value: ReactNode) {
  return (
    value === undefined ||
    (typeof value === "string" && value.trim().length === 0) ||
    (Array.isArray(value) && value.every(isEmpty))
  );
}
