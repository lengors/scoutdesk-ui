import type { ErrorMessage } from "../../models/errors/error-message";

import { HttpError } from "../../models/http/http-error";
import { ErrorIndicator } from "../../components/common/error-indicator";

export interface ErrorPanelProps {
  readonly error: ErrorMessage;
}

export function ErrorPanel({ error }: ErrorPanelProps) {
  return (
    <ErrorIndicator
      {...(typeof error !== "string" &&
      (!(error instanceof Error) || error instanceof HttpError)
        ? { title: error.status }
        : {})}
      message={error}
      onClick={() => window.location.reload()}
    >
      Refresh
    </ErrorIndicator>
  );
}
