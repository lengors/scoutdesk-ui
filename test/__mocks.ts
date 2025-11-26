import type { User } from "../src/models/users/user";
import type { HttpFailureResponse } from "../src/models/http/http-failure-response";

import { afterEach, beforeEach, expect, vi } from "vitest";
import { queryClient } from "../src/bootstrap/query-client-provider";

const fetchStub = vi.fn<typeof fetch>();

export async function assertMock(expected: {
  readonly body?: unknown;
  readonly method?: string;
  readonly url: string;
}) {
  const call = fetchStub.mock.calls.at(-1);
  expect(call).toBeDefined();

  const [input, init] = call as Parameters<typeof fetch>;

  if (expected.method !== undefined) {
    const actualMethod =
      typeof init?.method === "string"
        ? init.method.toUpperCase()
        : input instanceof Request
          ? input.method.toUpperCase()
          : undefined;
    expect(actualMethod).toBe(expected.method);
  }

  const actualUrl =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input?.url;
  expect(actualUrl).not.toBeUndefined();
  expect(actualUrl?.endsWith(expected.url)).toBeTruthy();

  if (expected.body !== undefined) {
    expect(input).toBeInstanceOf(Request);
    const request = input as Request;
    const contentType = request.headers.get("content-type");

    const body =
      contentType?.includes("multipart/form-data") === true
        ? Object.fromEntries([...(await request.formData())])
        : await request.json();

    expect(body).toBeDefined();
    expect(body).toEqual(expected.body);
  }
}

function createJsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

function createUserResponse() {
  return createJsonResponse(
    {
      avatar: "https://cdn.scoutdesk.dev/assets/avatar.png",
      email: "scoutdesk@example.com",
      name: "Scout Desk",
      roles: ["admin"],
      username: "scoutdesk",
    } satisfies User,
    { status: 200, statusText: "OK" },
  );
}

export function mockError(status: number, body: HttpFailureResponse) {
  mockPayload({ body, status });
}

export function mockPayload({
  body,
  status = 200,
}:
  | { readonly body: unknown; readonly status?: never }
  | { readonly body: HttpFailureResponse; readonly status: number }) {
  fetchStub.mockResolvedValueOnce(createJsonResponse(body, { status }));
}

export function mockPending() {
  let resolve!: (value: Response) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<Response>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  fetchStub.mockReturnValueOnce(promise);

  return {
    resolve: () => resolve(createUserResponse()),
    reject,
  } as const;
}

export function mockUser() {
  fetchStub.mockResolvedValueOnce(createUserResponse());
}

beforeEach(async () => {
  // Stub fetch globally
  vi.stubGlobal("fetch", fetchStub);
});

afterEach(async () => {
  // Clear all mocks before each test
  vi.clearAllMocks();

  // Unstub globals
  vi.unstubAllGlobals();

  // Clear query client cache
  queryClient.clear();
});
