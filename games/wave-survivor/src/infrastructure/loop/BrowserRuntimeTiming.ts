import type {
  FrameScheduler,
  MonotonicClock,
} from "../../domain/RuntimeTimingPort.js";

/** Monotonic browser clock backed by performance.now(). */
export class BrowserMonotonicClock implements MonotonicClock {
  nowMilliseconds(): number {
    if (
      typeof globalThis.performance === "undefined" ||
      typeof globalThis.performance.now !== "function"
    ) {
      throw new Error("BrowserMonotonicClock requires performance.now().");
    }

    return globalThis.performance.now();
  }
}

/** Single-frame browser scheduler backed by the animation-frame API. */
export class BrowserFrameScheduler implements FrameScheduler {
  requestFrame(callback: () => void): number {
    if (typeof globalThis.requestAnimationFrame !== "function") {
      throw new Error(
        "BrowserFrameScheduler requires requestAnimationFrame().",
      );
    }

    return globalThis.requestAnimationFrame(() => callback());
  }

  cancelFrame(frameId: number): void {
    if (typeof globalThis.cancelAnimationFrame !== "function") {
      throw new Error("BrowserFrameScheduler requires cancelAnimationFrame().");
    }

    globalThis.cancelAnimationFrame(frameId);
  }
}
