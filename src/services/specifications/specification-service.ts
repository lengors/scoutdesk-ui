import type { ScraperOwnedSpecificationActionRequest } from "../../models/specifications/scraper-owned-specification-action-request";

import { z } from "zod/mini";
import { httpService } from "../http/http-provider";
import { ScraperOwnedSpecification } from "../../models/specifications/scraper-owned-specification";
import { ScraperOwnedSpecificationArray } from "../../models/specifications/scraper-owned-specification-array";

export async function deleteSpecification(name: string) {
  return await httpService.delete(
    `/scrapers/specifications/${name}`,
    z.unknown(),
  );
}

export async function deleteSpecifications() {
  return await httpService.delete("/scrapers/specifications", z.unknown());
}

export async function findSpecification(name: string) {
  return await httpService.get(
    `/scrapers/specifications/${name}`,
    ScraperOwnedSpecification,
  );
}

export async function findSpecifications() {
  return await httpService.get(
    "/scrapers/specifications",
    ScraperOwnedSpecificationArray,
  );
}

export async function updateSpecification(
  name: string,
  action: ScraperOwnedSpecificationActionRequest["action"],
) {
  return await httpService.patch(
    `/scrapers/specifications/${name}`,
    z.unknown(),
    {
      action,
    },
  );
}

export async function uploadSpecification(specification?: File) {
  return await httpService.putForm(
    "/scrapers/specifications",
    ScraperOwnedSpecification,
    specification !== undefined ? { specification } : {},
  );
}
