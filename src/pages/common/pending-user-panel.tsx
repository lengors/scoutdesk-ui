import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { PendingPanel } from "./pending-panel";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export function PendingUserPanel() {
  const { t } = useTranslation();
  return (
    <Fragment>
      <PendingPanel>{t("common.loadingUser")}</PendingPanel>
      <TanStackRouterDevtools />
    </Fragment>
  );
}
