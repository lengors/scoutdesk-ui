import { z } from "zod/mini";
import { UserRole } from "./user-role";

export const User = z.readonly(
  z.object({
    username: z.string(),
    name: z.pipe(
      z.optional(z.string()),
      z.transform((value) => (value?.trim()?.length === 0 ? undefined : value)),
    ),
    roles: z.readonly(z.array(UserRole)),
    email: z.pipe(
      z.pipe(
        z.optional(z.string()),
        z.transform((value) =>
          value?.trim()?.length === 0 ? undefined : value,
        ),
      ),
      z.optional(z.email()),
    ),
    avatar: z.pipe(
      z.optional(z.string()),
      z.transform((value) => (value?.trim()?.length === 0 ? undefined : value)),
    ),
  }),
);

export type User = z.infer<typeof User>;
