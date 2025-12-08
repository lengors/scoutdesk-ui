import { z } from "zod/mini";
import { ScraperSpecificationRequirement } from "@lengors/protoscout-schemas/scrapers/specifications";

export const ScraperOwnedProfileRequirementBatch = z.readonly(
  z.array(ScraperSpecificationRequirement),
);

export type ScraperOwnedProfileRequirementBatch = z.infer<
  typeof ScraperOwnedProfileRequirementBatch
>;
