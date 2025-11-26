import type {
  FetchQueryOptions,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { HttpError } from "../../src/models/http/http-error";
import { fetchLoaderQuery } from "../../src/utils/loader-query";

const notFoundSymbol = Symbol();

describe("fetchLoaderQuery", () => {
  it("rethrows non-HttpError failures", async () => {
    const failure = new Error("boom");
    const result = Promise.reject(failure);

    await expect(
      fetchLoaderQuery(
        {
          fetchQuery: vi.fn().mockReturnValue(result),
        } as unknown as QueryClient,
        {
          queryKey: ["test"] as QueryKey,
          queryFn: vi.fn(),
        } as FetchQueryOptions,
      ),
    ).rejects.toBe(failure);
  });

  it("throws the router notFound result when the status is 404", async () => {
    vi.mock("@tanstack/react-router", async () => {
      const actual = await vi.importActual<
        typeof import("@tanstack/react-router")
      >("@tanstack/react-router");
      return {
        ...actual,
        notFound: vi.fn(() => notFoundSymbol),
      };
    });

    const { notFound } = await import("@tanstack/react-router");

    const httpError = new HttpError({
      response: { message: "missing" },
      status: 404,
    });
    const result = Promise.reject(httpError);

    await expect(
      fetchLoaderQuery(
        {
          fetchQuery: vi.fn().mockReturnValue(result),
        } as unknown as QueryClient,
        {
          queryKey: ["test"] as QueryKey,
          queryFn: vi.fn(),
        } as FetchQueryOptions,
      ),
    ).rejects.toBe(notFoundSymbol);
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
