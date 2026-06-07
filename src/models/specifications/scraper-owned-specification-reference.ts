import { z } from "zod/mini";

export const ScraperOwnedSpecificationReference = z.readonly(
  z.object({
    owner: z.string(),
    name: z.string(),
  }),
);

export type ScraperOwnedSpecificationReference = z.infer<
  typeof ScraperOwnedSpecificationReference
>;
