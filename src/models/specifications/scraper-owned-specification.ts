import { z } from "zod/mini";
import { ScraperOwnedSpecificationStatus } from "./scraper-owned-specification-status";
import { ScraperSpecification } from "@lengors/protoscout-schemas/scrapers/specifications";

export const ScraperOwnedSpecification = z.readonly(
  z.object({
    owner: z.string(),
    specification: ScraperSpecification,
    status: ScraperOwnedSpecificationStatus,
  }),
);

export type ScraperOwnedSpecification = z.infer<
  typeof ScraperOwnedSpecification
>;
