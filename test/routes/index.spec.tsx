import { beforeEach, describe, expect, it } from "vitest";
import { mockUser } from "../__mocks/models/users/mock-user";
import { act, screen, waitFor } from "@testing-library/react";
import { renderRoute } from "../__mocks/bootstrap/render-route";
import { ENVIRONMENT_CONFIG } from "../../src/configs/environment-config";

import userEvent from "@testing-library/user-event";

describe("routes/index", () => {
  const themeStorageKey = `${ENVIRONMENT_CONFIG.VITE_STORAGE_NAMESPACE}.theme-preference`;

  beforeEach(() => {
    // Clear local storage
    localStorage.clear();
  });

  it("renders home page", async () => {
    await mockUser();

    renderRoute("/");

    expect(
      await screen.findByRole("img", { name: /scoutdesk/i }),
    ).toBeVisible();

    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("displays theme toggler tooltip", async () => {
    await mockUser();

    const user = userEvent.setup();
    renderRoute("/");

    const toggleButton = await screen.findByRole("button", {
      name: /toggleTheme/i,
    });
    await user.hover(toggleButton);

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      /toggleTheme/i,
    );
  });

  it("displays user profile tooltip", async () => {
    await mockUser();

    const user = userEvent.setup();
    renderRoute("/");

    const profileButton = await screen.findByRole("button", {
      name: /openProfileMenu/i,
    });
    await user.click(profileButton);

    expect(await screen.findByText("Scout Desk")).toBeVisible();
    expect(screen.getByText(`@scoutdesk`)).toBeVisible();
  });

  it("cycles between dark and light theme preferences", async () => {
    await mockUser();

    const user = userEvent.setup();
    renderRoute("/");

    let toggleButton = await screen.findByRole("button", {
      name: /toggleTheme/i,
    });
    await user.click(toggleButton);
    await waitFor(() =>
      expect(localStorage.getItem(themeStorageKey)).toBe("dark"),
    );
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute("data-bs-theme", "dark"),
    );

    toggleButton = await screen.findByRole("button", {
      name: /toggleTheme/i,
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

    await mockUser();

    renderRoute("/");

    const dispatchSystemThemeChange = (matches: boolean) => {
      const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
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
