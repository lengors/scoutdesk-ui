import { z } from "zod/mini";
import { ScraperOwnedSpecification } from "./scraper-owned-specification";

export const ScraperOwnedSpecificationArray = z.readonly(
  z.array(ScraperOwnedSpecification),
);

export type ScraperOwnedSpecificationArray = z.infer<
  typeof ScraperOwnedSpecificationArray
>;
