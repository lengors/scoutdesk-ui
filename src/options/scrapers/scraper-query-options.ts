import type { ScraperEntry } from "../../models/scrapers/scraper-entry";
import type { HttpRequestConfig } from "../../models/http/http-request-config";

import {
  experimental_streamedQuery as streamedQuery,
  queryOptions,
  type QueryMeta,
} from "@tanstack/react-query";
import { DateTime } from "luxon";
import { scrapersKey } from "./scraper-keys";
import { scrap } from "../../services/scrapers/scraper-service";

export const scrapOptions = <TData>(
  searchTerm: string,
  profiles: ReadonlyArray<string>,
  {
    initialValue,
    reducer,
    reset,
  }: {
    readonly initialValue: TData;
    readonly reducer: (acc: TData, chunk: ScraperEntry) => TData;
    readonly reset?: (initialValue: TData) => unknown;
  },
) =>
  queryOptions({
    enabled: searchTerm.trim().length > 0 && profiles.length > 0,
    queryFn: streamedQuery({
      initialValue,
      reducer,
      streamFn: async function* ({
        meta,
        signal,
      }: HttpRequestConfig & {
        readonly meta?: QueryMeta;
      }) {
        reset?.(initialValue);
        for await (const entry of await scrap(
          {
            profiles,
            searchTerm,
          },
          { signal },
        )) {
          if ("error" in entry) {
            meta?.notificationStack?.pushNotification({
              level: "error",
              message: {
                message:
                  entry.error instanceof Error
                    ? entry.error.message
                    : `${entry.error}`,
                tag: "parse_error",
              },
              title: "Error parsing scraper entry",
            });
          } else if ("code" in entry.value) {
            meta?.notificationStack?.pushNotification({
              level: "error",
              message: {
                message: entry.value.message,
                subject:
                  entry.value.handlerName === undefined
                    ? undefined
                    : `Handler: ${entry.value.handlerName}`,
                tag: entry.value.code,
              },
              title: `Error on "${entry.value.specificationName}"`,
            });
          } else if (entry.value.price.unit !== "EUR") {
            meta?.notificationStack?.pushNotification({
              level: "warning",
              message: {
                message: `Price is in ${entry.value.price.unit}, support EUR only.`,
                tag: "unsupported_currency",
              },
              title: `Unexpected currency on "${entry.value.specificationName}"`,
            });
          } else {
            const { stocks, ...rest } = entry.value;
            yield stocks === undefined
              ? Object.assign(rest, { stocks: [] } as const)
              : ({
                  ...rest,
                  stocks: stocks?.map(({ deliveringOn, ...stockRest }) =>
                    deliveringOn === undefined
                      ? stockRest
                      : ({
                          ...stockRest,
                          deliveringOn:
                            "to" in deliveringOn
                              ? ({
                                  from: {
                                    value: DateTime.fromISO(
                                      deliveringOn.from.value,
                                    ),
                                    grain:
                                      `${deliveringOn.from.grain}s` as const,
                                  },
                                  to: {
                                    value: DateTime.fromISO(
                                      deliveringOn.to.value,
                                    ),
                                    grain: `${deliveringOn.to.grain}s` as const,
                                  },
                                } as const)
                              : ({
                                  value: DateTime.fromISO(deliveringOn.value),
                                  grain: `${deliveringOn.grain}s` as const,
                                } as const),
                        } as const),
                  ),
                } as const);
          }
        }
      },
    }),
    queryKey: scrapersKey(searchTerm, profiles),
  });
