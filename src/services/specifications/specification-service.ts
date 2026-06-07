import type { HttpRequestConfig } from "../../models/http/http-request-config";
import type { ScraperOwnedSpecificationActionRequest } from "../../models/specifications/scraper-owned-specification-action-request";

import { z } from "zod/mini";
import { httpService } from "../http/http-provider";
import { ScraperOwnedSpecification } from "../../models/specifications/scraper-owned-specification";
import { ScraperOwnedSpecificationArray } from "../../models/specifications/scraper-owned-specification-array";

const SPECIFICATION_PATH = "/scrapers/specifications";

export async function deleteSpecification(
  name: string,
  config?: HttpRequestConfig,
) {
  return await httpService.delete(
    `${SPECIFICATION_PATH}/${name}`,
    z.unknown(),
    config,
  );
}

export async function deleteSpecifications(config?: HttpRequestConfig) {
  return await httpService.delete(SPECIFICATION_PATH, z.unknown(), config);
}

export async function findSpecification(
  name: string,
  config?: HttpRequestConfig,
) {
  return await httpService.get(
    `${SPECIFICATION_PATH}/${name}`,
    ScraperOwnedSpecification,
    config,
  );
}

export async function findSpecifications(config?: HttpRequestConfig) {
  return await httpService.get(
    SPECIFICATION_PATH,
    ScraperOwnedSpecificationArray,
    config,
  );
}

export async function updateSpecification(
  name: string,
  action: ScraperOwnedSpecificationActionRequest["action"],
  config?: HttpRequestConfig,
) {
  return await httpService.patch(
    `${SPECIFICATION_PATH}/${name}`,
    ScraperOwnedSpecification,
    {
      action,
    },
    config,
  );
}

export async function uploadSpecification(
  specification?: File,
  config?: HttpRequestConfig,
) {
  return await httpService.putForm(
    SPECIFICATION_PATH,
    ScraperOwnedSpecification,
    specification !== undefined ? { specification } : {},
    config,
  );
}
