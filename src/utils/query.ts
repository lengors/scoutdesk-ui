import type {
  DefaultError,
  FetchQueryOptions,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";

import { notFound } from "@tanstack/react-router";
import { HttpError } from "../models/http/http-error";

export async function fetchQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
>(
  queryClient: QueryClient,
  options: FetchQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): Promise<void> {
  try {
    await queryClient.fetchQuery(options);
  } catch (error: unknown) {
    if (!(error instanceof HttpError)) {
      throw error;
    }
    throw error?.status === 404 ? notFound() : error;
  }
}
