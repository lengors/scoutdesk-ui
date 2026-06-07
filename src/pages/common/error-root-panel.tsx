import type { ErrorComponentProps } from "@tanstack/react-router";

import { Fragment } from "react";
import { ErrorPanel } from "./error-panel";
import { PendingPanel } from "./pending-panel";
import { useTranslation } from "react-i18next";
import { HttpChallenge } from "../../models/http/http-challenge-error";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export function ErrorRootPanel({
  error,
}: ErrorComponentProps<Error | HttpChallenge>) {
  const { t } = useTranslation();
  return (
    <Fragment>
      {error === HttpChallenge ? (
        <PendingPanel>{t("common.loginRedirect")}</PendingPanel>
      ) : (
        <ErrorPanel error={error} />
      )}
      <TanStackRouterDevtools />
    </Fragment>
  );
}
