import type {
  DefaultError,
  MutationFunctionContext,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

import { HttpError } from "../../models/http/http-error";

export const mutationErrorOptions = <
  TVariables = unknown,
  TOnMutateResult = unknown,
>({
  skipErrorCheck = false,
  title,
}: {
  readonly skipErrorCheck?: boolean;
  readonly title:
    | NonNullable<ReactNode>
    | ((
        error: DefaultError,
        variables: TVariables,
        result: TOnMutateResult | undefined,
        context: MutationFunctionContext,
      ) => NonNullable<ReactNode>);
}) =>
  ({
    onError: (
      error: DefaultError,
      variables: TVariables,
      result: TOnMutateResult | undefined,
      context: MutationFunctionContext,
    ) => {
      if (
        skipErrorCheck ||
        (error instanceof HttpError &&
          (typeof error.response === "string" ||
            "message" in error.response ||
            "error" in error.response))
      ) {
        context.meta?.notificationStack?.pushNotification?.({
          delay: 10000,
          level: "error",
          message: error instanceof HttpError ? error : error.message,
          title:
            typeof title === "function"
              ? title(error, variables, result, context)
              : title,
        });
      }
    },
  }) as const;
