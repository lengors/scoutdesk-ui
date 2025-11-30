import { act, screen } from "@testing-library/react";
import { mockUser } from "../__mocks/models/users/mock-user";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("bootstrap", () => {
  beforeEach(() => (document.body.innerHTML = ""));

  afterEach(() => vi.resetModules());

  it("renders application", async () => {
    mockUser();

    const root = document.createElement("div");
    root.id = "root";
    document.body.append(root);

    await act(async () => await import("../../src/bootstrap/bootstrap"));
    expect(
      await screen.findByRole("img", { name: /scoutdesk/i }),
    ).toBeVisible();
  });

  it("skips rendering application", async () => {
    await act(() => import("../../src/bootstrap/bootstrap"));
    expect(screen.queryByRole("img", { name: /scoutdesk/i })).toBeNullable();
  });
});
