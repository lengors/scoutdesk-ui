import { z } from "zod/mini";

export const ScraperOwnedSpecificationStatus = z.enum([
  "active",
  "archived",
  "deleted",
]);

export type ScraperOwnedSpecificationStatus = z.infer<
  typeof ScraperOwnedSpecificationStatus
>;
