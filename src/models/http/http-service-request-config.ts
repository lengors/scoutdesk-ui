import type { HttpRequestConfig } from "./http-request-config";

export type HttpServiceRequestConfig<
  TResponseType extends "json" | "stream" = "json",
> = ([TResponseType] extends ["stream"]
  ? {
      readonly responseType: "stream";
    }
  : [TResponseType] extends ["json"]
    ? {
        readonly responseType?: "json";
      }
    : never) & {
  readonly params?: unknown;
} & HttpRequestConfig;
