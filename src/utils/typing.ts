export type IsEqual<TTypeLeft, TTypeRight, TTrue, TFalse> = [
  TTypeLeft,
] extends [TTypeRight]
  ? [TTypeRight] extends [TTypeLeft]
    ? TTrue
    : TFalse
  : TFalse;
