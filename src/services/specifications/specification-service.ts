import type { ScraperOwnedSpecificationActionRequest } from "../../models/specifications/scraper-owned-specification-action-request";

import { z } from "zod/mini";
import { httpService } from "../http/http-provider";
import { ScraperOwnedSpecification } from "../../models/specifications/scraper-owned-specification";
import { ScraperOwnedSpecificationArray } from "../../models/specifications/scraper-owned-specification-array";

const SPECIFICATION_PATH = "/scrapers/specifications";

export async function deleteSpecification(name: string) {
  return await httpService.delete(`${SPECIFICATION_PATH}/${name}`, z.unknown());
}

export async function deleteSpecifications() {
  return await httpService.delete(SPECIFICATION_PATH, z.unknown());
}

export async function findSpecification(name: string) {
  return await httpService.get(
    `${SPECIFICATION_PATH}/${name}`,
    ScraperOwnedSpecification,
  );
}

export async function findSpecifications() {
  return await httpService.get(
    SPECIFICATION_PATH,
    ScraperOwnedSpecificationArray,
  );
}

export async function updateSpecification(
  name: string,
  action: ScraperOwnedSpecificationActionRequest["action"],
) {
  return await httpService.patch(
    `${SPECIFICATION_PATH}/${name}`,
    ScraperOwnedSpecification,
    {
      action,
    },
  );
}

export async function uploadSpecification(specification?: File) {
  return await httpService.putForm(
    SPECIFICATION_PATH,
    ScraperOwnedSpecification,
    specification !== undefined ? { specification } : {},
  );
}
