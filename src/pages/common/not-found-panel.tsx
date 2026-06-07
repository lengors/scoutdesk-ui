import type { NotFoundRouteProps } from "@tanstack/react-router";

import { useTranslation } from "react-i18next";
import { NotFoundRoute } from "../../models/errors/not-found-route";
import { ErrorIndicator } from "../../components/common/error-indicator";
import { NOT_FOUND_ROUTE_CONFIG } from "../../configs/not-found-route-config";

export type NotFoundPanelProps = Readonly<Partial<NotFoundRouteProps>>;

export function NotFoundPanel({ routeId }: NotFoundPanelProps) {
  const { t } = useTranslation();
  const notFoundRoute: NotFoundRoute =
    Object.values(NotFoundRoute).find(
      (key) =>
        typeof key === "string" && routeId?.startsWith(`/${key}/`) === true,
    ) ?? NotFoundRoute.UNKNOWN;

  const selectedRoute =
    notFoundRoute === NotFoundRoute.UNKNOWN ? "unknown" : notFoundRoute;
  return (
    <ErrorIndicator
      message={t(`errors.notFound.${selectedRoute}.message`)}
      subtitle={t(`errors.notFound.${selectedRoute}.subtitle`)}
      title="404"
      to={NOT_FOUND_ROUTE_CONFIG[notFoundRoute]}
    >
      {t(`errors.notFound.${selectedRoute}.button`)}
    </ErrorIndicator>
  );
}
