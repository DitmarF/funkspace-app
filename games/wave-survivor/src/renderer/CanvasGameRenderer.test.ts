import { describe, expect, it, vi } from "vitest";
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

function createCanvas(displayWidth: number, displayHeight: number) {
  const context = {
    fillRect: vi.fn(),
    fillStyle: "",
    lineWidth: 0,
    setTransform: vi.fn(),
    strokeRect: vi.fn(),
    strokeStyle: "",
  } as unknown as CanvasRenderingContext2D;
  const canvas = {
    clientHeight: displayHeight,
    clientWidth: displayWidth,
    getContext: vi.fn(() => context),
    height: displayHeight,
    style: {
      display: "",
      height: "",
      margin: "",
      width: "",
    },
    width: displayWidth,
  } as unknown as HTMLCanvasElement;

  return { canvas, context };
}

describe("CanvasGameRenderer", () => {
  it("initializes a centered DPR-aware canvas in logical coordinates", () => {
    const { canvas, context } = createCanvas(390, 844);
    const renderer = new CanvasGameRenderer({ canvas, theme: initialTheme }, 2);

    expect(renderer.mountedCanvas).toBe(canvas);
    expect(renderer.currentTheme).toBe(initialTheme);
    expect(canvas.style.display).toBe("block");
    expect(Number.parseFloat(canvas.style.width)).toBeCloseTo(390);
    expect(Number.parseFloat(canvas.style.height)).toBeCloseTo(
      640 * (390 / 360),
    );
    expect(Number.parseFloat(canvas.style.margin)).toBeCloseTo(
      (844 - 640 * (390 / 360)) / 2,
    );
    expect(canvas.width).toBe(780);
    expect(canvas.height).toBe(1387);
    expect(context.setTransform).toHaveBeenCalledWith(
      2 * (390 / 360),
      0,
      0,
      2 * (390 / 360),
      0,
      0,
    );
    expect(context.fillStyle).toBe(initialTheme.colors.background);
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 360, 640);
    expect(context.strokeStyle).toBe(initialTheme.colors.effect);
    expect(context.lineWidth).toBe(1);
    expect(context.strokeRect).toHaveBeenCalledWith(0.5, 0.5, 359, 639);
  });

  it("applies the desktop cap without stretching", () => {
    const { canvas, context } = createCanvas(1920, 1080);
    const renderer = new CanvasGameRenderer({ canvas, theme: initialTheme }, 3);

    expect(Number.parseFloat(canvas.style.width)).toBe(540);
    expect(Number.parseFloat(canvas.style.height)).toBe(960);
    expect(canvas.style.margin).toBe("60px 690px");
    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1920);
    expect(context.setTransform).toHaveBeenCalledWith(3, 0, 0, 3, 0, 0);

    renderer.destroy();
  });

  it("redraws with host theme changes", () => {
    const { canvas, context } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({ canvas, theme: initialTheme });
    const replacementTheme: GameTheme = {
      colors: {
        ...initialTheme.colors,
        background: "replacement-background",
        effect: "replacement-effect",
      },
    };

    renderer.setTheme(replacementTheme);

    expect(renderer.currentTheme).toBe(replacementTheme);
    expect(context.fillStyle).toBe("replacement-background");
    expect(context.strokeStyle).toBe("replacement-effect");
    expect(context.fillRect).toHaveBeenCalledTimes(2);
    expect(context.strokeRect).toHaveBeenCalledTimes(2);
  });

  it("can recalculate the transform without changing logical coordinates", () => {
    const { canvas, context } = createCanvas(320, 568);
    const renderer = new CanvasGameRenderer({ canvas, theme: initialTheme });

    renderer.resize(1920, 1080, 2);

    expect(canvas.style.width).toBe("540px");
    expect(canvas.style.height).toBe("960px");
    expect(canvas.style.margin).toBe("60px 690px");
    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1920);
    expect(context.setTransform).toHaveBeenLastCalledWith(3, 0, 0, 3, 0, 0);
    expect(context.fillRect).toHaveBeenLastCalledWith(0, 0, 360, 640);
  });

  it("releases host resources and ignores later theme changes", () => {
    const { canvas, context } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      theme: initialTheme,
    });
    const drawsBeforeDestroy = vi.mocked(context.fillRect).mock.calls.length;

    renderer.destroy();
    renderer.setTheme(initialTheme);
    renderer.resize(390, 844, 2);

    expect(renderer.mountedCanvas).toBeNull();
    expect(renderer.currentTheme).toBeNull();
    expect(context.fillRect).toHaveBeenCalledTimes(drawsBeforeDestroy);
  });
});
