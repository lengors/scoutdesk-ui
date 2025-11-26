import { toFormData } from "axios";
import { describe, expect, it, vi } from "vitest";
import { HttpError } from "../../../src/models/http/http-error";
import { assertMock, mockError, mockPayload } from "../../__mocks";
import { httpService } from "../../../src/services/http/http-provider";

describe("AxiosHttpService", () => {
  const parser = vi.fn((data: unknown) => data);

  it("resolves DELETE requests", async () => {
    const payload = { deleted: true };
    mockPayload({ body: payload });

    await expect(httpService.delete("/resource", parser)).resolves.toEqual(
      payload,
    );
    expect(parser).toHaveBeenCalledWith(payload);

    await assertMock({ method: "DELETE", url: "/api/v1/resource" });
  });

  it("rejects GET requests", async () => {
    mockError(403, { message: "Forbidden" });
    await expect(
      httpService.get("/resource", (response) => response),
    ).rejects.toThrow(HttpError);

    mockError(403, { message: "Forbidden" });

    await expect(
      httpService.get("/resource", (response) => response),
    ).rejects.toMatchObject({
      status: 403,
      response: { message: "Forbidden" },
    });
  });

  it("resolves GET requests", async () => {
    const payload = { id: 1 };
    mockPayload({ body: payload });

    await expect(httpService.get("/resource", parser)).resolves.toEqual(
      payload,
    );
    expect(parser).toHaveBeenCalledWith(payload);

    await assertMock({ method: "GET", url: "/api/v1/resource" });
  });

  it("resolves PATCH requests", async () => {
    const payload = { created: true };
    mockPayload({ body: payload });

    const body = { name: "Scout" };
    await expect(httpService.patch("/resource", parser, body)).resolves.toEqual(
      payload,
    );
    expect(parser).toHaveBeenCalledWith(payload);

    await assertMock({
      method: "PATCH",
      url: "/api/v1/resource",
      body,
    });
  });

  it("resolves Form PATCH requests", async () => {
    const payload = { created: true };
    mockPayload({ body: payload });

    const body = { name: "Scout" };
    await expect(
      httpService.patchForm(
        "/resource",
        parser,
        toFormData(body, new FormData()),
      ),
    ).resolves.toEqual(payload);

    await assertMock({
      method: "PATCH",
      url: "/api/v1/resource",
      body,
    });
  });

  it("resolves POST requests", async () => {
    const payload = { created: true };
    mockPayload({ body: payload });

    const body = { name: "Scout" };
    await expect(httpService.post("/resource", parser, body)).resolves.toEqual(
      payload,
    );
    expect(parser).toHaveBeenCalledWith(payload);

    await assertMock({
      method: "POST",
      url: "/api/v1/resource",
      body,
    });
  });

  it("resolves Form POST requests", async () => {
    const payload = { created: true };
    mockPayload({ body: payload });

    const body = { name: "Scout" };
    await expect(
      httpService.postForm(
        "/resource",
        parser,
        toFormData(body, new FormData()),
      ),
    ).resolves.toEqual(payload);

    await assertMock({
      method: "POST",
      url: "/api/v1/resource",
      body,
    });
  });

  it("resolves PUT requests", async () => {
    const payload = { created: true };
    mockPayload({ body: payload });

    const body = { name: "Scout" };
    await expect(httpService.put("/resource", parser, body)).resolves.toEqual(
      payload,
    );
    expect(parser).toHaveBeenCalledWith(payload);

    await assertMock({
      method: "PUT",
      url: "/api/v1/resource",
      body,
    });
  });

  it("resolves Form PUT requests", async () => {
    const payload = { created: true };
    mockPayload({ body: payload });

    const body = { name: "Scout" };
    await expect(
      httpService.putForm(
        "/resource",
        parser,
        toFormData(body, new FormData()),
      ),
    ).resolves.toEqual(payload);

    await assertMock({
      method: "PUT",
      url: "/api/v1/resource",
      body,
    });
  });
});
