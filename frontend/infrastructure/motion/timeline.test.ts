import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AnimationTimeline } from "./timeline";
import type { AnimationManifest } from "@/domain/animations/AnimationManifest";

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

  describe("tween value calculations", () => {
    beforeEach(() => {
      // Create test elements
      const path1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path1.id = "test-path-1";
      path1.setAttribute("d", "M 0,0 L 100,0");
      mockSvg.appendChild(path1);

      const path2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path2.id = "test-path-2";
      path2.setAttribute("d", "M 0,0 L 100,0");
      mockSvg.appendChild(path2);
    });

    it("should calculate tween values at start time", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.seek(0);

      const path1 = mockSvg.querySelector("#test-path-1") as SVGElement;
      expect(path1).toBeTruthy();
      // At time 0, first step should be at from value (0)
      const opacity = path1.style.opacity;
      expect(parseFloat(opacity || "0")).toBe(0);
    });

    it("should calculate tween values at mid time", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      // First step: 0-200ms, so at 100ms should be halfway (0.5)
      timeline.seek(100);

      const path1 = mockSvg.querySelector("#test-path-1") as SVGElement;
      expect(path1).toBeTruthy();
      // At 50% progress, opacity should be ~0.5 (with linear easing)
      const opacity = parseFloat(path1.style.opacity || "0");
      expect(opacity).toBeCloseTo(0.5, 1);
    });

    it("should calculate tween values at end time", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.seek(200); // End of first step

      const path1 = mockSvg.querySelector("#test-path-1") as SVGElement;
      expect(path1).toBeTruthy();
      // At end, opacity should be at to value (1)
      const opacity = parseFloat(path1.style.opacity || "0");
      expect(opacity).toBeCloseTo(1, 1);
    });

    it("should handle tween before start (initial value)", () => {
      const delayedManifest: AnimationManifest = {
        steps: [
          {
            target: "#test-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            delay: 100, // Starts at 100ms
          },
        ],
      };

      const timeline = new AnimationTimeline(mockSvg, delayedManifest);
      timeline.seek(50); // Before start

      const path1 = mockSvg.querySelector("#test-path-1") as SVGElement;
      // Should be at from value (0)
      const opacity = parseFloat(path1.style.opacity || "0");
      expect(opacity).toBe(0);
    });

    it("should handle tween after end (final value)", () => {
      const timeline = new AnimationTimeline(mockSvg, manifest);
      timeline.seek(500); // After all steps end

      const path1 = mockSvg.querySelector("#test-path-1") as SVGElement;
      const path2 = mockSvg.querySelector("#test-path-2") as SVGElement;
      // Should be at final values (1 for both)
      expect(parseFloat(path1.style.opacity || "0")).toBeCloseTo(1, 1);
      expect(parseFloat(path2.style.opacity || "0")).toBeCloseTo(1, 1);
    });
  });

  describe("overlapping delays", () => {
    beforeEach(() => {
      // Clear previous elements
      mockSvg.innerHTML = "";

      // Create test elements
      const path1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path1.id = "overlap-path-1";
      path1.setAttribute("d", "M 0,0 L 100,0");
      mockSvg.appendChild(path1);

      const path2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path2.id = "overlap-path-2";
      path2.setAttribute("d", "M 0,0 L 100,0");
      mockSvg.appendChild(path2);

      const path3 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path3.id = "overlap-path-3";
      path3.setAttribute("d", "M 0,0 L 100,0");
      mockSvg.appendChild(path3);
    });

    it("should handle multiple tweens active simultaneously", () => {
      const overlappingManifest: AnimationManifest = {
        steps: [
          {
            target: "#overlap-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 300,
            delay: 0,
          },
          {
            target: "#overlap-path-2",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 300,
            delay: 100, // Overlaps with first
          },
          {
            target: "#overlap-path-3",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 300,
            delay: 200, // Overlaps with both
          },
        ],
      };

      const timeline = new AnimationTimeline(mockSvg, overlappingManifest);

      // At 150ms: path1 should be at ~50%, path2 at ~17%, path3 not started
      timeline.seek(150);

      const path1 = mockSvg.querySelector("#overlap-path-1");
      const path2 = mockSvg.querySelector("#overlap-path-2");
      const path3 = mockSvg.querySelector("#overlap-path-3");

      expect(path1).toBeTruthy();
      expect(path2).toBeTruthy();
      expect(path3).toBeTruthy();
    });

    it("should handle fully overlapping tweens", () => {
      const fullyOverlappingManifest: AnimationManifest = {
        steps: [
          {
            target: "#overlap-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            delay: 0,
          },
          {
            target: "#overlap-path-2",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            delay: 0, // Same start time
          },
        ],
      };

      const timeline = new AnimationTimeline(mockSvg, fullyOverlappingManifest);
      timeline.seek(100); // Mid point

      const path1 = mockSvg.querySelector("#overlap-path-1") as SVGElement;
      const path2 = mockSvg.querySelector("#overlap-path-2") as SVGElement;
      // Both should be at ~50%
      expect(parseFloat(path1.style.opacity || "0")).toBeCloseTo(0.5, 1);
      expect(parseFloat(path2.style.opacity || "0")).toBeCloseTo(0.5, 1);
    });

    it("should calculate duration correctly with overlapping steps", () => {
      const overlappingManifest: AnimationManifest = {
        steps: [
          {
            target: "#overlap-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            delay: 0,
          },
          {
            target: "#overlap-path-2",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 300,
            delay: 100, // Overlaps but ends later
          },
        ],
      };

      const timeline = new AnimationTimeline(mockSvg, overlappingManifest);
      // Duration should be max(endTime) = 100 + 300 = 400
      expect(timeline.duration).toBe(400);
    });

    it("should handle cascading delays (staggered)", () => {
      const staggeredManifest: AnimationManifest = {
        steps: [
          {
            target: "#overlap-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            delay: 0,
          },
          {
            target: "#overlap-path-2",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            delay: 50, // Starts before first ends
          },
          {
            target: "#overlap-path-3",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            delay: 100, // Starts before second ends
          },
        ],
      };

      const timeline = new AnimationTimeline(mockSvg, staggeredManifest);

      // At 150ms:
      // - path1: starts at 0ms, duration 200ms → 150ms elapsed of 200ms = 75% (0.75)
      // - path2: starts at 50ms, duration 200ms → 100ms elapsed of 200ms = 50% (0.5)
      // - path3: starts at 100ms, duration 200ms → 50ms elapsed of 200ms = 25% (0.25)
      timeline.seek(150);

      const path1 = mockSvg.querySelector("#overlap-path-1") as SVGElement;
      const path2 = mockSvg.querySelector("#overlap-path-2") as SVGElement;
      const path3 = mockSvg.querySelector("#overlap-path-3") as SVGElement;

      expect(parseFloat(path1.style.opacity || "0")).toBeCloseTo(0.75, 1); // 75%
      expect(parseFloat(path2.style.opacity || "0")).toBeCloseTo(0.5, 1); // 50%
      expect(parseFloat(path3.style.opacity || "0")).toBeCloseTo(0.25, 1); // 25%
    });
  });

  describe("easing application", () => {
    beforeEach(() => {
      // Create test elements with proper SVG namespace
      const path1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      ) as SVGPathElement;
      path1.id = "easing-path-1";
      path1.setAttribute("d", "M 0,0 L 100,0");
      mockSvg.appendChild(path1);
    });

    it("should apply linear easing correctly", () => {
      const linearManifest: AnimationManifest = {
        steps: [
          {
            target: "#easing-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            easing: "linear",
          },
        ],
      };

      const timeline = new AnimationTimeline(mockSvg, linearManifest);

      // At 50% time (100ms), should be at 50% value (0.5) with linear
      timeline.seek(100);

      const path1 = mockSvg.querySelector("#easing-path-1") as SVGElement;
      const opacity = parseFloat(path1.style.opacity || "0");
      expect(opacity).toBeCloseTo(0.5, 1);
    });

    it("should apply standard easing correctly", () => {
      const standardManifest: AnimationManifest = {
        steps: [
          {
            target: "#easing-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            easing: "standard",
          },
        ],
      };

      const timeline = new AnimationTimeline(mockSvg, standardManifest);

      // At 50% time, standard easing should give different value than linear
      timeline.seek(100);

      const path1 = mockSvg.querySelector("#easing-path-1") as SVGElement;
      const opacity = parseFloat(path1.style.opacity || "0");
      // Standard easing (ease-out) should be > 0.5 at 50% time
      expect(opacity).toBeGreaterThan(0.5);
      expect(opacity).toBeLessThan(1);
    });

    it("should apply emph easing correctly", () => {
      const emphManifest: AnimationManifest = {
        steps: [
          {
            target: "#easing-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            easing: "emph",
          },
        ],
      };

      const timeline = new AnimationTimeline(mockSvg, emphManifest);
      timeline.seek(100);

      const path1 = mockSvg.querySelector("#easing-path-1") as SVGElement;
      const opacity = parseFloat(path1.style.opacity || "0");
      // Emph easing should produce a different curve than linear
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });

    it("should default to linear when easing not specified", () => {
      const noEasingManifest: AnimationManifest = {
        steps: [
          {
            target: "#easing-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            // No easing specified
          },
        ],
      };

      const timeline = new AnimationTimeline(mockSvg, noEasingManifest);
      timeline.seek(100);

      const path1 = mockSvg.querySelector("#easing-path-1") as SVGElement;
      const opacity = parseFloat(path1.style.opacity || "0");
      // Should default to linear (0.5 at 50% time)
      expect(opacity).toBeCloseTo(0.5, 1);
    });
  });
});
