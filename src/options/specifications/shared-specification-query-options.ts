import type { HttpRequestConfig } from "../../models/http/http-request-config";
import type { ScraperOwnedSpecificationReference } from "../../models/specifications/scraper-owned-specification-reference";

import { queryOptions } from "@tanstack/react-query";
import {
  sharedSpecificationKey,
  sharedSpecificationsKey,
} from "./shared-specification-keys";
import {
  findSharedSpecification,
  findSharedSpecifications,
} from "../../services/specifications/shared-specification-service";

export const sharedSpecificationQueryOptions = (
  reference: ScraperOwnedSpecificationReference,
) =>
  queryOptions({
    queryFn: async ({ signal }: HttpRequestConfig) =>
      await findSharedSpecification(reference, { signal }),
    queryKey: sharedSpecificationKey(reference),
  });

export const sharedSpecificationsQueryOptions = (query: string) =>
  queryOptions({
    queryFn: async ({ signal }: HttpRequestConfig) =>
      await findSharedSpecifications(
        query.trim().length === 0 ? undefined : { query },
        { signal },
      ),
    queryKey: sharedSpecificationsKey(query),
    select: (data) =>
      data.map(
        ({ owner, specification: { name } }) => ({ owner, name }) as const,
      ),
  });
