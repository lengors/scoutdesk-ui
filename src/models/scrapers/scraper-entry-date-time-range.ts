import type { ScraperEntryDateTimeInstant } from "./scraper-entry-date-time-instant";

export type ScraperEntryDateTimeRange = {
  readonly from: ScraperEntryDateTimeInstant;
  readonly to: ScraperEntryDateTimeInstant;
};
