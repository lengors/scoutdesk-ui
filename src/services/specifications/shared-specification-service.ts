import type { HttpRequestConfig } from "../../models/http/http-request-config";
import type { ScraperOwnedSpecificationReference } from "../../models/specifications/scraper-owned-specification-reference";

import { httpService } from "../http/http-provider";
import { ScraperOwnedSpecification } from "../../models/specifications/scraper-owned-specification";
import { ScraperOwnedSpecificationArray } from "../../models/specifications/scraper-owned-specification-array";

const SHARED_SPECIFICATION_PATH = "/shared/scrapers/specifications";

export async function findSharedSpecification(
  request: ScraperOwnedSpecificationReference,
  config?: HttpRequestConfig,
) {
  return await httpService.get(
    SHARED_SPECIFICATION_PATH,
    ScraperOwnedSpecification,
    {
      params: request,
      signal: config?.signal,
    },
  );
}

export async function findSharedSpecifications(
  request?: {
    readonly query: string;
    readonly strictModeEnabled?: boolean;
  },
  config?: HttpRequestConfig,
) {
  const requestConfig = Object.assign(
    request === undefined ? {} : { params: request },
    config ?? {},
  );
  return await httpService.get(
    SHARED_SPECIFICATION_PATH,
    ScraperOwnedSpecificationArray,
    request !== undefined || config?.signal !== undefined
      ? requestConfig
      : undefined,
  );
}
