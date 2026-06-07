import type { HttpRequestConfig } from "../../models/http/http-request-config";
import type { ScraperOwnedSpecificationReference } from "../../models/specifications/scraper-owned-specification-reference";

import { queryOptions } from "@tanstack/react-query";
import { specificationKey, SPECIFICATIONS_KEY } from "./specification-keys";
import {
  findSpecification,
  findSpecifications,
} from "../../services/specifications/specification-service";

export const specificationQueryOptions = (
  reference: ScraperOwnedSpecificationReference,
) =>
  queryOptions({
    enabled: ({ meta }) =>
      meta?.queryClient?.getQueryState(SPECIFICATIONS_KEY)?.isInvalidated !==
      true,
    queryFn: async ({ signal }: HttpRequestConfig) =>
      await findSpecification(reference.name, { signal }),
    queryKey: specificationKey(reference),
  });

export const specificationsQueryOptions = queryOptions({
  queryFn: findSpecifications,
  queryKey: SPECIFICATIONS_KEY,
  select: (data) => data.map(({ specification: { name } }) => name),
});
