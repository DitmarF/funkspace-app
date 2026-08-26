import { describe, expect, it, vi } from "vitest";
import { ZERO_MOVEMENT_INTENT } from "../../domain/movement/MovementIntent.js";
import { BrowserVirtualJoystickInput } from "./BrowserVirtualJoystickInput.js";
import { VIRTUAL_JOYSTICK_GEOMETRY } from "./VirtualJoystickConfig.js";

type FakeListener = (event: unknown) => void;

interface ClientRectValues {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

class FakePointerSurface {
  readonly capturedPointerIds = new Set<number>();
  readonly releasePointerCaptureCalls: number[] = [];
  readonly setPointerCaptureCalls: number[] = [];
  readonly style = { touchAction: "" };
  private readonly listeners = new Map<string, Set<FakeListener>>();

  constructor(private clientRect: ClientRectValues = createClientRect()) {}

  addEventListener(type: string, listener: FakeListener): void {
    const listenersForType = this.listeners.get(type) ?? new Set();
    listenersForType.add(listener);
    this.listeners.set(type, listenersForType);
  }

  removeEventListener(type: string, listener: FakeListener): void {
    this.listeners.get(type)?.delete(listener);
  }

  emit(type: string, event: unknown): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event);
    }
  }

  getBoundingClientRect(): DOMRect {
    return this.clientRect as DOMRect;
  }

  hasPointerCapture(pointerId: number): boolean {
    return this.capturedPointerIds.has(pointerId);
  }

  listenerCount(type: string): number {
    return this.listeners.get(type)?.size ?? 0;
  }

  losePointerCapture(pointerId: number): void {
    this.capturedPointerIds.delete(pointerId);
    this.emit("lostpointercapture", createPointerEvent({ pointerId }).event);
  }

  releasePointerCapture(pointerId: number): void {
    this.releasePointerCaptureCalls.push(pointerId);
    this.capturedPointerIds.delete(pointerId);
  }

  setClientRect(clientRect: ClientRectValues): void {
    this.clientRect = clientRect;
  }

  setPointerCapture(pointerId: number): void {
    this.setPointerCaptureCalls.push(pointerId);
    this.capturedPointerIds.add(pointerId);
  }
}

function createClientRect(
  overrides: Partial<ClientRectValues> = {},
): ClientRectValues {
  return {
    left: 0,
    top: 0,
    width: 360,
    height: 640,
    ...overrides,
  };
}

function getJoystickCenter(clientRect: ClientRectValues): {
  x: number;
  y: number;
} {
  const centerOffset =
    VIRTUAL_JOYSTICK_GEOMETRY.safeInsetCssPixels +
    VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels;
  return {
    x: clientRect.left + centerOffset,
    y: clientRect.top + clientRect.height - centerOffset,
  };
}

function createPointerEvent(
  overrides: Partial<
    Pick<
      PointerEvent,
      "button" | "clientX" | "clientY" | "isPrimary" | "pointerId"
    >
  > = {},
) {
  const preventDefault = vi.fn();
  const event = {
    button: 0,
    clientX: 0,
    clientY: 0,
    isPrimary: true,
    pointerId: 1,
    preventDefault,
    ...overrides,
  } as unknown as PointerEvent;
  return { event, preventDefault };
}

function createHarness(clientRect = createClientRect(), touchAction = "") {
  const surface = new FakePointerSurface(clientRect);
  surface.style.touchAction = touchAction;
  const input = new BrowserVirtualJoystickInput(
    surface as unknown as HTMLCanvasElement,
  );
  const center = getJoystickCenter(clientRect);

  const emitPointer = (
    type: "pointerdown" | "pointermove" | "pointerup" | "pointercancel",
    overrides: Partial<
      Pick<
        PointerEvent,
        "button" | "clientX" | "clientY" | "isPrimary" | "pointerId"
      >
    > = {},
  ) => {
    const pointerEvent = createPointerEvent({
      clientX: center.x,
      clientY: center.y,
      ...overrides,
    });
    surface.emit(type, pointerEvent.event);
    return pointerEvent.preventDefault;
  };

  return { center, emitPointer, input, surface };
}

describe("BrowserVirtualJoystickInput activation", () => {
  it("accepts a primary pointer inside the fixed activation area", () => {
    const { emitPointer, input, surface } = createHarness();

    const preventDefault = emitPointer("pointerdown");

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(surface.setPointerCaptureCalls).toEqual([1]);
    expect(surface.capturedPointerIds.has(1)).toBe(true);
    expect(input.readPresentationSnapshot()?.active).toBe(true);
  });

  it("ignores a pointer outside the fixed activation area", () => {
    const { center, emitPointer, input, surface } = createHarness();

    const preventDefault = emitPointer("pointerdown", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels + 1,
    });

    expect(preventDefault).not.toHaveBeenCalled();
    expect(surface.setPointerCaptureCalls).toHaveLength(0);
    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.readPresentationSnapshot()?.active).toBe(false);
  });

  it("rejects a secondary pointer", () => {
    const { emitPointer, input, surface } = createHarness();

    const preventDefault = emitPointer("pointerdown", {
      isPrimary: false,
      pointerId: 2,
    });

    expect(preventDefault).not.toHaveBeenCalled();
    expect(surface.setPointerCaptureCalls).toHaveLength(0);
    expect(input.readPresentationSnapshot()?.active).toBe(false);
  });

  it("tracks only the first accepted pointer until its gesture ends", () => {
    const { center, emitPointer, input, surface } = createHarness();
    emitPointer("pointerdown", { pointerId: 1 });
    emitPointer("pointermove", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels / 2,
      pointerId: 1,
    });
    const firstPointerIntent = input.readMovementIntent();

    const secondPointerPreventDefault = emitPointer("pointerdown", {
      pointerId: 2,
    });
    emitPointer("pointermove", {
      clientX: center.x - VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels,
      pointerId: 2,
    });
    emitPointer("pointerup", { pointerId: 2 });

    expect(secondPointerPreventDefault).not.toHaveBeenCalled();
    expect(surface.setPointerCaptureCalls).toEqual([1]);
    expect(input.readMovementIntent()).toBe(firstPointerIntent);
    expect(input.readPresentationSnapshot()?.active).toBe(true);
  });

  it("continues movement beyond the original activation region", () => {
    const { center, emitPointer, input, surface } = createHarness();
    emitPointer("pointerdown");

    emitPointer("pointermove", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels * 3,
    });

    expect(surface.capturedPointerIds.has(1)).toBe(true);
    expect(input.readMovementIntent()).toEqual({ x: 1, y: 0 });
    expect(input.readPresentationSnapshot()?.knobX).toBe(
      72 + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels,
    );
  });
});

describe("BrowserVirtualJoystickInput analog movement", () => {
  it("returns zero intent inside the dead zone", () => {
    const { center, emitPointer, input } = createHarness();
    const deadZoneRadius =
      VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels *
      VIRTUAL_JOYSTICK_GEOMETRY.deadZoneRatio;

    emitPointer("pointerdown", {
      clientX: center.x + deadZoneRadius / 2,
    });

    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.readPresentationSnapshot()?.knobX).toBeCloseTo(
      72 + deadZoneRadius / 2,
    );
  });

  it("remaps displacement outside the dead zone to partial analog output", () => {
    const { center, emitPointer, input } = createHarness();
    const deadZoneRadius =
      VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels *
      VIRTUAL_JOYSTICK_GEOMETRY.deadZoneRatio;
    const halfAnalogDistance =
      deadZoneRadius +
      (VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels - deadZoneRadius) / 2;

    emitPointer("pointerdown", {
      clientX: center.x + halfAnalogDistance,
    });

    expect(input.readMovementIntent().x).toBeCloseTo(0.5);
    expect(input.readMovementIntent().y).toBe(0);
  });

  it("clamps maximum output and visual knob displacement", () => {
    const { center, emitPointer, input } = createHarness();
    emitPointer("pointerdown");

    emitPointer("pointermove", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels * 2,
    });

    expect(input.readMovementIntent()).toEqual({ x: 1, y: 0 });
    expect(input.readPresentationSnapshot()?.knobX).toBe(
      72 + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels,
    );
  });

  it("normalizes maximum diagonal output", () => {
    const { center, emitPointer, input } = createHarness();
    emitPointer("pointerdown");
    emitPointer("pointermove", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels * 2,
      clientY: center.y - VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels * 2,
    });

    const intent = input.readMovementIntent();

    expect(intent.x).toBeCloseTo(Math.SQRT1_2);
    expect(intent.y).toBeCloseTo(-Math.SQRT1_2);
    expect(Math.hypot(intent.x, intent.y)).toBeCloseTo(1);
  });
});

describe("BrowserVirtualJoystickInput coordinate mapping", () => {
  it("accounts for a translated Canvas rectangle", () => {
    const clientRect = createClientRect({ left: 120, top: 80 });
    const { emitPointer, input } = createHarness(clientRect);

    emitPointer("pointerdown");

    expect(input.readPresentationSnapshot()).toMatchObject({
      centerX: 72,
      centerY: 568,
      baseRadius: 52,
      knobX: 72,
      knobY: 568,
      knobRadius: 22,
    });
  });

  it("accounts for the displayed Canvas scale", () => {
    const clientRect = createClientRect({
      left: 120,
      top: 80,
      width: 720,
      height: 1280,
    });
    const { center, emitPointer, input } = createHarness(clientRect);
    emitPointer("pointerdown");
    emitPointer("pointermove", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels,
    });

    expect(input.readPresentationSnapshot()).toMatchObject({
      centerX: 36,
      centerY: 604,
      baseRadius: 26,
      knobX: 62,
      knobY: 604,
      knobRadius: 11,
    });
    expect(input.readMovementIntent()).toEqual({ x: 1, y: 0 });
  });

  it("safely ignores a zero-size Canvas rectangle", () => {
    const { emitPointer, input, surface } = createHarness(
      createClientRect({ width: 0 }),
    );

    emitPointer("pointerdown");

    expect(surface.setPointerCaptureCalls).toHaveLength(0);
    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.readPresentationSnapshot()).toBeNull();
  });
});

describe("BrowserVirtualJoystickInput interruption and cleanup", () => {
  it("resets and releases capture on pointerup", () => {
    const { center, emitPointer, input, surface } = createHarness();
    emitPointer("pointerdown");
    emitPointer("pointermove", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels,
    });

    emitPointer("pointerup");

    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.readPresentationSnapshot()?.active).toBe(false);
    expect(surface.releasePointerCaptureCalls).toEqual([1]);
    expect(surface.capturedPointerIds.size).toBe(0);
  });

  it("resets and releases capture on pointercancel", () => {
    const { center, emitPointer, input, surface } = createHarness();
    emitPointer("pointerdown");
    emitPointer("pointermove", {
      clientY: center.y - VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels,
    });

    emitPointer("pointercancel");

    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.readPresentationSnapshot()?.active).toBe(false);
    expect(surface.releasePointerCaptureCalls).toEqual([1]);
  });

  it("resets when pointer capture is lost externally", () => {
    const { center, emitPointer, input, surface } = createHarness();
    emitPointer("pointerdown");
    emitPointer("pointermove", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels,
    });

    surface.losePointerCapture(1);

    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.readPresentationSnapshot()?.active).toBe(false);
    expect(surface.releasePointerCaptureCalls).toHaveLength(0);
  });

  it("supports explicit idempotent reset and releases capture", () => {
    const { center, emitPointer, input, surface } = createHarness();
    emitPointer("pointerdown");
    emitPointer("pointermove", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels,
    });

    input.reset();
    input.reset();

    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.readPresentationSnapshot()?.active).toBe(false);
    expect(surface.releasePointerCaptureCalls).toEqual([1]);
  });

  it("removes listeners, capture, and owned touch-action styling", () => {
    const { emitPointer, input, surface } = createHarness(
      createClientRect(),
      "pan-y",
    );
    emitPointer("pointerdown");
    expect(surface.style.touchAction).toBe("none");

    input.destroy();

    expect(surface.style.touchAction).toBe("pan-y");
    expect(surface.capturedPointerIds.size).toBe(0);
    expect(surface.releasePointerCaptureCalls).toEqual([1]);
    expect(surface.listenerCount("pointerdown")).toBe(0);
    expect(surface.listenerCount("pointermove")).toBe(0);
    expect(surface.listenerCount("pointerup")).toBe(0);
    expect(surface.listenerCount("pointercancel")).toBe(0);
    expect(surface.listenerCount("lostpointercapture")).toBe(0);
  });

  it("makes repeated destroy safe and ignores later pointer changes", () => {
    const { center, emitPointer, input, surface } = createHarness();
    input.destroy();
    input.destroy();

    const preventDefault = emitPointer("pointerdown", {
      clientX: center.x + VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels,
    });

    expect(preventDefault).not.toHaveBeenCalled();
    expect(surface.setPointerCaptureCalls).toHaveLength(0);
    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.readPresentationSnapshot()).toBeNull();
  });
});
