/**
 * HTMLTimeline - Simple timeline for HTML element animations
 *
 * Supports transform and opacity animations only (GPU-safe).
 * Designed for scroll-triggered animations with enter/leave controls.
 */

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
 */
export class HTMLTimeline {
  private steps: HTMLTimelineStep[] = [];
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
    if (this.steps.length === 0) return 0;
    return Math.max(
      ...this.steps.map((step) => (step.delay || 0) + step.duration),
    );
  }

  /**
   * Get current timeline time (ms)
   */
  get time(): number {
    return this.currentTime;
  }

  /**
   * Play the timeline from the beginning
   */
  playFrom(start: number = 0): void {
    this.currentTime = Math.max(0, start);
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.lastFrameTime = performance.now();
      if (!this.hasEntered && this.onEnter) {
        this.onEnter();
        this.hasEntered = true;
      }
      this.tick();
    }
  }

  /**
   * Play the timeline
   */
  play(): void {
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
   * Seek to a specific time (ms)
   */
  seek(progress: number): void {
    // Progress is 0-1, convert to time
    const targetTime = progress * this.duration;
    this.currentTime = Math.max(0, Math.min(targetTime, this.duration));
    this.update();
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
    const delta = (now - this.lastFrameTime) * this.speed;
    this.lastFrameTime = now;

    this.currentTime = Math.min(this.currentTime + delta, this.duration);
    this.update();

    if (this.currentTime >= this.duration) {
      this.pause();
    }

    if (this.isPlaying) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  /**
   * Update all active steps based on current time
   */
  private update(): void {
    for (const step of this.steps) {
      const element = step.element;
      if (!element) continue;

      const delay = step.delay || 0;
      const startTime = delay;
      const endTime = startTime + step.duration;

      // Check if step is active
      const isActive =
        this.currentTime >= startTime && this.currentTime <= endTime;

      if (this.currentTime < startTime) {
        // Before start: set to initial value
        if (step.fromTransform !== undefined) {
          element.style.transform = step.fromTransform;
        }
        if (step.fromOpacity !== undefined) {
          element.style.opacity = String(step.fromOpacity);
        }
        continue;
      }

      if (this.currentTime > endTime) {
        // After end: set to final value
        if (step.toTransform !== undefined) {
          element.style.transform = step.toTransform;
        }
        if (step.toOpacity !== undefined) {
          element.style.opacity = String(step.toOpacity);
        }
        continue;
      }

      if (!isActive) continue;

      // Calculate progress [0, 1] within the step duration
      const elapsed = this.currentTime - startTime;
      const progress = step.duration > 0 ? elapsed / step.duration : 1;

      // Apply easing (simple linear for now, can be extended)
      const easedProgress = this.applyEasing(progress, step.easing);

      // Interpolate transform
      if (step.fromTransform !== undefined && step.toTransform !== undefined) {
        // For simplicity, we'll interpolate numeric values
        // In a full implementation, we'd parse and interpolate transform strings
        const transform = this.interpolateTransform(
          step.fromTransform,
          step.toTransform,
          easedProgress,
        );
        element.style.transform = transform;
      }

      // Interpolate opacity
      if (step.fromOpacity !== undefined && step.toOpacity !== undefined) {
        const opacity =
          step.fromOpacity +
          (step.toOpacity - step.fromOpacity) * easedProgress;
        element.style.opacity = String(opacity);
      }
    }
  }

  /**
   * Apply easing function to progress
   */
  private applyEasing(progress: number, easing?: string): number {
    if (!easing || easing === "linear") {
      return progress;
    }

    // Simple easing implementations
    // Can be extended with more easing functions
    if (easing === "ease-out") {
      return 1 - Math.pow(1 - progress, 3);
    }
    if (easing === "ease-in") {
      return Math.pow(progress, 3);
    }
    if (easing === "ease-in-out") {
      return progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    }

    return progress;
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
      const value = fromValue + (toValue - fromValue) * progress;
      return `translateY(${value}px)`;
    }

    // Fallback: return final value if we can't parse
    return progress >= 1 ? to : from;
  }

  /**
   * Cleanup: stop animation and release resources
   */
  destroy(): void {
    this.pause();
    this.steps = [];
  }
}
