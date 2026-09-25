import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PortfolioNavigation from "./PortfolioNavigation";
import MotionChoices from "./MotionChoices";

vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: () => ({
    bindDialog: (
      node: HTMLDialogElement,
      options: { onCloseRequest(reason: string): void },
    ) => ({
      sync: (open: boolean) => {
        node.open = open;
      },
      destroy: () => {},
      requestClose: () => options.onCloseRequest("close"),
    }),
    themeService: {
      subscribe: (callback: (state: { selectedTheme: string }) => void) => {
        callback({ selectedTheme: "dark" });
        return () => {};
      },
      setTheme: vi.fn(),
    },
  }),
}));

describe("Portfolio navigation composition", () => {
  it("opens Navigation with native destinations, disabled future categories and an icon-only named trigger", async () => {
    const user = userEvent.setup();
    render(<PortfolioNavigation />);
    const menu = screen.getByRole("button", {
      name: "Menu: navigation and settings",
    });
    expect(menu.textContent).toBe("");
    await user.click(menu);
    const dialog = within(
      screen.getByRole("dialog", { name: "Navigation and settings" }),
    );
    expect(
      dialog.getByRole("button", {
        name: "Menu: close navigation and settings",
      }).textContent,
    ).toBe("");
    expect(dialog.getByRole("button", { name: "Navigation" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    for (const [label, href] of [
      ["Home", "/"],
      ["About", "/about"],
      ["Contact", "/#contact"],
    ]) {
      expect(dialog.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }
    await user.click(dialog.getByText("Privacy", { exact: true }));
    expect(
      dialog.getByRole("link", { name: "Privacy policy" }),
    ).toHaveAttribute("href", "/privacy");
    expect(dialog.getByRole("link", { name: "Legal notice" })).toHaveAttribute(
      "href",
      "/impressum",
    );
    for (const name of ["Chat-bot", "Languages"])
      expect(dialog.getByRole("button", { name })).toBeDisabled();
    expect(dialog.queryByRole("menu")).toBeNull();
    expect(dialog.getAllByRole("link")).toHaveLength(5);
    await user.click(dialog.getByRole("button", { name: "Accessibility" }));
    expect(dialog.getByRole("group", { name: "Appearance" })).toBeVisible();
    expect(dialog.queryByRole("group", { name: "Motion" })).toBeNull();
    expect(dialog.queryByRole("link")).toBeNull();
    await user.click(dialog.getByRole("button", { name: "Close" }));
    await user.click(menu);
    expect(
      screen.getByRole("button", { name: "Navigation", pressed: true }),
    ).toBeVisible();
  });

  it("offers Motion only with controlled input and does not invent an authority", () => {
    const onChange = vi.fn();
    const view = render(<MotionChoices value="system" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Off" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("off");
    expect(
      screen.getByRole("button", { name: "Follow system" }),
    ).toHaveAttribute("aria-pressed", "true");
    view.rerender(<MotionChoices value="off" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Off" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
