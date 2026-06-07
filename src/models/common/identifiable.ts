import type { UUID } from "./uuid";

export const identity: unique symbol = Symbol();

export type Identifiable<TObject extends object, TIdentity = UUID> = TObject & {
  readonly [identity]: TIdentity;
};
