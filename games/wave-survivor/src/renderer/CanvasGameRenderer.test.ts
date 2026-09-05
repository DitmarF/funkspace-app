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
    playerCurrentHealth: 3,
    playerMaximumHealth: 3,
    isPlayerInvulnerable: false,
    killCount: 0,
    enemies: [],
    projectiles: [],
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
  const lineWidths: number[] = [];
  const strokeStyles: string[] = [];
  let fillStyle = "";
  let globalAlpha = 1;
  let lineWidth = 0;
  let strokeStyle = "";
  const context = {
    arc: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    font: "",
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
    get lineWidth() {
      return lineWidth;
    },
    set lineWidth(value: number) {
      lineWidth = value;
      lineWidths.push(value);
    },
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    setTransform: vi.fn(),
    stroke: vi.fn(),
    strokeRect: vi.fn(),
    textAlign: "start",
    textBaseline: "alphabetic",
    get strokeStyle() {
      return strokeStyle;
    },
    set strokeStyle(value: string) {
      strokeStyle = value;
      strokeStyles.push(value);
    },
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

  return {
    canvas,
    container,
    context,
    fillStyles,
    globalAlphas,
    lineWidths,
    strokeStyles,
  };
}

describe("CanvasGameRenderer", () => {
  it("renders a static boss label and double chevron while entry is partially visible", () => {
    const { canvas, container, context } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer(
      { canvas, viewport: container, theme: initialTheme },
      1,
    );
    renderer.render(
      createRenderSnapshot({
        enemies: [
          {
            id: 1,
            phase: "entering",
            x: 180,
            y: 0,
            collisionRadius: 24,
            entryWarning: "boss",
          },
        ],
      }),
    );
    expect(context.fillText).toHaveBeenCalledWith("BOSS INCOMING", 180, 30);
    expect(context.fillText).toHaveBeenCalledWith(
      "Move clear of the top entry",
      180,
      49,
    );
    expect(context.moveTo).toHaveBeenCalledWith(168, 6);
    expect(context.moveTo).toHaveBeenCalledWith(168, 16);
    expect(context.lineTo).toHaveBeenCalledWith(180, 14);
    expect(context.lineTo).toHaveBeenCalledWith(180, 24);
    vi.mocked(context.fillText).mockClear();
    renderer.render(
      createRenderSnapshot({
        enemies: [
          { id: 1, phase: "active", x: 180, y: 24, collisionRadius: 24 },
        ],
      }),
    );
    expect(context.fillText).not.toHaveBeenCalledWith("BOSS INCOMING", 180, 30);
    renderer.destroy();
  });

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

  it("draws a static effect-colored ring while the player is invulnerable", () => {
    const { canvas, container, context, lineWidths, strokeStyles } =
      createCanvas(360, 640);
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
        isPlayerInvulnerable: true,
        joystick: null,
      }),
    );

    expect(context.arc).toHaveBeenNthCalledWith(1, 247, 193, 9, 0, Math.PI * 2);
    expect(context.arc).toHaveBeenNthCalledWith(
      2,
      247,
      193,
      13,
      0,
      Math.PI * 2,
    );
    expect(strokeStyles.at(-1)).toBe(initialTheme.colors.effect);
    expect(lineWidths).toContain(2);
    expect(context.stroke).toHaveBeenCalledOnce();
  });

  it("draws the kill count in the top-right corner", () => {
    const { canvas, container, context } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });

    renderer.render(
      createRenderSnapshot({
        killCount: 7,
        joystick: null,
      }),
    );

    expect(context.fillStyle).toBe(initialTheme.colors.effect);
    expect(context.font).toBe("600 12px sans-serif");
    expect(context.textAlign).toBe("right");
    expect(context.textBaseline).toBe("top");
    expect(context.fillText).toHaveBeenCalledWith("Kills: 7", 350, 10);
  });

  it("draws current health as a clamped geometric bar", () => {
    const { canvas, container, context, fillStyles, strokeStyles } =
      createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });

    renderer.render(
      createRenderSnapshot({
        playerCurrentHealth: 2,
        playerMaximumHealth: 3,
        joystick: null,
      }),
    );

    expect(context.strokeRect).toHaveBeenLastCalledWith(10.5, 10.5, 83, 7);
    expect(context.fillRect).toHaveBeenLastCalledWith(11, 11, (82 * 2) / 3, 6);
    expect(strokeStyles.at(-1)).toBe(initialTheme.colors.effect);
    expect(fillStyles).toContain(initialTheme.colors.player);
  });

  it("draws a static centered lost state from the terminal snapshot", () => {
    const { canvas, container, context } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });

    renderer.render(
      createRenderSnapshot({
        phase: "lost",
        joystick: null,
      }),
    );

    expect(context.fillStyle).toBe(initialTheme.colors.effect);
    expect(context.font).toBe("700 32px sans-serif");
    expect(context.textAlign).toBe("center");
    expect(context.textBaseline).toBe("middle");
    expect(context.fillText).toHaveBeenLastCalledWith("LOST", 180, 320);
  });

  it("draws projectile snapshot circles after the player", () => {
    const { canvas, container, context, fillStyles } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });

    renderer.render(
      createRenderSnapshot({
        projectiles: [
          { id: 7, x: 210, y: 300, collisionRadius: 4 },
          { id: 8, x: 220, y: 310, collisionRadius: 3 },
        ],
        joystick: null,
      }),
    );

    expect(fillStyles.slice(-4)).toEqual([
      initialTheme.colors.player,
      initialTheme.colors.projectile,
      initialTheme.colors.player,
      initialTheme.colors.effect,
    ]);
    expect(context.arc).toHaveBeenNthCalledWith(
      1,
      180,
      320,
      12,
      0,
      Math.PI * 2,
    );
    expect(context.arc).toHaveBeenNthCalledWith(2, 210, 300, 4, 0, Math.PI * 2);
    expect(context.arc).toHaveBeenNthCalledWith(3, 220, 310, 3, 0, Math.PI * 2);
    expect(context.fill).toHaveBeenCalledTimes(3);
  });

  it("draws an inward border warning instead of an entering enemy shape", () => {
    const { canvas, container, context } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });

    renderer.render(
      createRenderSnapshot({
        enemies: [
          {
            id: 1,
            phase: "entering",
            x: 180,
            y: -66,
            collisionRadius: 12,
          },
        ],
        joystick: null,
      }),
    );

    expect(context.moveTo).toHaveBeenCalledWith(174, 2);
    expect(context.lineTo).toHaveBeenNthCalledWith(1, 186, 2);
    expect(context.lineTo).toHaveBeenNthCalledWith(2, 180, 12);
    expect(context.closePath).toHaveBeenCalledOnce();
    expect(context.stroke).not.toHaveBeenCalled();
    expect(context.arc).toHaveBeenCalledOnce();
    expect(context.fill).toHaveBeenCalledTimes(2);
  });

  it("draws a partially entered active enemy as a diamond without a warning", () => {
    const { canvas, container, context } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });

    renderer.render(
      createRenderSnapshot({
        enemies: [
          {
            id: 1,
            phase: "active",
            x: -11,
            y: 320,
            collisionRadius: 12,
          },
        ],
        joystick: null,
      }),
    );

    expect(context.moveTo).toHaveBeenCalledWith(-11, 308);
    expect(context.lineTo).toHaveBeenNthCalledWith(1, 1, 320);
    expect(context.lineTo).toHaveBeenNthCalledWith(2, -11, 332);
    expect(context.lineTo).toHaveBeenNthCalledWith(3, -23, 320);
    expect(context.stroke).toHaveBeenCalledOnce();
    expect(context.fill).toHaveBeenCalledOnce();
    expect(context.arc).toHaveBeenCalledWith(180, 320, 12, 0, Math.PI * 2);
    expect(vi.mocked(context.moveTo).mock.invocationCallOrder[0]!).toBeLessThan(
      vi.mocked(context.arc).mock.invocationCallOrder[0]!,
    );
  });

  it("draws a dying enemy as a static effect-colored cross", () => {
    const { canvas, container, context, strokeStyles } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });

    renderer.render(
      createRenderSnapshot({
        enemies: [
          {
            id: 1,
            phase: "dying",
            x: 120,
            y: 200,
            collisionRadius: 12,
          },
        ],
        joystick: null,
      }),
    );

    expect(strokeStyles.at(-1)).toBe(initialTheme.colors.effect);
    expect(context.moveTo).toHaveBeenNthCalledWith(1, 108, 188);
    expect(context.lineTo).toHaveBeenNthCalledWith(1, 132, 212);
    expect(context.moveTo).toHaveBeenNthCalledWith(2, 132, 188);
    expect(context.lineTo).toHaveBeenNthCalledWith(2, 108, 212);
    expect(context.closePath).not.toHaveBeenCalled();
    expect(context.stroke).toHaveBeenCalledOnce();
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
    expect(fillStyles.slice(-4)).toEqual([
      "replacement-background",
      "replacement-player",
      "replacement-player",
      "replacement-effect",
    ]);
    expect(context.strokeStyle).toBe("replacement-effect");
    expect(context.arc).toHaveBeenLastCalledWith(244, 171, 12, 0, Math.PI * 2);
  });

  it("redraws current warnings and enemies with replacement theme roles", () => {
    const { canvas, container, fillStyles, strokeStyles } = createCanvas(
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
        enemies: [
          {
            id: 1,
            phase: "entering",
            x: 180,
            y: -66,
            collisionRadius: 12,
          },
          {
            id: 2,
            phase: "active",
            x: 120,
            y: 200,
            collisionRadius: 12,
          },
        ],
        joystick: null,
      }),
    );
    const replacementTheme: GameTheme = {
      colors: {
        ...initialTheme.colors,
        background: "replacement-background",
        effect: "replacement-effect",
        enemy: "replacement-enemy",
        player: "replacement-player",
      },
    };

    renderer.setTheme(replacementTheme);

    expect(fillStyles.slice(-5)).toEqual([
      "replacement-background",
      "replacement-effect",
      "replacement-player",
      "replacement-player",
      "replacement-effect",
    ]);
    expect(strokeStyles.slice(-2)).toEqual([
      "replacement-enemy",
      "replacement-effect",
    ]);
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
        enemies: [
          {
            id: 1,
            phase: "active",
            x: 91,
            y: 447,
            collisionRadius: 9,
          },
        ],
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
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 360, 640);
    expect(context.moveTo).toHaveBeenLastCalledWith(91, 438);
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
      new SeededRandomSource(2),
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
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 360, 640);
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

  it("reuses its Canvas and observer across repeated session restarts", () => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    const { canvas, container } = createCanvas(360, 640);
    const renderer = new CanvasGameRenderer({
      canvas,
      viewport: container,
      theme: initialTheme,
    });
    const session = new GameRuntimeSession(
      createInitialRuntimeState(),
      new ZeroMovementInput(),
      renderer,
      new SeededRandomSource(1),
      new SeededRandomSource(2),
    );
    const controller = new GameControllerImpl(session);
    const observer = resizeObservers[0];
    if (!observer) throw new Error("Resize observer was not created.");
    controller.start();

    controller.restart();
    controller.restart();
    controller.restart();
    session.render();

    expect(resizeObservers).toHaveLength(1);
    expect(observer.observe).toHaveBeenCalledOnce();
    expect(observer.disconnect).not.toHaveBeenCalled();
    expect(renderer.mountedCanvas).toBe(canvas);
    expect(renderer.currentTheme).toBe(initialTheme);
    expect(controller.lifecycleState).toBe("running");

    controller.destroy();
    expect(observer.disconnect).toHaveBeenCalledOnce();
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
    const snapshot = createRenderSnapshot({
      enemies: [
        {
          id: 1,
          phase: "active",
          x: 100,
          y: 200,
          collisionRadius: 12,
        },
      ],
    });
    renderer.render(snapshot);
    const drawsBeforeDestroy = vi.mocked(context.fillRect).mock.calls.length;
    const enemyDrawsBeforeDestroy = vi.mocked(context.stroke).mock.calls.length;

    renderer.destroy();
    renderer.render(snapshot);
    renderer.setTheme(initialTheme);
    renderer.resize(390, 844, 2);

    expect(renderer.mountedCanvas).toBeNull();
    expect(renderer.currentTheme).toBeNull();
    expect(context.fillRect).toHaveBeenCalledTimes(drawsBeforeDestroy);
    expect(context.stroke).toHaveBeenCalledTimes(enemyDrawsBeforeDestroy);
  });
});
