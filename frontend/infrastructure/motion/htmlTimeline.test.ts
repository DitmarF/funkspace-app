import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { HTMLTimeline } from "./htmlTimeline";

describe("HTMLTimeline", () => {
  let mockElement1: HTMLElement;
  let mockElement2: HTMLElement;
  let rafSpy: ReturnType<typeof vi.fn>;
  let cancelRafSpy: ReturnType<typeof vi.fn>;
  const activeTimelines: HTMLTimeline[] = [];
  const pendingTimeouts: NodeJS.Timeout[] = [];

  beforeEach(() => {
    // Create mock elements
    mockElement1 = document.createElement("div");
    mockElement2 = document.createElement("div");

    // Clear any leftover timeouts
    pendingTimeouts.forEach((timeout) => clearTimeout(timeout));
    pendingTimeouts.length = 0;

    // Mock requestAnimationFrame - track timeouts so we can clear them
    rafSpy = vi.fn((callback: FrameRequestCallback) => {
      const timeout = setTimeout(callback, 16); // ~60fps
      pendingTimeouts.push(timeout);
      return 1;
    });
    global.requestAnimationFrame = rafSpy;

    // Mock cancelAnimationFrame - clear tracked timeouts
    cancelRafSpy = vi.fn((id: number) => {
      // Clear all pending timeouts (simplified - in real RAF, we'd track by id)
      pendingTimeouts.forEach((timeout) => clearTimeout(timeout));
      pendingTimeouts.length = 0;
    });
    global.cancelAnimationFrame = cancelRafSpy;

    // Mock performance.now
    let time = 0;
    vi.spyOn(performance, "now").mockImplementation(() => {
      time += 16;
      return time;
    });
  });

  afterEach(() => {
    // Pause all active timelines first (this cancels pending RAF)
    activeTimelines.forEach((timeline) => {
      try {
        timeline.pause();
      } catch {
        // Ignore errors during cleanup
      }
    });

    // Clear all pending timeouts
    pendingTimeouts.forEach((timeout) => clearTimeout(timeout));
    pendingTimeouts.length = 0;

    // Destroy all active timelines
    activeTimelines.forEach((timeline) => {
      try {
        timeline.destroy();
      } catch {
        // Ignore errors during cleanup
      }
    });
    activeTimelines.length = 0;

    // Ensure requestAnimationFrame and cancelAnimationFrame are always available as no-ops
    // This prevents errors when any remaining callbacks try to call these functions
    global.requestAnimationFrame = (() => 0) as typeof requestAnimationFrame;
    global.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame;

    // Restore mocks (this removes the spies)
    vi.restoreAllMocks();

    // Re-assign no-ops after restore (in case restore removed them)
    global.requestAnimationFrame = (() => 0) as typeof requestAnimationFrame;
    global.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame;
  });

  describe("constructor and initialization", () => {
    it("should initialize with steps", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 1000,
        },
      ]);

      expect(timeline.duration).toBe(1000);
      expect(mockElement1.style.transform).toBe("translateY(20px)");
      expect(mockElement1.style.opacity).toBe("0");
      expect(mockElement1.style.willChange).toBe("transform, opacity");
    });

    it("should initialize with empty steps", () => {
      const timeline = new HTMLTimeline([]);

      expect(timeline.duration).toBe(0);
    });

    it("should handle steps with delays", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 500,
          delay: 200,
        },
        {
          element: mockElement2,
          duration: 300,
          delay: 100,
        },
      ]);

      // Duration should be max of (delay + duration) for all steps
      expect(timeline.duration).toBe(700); // max(200+500, 100+300)
    });

    it("should call onEnter callback when provided", () => {
      const onEnter = vi.fn();
      const timeline = new HTMLTimeline(
        [
          {
            element: mockElement1,
            duration: 100,
          },
        ],
        { onEnter },
      );

      timeline.play();

      expect(onEnter).toHaveBeenCalled();
    });

    it("should not call onEnter if not provided", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      expect(() => timeline.play()).not.toThrow();
    });
  });

  describe("play and pause", () => {
    it("should start playing when play() is called", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.play();

      expect(rafSpy).toHaveBeenCalled();
    });

    it("should not start playing if already playing", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.play();
      const callCount = rafSpy.mock.calls.length;
      timeline.play();

      // Should not call raf again
      expect(rafSpy.mock.calls.length).toBe(callCount);
    });

    it("should pause when pause() is called", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.play();
      timeline.pause();

      expect(cancelRafSpy).toHaveBeenCalled();
    });

    it("should not pause if not playing", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.pause();

      expect(cancelRafSpy).not.toHaveBeenCalled();
    });

    it("should play from specific time when playFrom() is called", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          duration: 1000,
        },
      ]);

      timeline.playFrom(500);

      // Time may advance slightly due to tick() being called, so check it's close
      expect(timeline.time).toBeGreaterThanOrEqual(500);
      expect(timeline.time).toBeLessThan(550);
      expect(rafSpy).toHaveBeenCalled();
    });

    it("should clamp playFrom start time to 0", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.playFrom(-100);

      // Time may advance slightly due to tick() being called, so check it's close to 0
      expect(timeline.time).toBeGreaterThanOrEqual(0);
      expect(timeline.time).toBeLessThan(20);
    });
  });

  describe("seek", () => {
    it("should seek to specific progress (0-1)", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 1000,
        },
      ]);

      timeline.seek(0.5);

      expect(timeline.time).toBe(500);
    });

    it("should clamp seek to duration", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 1000,
        },
      ]);

      timeline.seek(2.0); // 200% progress

      expect(timeline.time).toBe(1000);
    });

    it("should clamp seek to 0", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 1000,
        },
      ]);

      timeline.seek(-0.5);

      expect(timeline.time).toBe(0);
    });

    it("should update element styles when seeking", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 1000,
        },
      ]);

      timeline.seek(0.5);

      // At 50% progress, transform should be interpolated
      expect(mockElement1.style.transform).toBeDefined();
    });
  });

  describe("reset", () => {
    it("should reset timeline to initial state", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 1000,
        },
      ]);

      timeline.seek(0.5);
      timeline.reset();

      expect(timeline.time).toBe(0);
      expect(mockElement1.style.transform).toBe("translateY(20px)");
      expect(mockElement1.style.opacity).toBe("0");
    });

    it("should call onLeave callback when reset", () => {
      const onLeave = vi.fn();
      const timeline = new HTMLTimeline(
        [
          {
            element: mockElement1,
            duration: 100,
          },
        ],
        { onLeave },
      );

      timeline.reset();

      expect(onLeave).toHaveBeenCalled();
    });

    it("should pause when reset", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.play();
      timeline.reset();

      expect(cancelRafSpy).toHaveBeenCalled();
    });
  });

  describe("reverse", () => {
    it("should reset timeline when reverse is called", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.seek(0.5);
      timeline.reverse();

      expect(timeline.time).toBe(0);
    });
  });

  describe("setSpeed", () => {
    it("should set playback speed", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.setSpeed(2);

      // Speed is used internally, can't directly test but shouldn't throw
      expect(() => timeline.play()).not.toThrow();
    });

    it("should clamp speed to 0 minimum", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.setSpeed(-1);

      // Should not throw
      expect(() => timeline.play()).not.toThrow();
    });
  });

  describe("duration calculation", () => {
    it("should calculate duration correctly with delays", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 500,
          delay: 100,
        },
        {
          element: mockElement2,
          duration: 300,
          delay: 200,
        },
      ]);

      expect(timeline.duration).toBe(600); // max(100+500, 200+300)
    });

    it("should return 0 for empty steps", () => {
      const timeline = new HTMLTimeline([]);

      expect(timeline.duration).toBe(0);
    });
  });

  describe("time tracking", () => {
    it("should return current time", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 1000,
        },
      ]);

      timeline.seek(0.3);

      expect(timeline.time).toBe(300);
    });
  });

  describe("opacity interpolation", () => {
    it("should interpolate opacity correctly", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromOpacity: 0,
          toOpacity: 1,
          duration: 1000,
        },
      ]);

      timeline.seek(0.5);

      const opacity = parseFloat(mockElement1.style.opacity);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });
  });

  describe("transform interpolation", () => {
    it("should interpolate translateY transform", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          duration: 1000,
        },
      ]);

      timeline.seek(0.5);

      // Should have interpolated value
      expect(mockElement1.style.transform).toContain("translateY");
    });
  });

  describe("easing", () => {
    it("should apply linear easing by default", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromOpacity: 0,
          toOpacity: 1,
          duration: 1000,
        },
      ]);

      timeline.seek(0.5);

      const opacity = parseFloat(mockElement1.style.opacity);
      expect(opacity).toBeCloseTo(0.5, 1);
    });

    it("should apply ease-out easing", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromOpacity: 0,
          toOpacity: 1,
          duration: 1000,
          easing: "ease-out",
        },
      ]);

      timeline.seek(0.5);

      const opacity = parseFloat(mockElement1.style.opacity);
      // Ease-out should be > 0.5 at 50% progress
      expect(opacity).toBeGreaterThan(0.5);
    });
  });

  describe("step timing", () => {
    it("should set initial values before step starts", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          duration: 1000,
          delay: 500,
        },
      ]);

      timeline.seek(0.25); // Before delay

      expect(mockElement1.style.transform).toBe("translateY(20px)");
    });

    it("should set final values after step ends", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          duration: 1000,
        },
      ]);

      timeline.seek(1.5); // After duration

      // The interpolation adds "px" to the value
      expect(mockElement1.style.transform).toBe("translateY(0px)");
    });
  });

  describe("destroy", () => {
    it("should pause and clear steps on destroy", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          duration: 100,
        },
      ]);

      timeline.play();
      timeline.destroy();

      expect(cancelRafSpy).toHaveBeenCalled();
      expect(timeline.duration).toBe(0);
    });
  });

  describe("error handling", () => {
    it("should handle missing element gracefully", () => {
      const timeline = new HTMLTimeline([
        {
          element: null as unknown as HTMLElement,
          duration: 100,
        },
      ]);

      expect(() => timeline.seek(0.5)).not.toThrow();
    });

    it("should handle zero duration steps", () => {
      const timeline = new HTMLTimeline([
        {
          element: mockElement1,
          fromOpacity: 0,
          toOpacity: 1,
          duration: 0,
        },
      ]);

      expect(() => timeline.seek(0.5)).not.toThrow();
    });
  });

  describe("enter/leave callbacks", () => {
    it("should call onEnter only once when playing", () => {
      const onEnter = vi.fn();
      const timeline = new HTMLTimeline(
        [
          {
            element: mockElement1,
            duration: 100,
          },
        ],
        { onEnter },
      );

      timeline.play();
      timeline.play(); // Call again

      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it("should call onEnter again after reset", () => {
      const onEnter = vi.fn();
      const timeline = new HTMLTimeline(
        [
          {
            element: mockElement1,
            duration: 100,
          },
        ],
        { onEnter },
      );

      timeline.play();
      timeline.reset();
      timeline.play();

      expect(onEnter).toHaveBeenCalledTimes(2);
    });
  });
});
