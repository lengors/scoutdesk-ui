import type { ScraperUnownedProfile } from "../../models/profiles/scraper-unowned-profile";

import { z } from "zod/mini";
import { httpService } from "../http/http-provider";
import { ScraperOwnedProfile } from "../../models/profiles/scraper-owned-profile";
import { ScraperOwnedProfileArray } from "../../models/profiles/scraper-owned-profile-array";
import { ScraperOwnedProfileRequirementBatch } from "../../models/profiles/scraper-owned-profile-requirement-batch";

const PROFILE_PATH = "/scrapers/profiles";

export async function deleteProfile(name: string) {
  return await httpService.delete(`${PROFILE_PATH}/${name}`, z.unknown());
}

export async function deleteProfiles() {
  return await httpService.delete(PROFILE_PATH, z.unknown());
}

export async function findProfile(name: string) {
  return await httpService.get(`${PROFILE_PATH}/${name}`, ScraperOwnedProfile);
}

export async function findProfileRequirements(name: string) {
  return await httpService.get(
    `${PROFILE_PATH}/${name}/requirements`,
    ScraperOwnedProfileRequirementBatch,
  );
}

export async function findProfiles() {
  return await httpService.get(PROFILE_PATH, ScraperOwnedProfileArray);
}

export async function saveProfile(request: ScraperUnownedProfile) {
  return await httpService.put(PROFILE_PATH, ScraperOwnedProfile, request);
}

export async function updateProfile(
  name: string,
  request: Partial<Omit<ScraperUnownedProfile, "name">>,
) {
  return await httpService.patch(
    `${PROFILE_PATH}/${name}`,
    ScraperOwnedProfile,
    request,
  );
}
