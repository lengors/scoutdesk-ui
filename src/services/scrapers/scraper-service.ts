import type { HttpRequestConfig } from "../../models/http/http-request-config";
import type { ScraperOwnedRequest } from "../../models/scrapers/scraper-owned-request";

import { httpService } from "../http/http-provider";
import { ScraperResponse } from "@lengors/protoscout-schemas/scrapers";

const SCRAPER_PATH = "/scrapers";

export async function scrap(
  request: ScraperOwnedRequest,
  config?: HttpRequestConfig,
) {
  return await httpService.post(
    SCRAPER_PATH,
    ScraperResponse,
    {
      profiles: request.profiles,
      ["search_term"]: request.searchTerm,
      strategies: request.strategies,
    },
    Object.assign(config ?? {}, {
      responseType: "stream",
    } as const),
  );
}
