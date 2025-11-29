import type { ErrorMessage } from "../../models/errors/error-message";

import { HttpError } from "../../models/http/http-error";

export interface ErrorRendererProps {
  readonly message: ErrorMessage;
}

export function ErrorRenderer({ message }: ErrorRendererProps) {
  if (typeof message === "string") {
    return message;
  }

  if (message instanceof Error && !(message instanceof HttpError)) {
    return message.message;
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
