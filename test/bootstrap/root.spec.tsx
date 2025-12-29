import { userEvent } from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { mockUser } from "../__mocks/models/users/mock-user";
import { renderRoute } from "../__mocks/bootstrap/render-route";

describe("Root", () => {
  beforeEach(() => {
    // Clear local storage
    localStorage.clear();
  });

  it("renders not-found page", async () => {
    await mockUser();

    renderRoute("/missing");

    expect(
      await screen.findByText(/errors\.notFound\.unknown\.subtitle/i),
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: /errors\.notFound\.unknown\.button/i,
      }),
    ).toBeVisible();
  });

  it("renders error page", async () => {
    await mockUser({ unauthorized: true });

    renderRoute("/");

    expect(await screen.findByText(/unauthorized/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /refresh/i })).toBeVisible();
  });

  it("presses Go to Home button", async () => {
    await mockUser();

    const user = userEvent.setup();
    const { history } = renderRoute("/missing");

    const goHomeButton = await screen.findByRole("button", {
      name: /errors\.notFound\.unknown\.button/i,
    });

    await user.click(goHomeButton);

    await waitFor(() => expect(history.location.pathname).toBe("/"));
    expect(
      await screen.findByRole("img", { name: /scoutdesk/i }),
    ).toBeVisible();
  });
});
