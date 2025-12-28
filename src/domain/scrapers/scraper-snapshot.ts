import type { Identifiable } from "../../models/common/identifiable";
import type { ScraperEntry } from "../../models/scrapers/scraper-entry";

export type ScraperSnapshot = {
  readonly batch: ReadonlyArray<Identifiable<ScraperEntry, number>>;
  readonly batchSize: number;
  readonly batchOffset: number;
  readonly count: number;
  readonly brands: ReadonlyArray<[string, boolean]>;
  readonly direction: "forward" | "backward";
  readonly selectionMode: "all" | "indeterminate" | "none";
};
