import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  FrameScheduler,
  MonotonicClock,
} from "../../domain/RuntimeTimingPort.js";
import {
  BrowserFrameScheduler,
  BrowserMonotonicClock,
} from "./BrowserRuntimeTiming.js";

class FakeMonotonicClock implements MonotonicClock {
  constructor(private currentTimeMilliseconds = 0) {}

  nowMilliseconds(): number {
    return this.currentTimeMilliseconds;
  }

  advanceByMilliseconds(deltaMilliseconds: number): void {
    this.currentTimeMilliseconds += deltaMilliseconds;
  }
}

class FakeFrameScheduler implements FrameScheduler {
  private readonly callbacks = new Map<number, () => void>();
  private nextFrameId = 1;

  requestFrame(callback: () => void): number {
    const frameId = this.nextFrameId;
    this.nextFrameId += 1;
    this.callbacks.set(frameId, callback);
    return frameId;
  }

  cancelFrame(frameId: number): void {
    this.callbacks.delete(frameId);
  }

  runFrame(frameId: number): void {
    const callback = this.callbacks.get(frameId);
    this.callbacks.delete(frameId);
    callback?.();
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("runtime timing contracts", () => {
  it("allows a fake clock to return controlled monotonic values", () => {
    const clock = new FakeMonotonicClock(100);

    expect(clock.nowMilliseconds()).toBe(100);

    clock.advanceByMilliseconds(16.5);

    expect(clock.nowMilliseconds()).toBe(116.5);
  });

  it("allows frames to be requested and run without real RAF", () => {
    const scheduler = new FakeFrameScheduler();
    const callback = vi.fn();

    const frameId = scheduler.requestFrame(callback);
    expect(callback).not.toHaveBeenCalled();

    scheduler.runFrame(frameId);

    expect(callback).toHaveBeenCalledOnce();
  });

  it("allows a requested fake frame to be cancelled", () => {
    const scheduler = new FakeFrameScheduler();
    const callback = vi.fn();
    const frameId = scheduler.requestFrame(callback);

    scheduler.cancelFrame(frameId);
    scheduler.runFrame(frameId);

    expect(callback).not.toHaveBeenCalled();
  });
});

describe("BrowserMonotonicClock", () => {
  it("forwards reads to performance.now", () => {
    const now = vi.fn(() => 321.5);
    vi.stubGlobal("performance", { now });

    expect(new BrowserMonotonicClock().nowMilliseconds()).toBe(321.5);
    expect(now).toHaveBeenCalledOnce();
  });

  it("can be constructed without performance and fails only when read", () => {
    vi.stubGlobal("performance", undefined);

    const clock = new BrowserMonotonicClock();

    expect(() => clock.nowMilliseconds()).toThrow(
      "BrowserMonotonicClock requires performance.now().",
    );
  });
});

describe("BrowserFrameScheduler", () => {
  it("forwards frame requests without exposing the browser timestamp", () => {
    const browserCallbacks: Array<(timestampMilliseconds: number) => void> = [];
    const requestAnimationFrame = vi.fn(
      (callback: (timestampMilliseconds: number) => void) => {
        browserCallbacks.push(callback);
        return 42;
      },
    );
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    const callback = vi.fn();

    const frameId = new BrowserFrameScheduler().requestFrame(callback);

    expect(frameId).toBe(42);
    expect(requestAnimationFrame).toHaveBeenCalledOnce();
    expect(callback).not.toHaveBeenCalled();

    browserCallbacks[0]?.(16.7);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith();
  });

  it("forwards cancellation with the requested frame id", () => {
    const cancelAnimationFrame = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);

    new BrowserFrameScheduler().cancelFrame(42);

    expect(cancelAnimationFrame).toHaveBeenCalledOnce();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
  });

  it("can be constructed without browser frame globals", () => {
    vi.stubGlobal("requestAnimationFrame", undefined);
    vi.stubGlobal("cancelAnimationFrame", undefined);

    const scheduler = new BrowserFrameScheduler();

    expect(() => scheduler.requestFrame(vi.fn())).toThrow(
      "BrowserFrameScheduler requires requestAnimationFrame().",
    );
    expect(() => scheduler.cancelFrame(1)).toThrow(
      "BrowserFrameScheduler requires cancelAnimationFrame().",
    );
  });
});
