import {
  type FieldPath,
  type FieldValues,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormProps,
  useForm as useNativeForm,
} from "react-hook-form";
import { HttpError } from "../models/http/http-error";
import { useCallback, useEffect, type BaseSyntheticEvent } from "react";

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>(props?: UseFormProps<TFieldValues, TContext, TTransformedValues>) {
  const {
    formState: { isSubmitSuccessful, isSubmitting, ...formState },
    handleSubmit: nativeHandleSubmit,
    reset,
    setError,
    ...form
  } = useNativeForm<TFieldValues, TContext, TTransformedValues>(props);

  const handleSubmit = useCallback(
    (
      onValid: SubmitHandler<TTransformedValues>,
      onInvalid?: SubmitErrorHandler<TFieldValues>,
    ): ((syntheticEvent?: BaseSyntheticEvent) => Promise<void>) =>
      nativeHandleSubmit(async (data, event) => {
        try {
          return await onValid(data, event);
        } catch (error: unknown) {
          if (!(error instanceof HttpError)) {
            throw error;
          }

          const response = error?.response;
          if (
            typeof response === "string" ||
            "message" in response ||
            "error" in response
          ) {
            setError("root", { message: error.message });
          } else {
            Object.entries(Object.groupBy(response, ({ property }) => property))
              .map(
                ([property, messages]) =>
                  [
                    property,
                    Object.fromEntries(
                      messages?.map(({ message, category }) => [
                        category,
                        message,
                      ]) ?? [],
                    ),
                  ] as const,
              )
              .forEach(([property, messages]) =>
                setError(property as FieldPath<TFieldValues>, {
                  types: messages,
                }),
              );
          }
        }
      }, onInvalid),
    [nativeHandleSubmit, setError],
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return {
    formState: { isSubmitSuccessful, isSubmitting, ...formState },
    handleSubmit,
    reset,
    ...form,
  };
}
