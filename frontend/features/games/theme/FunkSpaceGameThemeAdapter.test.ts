import { describe, expect, it, vi } from "vitest";
import type {
  ThemeService,
  ThemeSubscriber,
} from "@/application/theme/ThemeService";
import { FunkSpaceGameThemeAdapter } from "./FunkSpaceGameThemeAdapter";

type ThemeSource = Pick<ThemeService, "getCurrentTheme" | "subscribe">;

function createThemeSource(
  resolvedTheme: ReturnType<ThemeService["getCurrentTheme"]> = "default",
): ThemeSource {
  return {
    getCurrentTheme: vi.fn(() => resolvedTheme),
    subscribe: vi.fn((callback: ThemeSubscriber) => {
      callback({ selectedTheme: resolvedTheme, resolvedTheme });
      return vi.fn();
    }),
  };
}

describe("FunkSpaceGameThemeAdapter", () => {
  it("converts FunkSpace game color tokens into a clean GameTheme", () => {
    const adapter = new FunkSpaceGameThemeAdapter(createThemeSource());

    expect(adapter.toGameTheme("dark-high-contrast")).toEqual({
      colors: {
        background: "#000000",
        player: "#4abaff",
        enemy: "#ff8284",
        projectile: "#fffd82",
        effect: "#82ffea",
      },
    });
  });

  it("returns resolved values for every supported FunkSpace theme", () => {
    const adapter = new FunkSpaceGameThemeAdapter(createThemeSource());

    for (const theme of [
      "default",
      "dark",
      "muted",
      "dark-high-contrast",
    ] as const) {
      const gameTheme = adapter.toGameTheme(theme);

      expect(Object.isFrozen(gameTheme)).toBe(true);
      expect(Object.isFrozen(gameTheme.colors)).toBe(true);
      expect(Object.values(gameTheme.colors)).toHaveLength(5);
      expect(
        Object.values(gameTheme.colors).every((value) =>
          /^#[\da-f]{6}$/i.test(value),
        ),
      ).toBe(true);
      expect(
        Object.values(gameTheme.colors).every(
          (value) => !value.includes("var("),
        ),
      ).toBe(true);
    }
  });

  it("converts the current resolved portfolio theme", () => {
    const adapter = new FunkSpaceGameThemeAdapter(createThemeSource("dark"));

    expect(adapter.getCurrentTheme()).toEqual({
      colors: {
        background: "#1a1a1a",
        player: "#3b94cc",
        enemy: "#cc686a",
        projectile: "#ccca68",
        effect: "#68ccbb",
      },
    });
  });

  it("maps theme subscriptions and preserves their cleanup", () => {
    const cleanup = vi.fn();
    const themeSubscribers: ThemeSubscriber[] = [];
    const themeSource: ThemeSource = {
      getCurrentTheme: vi.fn(() => "default" as const),
      subscribe: vi.fn((callback) => {
        themeSubscribers.push(callback);
        return cleanup;
      }),
    };
    const adapter = new FunkSpaceGameThemeAdapter(themeSource);
    const gameSubscriber = vi.fn();

    const unsubscribe = adapter.subscribe(gameSubscriber);
    themeSubscribers[0]({ selectedTheme: "system", resolvedTheme: "dark" });

    expect(gameSubscriber).toHaveBeenCalledWith({
      colors: {
        background: "#1a1a1a",
        player: "#3b94cc",
        enemy: "#cc686a",
        projectile: "#ccca68",
        effect: "#68ccbb",
      },
    });

    unsubscribe();
    expect(cleanup).toHaveBeenCalledOnce();
  });
});
