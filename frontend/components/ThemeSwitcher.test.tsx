import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ThemeSwitcher from "./ThemeSwitcher";

const themeService = vi.hoisted(() => ({
  subscribe: vi.fn(),
  setTheme: vi.fn(),
}));

let themeSubscriber:
  | ((state: { selectedTheme: string; resolvedTheme: string }) => void)
  | null = null;

vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: () => ({ themeService }),
}));

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    themeSubscriber = null;
    themeService.subscribe.mockReset();
    themeService.subscribe.mockImplementation((callback) => {
      themeSubscriber = callback;
      callback({ selectedTheme: "dark", resolvedTheme: "dark" });
      return vi.fn();
    });
    themeService.setTheme.mockReset();
    themeService.setTheme.mockImplementation((theme) => {
      themeSubscriber?.({ selectedTheme: theme, resolvedTheme: theme });
    });
  });

  it("renders domain theme choices and marks the stored selection", async () => {
    render(<ThemeSwitcher />);

    expect(screen.getByRole("button", { name: "System" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Default" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Dark" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Muted" })).toBeVisible();
    expect(screen.getByRole("button", { name: "High Contrast" })).toBeVisible();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
  });

  it("delegates selections and reacts through the service subscription", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    const mutedButton = screen.getByRole("button", { name: "Muted" });
    await user.click(mutedButton);

    expect(themeService.setTheme).toHaveBeenCalledOnce();
    expect(themeService.setTheme).toHaveBeenCalledWith("muted");
    expect(mutedButton).toHaveAttribute("aria-pressed", "true");
  });
});
