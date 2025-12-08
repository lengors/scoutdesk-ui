import { z } from "zod/mini";
import { ScraperUnownedProfile } from "./scraper-unowned-profile";

export const ScraperOwnedProfile = z.readonly(
  z.extend(ScraperUnownedProfile.def.innerType, {
    owner: z.string(),
  }),
);

export type ScraperOwnedProfile = z.infer<typeof ScraperOwnedProfile>;
