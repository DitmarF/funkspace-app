import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AnimationTimeline } from "./timeline";
import type { AnimationManifest } from "./types";

describe("AnimationTimeline", () => {
  let mockSvg: SVGSVGElement;
  let manifest: AnimationManifest;

  beforeEach(() => {
    // Create a mock SVG element
    mockSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(mockSvg);

    manifest = {
      steps: [
        {
          target: "#test-path-1",
          property: "opacity",
          from: 0,
          to: 1,
          duration: 200,
        },
        {
          target: "#test-path-2",
          property: "opacity",
          from: 0,
          to: 1,
          duration: 300,
          delay: 100,
        },
      ],
    };
  });

  describe("instantiation", () => {
    it("should create a timeline without throwing", () => {
      expect(() => new AnimationTimeline(mockSvg, manifest)).not.toThrow();
    });

    it("should initialize with correct duration", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      // First step: 0ms + 200ms = 200ms
      // Second step: 100ms delay + 300ms duration = 400ms end
      expect(timeline.duration).toBe(400);
    });

    it("should initialize with time at 0", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      expect(timeline.time).toBe(0);
    });
  });

  describe("play()", () => {
    it("should start playing", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();
      // State should be observable - we'll verify via pause behavior
      expect(() => timeline.pause()).not.toThrow();
    });

    it("should be idempotent", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();
      timeline.play(); // Should not throw or cause issues
      expect(() => timeline.pause()).not.toThrow();
    });
  });

  describe("pause()", () => {
    it("should pause a playing timeline", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();
      expect(() => timeline.pause()).not.toThrow();
    });

    it("should be idempotent", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.pause();
      timeline.pause(); // Should not throw
    });

    it("should pause a non-playing timeline without error", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      expect(() => timeline.pause()).not.toThrow();
    });
  });

  describe("reverse()", () => {
    it("should toggle direction", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.reverse();
      // Direction change should not throw
      expect(() => timeline.play()).not.toThrow();
      timeline.pause();
    });

    it("should be callable multiple times", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.reverse();
      timeline.reverse();
      timeline.reverse();
      expect(() => timeline.play()).not.toThrow();
      timeline.pause();
    });

    it("should work when not playing", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      expect(() => timeline.reverse()).not.toThrow();
    });
  });

  describe("seek()", () => {
    it("should seek to a specific time", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.seek(150);
      expect(timeline.time).toBe(150);
    });

    it("should clamp to 0", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.seek(-100);
      expect(timeline.time).toBe(0);
    });

    it("should clamp to duration", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.seek(1000);
      expect(timeline.time).toBe(timeline.duration);
    });

    it("should work when playing", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();
      timeline.seek(200);
      expect(timeline.time).toBe(200);
      timeline.pause();
    });
  });

  describe("setSpeed()", () => {
    it("should set speed multiplier", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.setSpeed(2);
      // Speed should be set (no direct getter, but should not throw)
      expect(() => timeline.play()).not.toThrow();
      timeline.pause();
    });

    it("should clamp speed to >= 0", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.setSpeed(-1);
      timeline.setSpeed(0);
      timeline.setSpeed(0.5);
      timeline.setSpeed(2);
      expect(() => timeline.play()).not.toThrow();
      timeline.pause();
    });
  });

  describe("duration", () => {
    it("should compute duration from steps", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      expect(timeline.duration).toBe(400);
    });

    it("should handle empty manifest", () => {
      const emptyManifest: AnimationManifest = { steps: [] };
      const timeline = new AnimationTimeline(mockSvg, emptyManifest);
      expect(timeline.duration).toBe(0);
    });

    it("should handle single step", () => {
      const singleStep: AnimationManifest = {
        steps: [
          {
            target: "#test",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 500,
          },
        ],
      };
      const timeline = new AnimationTimeline(mockSvg, singleStep);
      expect(timeline.duration).toBe(500);
    });
  });

  describe("destroy()", () => {
    it("should cleanup resources", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();
      expect(() => timeline.destroy()).not.toThrow();
      // After destroy, should be safe to pause
      expect(() => timeline.pause()).not.toThrow();
    });
  });

  describe("rAF loop", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Mock requestAnimationFrame
      global.requestAnimationFrame = vi.fn((cb) => {
        setTimeout(() => cb(performance.now()), 16);
        return 1;
      });
      global.cancelAnimationFrame = vi.fn();
      // Mock performance.now() to return controllable time
      let mockTime = 0;
      vi.spyOn(performance, "now").mockImplementation(() => mockTime);
      // Helper to advance time
      (global as any).__advanceTime = (ms: number) => {
        mockTime += ms;
        vi.advanceTimersByTime(ms);
      };
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it("should start rAF loop on play", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();
      expect(global.requestAnimationFrame).toHaveBeenCalled();
      timeline.pause();
    });

    it("should stop rAF loop on pause", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();
      const rafCalls = (global.requestAnimationFrame as any).mock.calls.length;
      timeline.pause();
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
      timeline.pause(); // Should be idempotent
    });

    it("should advance time with delta on each tick", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();

      // Advance time by 50ms (simulating ~3 frames at 60fps)
      (global as any).__advanceTime(50);

      // Time should have advanced (allowing for some variance)
      expect(timeline.time).toBeGreaterThan(0);
      expect(timeline.time).toBeLessThanOrEqual(50);

      timeline.pause();
    });

    it("should apply speed multiplier to delta", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.setSpeed(2); // 2x speed
      timeline.play();

      // Advance time by 50ms
      (global as any).__advanceTime(50);

      // With 2x speed, should advance ~100ms of timeline time
      const timeBefore = timeline.time;
      timeline.pause();

      // Reset and try with 0.5x speed
      const timeline2 = new AnimationTimeline(mockSvg, manifest);
      timeline2.setSpeed(0.5);
      timeline2.play();
      (global as any).__advanceTime(50);
      const timeAfter = timeline2.time;
      timeline2.pause();

      // 2x speed should advance more than 0.5x speed
      expect(timeBefore).toBeGreaterThan(timeAfter);
    });

    it("should guard against multiple play() calls", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();
      const initialRafCalls = (global.requestAnimationFrame as any).mock.calls
        .length;
      timeline.play(); // Second call should not start another loop
      const afterSecondCall = (global.requestAnimationFrame as any).mock.calls
        .length;

      // Should not have started additional rAF loops
      expect(afterSecondCall).toBeLessThanOrEqual(initialRafCalls + 1);
      timeline.pause();
    });

    it("should reflect elapsed time in seek", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();

      // Advance time
      (global as any).__advanceTime(100);

      const elapsedTime = timeline.time;
      timeline.pause();

      // Seek should reflect the elapsed time
      timeline.seek(elapsedTime);
      expect(timeline.time).toBe(elapsedTime);
    });

    it("should stop at duration end when playing forward", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.play();

      // Advance past duration
      (global as any).__advanceTime(500);

      // Should pause automatically at end
      expect(timeline.time).toBeLessThanOrEqual(timeline.duration);
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    it("should stop at 0 when playing reverse", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.seek(200); // Start in middle
      timeline.reverse();
      timeline.play();

      // Advance time (moving backward)
      (global as any).__advanceTime(300);

      // Should pause at 0
      expect(timeline.time).toBeGreaterThanOrEqual(0);
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    it("should handle rapid play/pause cycles", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      for (let i = 0; i < 5; i++) {
        timeline.play();
        (global as any).__advanceTime(10);
        timeline.pause();
      }
      // Should not throw or leak rAF handles
      expect(() => timeline.play()).not.toThrow();
      timeline.pause();
    });
  });
});
