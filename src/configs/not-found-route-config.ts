import type { Register, ToPathOption } from "@tanstack/react-router";

import { NotFoundRoute } from "../models/errors/not-found-route";

export const NOT_FOUND_ROUTE_CONFIG = {
  [NotFoundRoute.UNKNOWN]: "/",
  [NotFoundRoute.PROFILES]: "/profiles",
  [NotFoundRoute.SPECIFICATIONS]: "/specifications",
} as const satisfies Record<
  string,
  NonNullable<ToPathOption<Register["router"], string, string | undefined>>
>;
