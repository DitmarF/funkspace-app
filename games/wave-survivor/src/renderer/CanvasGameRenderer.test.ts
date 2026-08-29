import { afterEach, describe, expect, it, vi } from "vitest";
import type { GameTheme } from "../GameTheme.js";
import { GameControllerImpl } from "../application/GameControllerImpl.js";
import { GameRuntimeSession } from "../application/GameRuntimeSession.js";
import type { GameRenderSnapshot } from "../domain/GamePresentationPort.js";
import { createInitialRuntimeState } from "../domain/state/RuntimeState.js";
import { ZeroMovementInput } from "../infrastructure/input/ZeroMovementInput.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
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

function createRenderSnapshot(
  overrides: Partial<GameRenderSnapshot> = {},
): GameRenderSnapshot {
  return {
    phase: "playing",
    simulationTimeSeconds: 0,
    playerX: 180,
    playerY: 320,
    playerCollisionRadius: 12,
    joystick: {
      active: false,
      centerX: 72,
      centerY: 568,
      baseRadius: 52,
      knobX: 72,
      knobY: 568,
      knobRadius: 22,
    },
    ...overrides,
  };
}

const resizeObservers: ResizeObserverMock[] = [];

class ResizeObserverMock {
  readonly disconnect = vi.fn();
  readonly observe = vi.fn((target: Element) => {
    this.target = target;
  });
  private target: Element | null = null;

  constructor(private readonly callback: ResizeObserverCallback) {
    resizeObservers.push(this);
  }

  emit(width: number, height: number): void {
    if (this.target) {
      Object.defineProperties(this.target, {
        clientHeight: { configurable: true, value: height },
        clientWidth: { configurable: true, value: width },
      });
    }
    this.callback(
      [{ contentRect: { width, height } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
}

afterEach(() => {
  resizeObservers.length = 0;
  vi.unstubAllGlobals();
});

function createCanvas(displayWidth: number, displayHeight: number) {
  const fillStyles: string[] = [];
  const globalAlphas: number[] = [];
  let fillStyle = "";
  let globalAlpha = 1;
  const context = {
    arc: vi.fn(),
    beginPath: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value: string) {
      fillStyle = value;
      fillStyles.push(value);
    },
    get globalAlpha() {
      return globalAlpha;
    },
    set globalAlpha(value: number) {
      globalAlpha = value;
      globalAlphas.push(value);
    },
    lineWidth: 0,
    setTransform: vi.fn(),
    strokeRect: vi.fn(),
    strokeStyle: "",
  } as unknown as CanvasRenderingContext2D;
  const container = {
    clientHeight: displayHeight,
    clientWidth: displayWidth,
  } as HTMLElement;
  const canvas = {
    clientHeight: displayHeight,
    clientWidth: displayWidth,
    getContext: vi.fn(() => context),
    height: displayHeight,
    parentElement: container,
    style: {
      display: "",
      height: "",
      left: "",
      margin: "",
      position: "",
      top: "",
      transform: "",
      width: "",
    },
    width: displayWidth,
  } as unknown as HTMLCanvasElement;

  return { canvas, container, context, fillStyles, globalAlphas };
}

describe("CanvasGameRenderer", () => {
  it("initializes a centered DPR-aware canvas in logical coordinates", () => {
    const { canvas, container, context, fillStyles } = createCanvas(390, 844);
    Object.defineProperties(canvas, {
      clientHeight: { value: 540 },
      clientWidth: { value: 960 },
    });
    const renderer = new CanvasGameRenderer(
      { canvas, viewport: container, theme: initialTheme },
      2,
    );
    renderer.render(createRenderSnapshot());

    expect(renderer.mountedCanvas).toBe(canvas);
    expect(renderer.currentTheme).toBe(initialTheme);
    expect(canvas.style.display).toBe("block");
    expect(canvas.style.position).toBe("absolute");
    expect(canvas.style.left).toBe("0px");
    expect(canvas.style.top).toBe("0px");
    expect(Number.parseFloat(canvas.style.width)).toBeCloseTo(390);
    expect(Number.parseFloat(canvas.style.height)).toBeCloseTo(
      640 * (390 / 360),
    );
    expect(canvas.style.margin).toBe("0px");
    const verticalOffset = Number.parseFloat(
      canvas.style.transform.replace("translate(0px, ", ""),
    );
    expect(verticalOffset).toBeCloseTo((844 - 640 * (390 / 360)) / 2);
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
    expect(fillStyles).toEqual([
      initialTheme.colors.background,
      initialTheme.colors.background,
      initialTheme.colors.player,
      initialTheme.colors.effect,
    ]);
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 360, 640);
    expect(context.strokeStyle).toBe(initialTheme.colors.effect);
    expect(context.lineWidth).toBe(1);
    expect(context.strokeRect).toHaveBeenCalledWith(0.5, 0.5, 359, 639);
    expect(context.beginPath).toHaveBeenCalledTimes(3);
    expect(context.arc).toHaveBeenNthCalledWith(
      1,
      180,
      320,
      12,
      0,
      Math.PI * 2,
    );
    expect(context.arc).toHaveBeenNthCalledWith(2, 72, 568, 52, 0, Math.PI * 2);
    expect(context.arc).toHaveBeenNthCalledWith(3, 72, 568, 22, 0, Math.PI * 2);
    expect(context.fill).toHaveBeenCalledTimes(3);
  });

  it("draws the player at its runtime position and configured radius", () => {
    const { canvas, container, context } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });

    renderer.render(
      createRenderSnapshot({
        playerX: 247,
        playerY: 193,
        playerCollisionRadius: 9,
        joystick: null,
      }),
    );

    expect(context.arc).toHaveBeenLastCalledWith(247, 193, 9, 0, Math.PI * 2);
  });

  it.each([
    [false, 72, 568, [0.18, 0.35, 1]],
    [true, 105, 544, [0.3, 0.7, 1]],
  ] as const)(
    "draws the joystick base and knob for active=%s",
    (active, knobX, knobY, expectedAlphas) => {
      const { canvas, container, context, globalAlphas } = createCanvas(
        360,
        640,
      );
      const renderer = new CanvasGameRenderer({
        canvas,
        viewport: container,
        theme: initialTheme,
      });

      renderer.render(
        createRenderSnapshot({
          joystick: {
            active,
            centerX: 72,
            centerY: 568,
            baseRadius: 52,
            knobX,
            knobY,
            knobRadius: 22,
          },
        }),
      );

      expect(context.arc).toHaveBeenNthCalledWith(
        2,
        72,
        568,
        52,
        0,
        Math.PI * 2,
      );
      expect(context.arc).toHaveBeenNthCalledWith(
        3,
        knobX,
        knobY,
        22,
        0,
        Math.PI * 2,
      );
      expect(globalAlphas).toEqual(expectedAlphas);
      expect(context.globalAlpha).toBe(1);
    },
  );

  it("applies the desktop cap without stretching", () => {
    const { canvas, container, context } = createCanvas(1920, 1080);
    const renderer = new CanvasGameRenderer(
      { canvas, viewport: container, theme: initialTheme },
      3,
    );

    expect(Number.parseFloat(canvas.style.width)).toBe(540);
    expect(Number.parseFloat(canvas.style.height)).toBe(960);
    expect(canvas.style.margin).toBe("0px");
    expect(canvas.style.transform).toBe("translate(690px, 60px)");
    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1920);
    expect(context.setTransform).toHaveBeenCalledWith(3, 0, 0, 3, 0, 0);

    renderer.destroy();
  });

  it("redraws with host theme changes", () => {
    const { canvas, container, context, fillStyles } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });
    renderer.render(
      createRenderSnapshot({
        playerX: 244,
        playerY: 171,
        joystick: null,
      }),
    );
    const replacementTheme: GameTheme = {
      colors: {
        ...initialTheme.colors,
        background: "replacement-background",
        effect: "replacement-effect",
        player: "replacement-player",
      },
    };

    renderer.setTheme(replacementTheme);

    expect(renderer.currentTheme).toBe(replacementTheme);
    expect(fillStyles.slice(-2)).toEqual([
      "replacement-background",
      "replacement-player",
    ]);
    expect(context.strokeStyle).toBe("replacement-effect");
    expect(context.arc).toHaveBeenLastCalledWith(244, 171, 12, 0, Math.PI * 2);
  });

  it("can recalculate the transform without changing logical coordinates", () => {
    const { canvas, container, context } = createCanvas(320, 568);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });
    renderer.render(
      createRenderSnapshot({
        playerX: 91,
        playerY: 447,
        joystick: null,
      }),
    );

    renderer.resize(1920, 1080, 2);

    expect(canvas.style.width).toBe("540px");
    expect(canvas.style.height).toBe("960px");
    expect(canvas.style.margin).toBe("0px");
    expect(canvas.style.transform).toBe("translate(690px, 60px)");
    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1920);
    expect(context.setTransform).toHaveBeenLastCalledWith(3, 0, 0, 3, 0, 0);
    expect(context.fillRect).toHaveBeenLastCalledWith(0, 0, 360, 640);
    expect(context.arc).toHaveBeenLastCalledWith(91, 447, 12, 0, Math.PI * 2);
  });

  it("observes repeated container resizes without replacing game state", () => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    vi.stubGlobal("window", { devicePixelRatio: 2 });
    const { canvas, container, context } = createCanvas(320, 568);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });
    const state = createInitialRuntimeState();
    state.player.position = { x: 129, y: 411 };
    const session = new GameRuntimeSession(
      state,
      new ZeroMovementInput(),
      renderer,
      new SeededRandomSource(1),
    );
    const controller = new GameControllerImpl(session);
    const observer = resizeObservers[0];
    if (!observer) throw new Error("Resize observer was not created.");
    controller.start();
    session.render();

    expect(observer.observe).toHaveBeenCalledWith(container);

    observer.emit(600, 800);

    expect(canvas.style.width).toBe("450px");
    expect(canvas.style.height).toBe("800px");
    expect(canvas.style.margin).toBe("0px");
    expect(canvas.style.transform).toBe("translate(75px, 0px)");
    expect(canvas.width).toBe(900);
    expect(canvas.height).toBe(1600);
    expect(context.setTransform).toHaveBeenLastCalledWith(2.5, 0, 0, 2.5, 0, 0);

    observer.emit(1920, 1080);

    expect(canvas.style.width).toBe("540px");
    expect(canvas.style.height).toBe("960px");
    expect(canvas.style.margin).toBe("0px");
    expect(canvas.style.transform).toBe("translate(690px, 60px)");
    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1920);
    expect(context.setTransform).toHaveBeenLastCalledWith(3, 0, 0, 3, 0, 0);
    expect(context.fillRect).toHaveBeenLastCalledWith(0, 0, 360, 640);
    expect(context.arc).toHaveBeenLastCalledWith(129, 411, 12, 0, Math.PI * 2);
    expect(renderer.mountedCanvas).toBe(canvas);
    expect(renderer.currentTheme).toBe(initialTheme);
    expect(controller.lifecycleState).toBe("running");

    const drawsBeforeDestroy = vi.mocked(context.fillRect).mock.calls.length;
    controller.destroy();
    observer.emit(390, 844);

    expect(observer.disconnect).toHaveBeenCalledOnce();
    expect(context.fillRect).toHaveBeenCalledTimes(drawsBeforeDestroy);
  });

  it("does not accumulate observers across repeated mounts and destroys", () => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    vi.stubGlobal("window", { devicePixelRatio: 2 });
    const mounts = Array.from({ length: 3 }, () => {
      const { canvas, container, context } = createCanvas(390, 844);
      const renderer = new CanvasGameRenderer({
        canvas,
        viewport: container,
        theme: initialTheme,
      });
      const observer = resizeObservers.at(-1);
      if (!observer) throw new Error("Resize observer was not created.");

      renderer.destroy();
      renderer.destroy();

      return {
        context,
        drawsAfterDestroy: vi.mocked(context.fillRect).mock.calls.length,
        observer,
      };
    });

    expect(resizeObservers).toHaveLength(3);

    for (const mount of mounts) {
      expect(mount.observer.observe).toHaveBeenCalledOnce();
      expect(mount.observer.disconnect).toHaveBeenCalledOnce();

      mount.observer.emit(600, 800);

      expect(mount.context.fillRect).toHaveBeenCalledTimes(
        mount.drawsAfterDestroy,
      );
    }
  });

  it("releases host resources and ignores later theme changes", () => {
    const { canvas, container, context } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
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
