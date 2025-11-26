import { Root } from "../../src/bootstrap/root";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { createMemoryHistory } from "@tanstack/react-router";
import { createRouter } from "../../src/bootstrap/router-provider";
import { act, render, screen, waitFor } from "@testing-library/react";
import { ENVIRONMENT_CONFIG } from "../../src/configs/environment-config";
import { assertMock, mockError, mockPending, mockUser } from "../__mocks";

describe("Root", () => {
  const themeStorageKey = `${ENVIRONMENT_CONFIG.VITE_STORAGE_NAMESPACE}.theme-preference`;

  beforeEach(() => {
    // Clear local storage
    localStorage.clear();
  });

  it("renders home page", async () => {
    mockUser();

    render(
      <Root
        router={createRouter({
          history: createMemoryHistory({ initialEntries: ["/"] }),
        })}
      />,
    );

    expect(
      await screen.findByRole("img", { name: /scoutdesk/i }),
    ).toBeVisible();

    const link = screen.getByRole("link", { hidden: true });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");

    await assertMock({ method: "GET", url: "/api/v1/users/me" });
  });

  it("renders not-found page", async () => {
    mockUser();

    render(
      <Root
        router={createRouter({
          history: createMemoryHistory({ initialEntries: ["/missing"] }),
        })}
      />,
    );

    expect(await screen.findByText(/page not found!/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /go to home/i })).toBeVisible();
  });

  it("renders error page", async () => {
    mockError(401, { message: "Unauthorized" });

    render(
      <Root
        router={createRouter({
          history: createMemoryHistory({ initialEntries: ["/"] }),
        })}
      />,
    );

    expect(await screen.findByText(/unauthorized/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /refresh/i })).toBeVisible();
  });

  it("render pending page", async () => {
    const { resolve } = mockPending();

    render(
      <Root
        router={createRouter({
          history: createMemoryHistory({ initialEntries: ["/"] }),
        })}
      />,
    );

    await waitFor(
      async () =>
        expect(
          await screen.findByText(/loading user data/i),
        ).toBeInTheDocument(),
      { timeout: 5000 },
    );

    resolve();
    expect(
      await screen.findByRole("img", { name: /scoutdesk/i }),
    ).toBeVisible();
  });

  it("displays theme toggler tooltip", async () => {
    mockUser();

    const user = userEvent.setup();
    render(
      <Root
        router={createRouter({
          history: createMemoryHistory({ initialEntries: ["/"] }),
        })}
      />,
    );

    const toggleButton = await screen.findByRole("button", {
      name: /toggle theme/i,
    });
    await user.hover(toggleButton);

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      /toggle theme/i,
    );
  });

  it("displays user profile tooltip", async () => {
    mockUser();

    const user = userEvent.setup();
    render(
      <Root
        router={createRouter({
          history: createMemoryHistory({ initialEntries: ["/"] }),
        })}
      />,
    );

    const profileButton = await screen.findByRole("button", {
      name: /open profile menu/i,
    });
    await user.click(profileButton);

    expect(await screen.findByText("Scout Desk")).toBeVisible();
    expect(screen.getByText(`@scoutdesk`)).toBeVisible();
  });

  it("presses Go to Home button", async () => {
    mockUser();

    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ["/missing"] });
    render(
      <Root
        router={createRouter({
          history,
        })}
      />,
    );

    const goHomeButton = await screen.findByRole("button", {
      name: /go to home/i,
    });

    await user.click(goHomeButton);

    await waitFor(() => expect(history.location.pathname).toBe("/"));
    expect(
      await screen.findByRole("img", { name: /scoutdesk/i }),
    ).toBeVisible();
  });

  it("cycles between dark and light theme preferences", async () => {
    mockUser();

    const user = userEvent.setup();
    render(
      <Root
        router={createRouter({
          history: createMemoryHistory({ initialEntries: ["/"] }),
        })}
      />,
    );

    let toggleButton = await screen.findByRole("button", {
      name: /toggle theme/i,
    });
    await user.click(toggleButton);
    await waitFor(() =>
      expect(localStorage.getItem(themeStorageKey)).toBe("dark"),
    );
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute("data-bs-theme", "dark"),
    );

    toggleButton = await screen.findByRole("button", {
      name: /toggle theme/i,
    });

    await user.click(toggleButton);
    await waitFor(() =>
      expect(localStorage.getItem(themeStorageKey)).toBe("light"),
    );
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute(
        "data-bs-theme",
        "light",
      ),
    );
  });

  it("syncs UI theme with system's theme", async () => {
    localStorage.setItem(themeStorageKey, "system");

    mockUser();
    render(
      <Root
        router={createRouter({
          history: createMemoryHistory({ initialEntries: ["/"] }),
        })}
      />,
    );

    const dispatchSystemThemeChange = (matches: boolean) => {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const event = new Event("change") as MediaQueryListEvent;
      Object.defineProperty(event, "matches", { value: matches });
      mediaQuery.dispatchEvent(event);
    };

    await act(async () => dispatchSystemThemeChange(true));
    expect(document.documentElement).toHaveAttribute("data-bs-theme", "dark");

    await act(async () => dispatchSystemThemeChange(false));
    expect(document.documentElement).toHaveAttribute("data-bs-theme", "light");
  });
});
