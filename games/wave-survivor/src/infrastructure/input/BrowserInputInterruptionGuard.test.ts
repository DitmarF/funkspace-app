import { describe, expect, it, vi } from "vitest";
import type { MovementInputPort } from "../../domain/MovementInputPort.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../../domain/movement/MovementIntent.js";
import { BrowserInputInterruptionGuard } from "./BrowserInputInterruptionGuard.js";

type FakeListener = () => void;

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

  emit(type: string): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener();
    }
  }

  listenerCount(type: string): number {
    return this.listeners.get(type)?.size ?? 0;
  }
}

class FakeVisibilityDocument extends FakeEventTarget {
  hidden = false;
}

function createHarness(
  initialIntent: MovementIntent = createMovementIntent(1, 0),
) {
  let intent = initialIntent;
  const source: MovementInputPort = {
    readMovementIntent: vi.fn(() => intent),
    reset: vi.fn(() => {
      intent = ZERO_MOVEMENT_INTENT;
    }),
    destroy: vi.fn(() => {
      intent = ZERO_MOVEMENT_INTENT;
    }),
  };
  const windowTarget = new FakeEventTarget();
  const documentTarget = new FakeVisibilityDocument();
  const input = new BrowserInputInterruptionGuard(
    source,
    windowTarget as unknown as Window,
    documentTarget as unknown as Document,
  );

  return { documentTarget, input, source, windowTarget };
}

describe("BrowserInputInterruptionGuard", () => {
  it("resets the complete input source when the window blurs", () => {
    const { input, source, windowTarget } = createHarness();

    windowTarget.emit("blur");

    expect(source.reset).toHaveBeenCalledOnce();
    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
  });

  it("resets input only when a visibility change makes the document hidden", () => {
    const { documentTarget, input, source } = createHarness();

    documentTarget.emit("visibilitychange");
    expect(source.reset).not.toHaveBeenCalled();

    documentTarget.hidden = true;
    documentTarget.emit("visibilitychange");

    expect(source.reset).toHaveBeenCalledOnce();
    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
  });

  it("keeps explicit reset idempotent for lifecycle transitions", () => {
    const { input, source } = createHarness();

    input.reset();
    input.reset();

    expect(source.reset).toHaveBeenCalledTimes(2);
    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
  });

  it("removes listeners and destroys its child source exactly once", () => {
    const { documentTarget, input, source, windowTarget } = createHarness();
    expect(windowTarget.listenerCount("blur")).toBe(1);
    expect(documentTarget.listenerCount("visibilitychange")).toBe(1);

    input.destroy();
    input.destroy();
    windowTarget.emit("blur");
    documentTarget.hidden = true;
    documentTarget.emit("visibilitychange");

    expect(windowTarget.listenerCount("blur")).toBe(0);
    expect(documentTarget.listenerCount("visibilitychange")).toBe(0);
    expect(source.reset).toHaveBeenCalledOnce();
    expect(source.destroy).toHaveBeenCalledOnce();
    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
  });
});
