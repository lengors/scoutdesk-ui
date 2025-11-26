import type { NotFoundRouteProps } from "@tanstack/react-router";

import { NotFoundRoute } from "../../models/errors/not-found-route";
import { ErrorIndicator } from "../../components/common/error-indicator";
import { NOT_FOUND_ROUTE_CONFIG } from "../../configs/not-found-route-config";

export type NotFoundPanelProps = Readonly<Partial<NotFoundRouteProps>>;

export function NotFoundPanel({ routeId }: NotFoundPanelProps) {
  const notFoundRoute: NotFoundRoute =
    Object.values(NotFoundRoute).find(
      (key) =>
        typeof key === "string" && routeId?.startsWith(`/${key}/`) === true,
    ) ?? NotFoundRoute.UNKNOWN;

  return (
    <ErrorIndicator title="404" {...NOT_FOUND_ROUTE_CONFIG[notFoundRoute]} />
  );
}
