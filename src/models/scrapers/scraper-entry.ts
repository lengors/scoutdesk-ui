import type { ScraperEntryStock } from "./scraper-entry-stock";
import type { ScraperResponseResult } from "@lengors/protoscout-schemas/scrapers";

export type ScraperEntry = Omit<ScraperResponseResult, "stocks"> & {
  readonly stocks: ReadonlyArray<ScraperEntryStock>;
};
