import { describe, expect, it } from "vitest";
import { HttpError } from "../../../src/models/http/http-error";

describe("HttpError", () => {
  it("includes string responses in the error message", () => {
    const error = new HttpError({ response: "Plain failure", status: 500 });

    expect(error.message).toBe("Plain failure");
    expect(error.response).toBe("Plain failure");
  });

  it("uses the response message property when available", () => {
    const error = new HttpError({ response: "Custom message", status: 400 });

    expect(error.message).toBe("Custom message");
    expect(error.status).toBe(400);
  });

  it("flattens constraint violations into the message", () => {
    const error = new HttpError({
      response: [
        { property: "email", message: "invalid", category: "main" },
        { property: "name", message: "required", category: "other" },
      ],
      status: 500,
    });

    expect(error.message).toBe(
      "Failed to validate constraints: email: invalid, name: required",
    );
  });
});
