import type { ScraperOwnedProfileReference } from "../../models/profiles/scraper-owned-profile-reference";

export const PROFILES_KEY = ["profiles", "owned"] as const;

export function profileKey(reference: ScraperOwnedProfileReference) {
  return [...PROFILES_KEY, reference] as const;
}

export function profileRequirementBatchKey(
  reference: ScraperOwnedProfileReference,
) {
  return [...profileKey(reference), "requirements"] as const;
}
