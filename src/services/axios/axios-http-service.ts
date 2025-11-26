import type { HttpResponseParser } from "../http/http-response-parser";
import type { HttpRequestConfig } from "../../models/http/http-request-config";

import { HttpService } from "../http/http-service";
import { type AxiosResponse, isAxiosError } from "axios";
import { HttpError } from "../../models/http/http-error";
import { HttpStatusCode } from "../../models/http/http-status-code";
import { HttpFailureResponse } from "../../models/http/http-failure-response";

import axios from "axios";

export class AxiosHttpService implements HttpService {
  readonly #axios = axios.create({
    adapter: "fetch",
    baseURL: "/api/v1",
  });

  delete<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput> {
    return AxiosHttpService.#handleResponse(
      this.#axios.delete(url, requestConfig),
      parser,
    );
  }

  get<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput> {
    return AxiosHttpService.#handleResponse(
      this.#axios.get(url, requestConfig),
      parser,
    );
  }

  patch<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput> {
    return AxiosHttpService.#handleResponse(
      this.#axios.patch(url, data, requestConfig),
      parser,
    );
  }

  patchForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput> {
    return AxiosHttpService.#handleResponse(
      this.#axios.patchForm(url, data, requestConfig),
      parser,
    );
  }

  post<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput> {
    return AxiosHttpService.#handleResponse(
      this.#axios.post(url, data, requestConfig),
      parser,
    );
  }

  postForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput> {
    return AxiosHttpService.#handleResponse(
      this.#axios.postForm(url, data, requestConfig),
      parser,
    );
  }

  put<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput> {
    return AxiosHttpService.#handleResponse(
      this.#axios.put(url, data, requestConfig),
      parser,
    );
  }

  putForm<TOutput>(
    url: string,
    parser: HttpResponseParser<TOutput>,
    data?: unknown,
    requestConfig?: HttpRequestConfig,
  ): Promise<TOutput> {
    return AxiosHttpService.#handleResponse(
      this.#axios.putForm(url, data, requestConfig),
      parser,
    );
  }

  static #handleResponse<TOutput>(
    response: Promise<AxiosResponse> | AxiosResponse,
    parser: HttpResponseParser<TOutput>,
  ) {
    return Promise.resolve(response)
      .then((response) => response.data)
      .then(HttpService.resolveParser(parser))
      .catch(async (error) => {
        if (isAxiosError(error) && error.response !== undefined) {
          throw new HttpError(
            {
              status: await HttpStatusCode.parseAsync(error.status),
              response: await HttpFailureResponse.parseAsync(
                error.response.data,
              ),
            },
            error,
          );
        } else {
          throw error;
        }
      });
  }
}
