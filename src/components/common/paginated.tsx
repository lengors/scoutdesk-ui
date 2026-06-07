import type { ArrayLike } from "../../collections/array-like";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { PaginatedControlled } from "./paginated-controlled";
import { PaginatedUncontrolled } from "./paginated-uncontrolled";

export type PaginatedProps<TEntry> = {
  readonly entries: ArrayLike<TEntry>;
  readonly render: (paginatedEntries: ArrayLike<TEntry>) => ReactNode;
  readonly size: number;
  readonly span: number;
} & ({ readonly count?: never } | { readonly count: number }) &
  (
    | {
        readonly page: number;
        readonly setPage: Dispatch<SetStateAction<number>>;
      }
    | {
        readonly page?: never;
        readonly setPage?: never;
      }
  ) &
  (
    | {
        readonly setSize: Dispatch<SetStateAction<number>>;
        readonly sizeOptions: ReadonlyArray<number>;
      }
    | {
        readonly setSize?: never;
        readonly sizeOptions?: never;
      }
  );

export function Paginated<TEntry>({
  count,
  entries,
  page,
  render,
  setPage,
  setSize,
  size,
  sizeOptions,
  span,
}: PaginatedProps<TEntry>) {
  return page === undefined ? (
    <PaginatedUncontrolled
      count={count}
      entries={entries}
      render={render}
      setSize={setSize}
      size={size}
      sizeOptions={sizeOptions}
      span={span}
    />
  ) : (
    <PaginatedControlled
      count={count}
      entries={entries}
      page={page}
      render={render}
      setPage={setPage}
      setSize={setSize}
      sizeOptions={sizeOptions}
      size={size}
      span={span}
    />
  );
}
