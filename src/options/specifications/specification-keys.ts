import type { ScraperOwnedSpecificationReference } from "../../models/specifications/scraper-owned-specification-reference";

export const SPECIFICATIONS_KEY = ["specifications", "owned"] as const;

export function specificationKey(
  reference: ScraperOwnedSpecificationReference,
) {
  return [...SPECIFICATIONS_KEY, reference] as const;
}
