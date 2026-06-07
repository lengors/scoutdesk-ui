import type { HttpRequestConfig } from "../../models/http/http-request-config";
import type { ScraperOwnedProfileReference } from "../../models/profiles/scraper-owned-profile-reference";

import { queryOptions } from "@tanstack/react-query";
import {
  profileKey,
  profileRequirementBatchKey,
  PROFILES_KEY,
} from "./profile-keys";
import {
  findProfile,
  findProfileRequirements,
  findProfiles,
} from "../../services/profiles/profile-service";

export const profileQueryOptions = (reference: ScraperOwnedProfileReference) =>
  queryOptions({
    enabled: ({ meta }) =>
      meta?.queryClient.getQueryState(PROFILES_KEY)?.isInvalidated !== true,
    queryFn: async ({ signal }: HttpRequestConfig) =>
      await findProfile(reference.name, { signal }),
    queryKey: profileKey(reference),
  });

export const profileRequirementBatchQueryOptions = (
  reference: ScraperOwnedProfileReference,
) =>
  queryOptions({
    enabled: ({ meta }) =>
      meta?.queryClient.getQueryState(PROFILES_KEY)?.isInvalidated !== true,
    queryFn: async ({ signal }: HttpRequestConfig) =>
      await findProfileRequirements(reference.name, { signal }),
    queryKey: profileRequirementBatchKey(reference),
  });

export const profilesQueryOptions = queryOptions({
  queryFn: findProfiles,
  queryKey: PROFILES_KEY,
  select: (data) => data.map(({ name }) => name),
});
