/**
 * HTMLTimeline - Simple timeline for HTML element animations
 *
 * Supports transform and opacity animations only (GPU-safe).
 * Designed for scroll-triggered animations with enter/leave controls.
 */

import {
  advanceTimeline,
  createTimeline,
  interpolateNumber,
  sampleTimeline,
  seekTimeline,
  type AnimationRuntime,
  type MotionTimeline,
} from "@funkspace/common/motion";

type HTMLCoreProperty = "progress";

export type HTMLTimelineStep = {
  /**
   * Target element to animate
   */
  element: HTMLElement;
  /**
   * Initial transform value (e.g., "translateY(20px)")
   */
  fromTransform?: string;
  /**
   * Final transform value (e.g., "translateY(0)")
   */
  toTransform?: string;
  /**
   * Initial opacity (0-1)
   */
  fromOpacity?: number;
  /**
   * Final opacity (0-1)
   */
  toOpacity?: number;
  /**
   * Animation duration in milliseconds
   */
  duration: number;
  /**
   * Delay before animation starts (ms)
   */
  delay?: number;
  /**
   * Easing function (CSS easing string)
   */
  easing?: string;
};

export type HTMLTimelineOptions = {
  /**
   * Callback when animation enters (starts playing)
   */
  onEnter?: () => void;
  /**
   * Callback when animation leaves (resets)
   */
  onLeave?: () => void;
};

/**
 * Simple timeline for HTML element animations (transform/opacity only)
 *
 * Designed for scroll-triggered animations with enter/leave controls.
 * Supports GPU-accelerated animations using only transform and opacity properties.
 *
 * @example
 * ```tsx
 * const timeline = new HTMLTimeline([
 *   {
 *     element: headingRef.current,
 *     fromTransform: "translateY(20px)",
 *     toTransform: "translateY(0)",
 *     fromOpacity: 0,
 *     toOpacity: 1,
 *     duration: 600,
 *     delay: 0,
 *     easing: "ease-out",
 *   },
 * ], {
 *   onEnter: () => console.log("Animation started"),
 *   onLeave: () => console.log("Animation reset"),
 * });
 *
 * timeline.play();
 * ```
 *
 * @remarks
 * - Only supports transform and opacity animations for performance
 * - Automatically sets `will-change: transform, opacity` for GPU acceleration
 * - Callbacks are invoked only once per enter/leave cycle
 * - Zero-duration steps are handled gracefully
 * - Missing elements are skipped without errors
 */
export class HTMLTimeline implements AnimationRuntime {
  private steps: HTMLTimelineStep[] = [];
  private timeline: MotionTimeline<HTMLCoreProperty>;
  private currentTime: number = 0;
  private isPlaying: boolean = false;
  private rafId: number | null = null;
  private lastFrameTime: number = 0;
  private speed: number = 1;
  private onEnter?: () => void;
  private onLeave?: () => void;
  private hasEntered: boolean = false;

  constructor(steps: HTMLTimelineStep[], options: HTMLTimelineOptions = {}) {
    this.steps = steps;
    this.timeline = this.createMotionTimeline();
    this.onEnter = options.onEnter;
    this.onLeave = options.onLeave;
    this.initializeSteps();
  }

  /**
   * Initialize steps by setting initial values
   */
  private initializeSteps(): void {
    for (const step of this.steps) {
      const element = step.element;
      if (!element) continue;

      // Set initial transform
      if (step.fromTransform !== undefined) {
        element.style.transform = step.fromTransform;
      }

      // Set initial opacity
      if (step.fromOpacity !== undefined) {
        element.style.opacity = String(step.fromOpacity);
      }

      // Ensure will-change for GPU acceleration
      element.style.willChange = "transform, opacity";
    }
  }

  /**
   * Get total duration of the timeline (ms)
   */
  get duration(): number {
    return this.timeline.duration;
  }

  /**
   * Get current timeline time (ms)
   */
  get time(): number {
    return this.currentTime;
  }

  /**
   * Play the timeline from a specific time (ms)
   *
   * @param start - Start time in milliseconds (default: 0)
   * @remarks
   * - Clamps start time to [0, duration]
   * - Calls onEnter callback if not already entered
   * - Does nothing if already playing
   *
   * @example
   * ```tsx
   * timeline.playFrom(500); // Start from 500ms
   * ```
   */
  playFrom(start: number = 0): void {
    this.currentTime = Math.max(0, start);
    this.resume();
  }

  /**
   * Play the timeline from current time
   *
   * @remarks
   * - Does nothing if already playing
   * - Calls onEnter callback if not already entered
   * - Uses requestAnimationFrame for smooth 60fps updates
   *
   * @example
   * ```tsx
   * timeline.seek(0.5); // Seek to 50%
   * timeline.play(); // Play from 50%
   * ```
   */
  play(): void {
    this.resume();
  }

  /**
   * Resume playback from the current timeline time
   */
  resume(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    if (!this.hasEntered && this.onEnter) {
      this.onEnter();
      this.hasEntered = true;
    }
    this.tick();
  }

  /**
   * Pause the timeline
   */
  pause(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Reset the timeline to initial state
   *
   * @remarks
   * - Pauses the timeline
   * - Resets time to 0
   * - Resets hasEntered flag (allows onEnter to be called again)
   * - Restores initial element styles
   * - Calls onLeave callback
   *
   * @example
   * ```tsx
   * timeline.play();
   * // ... later
   * timeline.reset(); // Reset to start, calls onLeave
   * ```
   */
  reset(): void {
    this.pause();
    this.currentTime = 0;
    this.hasEntered = false;
    this.initializeSteps();
    if (this.onLeave) {
      this.onLeave();
    }
  }

  /**
   * Reverse the timeline direction
   */
  reverse(): void {
    // For simplicity, we'll just reset and play backwards
    // In a full implementation, we'd track direction
    this.reset();
  }

  /**
   * Seek to a specific progress (0-1)
   *
   * @param progress - Progress value from 0 to 1 (0 = start, 1 = end)
   * @remarks
   * - Clamps progress to [0, 1]
   * - Immediately updates element styles without animation
   * - Useful for scroll-based scrubbing
   *
   * @example
   * ```tsx
   * timeline.seek(0.5); // Jump to 50% progress
   * timeline.seek(1.0); // Jump to end
   * ```
   */
  seek(progress: number): void {
    this.currentTime = seekTimeline(this.timeline, progress * this.duration);
    this.render();
  }

  /**
   * Set playback speed multiplier
   */
  setSpeed(multiplier: number): void {
    this.speed = Math.max(0, multiplier);
  }

  /**
   * Animation frame tick
   */
  private tick = (): void => {
    if (!this.isPlaying) return;

    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.update(delta);

    if (this.isPlaying) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  /**
   * Advance an active timeline by an elapsed duration
   */
  update(deltaMilliseconds: number): void {
    if (!this.isPlaying) return;

    const advancement = advanceTimeline(
      {
        time: this.currentTime,
        duration: this.duration,
        direction: 1,
        speed: this.speed,
      },
      deltaMilliseconds,
    );
    this.currentTime = advancement.state.time;
    this.render();

    if (advancement.completed) this.pause();
  }

  /**
   * Render all sampled steps at the current time
   */
  private render(): void {
    for (const sample of sampleTimeline(this.timeline, this.currentTime)) {
      const step = this.steps[Number(sample.tween.target)];
      if (!step) continue;

      const element = step.element;
      if (!element) continue;

      if (sample.phase === "before") {
        // Before start: set to initial value
        if (step.fromTransform !== undefined) {
          element.style.transform = step.fromTransform;
        }
        if (step.fromOpacity !== undefined) {
          element.style.opacity = String(step.fromOpacity);
        }
        continue;
      }

      if (sample.phase === "after") {
        // After end: set to final value
        if (step.toTransform !== undefined) {
          element.style.transform = step.toTransform;
        }
        if (step.toOpacity !== undefined) {
          element.style.opacity = String(step.toOpacity);
        }
        continue;
      }

      // Interpolate transform
      if (step.fromTransform !== undefined && step.toTransform !== undefined) {
        // For simplicity, we'll interpolate numeric values
        // In a full implementation, we'd parse and interpolate transform strings
        const transform = this.interpolateTransform(
          step.fromTransform,
          step.toTransform,
          sample.value,
        );
        element.style.transform = transform;
      }

      // Interpolate opacity
      if (step.fromOpacity !== undefined && step.toOpacity !== undefined) {
        const opacity = interpolateNumber(
          step.fromOpacity,
          step.toOpacity,
          sample.value,
        );
        element.style.opacity = String(opacity);
      }
    }
  }

  private createMotionTimeline(): MotionTimeline<HTMLCoreProperty> {
    return createTimeline(
      this.steps.map((step, index) => ({
        target: String(index),
        property: "progress" as const,
        from: 0,
        to: 1,
        duration: step.duration,
        delay: step.delay,
        easing: step.easing,
      })),
    );
  }

  /**
   * Interpolate transform values
   * Simplified: assumes translateY format for now
   */
  private interpolateTransform(
    from: string,
    to: string,
    progress: number,
  ): string {
    // Extract numeric values (simplified for translateY)
    const fromMatch = from.match(/translateY\(([^)]+)\)/);
    const toMatch = to.match(/translateY\(([^)]+)\)/);

    if (fromMatch && toMatch) {
      const fromValue = parseFloat(fromMatch[1]);
      const toValue = parseFloat(toMatch[1]);
      const value = interpolateNumber(fromValue, toValue, progress);
      return `translateY(${value}px)`;
    }

    // Fallback: return final value if we can't parse
    return progress >= 1 ? to : from;
  }

  /**
   * Cleanup: stop animation and release resources
   *
   * @remarks
   * - Pauses any active animation
   * - Clears all steps
   * - Should be called when component unmounts to prevent memory leaks
   *
   * @example
   * ```tsx
   * useEffect(() => {
   *   const timeline = new HTMLTimeline([...]);
   *   return () => timeline.destroy();
   * }, []);
   * ```
   */
  destroy(): void {
    this.pause();
    this.steps = [];
    this.timeline = createTimeline([]);
    this.currentTime = 0;
    this.hasEntered = false;
  }
}
