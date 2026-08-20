import { describe, expect, it } from "vitest";
import type { GameTheme } from "../GameTheme.js";
import { CanvasGameRenderer } from "./CanvasGameRenderer.js";

const initialTheme: GameTheme = {
  colors: {
    background: "background",
    player: "player",
    enemy: "enemy",
    projectile: "projectile",
    effect: "effect",
  },
};

describe("CanvasGameRenderer", () => {
  it("owns the mounted canvas and accepts host theme changes", () => {
    const canvas = {} as HTMLCanvasElement;
    const renderer = new CanvasGameRenderer({ canvas, theme: initialTheme });
    const replacementTheme: GameTheme = {
      colors: { ...initialTheme.colors, player: "replacement-player" },
    };

    expect(renderer.mountedCanvas).toBe(canvas);
    expect(renderer.currentTheme).toBe(initialTheme);

    renderer.setTheme(replacementTheme);
    expect(renderer.currentTheme).toBe(replacementTheme);
  });

  it("releases host resources and ignores later theme changes", () => {
    const renderer = new CanvasGameRenderer({
      canvas: {} as HTMLCanvasElement,
      theme: initialTheme,
    });

    renderer.destroy();
    renderer.setTheme(initialTheme);

    expect(renderer.mountedCanvas).toBeNull();
    expect(renderer.currentTheme).toBeNull();
  });
});
