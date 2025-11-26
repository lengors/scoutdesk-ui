import type { Register } from "@tanstack/react-router";
import type { ErrorIndicatorProps } from "../components/common/error-indicator";

import { NotFoundRoute } from "../models/errors/not-found-route";

export const NOT_FOUND_ROUTE_CONFIG = {
  [NotFoundRoute.UNKNOWN]: {
    children: "Go to Home",
    message:
      "Oops! The page you're looking for doesn't exist or has been moved.",
    subtitle: "Page Not Found!",
    to: "/",
  },
} as const satisfies Record<
  string,
  ErrorIndicatorProps<Register["router"], string, string | undefined>
>;
