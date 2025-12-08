import type { ScraperOwnedSpecificationReference } from "../../models/specifications/scraper-owned-specification-reference";

import { SPECIFICATIONS_KEY } from "./specification-keys";

function buildSharedKey(): readonly [...typeof SPECIFICATIONS_KEY, "shared"];
function buildSharedKey<T extends NonNullable<unknown>>(
  value: T,
): readonly [...typeof SPECIFICATIONS_KEY, T, "shared"];
function buildSharedKey<T extends NonNullable<unknown>>(value?: T) {
  return value === undefined
    ? ([...SPECIFICATIONS_KEY, "shared"] as const)
    : ([...SPECIFICATIONS_KEY, value, "shared"] as const);
}

export function sharedSpecificationsKey(): ReturnType<typeof buildSharedKey>;
export function sharedSpecificationsKey<T extends string>(
  query: T,
): ReturnType<typeof buildSharedKey<T>>;
export function sharedSpecificationsKey<T extends NonNullable<unknown>>(
  value?: T,
) {
  return value !== undefined ? buildSharedKey(value) : buildSharedKey();
}

export function sharedSpecificationKey(
  reference: ScraperOwnedSpecificationReference,
) {
  return buildSharedKey(reference);
}
