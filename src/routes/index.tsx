import { z } from "zod/mini";
import { Index } from "../pages/index";

export const Route = createFileRoute({
  component: Index,
  validateSearch: z.readonly(
    z.object({
      query: z.optional(z.string()),
    }),
  ),
});
