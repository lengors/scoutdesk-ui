import type { HttpFailure } from "./http-failure";

export class HttpError extends Error implements HttpFailure {
  readonly #httpFailure: HttpFailure;

  constructor(httpFailure: HttpFailure, cause?: unknown) {
    super(
      `${httpFailure.status}: ${HttpError.#buildErrorMessage(httpFailure)}`,
      { cause },
    );
    this.#httpFailure = httpFailure;
    this.name = "HttpError";
  }

  get response() {
    return this.#httpFailure.response;
  }

  get status() {
    return this.#httpFailure.status;
  }

  static #buildErrorMessage(httpFailure: HttpFailure): string {
    if (typeof httpFailure.response === "string") {
      return httpFailure.response;
    }

    if ("message" in httpFailure.response) {
      return httpFailure.response.message;
    }

    if ("error" in httpFailure.response) {
      return httpFailure.response.error;
    }

    const constraintErrors = httpFailure.response.map(
      ({ property, message }) => `${property}: ${message}`,
    );

    return `${constraintErrors.join(", ")}`;
  }
}
