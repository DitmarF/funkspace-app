import { describe, expect, it, vi } from "vitest";
import type {
  GamePresentationPort,
  GameRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import { ZERO_MOVEMENT_INTENT } from "../domain/movement/MovementIntent.js";
import { createInitialRuntimeState } from "../domain/state/RuntimeState.js";
import { BrowserInputInterruptionGuard } from "../infrastructure/input/BrowserInputInterruptionGuard.js";
import { BrowserKeyboardInput } from "../infrastructure/input/BrowserKeyboardInput.js";
import { BrowserVirtualJoystickInput } from "../infrastructure/input/BrowserVirtualJoystickInput.js";
import { CompositeMovementInput } from "../infrastructure/input/CompositeMovementInput.js";
import { VIRTUAL_JOYSTICK_GEOMETRY } from "../infrastructure/input/VirtualJoystickConfig.js";
import { FIXED_SIMULATION_STEP_SECONDS } from "../infrastructure/loop/FixedStepLoop.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import {
  GameControllerImpl,
  type RuntimeLoopControl,
} from "./GameControllerImpl.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

type FakeListener = (event: unknown) => void;

class FakeEventTarget {
  private readonly listeners = new Map<string, Set<FakeListener>>();

  addEventListener(type: string, listener: FakeListener): void {
    const listenersForType = this.listeners.get(type) ?? new Set();
    listenersForType.add(listener);
    this.listeners.set(type, listenersForType);
  }

  removeEventListener(type: string, listener: FakeListener): void {
    this.listeners.get(type)?.delete(listener);
  }

  emit(type: string, event: unknown = {}): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event);
    }
  }

  listenerCount(type: string): number {
    return this.listeners.get(type)?.size ?? 0;
  }
}

class FakeVisibilityDocument extends FakeEventTarget {
  hidden = false;
}

class FakeGameCanvas extends FakeEventTarget {
  readonly capturedPointerIds = new Set<number>();
  readonly style = { touchAction: "" };
  private readonly attributes = new Map<string, string>();
  private tabIndexValue = -1;

  get tabIndex(): number {
    return this.tabIndexValue;
  }

  set tabIndex(value: number) {
    this.tabIndexValue = value;
    this.attributes.set("tabindex", String(value));
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
    if (name === "tabindex") this.tabIndexValue = Number(value);
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
    if (name === "tabindex") this.tabIndexValue = -1;
  }

  getBoundingClientRect(): DOMRect {
    return { left: 0, top: 0, width: 360, height: 640 } as DOMRect;
  }

  hasPointerCapture(pointerId: number): boolean {
    return this.capturedPointerIds.has(pointerId);
  }

  releasePointerCapture(pointerId: number): void {
    this.capturedPointerIds.delete(pointerId);
  }

  setPointerCapture(pointerId: number): void {
    this.capturedPointerIds.add(pointerId);
  }
}

function createKeyboardEvent(code: string): KeyboardEvent {
  return { code, preventDefault: vi.fn() } as unknown as KeyboardEvent;
}

function createPointerEvent(
  type: "down" | "move",
  pointerId = 1,
): PointerEvent {
  const centerOffset =
    VIRTUAL_JOYSTICK_GEOMETRY.safeInsetCssPixels +
    VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels;
  return {
    button: 0,
    clientX:
      centerOffset +
      (type === "move" ? VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels : 0),
    clientY: 640 - centerOffset,
    isPrimary: true,
    pointerId,
    preventDefault: vi.fn(),
  } as unknown as PointerEvent;
}

function createHarness() {
  const surface = new FakeGameCanvas();
  const windowTarget = new FakeEventTarget();
  const documentTarget = new FakeVisibilityDocument();
  const keyboard = new BrowserKeyboardInput(
    surface as unknown as HTMLCanvasElement,
    null,
  );
  const joystick = new BrowserVirtualJoystickInput(
    surface as unknown as HTMLCanvasElement,
  );
  const composite = new CompositeMovementInput(keyboard, joystick);
  const input = new BrowserInputInterruptionGuard(
    composite,
    windowTarget as unknown as Window,
    documentTarget as unknown as Document,
  );
  const snapshots: GameRenderSnapshot[] = [];
  const presentation: GamePresentationPort = {
    destroy: vi.fn(),
    render: vi.fn((snapshot) => snapshots.push(snapshot)),
    setTheme: vi.fn(),
  };
  const session = new GameRuntimeSession(
    createInitialRuntimeState(),
    input,
    presentation,
    new SeededRandomSource(1),
    () => joystick.readPresentationSnapshot(),
  );
  const loop: RuntimeLoopControl = {
    destroy: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const controller = new GameControllerImpl(session, loop);

  const activateKeyboard = () => {
    surface.emit("keydown", createKeyboardEvent("KeyD"));
  };
  const activateJoystick = () => {
    surface.emit("pointerdown", createPointerEvent("down"));
    surface.emit("pointermove", createPointerEvent("move"));
  };
  const renderPlayerX = () => {
    session.render();
    return snapshots.at(-1)?.playerX;
  };

  return {
    activateJoystick,
    activateKeyboard,
    controller,
    documentTarget,
    input,
    joystick,
    loop,
    presentation,
    renderPlayerX,
    session,
    surface,
    windowTarget,
  };
}

describe("game input lifecycle integration", () => {
  it.each([
    [
      "keyboard",
      (harness: ReturnType<typeof createHarness>) => harness.activateKeyboard(),
    ],
    [
      "joystick",
      (harness: ReturnType<typeof createHarness>) => harness.activateJoystick(),
    ],
  ] as const)(
    "pausing active %s input preserves position and resume starts neutral",
    (_source, activate) => {
      const harness = createHarness();
      harness.controller.start();
      activate(harness);
      harness.session.fixedUpdate(FIXED_SIMULATION_STEP_SECONDS);
      expect(harness.renderPlayerX()).toBeCloseTo(182);

      harness.controller.pause();
      expect(harness.input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
      expect(harness.surface.capturedPointerIds.size).toBe(0);

      harness.controller.resume();
      harness.session.fixedUpdate(FIXED_SIMULATION_STEP_SECONDS);
      expect(harness.renderPlayerX()).toBeCloseTo(182);
      expect(harness.loop.start).toHaveBeenCalledTimes(2);

      harness.controller.destroy();
    },
  );

  it.each([
    [
      "keyboard",
      (harness: ReturnType<typeof createHarness>) => harness.activateKeyboard(),
    ],
    [
      "joystick",
      (harness: ReturnType<typeof createHarness>) => harness.activateJoystick(),
    ],
  ] as const)(
    "restarting active %s input creates one neutral initial session",
    (_source, activate) => {
      const harness = createHarness();
      harness.controller.start();
      activate(harness);
      harness.session.fixedUpdate(FIXED_SIMULATION_STEP_SECONDS);

      harness.controller.restart();
      harness.session.fixedUpdate(FIXED_SIMULATION_STEP_SECONDS);

      expect(harness.renderPlayerX()).toBe(180);
      expect(harness.input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
      expect(harness.surface.capturedPointerIds.size).toBe(0);
      expect(harness.loop.stop).toHaveBeenCalledOnce();
      expect(harness.loop.start).toHaveBeenCalledTimes(2);

      harness.controller.destroy();
    },
  );

  it("resets all input on window blur or hidden-document interruption", () => {
    const harness = createHarness();
    harness.activateKeyboard();
    harness.activateJoystick();

    harness.windowTarget.emit("blur");

    expect(harness.input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(harness.surface.capturedPointerIds.size).toBe(0);

    harness.activateKeyboard();
    harness.activateJoystick();
    harness.documentTarget.hidden = true;
    harness.documentTarget.emit("visibilitychange");

    expect(harness.input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(harness.surface.capturedPointerIds.size).toBe(0);

    harness.controller.destroy();
  });

  it("keeps surface blur scoped to keyboard state", () => {
    const harness = createHarness();
    harness.activateKeyboard();
    harness.activateJoystick();

    harness.surface.emit("blur");

    expect(harness.input.readMovementIntent()).toEqual({ x: 1, y: 0 });
    expect(harness.joystick.readPresentationSnapshot()?.active).toBe(true);

    harness.controller.destroy();
  });

  it("destroy during a pointer gesture releases every browser resource", () => {
    const harness = createHarness();
    harness.controller.start();
    harness.activateJoystick();

    harness.controller.destroy();
    harness.controller.destroy();

    expect(harness.surface.capturedPointerIds.size).toBe(0);
    expect(harness.surface.listenerCount("keydown")).toBe(0);
    expect(harness.surface.listenerCount("keyup")).toBe(0);
    expect(harness.surface.listenerCount("blur")).toBe(0);
    expect(harness.surface.listenerCount("pointerdown")).toBe(0);
    expect(harness.surface.listenerCount("pointermove")).toBe(0);
    expect(harness.surface.listenerCount("pointerup")).toBe(0);
    expect(harness.surface.listenerCount("pointercancel")).toBe(0);
    expect(harness.surface.listenerCount("lostpointercapture")).toBe(0);
    expect(harness.windowTarget.listenerCount("blur")).toBe(0);
    expect(harness.documentTarget.listenerCount("visibilitychange")).toBe(0);
    expect(harness.loop.destroy).toHaveBeenCalledOnce();
    expect(harness.presentation.destroy).toHaveBeenCalledOnce();
    expect(harness.input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
  });
});
