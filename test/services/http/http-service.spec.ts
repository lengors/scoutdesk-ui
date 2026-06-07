import { toFormData } from "axios";
import { describe, expect, it, vi } from "vitest";
import { HttpError } from "../../../src/models/http/http-error";
import { mockServer } from "../../__mocks/containers/mock-server";
import { httpService } from "../../../src/services/http/http-provider";

describe("AxiosHttpService", () => {
  const parser = vi.fn((data: unknown) => data);

  it("resolves DELETE requests", async () => {
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: "DELETE",
        path: "/api/v1/resource",
      },
      httpResponse: {
        statusCode: 200,
        body: { deleted: true },
      },
    });

    await expect(httpService.delete("/resource", parser)).resolves.toEqual({
      deleted: true,
    });
  });

  it("rejects GET requests", async () => {
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: "GET",
        path: "/api/v1/resource",
      },
      httpResponse: {
        statusCode: 403,
        body: { message: "Forbidden" },
      },
    });

    await expect(
      httpService.get("/resource", (response) => response),
    ).rejects.toThrow(HttpError);

    await expect(
      httpService.get("/resource", (response) => response),
    ).rejects.toMatchObject({
      status: 403,
      response: { message: "Forbidden" },
    });
  });

  it("resolves GET requests", async () => {
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: "GET",
        path: "/api/v1/resource",
      },
      httpResponse: {
        statusCode: 200,
        body: { id: 1 },
      },
    });

    await expect(httpService.get("/resource", parser)).resolves.toEqual({
      id: 1,
    });
  });

  it("resolves PATCH requests", async () => {
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: "PATCH",
        path: "/api/v1/resource",
        body: { name: "Scout" },
        headers: {
          "Content-Type": "application/json",
        },
      },
      httpResponse: {
        statusCode: 200,
        body: { created: true },
      },
    });

    await expect(
      httpService.patch("/resource", parser, { name: "Scout" }),
    ).resolves.toEqual({ created: true });
  });

  it("resolves Form PATCH requests", async () => {
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: "PATCH",
        path: "/api/v1/resource",
        headers: {
          "Content-Type": "multipart/form-data.*",
        },
        body: {
          type: "REGEX",
          regex: '.*?name="name".*?Scout.*',
        },
      },
      httpResponse: {
        statusCode: 200,
        body: { created: true },
      },
    });

    await expect(
      httpService.patchForm(
        "/resource",
        parser,
        toFormData({ name: "Scout" }, new FormData()),
      ),
    ).resolves.toEqual({ created: true });
  });

  it("resolves POST requests", async () => {
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: "POST",
        path: "/api/v1/resource",
        body: { name: "Scout" },
        headers: {
          "Content-Type": "application/json",
        },
      },
      httpResponse: {
        statusCode: 200,
        body: { created: true },
      },
    });

    await expect(
      httpService.post("/resource", parser, { name: "Scout" }),
    ).resolves.toEqual({ created: true });
  });

  it("resolves Form POST requests", async () => {
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: "POST",
        path: "/api/v1/resource",
        headers: {
          "Content-Type": "multipart/form-data.*",
        },
        body: {
          type: "REGEX",
          regex: '.*?name="name".*?Scout.*',
        },
      },
      httpResponse: {
        statusCode: 200,
        body: { created: true },
      },
    });

    await expect(
      httpService.postForm(
        "/resource",
        parser,
        toFormData({ name: "Scout" }, new FormData()),
      ),
    ).resolves.toEqual({ created: true });
  });

  it("resolves PUT requests", async () => {
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: "PUT",
        path: "/api/v1/resource",
        body: { name: "Scout" },
        headers: {
          "Content-Type": "application/json",
        },
      },
      httpResponse: {
        statusCode: 200,
        body: { created: true },
      },
    });

    await expect(
      httpService.put("/resource", parser, { name: "Scout" }),
    ).resolves.toEqual({ created: true });
  });

  it("resolves Form PUT requests", async () => {
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: "PUT",
        path: "/api/v1/resource",
        headers: {
          "Content-Type": "multipart/form-data.*",
        },
        body: {
          type: "REGEX",
          regex: '.*?name="name".*?Scout.*',
        },
      },
      httpResponse: {
        statusCode: 200,
        body: { created: true },
      },
    });

    await expect(
      httpService.putForm(
        "/resource",
        parser,
        toFormData({ name: "Scout" }, new FormData()),
      ),
    ).resolves.toEqual({ created: true });
  });
});
