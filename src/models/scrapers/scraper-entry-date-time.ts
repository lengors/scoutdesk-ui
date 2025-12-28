import type { ScraperEntryDateTimeRange } from "./scraper-entry-date-time-range";
import type { ScraperEntryDateTimeInstant } from "./scraper-entry-date-time-instant";

export type ScraperEntryDateTime =
  | ScraperEntryDateTimeInstant
  | ScraperEntryDateTimeRange;
