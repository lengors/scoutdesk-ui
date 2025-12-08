import { z } from "zod/mini";
import { ScraperOwnedProfile } from "./scraper-owned-profile";

export const ScraperOwnedProfileArray = z.readonly(
  z.array(ScraperOwnedProfile),
);

export type ScraperOwnedProfileArray = z.infer<typeof ScraperOwnedProfileArray>;
