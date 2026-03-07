import type { ErrorMessage } from "../../models/errors/error-message";

import { useTranslation } from "react-i18next";
import { HttpError } from "../../models/http/http-error";
import { ErrorIndicator } from "../../components/common/error-indicator";

export interface ErrorPanelProps {
  readonly error: ErrorMessage;
}

export function ErrorPanel({ error }: ErrorPanelProps) {
  const { t } = useTranslation();
  return (
    <ErrorIndicator
      {...(typeof error === "object" &&
      (!(error instanceof Error) || error instanceof HttpError) &&
      "status" in error
        ? { title: error.status }
        : {})}
      message={error}
      onClick={() => window.location.reload()}
    >
      {t("common.refresh")}
    </ErrorIndicator>
  );
}
