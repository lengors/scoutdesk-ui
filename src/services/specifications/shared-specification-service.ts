import type { ScraperOwnedSpecificationReference } from "../../models/specifications/scraper-owned-specification-reference";

import { httpService } from "../http/http-provider";
import { ScraperOwnedSpecification } from "../../models/specifications/scraper-owned-specification";
import { ScraperOwnedSpecificationArray } from "../../models/specifications/scraper-owned-specification-array";

const SHARED_SPECIFICATION_PATH = "/shared/scrapers/specifications";

export async function findSharedSpecification(
  request: ScraperOwnedSpecificationReference,
) {
  return await httpService.get(
    SHARED_SPECIFICATION_PATH,
    ScraperOwnedSpecification,
    {
      params: request,
    },
  );
}

export async function findSharedSpecifications(request?: {
  readonly query: string;
  readonly strictModeEnabled?: boolean;
}) {
  return await httpService.get(
    SHARED_SPECIFICATION_PATH,
    ScraperOwnedSpecificationArray,
    request !== undefined
      ? {
          params: request,
        }
      : undefined,
  );
}
