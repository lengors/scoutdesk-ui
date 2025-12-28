export type ArrayLike<TValue> = Iterable<TValue> & {
  map<UValue>(fn: (item: TValue, index: number) => UValue): ArrayLike<UValue>;
  slice(start?: number, end?: number): ArrayLike<TValue>;
} & ({ readonly size: number } | { readonly length: number });
