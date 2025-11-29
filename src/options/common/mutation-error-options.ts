import type { MutationFunctionContext } from "@tanstack/react-query";
import { HttpError } from "../../models/http/http-error";

export const mutationErrorOptions = <
  TVariables = void,
  TOnMutateResult = unknown,
>({
  title,
}: {
  readonly title:
    | string
    | ((
        error: Error,
        variables: TVariables,
        result: TOnMutateResult | undefined,
        context: MutationFunctionContext,
      ) => string);
}) =>
  ({
    onError: (
      error: Error,
      variables: TVariables,
      result: TOnMutateResult | undefined,
      context: MutationFunctionContext,
    ) =>
      context.meta?.notificationStack?.pushNotification?.({
        delay: 10000,
        level: "error",
        message: error instanceof HttpError ? error : error.message,
        title:
          typeof title === "function"
            ? title(error, variables, result, context)
            : title,
      }),
  }) as const;
