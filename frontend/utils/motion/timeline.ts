/**
 * AnimationTimeline - GSAP-style timeline engine for SVG animations
 *
 * Controls: play, pause, reverse, seek, setSpeed
 * Internal rAF loop with delta time tracking
 */

import type { AnimationManifest } from "./types";
import type { Direction, TimelineStep, Tween } from "./types";
import { lerpWithEasing } from "./easing";
import { setStrokeDashoffset, applyNumericStyle } from "./svg";

export class AnimationTimeline {
  private root: SVGSVGElement;
  private manifest: AnimationManifest;
  private steps: TimelineStep[] = [];
  private currentTime: number = 0;
  private direction: Direction = 1;
  private speed: number = 1;
  private isPlaying: boolean = false;
  private rafId: number | null = null;
  private lastFrameTime: number = 0;
  private elementCache: Map<string, SVGElement | null> = new Map();

  constructor(root: SVGSVGElement, manifest: AnimationManifest) {
    this.root = root;
    this.manifest = manifest;
    this.initializeSteps();
  }

  /**
   * Initialize timeline steps from manifest
   */
  private initializeSteps(): void {
    let maxEndTime = 0;

    this.steps = this.manifest.steps.map((step) => {
      const delay = step.delay ?? 0;
      const startTime = delay;
      const endTime = startTime + step.duration;

      const tween: Tween = {
        step,
        startTime,
        endTime,
        from: step.from,
        to: step.to,
        duration: step.duration,
        delay,
        easing: step.easing ?? "linear",
      };

      maxEndTime = Math.max(maxEndTime, endTime);

      return {
        tween,
        target: step.target,
        property: step.property,
      };
    });
  }

  /**
   * Get total duration of the timeline (ms)
   */
  get duration(): number {
    if (this.steps.length === 0) return 0;
    return Math.max(...this.steps.map((step) => step.tween.endTime));
  }

  /**
   * Get current timeline time (ms)
   */
  get time(): number {
    return this.currentTime;
  }

  /**
   * Play the timeline forward
   */
  play(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
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
   * Reverse the timeline direction
   */
  reverse(): void {
    this.direction = (this.direction === 1 ? -1 : 1) as Direction;
    if (this.isPlaying) {
      // Restart animation loop with new direction
      this.pause();
      this.play();
    }
  }

  /**
   * Seek to a specific time (ms)
   */
  seek(ms: number): void {
    this.currentTime = Math.max(0, Math.min(ms, this.duration));
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

    if (this.direction === 1) {
      this.currentTime = Math.min(this.currentTime + delta, this.duration);
      if (this.currentTime >= this.duration) {
        this.pause();
      }
    } else {
      this.currentTime = Math.max(this.currentTime - delta, 0);
      if (this.currentTime <= 0) {
        this.pause();
      }
    }

    this.update();

    if (this.isPlaying) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  /**
   * Update all active tweens based on current time
   */
  private update(): void {
    for (const step of this.steps) {
      const { tween, target, property } = step;

      // Check if tween is active at current time
      const isActive =
        this.currentTime >= tween.startTime &&
        this.currentTime <= tween.endTime;

      if (!isActive && this.currentTime < tween.startTime) {
        // Before start: set to initial value
        this.applyValue(target, property, tween.from);
        continue;
      }

      if (!isActive && this.currentTime > tween.endTime) {
        // After end: set to final value
        this.applyValue(target, property, tween.to);
        continue;
      }

      // Calculate progress [0, 1] within the tween duration
      const elapsed = this.currentTime - tween.startTime;
      const progress = tween.duration > 0 ? elapsed / tween.duration : 1;

      // Apply easing and interpolate
      const value = lerpWithEasing(
        tween.from,
        tween.to,
        progress,
        tween.easing,
      );

      // Apply to element
      this.applyValue(target, property, value);
    }
  }

  /**
   * Apply a value to an SVG element's property
   */
  private applyValue(target: string, property: string, value: number): void {
    // Get or cache element
    if (!this.elementCache.has(target)) {
      const element = this.root.querySelector(target) as SVGElement | null;
      this.elementCache.set(target, element);
    }

    const element = this.elementCache.get(target);
    if (!element) return;

    // Apply based on property type
    if (property === "strokeDashoffset") {
      if (
        element instanceof SVGPathElement ||
        element instanceof SVGPolygonElement
      ) {
        setStrokeDashoffset(element, value);
      }
    } else if (property === "opacity") {
      // For opacity, we can apply to any SVG element
      if (
        element instanceof SVGPathElement ||
        element instanceof SVGPolygonElement
      ) {
        // For paths, we might want to animate fill-opacity instead
        // But per spec, we animate the element's opacity
        applyNumericStyle(element, "opacity", value);
      } else {
        applyNumericStyle(element, "opacity", value);
      }
    } else {
      // Fallback: apply as generic numeric style
      applyNumericStyle(element, property, value);
    }
  }

  /**
   * Cleanup: stop animation and release resources
   */
  destroy(): void {
    this.pause();
    this.steps = [];
  }
}
