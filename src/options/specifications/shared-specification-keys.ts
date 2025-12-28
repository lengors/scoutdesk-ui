import type { ScraperOwnedSpecificationReference } from "../../models/specifications/scraper-owned-specification-reference";

import { SPECIFICATIONS_KEY } from "./specification-keys";

function buildSharedKey(): readonly [...typeof SPECIFICATIONS_KEY, "shared"];
function buildSharedKey<TValue extends NonNullable<unknown>>(
  value: TValue,
): readonly [...typeof SPECIFICATIONS_KEY, TValue, "shared"];
function buildSharedKey<TValue extends NonNullable<unknown>>(value?: TValue) {
  return value === undefined
    ? ([...SPECIFICATIONS_KEY, "shared"] as const)
    : ([...SPECIFICATIONS_KEY, value, "shared"] as const);
}

export function sharedSpecificationsKey(): ReturnType<typeof buildSharedKey>;
export function sharedSpecificationsKey<TQuery extends string>(
  query: TQuery,
): ReturnType<typeof buildSharedKey<TQuery>>;
export function sharedSpecificationsKey<TQuery extends NonNullable<unknown>>(
  value?: TQuery,
) {
  return value !== undefined ? buildSharedKey(value) : buildSharedKey();
}

export function sharedSpecificationKey(
  reference: ScraperOwnedSpecificationReference,
) {
  return buildSharedKey(reference);
}
