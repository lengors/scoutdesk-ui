import type { ScraperEntryDateTime } from "./scraper-entry-date-time";
import type { ScraperResponseResultStock } from "@lengors/protoscout-schemas/scrapers";

export type ScraperEntryStock = Omit<
  ScraperResponseResultStock,
  "deliveringOn"
> & {
  readonly deliveringOn?: ScraperEntryDateTime;
};
