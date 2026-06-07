import type { HttpStream } from "../../models/http/http-stream";
import type { HttpResponseParser } from "../http/http-response-parser";
import type { HttpServiceRequestConfig } from "../../models/http/http-service-request-config";

import { HttpService } from "../http/http-service";
import { type AxiosResponse, isAxiosError } from "axios";
import { HttpError } from "../../models/http/http-error";
import { HttpStatusCode } from "../../models/http/http-status-code";
import { HttpChallenge } from "../../models/http/http-challenge-error";
import { HttpFailureResponse } from "../../models/http/http-failure-response";
import {
  type EventSourceMessage,
  EventSourceParserStream,
} from "eventsource-parser/stream";

import axios from "axios";

export class AxiosHttpService implements HttpService {
  readonly #axios = axios.create({
    adapter: "fetch",
    baseURL: "/api/v1",
  });

  constructor() {
    this.#axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!isAxiosError(error) || error.response?.status !== 401) {
          return Promise.reject(error);
        }

        location.assign(
          `/auth/challenge?redirect=${encodeURIComponent(
            `${location.pathname}${location.search}${location.hash}`,
          )}`,
        );

        return Promise.reject(HttpChallenge);
      },
    );
  }

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
  delete<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig?:
      | HttpServiceRequestConfig<"json">
      | HttpServiceRequestConfig<"stream">,
  ): Promise<TOutput | HttpStream<TOutput>> {
    return AxiosHttpService.#handleResponse(
      this.#axios.delete(url, requestConfig),
      parser,
    );
  }

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
  get<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig?:
      | HttpServiceRequestConfig<"json">
      | HttpServiceRequestConfig<"stream">,
  ): Promise<TOutput | HttpStream<TOutput>> {
    return AxiosHttpService.#handleResponse(
      this.#axios.get(url, requestConfig),
      parser,
    );
  }

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
  patch<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?:
      | HttpServiceRequestConfig<"json">
      | HttpServiceRequestConfig<"stream">,
  ): Promise<TOutput | HttpStream<TOutput>> {
    return AxiosHttpService.#handleResponse(
      this.#axios.patch(url, data, requestConfig),
      parser,
    );
  }

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
  patchForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?:
      | HttpServiceRequestConfig<"json">
      | HttpServiceRequestConfig<"stream">,
  ): Promise<TOutput | HttpStream<TOutput>> {
    return AxiosHttpService.#handleResponse(
      this.#axios.patchForm(url, data, requestConfig),
      parser,
    );
  }

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
  post<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?:
      | HttpServiceRequestConfig<"json">
      | HttpServiceRequestConfig<"stream">,
  ): Promise<TOutput | HttpStream<TOutput>> {
    return AxiosHttpService.#handleResponse(
      this.#axios.post(url, data, requestConfig),
      parser,
    );
  }

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
  postForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?:
      | HttpServiceRequestConfig<"json">
      | HttpServiceRequestConfig<"stream">,
  ): Promise<TOutput | HttpStream<TOutput>> {
    return AxiosHttpService.#handleResponse(
      this.#axios.postForm(url, data, requestConfig),
      parser,
    );
  }

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
  put<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?:
      | HttpServiceRequestConfig<"json">
      | HttpServiceRequestConfig<"stream">,
  ): Promise<TOutput | HttpStream<TOutput>> {
    return AxiosHttpService.#handleResponse(
      this.#axios.put(url, data, requestConfig),
      parser,
    );
  }

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
  putForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data: unknown,
    requestConfig?:
      | HttpServiceRequestConfig<"json">
      | HttpServiceRequestConfig<"stream">,
  ): Promise<TOutput | HttpStream<TOutput>> {
    return AxiosHttpService.#handleResponse(
      this.#axios.putForm(url, data, requestConfig),
      parser,
    );
  }

  static async #handleResponse<TOutput>(
    response: Promise<AxiosResponse> | AxiosResponse,
    parser: HttpResponseParser<TOutput>,
  ) {
    const resolvedParser = HttpService.resolveParser(parser);

    try {
      const resolvedResponse = await response;
      if (resolvedResponse.config.responseType !== "stream") {
        return await resolvedParser(resolvedResponse.data);
      }

      const stream = new Response(resolvedResponse.data);
      const reader = stream.body
        ?.pipeThrough(new TextDecoderStream())
        ?.pipeThrough(new EventSourceParserStream())
        ?.getReader();
      if (reader === undefined) {
        return await resolvedParser(resolvedResponse.data);
      }

      return AxiosHttpService.#handleStreamResponse(reader, resolvedParser);
    } catch (error) {
      if (isAxiosError(error) && error.response !== undefined) {
        throw new HttpError(
          {
            status: await HttpStatusCode.parseAsync(error.status),
            response: await HttpFailureResponse.parseAsync(error.response.data),
          },
          error,
        );
      } else {
        throw error;
      }
    }
  }

  static async *#handleStreamResponse<TOutput>(
    reader: ReadableStreamDefaultReader<EventSourceMessage>,
    parser: (value: unknown) => TOutput | Promise<TOutput>,
  ) {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      try {
        const data = JSON.parse(value.data);
        yield { value: await parser(data) } as const;
      } catch (error) {
        yield { error } as const;
      }
    }
  }
}
