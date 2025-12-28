import type { HttpStream } from "../../models/http/http-stream";
import type { HttpResponseParser } from "./http-response-parser";
import type { HttpServiceRequestConfig } from "../../models/http/http-service-request-config";

export interface HttpService {
  delete<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig: HttpServiceRequestConfig<"stream">,
  ): Promise<HttpStream<TOutput>>;
  delete<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig?: HttpServiceRequestConfig<"json">,
  ): Promise<TOutput>;

  get<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig: HttpServiceRequestConfig<"stream">,
  ): Promise<HttpStream<TOutput>>;
  get<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig?: HttpServiceRequestConfig<"json">,
  ): Promise<TOutput>;

  patch<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig: HttpServiceRequestConfig<"stream">,
  ): Promise<HttpStream<TOutput>>;
  patch<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?: HttpServiceRequestConfig<"json">,
  ): Promise<TOutput>;

  patchForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig: HttpServiceRequestConfig<"stream">,
  ): Promise<HttpStream<TOutput>>;
  patchForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?: HttpServiceRequestConfig<"json">,
  ): Promise<TOutput>;

  post<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig: HttpServiceRequestConfig<"stream">,
  ): Promise<HttpStream<TOutput>>;
  post<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?: HttpServiceRequestConfig<"json">,
  ): Promise<TOutput>;

  postForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig: HttpServiceRequestConfig<"stream">,
  ): Promise<HttpStream<TOutput>>;
  postForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?: HttpServiceRequestConfig<"json">,
  ): Promise<TOutput>;

  put<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig: HttpServiceRequestConfig<"stream">,
  ): Promise<HttpStream<TOutput>>;
  put<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?: HttpServiceRequestConfig<"json">,
  ): Promise<TOutput>;

  putForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig: HttpServiceRequestConfig<"stream">,
  ): Promise<HttpStream<TOutput>>;
  putForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?: HttpServiceRequestConfig<"json">,
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
