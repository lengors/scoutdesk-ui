import { z } from "zod/mini";

export const UserRole = z.enum(["admin", "developer", "user"]);

export type UserRole = z.infer<typeof UserRole>;
