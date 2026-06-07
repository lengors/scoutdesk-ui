import type {
  FetchQueryOptions,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { fetchQuery } from "../../src/utils/query";
import { HttpError } from "../../src/models/http/http-error";

const notFoundSymbol = Symbol();

describe("ensureQueryData", () => {
  it("rethrows non-HttpError failures", async () => {
    const failure = new Error("boom");
    const result = Promise.reject(failure);

    await expect(
      fetchQuery(
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
      fetchQuery(
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
