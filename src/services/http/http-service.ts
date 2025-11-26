import type { HttpResponseParser } from "./http-response-parser";
import type { HttpRequestConfig } from "../../models/http/http-request-config";

export interface HttpService {
  delete<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput>;

  get<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput>;

  patch<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput>;

  patchForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput>;

  post<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput>;

  postForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput>;

  put<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput>;

  putForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput>;
}

export const HttpService = {
  resolveParser<TOutput>(parser: HttpResponseParser<TOutput>) {
    if (typeof parser === "function") {
      return parser;
    } else if ("parseAsync" in parser) {
      return parser.parseAsync;
    } else {
      return parser.parse;
    }
  },
};
