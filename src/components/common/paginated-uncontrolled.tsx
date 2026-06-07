import type { PaginatedProps } from "./paginated";

import { useState } from "react";
import { PaginatedControlled } from "./paginated-controlled";

export type PaginatedUncontrolledProps<TEntry> = Omit<
  PaginatedProps<TEntry>,
  "page" | "setPage"
>;

export function PaginatedUncontrolled<TEntry>({
  count,
  entries,
  render,
  setSize,
  size,
  sizeOptions,
  span,
}: PaginatedUncontrolledProps<TEntry>) {
  const [page, setPage] = useState(0);
  return (
    <PaginatedControlled
      count={count}
      entries={entries}
      page={page}
      render={render}
      setPage={setPage}
      setSize={setSize}
      size={size}
      sizeOptions={sizeOptions}
      span={span}
    />
  );
}
