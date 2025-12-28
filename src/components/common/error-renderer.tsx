import type { ErrorMessage } from "../../models/errors/error-message";
import type { NotificationLevel } from "../../models/notifications/notification-level";

import { Badge } from "react-bootstrap";
import { HttpError } from "../../models/http/http-error";

export interface ErrorRendererProps {
  readonly level?: NotificationLevel;
  readonly message: ErrorMessage;
}

export function ErrorRenderer({ level, message }: ErrorRendererProps) {
  if (typeof message === "string") {
    return message;
  }

  if (message instanceof Error && !(message instanceof HttpError)) {
    return message.message;
  }

  if (!("status" in message)) {
    return (
      <div className="d-flex flex-column gap-2">
        <div>{message.message ?? "An unknown error occurred."}</div>

        {(message.subject !== undefined || message.tag !== undefined) && (
          <div className="align-items-center d-flex justify-content-between">
            {message.subject !== undefined && (
              <div className="small text-muted">{message.subject}</div>
            )}

            {message.tag !== undefined && (
              <Badge
                bg={level === "error" ? "danger" : (level ?? "secondary")}
                className="ms-auto"
                pill
              >
                {message.tag}
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  }

  if (typeof message.response === "string") {
    return message.response;
  }

  if ("message" in message.response) {
    return message.response.message;
  }

  if ("error" in message.response) {
    return message.response.error;
  }

  return (
    <ul>
      {message.response.map(({ property, message }, index) => (
        <li key={index}>{`${property}: ${message}`}</li>
      ))}
    </ul>
  );
}
