import { z } from "zod/mini";
import { ScraperOwnedSpecificationReference } from "../specifications/scraper-owned-specification-reference";

export const ScraperUnownedProfile = z.readonly(
  z.object({
    name: z.string(),
    specification: ScraperOwnedSpecificationReference,
    inputs: z.readonly(z.record(z.string(), z.string())),
  }),
);

export type ScraperUnownedProfile = z.infer<typeof ScraperUnownedProfile>;
