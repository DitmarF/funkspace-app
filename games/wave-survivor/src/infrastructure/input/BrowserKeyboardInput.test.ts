import { describe, expect, it, vi } from "vitest";
import { BrowserKeyboardInput } from "./BrowserKeyboardInput.js";

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

class FakeCanvas extends FakeEventTarget {
  private readonly attributes = new Map<string, string>();
  private tabIndexValue = -1;

  constructor(tabIndexAttribute: string | null = null) {
    super();
    if (tabIndexAttribute !== null) {
      this.setAttribute("tabindex", tabIndexAttribute);
    }
  }

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
    if (name === "tabindex") {
      this.tabIndexValue = Number(value);
    }
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
    if (name === "tabindex") {
      this.tabIndexValue = -1;
    }
  }
}

function createKeyboardEvent(code: string) {
  const preventDefault = vi.fn();
  const event = { code, preventDefault } as unknown as KeyboardEvent;
  return { event, preventDefault };
}

function createHarness(tabIndexAttribute: string | null = null) {
  const surface = new FakeCanvas(tabIndexAttribute);
  const windowTarget = new FakeEventTarget();
  const input = new BrowserKeyboardInput(
    surface as unknown as HTMLCanvasElement,
    windowTarget as unknown as Window,
  );

  const emitKey = (type: "keydown" | "keyup", code: string) => {
    const keyboardEvent = createKeyboardEvent(code);
    surface.emit(type, keyboardEvent.event);
    return keyboardEvent.preventDefault;
  };

  return { emitKey, input, surface, windowTarget };
}

describe("BrowserKeyboardInput direction mapping", () => {
  it.each([
    ["KeyW", { x: 0, y: -1 }],
    ["KeyS", { x: 0, y: 1 }],
    ["KeyA", { x: -1, y: 0 }],
    ["KeyD", { x: 1, y: 0 }],
  ] as const)("maps %s to its WASD direction", (code, expectedIntent) => {
    const { emitKey, input } = createHarness();

    const preventDefault = emitKey("keydown", code);

    expect(input.readMovementIntent()).toEqual(expectedIntent);
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it.each([
    ["ArrowUp", { x: 0, y: -1 }],
    ["ArrowDown", { x: 0, y: 1 }],
    ["ArrowLeft", { x: -1, y: 0 }],
    ["ArrowRight", { x: 1, y: 0 }],
  ] as const)("maps %s to its arrow-key direction", (code, expectedIntent) => {
    const { emitKey, input } = createHarness();

    const preventDefault = emitKey("keydown", code);

    expect(input.readMovementIntent()).toEqual(expectedIntent);
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it("tracks simultaneous horizontal and vertical keys independently", () => {
    const { emitKey, input } = createHarness();
    emitKey("keydown", "KeyD");
    emitKey("keydown", "KeyW");

    emitKey("keyup", "KeyW");
    expect(input.readMovementIntent()).toEqual({ x: 1, y: 0 });

    emitKey("keyup", "KeyD");
    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
  });

  it("normalizes diagonal input through MovementIntent", () => {
    const { emitKey, input } = createHarness();
    emitKey("keydown", "KeyD");
    emitKey("keydown", "KeyW");

    const intent = input.readMovementIntent();

    expect(intent.x).toBeCloseTo(Math.SQRT1_2);
    expect(intent.y).toBeCloseTo(-Math.SQRT1_2);
    expect(Math.hypot(intent.x, intent.y)).toBeCloseTo(1);
  });

  it("cancels opposite keys on both axes", () => {
    const { emitKey, input } = createHarness();
    emitKey("keydown", "KeyA");
    emitKey("keydown", "KeyD");
    emitKey("keydown", "KeyW");
    emitKey("keydown", "KeyS");

    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
  });

  it("preserves equivalent held keys when they are released in either order", () => {
    const { emitKey, input } = createHarness();
    emitKey("keydown", "KeyW");
    emitKey("keydown", "ArrowUp");

    emitKey("keyup", "KeyW");
    expect(input.readMovementIntent()).toEqual({ x: 0, y: -1 });
    emitKey("keyup", "ArrowUp");
    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });

    emitKey("keydown", "KeyW");
    emitKey("keydown", "ArrowUp");
    emitKey("keyup", "ArrowUp");
    expect(input.readMovementIntent()).toEqual({ x: 0, y: -1 });
    emitKey("keyup", "KeyW");
    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
  });

  it("treats repeated keydown events as one held key", () => {
    const { emitKey, input } = createHarness();
    emitKey("keydown", "KeyD");
    emitKey("keydown", "KeyD");

    emitKey("keyup", "KeyD");

    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
  });

  it("ignores unsupported keys without preventing their default behavior", () => {
    const { emitKey, input } = createHarness();

    const preventDefault = emitKey("keydown", "Space");

    expect(preventDefault).not.toHaveBeenCalled();
    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
  });
});

describe("BrowserKeyboardInput focus and lifecycle", () => {
  it("does not capture movement keys outside the game surface", () => {
    const { input, windowTarget } = createHarness();
    const { event, preventDefault } = createKeyboardEvent("ArrowDown");

    windowTarget.emit("keydown", event);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
  });

  it("resets held keys when the game surface loses focus", () => {
    const { emitKey, input, surface } = createHarness();
    emitKey("keydown", "KeyA");

    surface.emit("blur");

    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
  });

  it("resets held keys when the browser window loses focus", () => {
    const { emitKey, input, windowTarget } = createHarness();
    emitKey("keydown", "KeyS");

    windowTarget.emit("blur");

    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
  });

  it("supports explicit idempotent reset", () => {
    const { emitKey, input } = createHarness();
    emitKey("keydown", "ArrowRight");

    input.reset();
    input.reset();

    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
  });

  it("makes an unfocusable Canvas tabbable and restores its prior attribute", () => {
    const { input, surface } = createHarness();

    expect(surface.tabIndex).toBe(0);
    expect(surface.getAttribute("tabindex")).toBe("0");

    input.destroy();

    expect(surface.tabIndex).toBe(-1);
    expect(surface.getAttribute("tabindex")).toBeNull();
  });

  it("preserves an existing focusable Canvas tab index", () => {
    const { input, surface } = createHarness("3");

    expect(surface.tabIndex).toBe(3);
    surface.tabIndex = 4;

    input.destroy();

    expect(surface.tabIndex).toBe(4);
    expect(surface.getAttribute("tabindex")).toBe("4");
  });

  it("removes every listener and restores an overridden host tab index", () => {
    const { input, surface, windowTarget } = createHarness("-1");
    expect(surface.tabIndex).toBe(0);
    expect(surface.listenerCount("keydown")).toBe(1);
    expect(surface.listenerCount("keyup")).toBe(1);
    expect(surface.listenerCount("blur")).toBe(1);
    expect(windowTarget.listenerCount("blur")).toBe(1);

    input.destroy();

    expect(surface.tabIndex).toBe(-1);
    expect(surface.getAttribute("tabindex")).toBe("-1");
    expect(surface.listenerCount("keydown")).toBe(0);
    expect(surface.listenerCount("keyup")).toBe(0);
    expect(surface.listenerCount("blur")).toBe(0);
    expect(windowTarget.listenerCount("blur")).toBe(0);
  });

  it("makes repeated destroy safe and ignores later key events", () => {
    const { emitKey, input, surface, windowTarget } = createHarness();

    input.destroy();
    input.destroy();
    const preventDefault = emitKey("keydown", "KeyW");
    windowTarget.emit("blur");

    expect(preventDefault).not.toHaveBeenCalled();
    expect(input.readMovementIntent()).toEqual({ x: 0, y: 0 });
    expect(surface.listenerCount("keydown")).toBe(0);
    expect(windowTarget.listenerCount("blur")).toBe(0);
  });
});
