import { afterAll, afterEach } from "vitest";
import { mockServerClient } from "mockserver-client";
import { MockserverContainer } from "@testcontainers/mockserver";
import { queryClient } from "../../../src/bootstrap/query-client-provider";

const mockServerContainer = await new MockserverContainer(
  "mockserver/mockserver:5.15.0",
).start();

const Request = globalThis.Request;
if (Request !== undefined) {
  const relativeFetchBaseUrl = `http://${mockServerContainer.getHost()}:${mockServerContainer.getMockserverPort()}`;
  globalThis.Request = class extends Request {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      super(
        typeof input === "string" && input.startsWith("/")
          ? new URL(input, relativeFetchBaseUrl)
          : input instanceof URL && input.href.startsWith("/")
            ? new URL(input.href, relativeFetchBaseUrl)
            : input,
        init,
      );
    }
  };
}

export const mockServer = mockServerClient(
  mockServerContainer.getHost(),
  mockServerContainer.getMockserverPort(),
);

afterAll(async () => await mockServerContainer.stop());

afterEach(async () => {
  //  Clear mock server expectations and requests
  await mockServer.reset();

  // Clear query client
  queryClient.clear();
});
