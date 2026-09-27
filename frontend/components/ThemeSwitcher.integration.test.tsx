import { StrictMode, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  ServiceProvider,
  useServices,
} from "@/application/providers/ServiceProvider";
import { FunkSpaceGameThemeAdapter } from "@/features/games/theme/FunkSpaceGameThemeAdapter";
import ThemeSwitcher from "./ThemeSwitcher";

function Fixture() {
  const [open, setOpen] = useState(true);
  const { themeService } = useServices();
  const [read, setRead] = useState("");
  return (
    <>
      <button onClick={() => setOpen(!open)}>Toggle settings</button>
      <button
        onClick={() => {
          const game = new FunkSpaceGameThemeAdapter(themeService);
          const stop = game.subscribe((theme) => {
            expect(theme).toEqual(game.getCurrentTheme());
          });
          stop();
          setRead(
            `${themeService.getCurrentTheme()}/${themeService.getStoredTheme()}`,
          );
        }}
      >
        Read themes
      </button>
      <output>{read}</output>
      {open && <ThemeSwitcher presentation="outlined" />}
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute("data-theme");
});

it.each(["write", "read-and-write"])(
  "keeps service-backed selection across real provider/switcher remount with denied %s",
  async (fault) => {
    localStorage.setItem("theme", "system");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    if (fault === "read-and-write")
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("denied");
      });
    const user = userEvent.setup();
    const view = render(
      <StrictMode>
        <ServiceProvider>
          <Fixture />
        </ServiceProvider>
      </StrictMode>,
    );
    await user.click(screen.getByRole("button", { name: "Dark" }));
    await user.click(screen.getByRole("button", { name: "Toggle settings" }));
    await user.click(screen.getByRole("button", { name: "Toggle settings" }));
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    await user.click(screen.getByRole("button", { name: "Read themes" }));
    expect(screen.getByRole("status")).toHaveTextContent("dark/system");
    view.unmount();
  },
);
