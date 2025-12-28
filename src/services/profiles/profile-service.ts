import type { HttpRequestConfig } from "../../models/http/http-request-config";
import type { ScraperUnownedProfile } from "../../models/profiles/scraper-unowned-profile";

import { z } from "zod/mini";
import { httpService } from "../http/http-provider";
import { ScraperOwnedProfile } from "../../models/profiles/scraper-owned-profile";
import { ScraperOwnedProfileArray } from "../../models/profiles/scraper-owned-profile-array";
import { ScraperOwnedProfileRequirementBatch } from "../../models/profiles/scraper-owned-profile-requirement-batch";

const PROFILE_PATH = "/scrapers/profiles";

export async function deleteProfile(name: string, config?: HttpRequestConfig) {
  return await httpService.delete(
    `${PROFILE_PATH}/${name}`,
    z.unknown(),
    config,
  );
}

export async function deleteProfiles(config?: HttpRequestConfig) {
  return await httpService.delete(PROFILE_PATH, z.unknown(), config);
}

export async function findProfile(name: string, config?: HttpRequestConfig) {
  return await httpService.get(
    `${PROFILE_PATH}/${name}`,
    ScraperOwnedProfile,
    config,
  );
}

export async function findProfileRequirements(
  name: string,
  config?: HttpRequestConfig,
) {
  return await httpService.get(
    `${PROFILE_PATH}/${name}/requirements`,
    ScraperOwnedProfileRequirementBatch,
    config,
  );
}

export async function findProfiles(config?: HttpRequestConfig) {
  return await httpService.get(PROFILE_PATH, ScraperOwnedProfileArray, config);
}

export async function saveProfile(
  request: ScraperUnownedProfile,
  config?: HttpRequestConfig,
) {
  return await httpService.put(
    PROFILE_PATH,
    ScraperOwnedProfile,
    request,
    config,
  );
}

export async function updateProfile(
  name: string,
  request: Partial<Omit<ScraperUnownedProfile, "name">>,
  config?: HttpRequestConfig,
) {
  return await httpService.patch(
    `${PROFILE_PATH}/${name}`,
    ScraperOwnedProfile,
    request,
    config,
  );
}
