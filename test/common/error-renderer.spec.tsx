import type { HttpFailureResponse } from "../../src/models/http/http-failure-response";

import { describe, expect, it } from "vitest";
import { HttpError } from "../../src/models/http/http-error";
import { render, screen, within } from "@testing-library/react";
import { ErrorRenderer } from "../../src/components/common/error-renderer";

describe("ErrorRenderer", () => {
  it("renders plain string messages", () => {
    render(<ErrorRenderer message="simple failure" />);

    expect(screen.getByText("simple failure")).toBeVisible();
  });

  it("renders generic Error messages", () => {
    const error = new Error("generic failure");

    render(<ErrorRenderer message={error} />);

    expect(screen.getByText("generic failure")).toBeVisible();
  });

  it("renders HttpError string responses", () => {
    render(<ErrorRenderer message={createHttpError("server exploded")} />);

    expect(screen.getByText("server exploded")).toBeVisible();
  });

  it("renders HttpError object responses", () => {
    render(
      <ErrorRenderer message={createHttpError({ message: "gone wrong" })} />,
    );

    expect(screen.getByText("gone wrong")).toBeVisible();
  });

  it("renders constraint violation lists", () => {
    render(
      <ErrorRenderer
        message={createHttpError([
          { property: "email", message: "invalid", category: "USER" },
          { property: "name", message: "too short", category: "USER" },
        ])}
      />,
    );

    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");

    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("email: invalid");
    expect(items[1]).toHaveTextContent("name: too short");
  });
});

function createHttpError(response: HttpFailureResponse) {
  return new HttpError({
    response,
    status: 500,
  });
}
