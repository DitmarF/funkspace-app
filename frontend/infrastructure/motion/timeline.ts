/**
 * AnimationTimeline - SVG renderer adapter for the shared motion timeline
 *
 * Controls: play, pause, reverse, seek, setSpeed
 * Internal rAF loop with delta time tracking
 */

import type {
  AnimationManifest,
  AnimationStep,
} from "@/domain/animations/AnimationManifest";
import {
  advanceTimeline,
  createTimeline,
  sampleTimeline,
  seekTimeline,
  type MotionTimeline,
  type TimelineDirection,
} from "@funkspace/common/motion";
import { setStrokeDashoffset, applyNumericStyle } from "./svg";

export class AnimationTimeline {
  private root: SVGSVGElement;
  private timeline: MotionTimeline<AnimationStep["property"]>;
  private currentTime: number = 0;
  private direction: TimelineDirection = 1;
  private speed: number = 1;
  private isPlaying: boolean = false;
  private rafId: number | null = null;
  private lastFrameTime: number = 0;
  private elementCache: Map<string, SVGElement | null> = new Map();

  constructor(root: SVGSVGElement, manifest: AnimationManifest) {
    this.root = root;
    this.timeline = createTimeline(manifest.steps);
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
    this.direction = this.direction === 1 ? -1 : 1;
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
    this.currentTime = seekTimeline(this.timeline, ms);
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
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    const advancement = advanceTimeline(
      {
        time: this.currentTime,
        duration: this.duration,
        direction: this.direction,
        speed: this.speed,
      },
      delta,
    );
    this.currentTime = advancement.state.time;

    if (advancement.completed) this.pause();

    this.update();

    if (this.isPlaying) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  /**
   * Update all active tweens based on current time
   */
  private update(): void {
    for (const sample of sampleTimeline(this.timeline, this.currentTime)) {
      this.applyValue(sample.tween.target, sample.tween.property, sample.value);
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
    // Check tagName for compatibility with jsdom (SVGPathElement not available in tests)
    const tagName = element.tagName?.toLowerCase();

    if (property === "strokeDashoffset") {
      if (
        tagName === "path" ||
        tagName === "polygon" ||
        tagName === "polyline"
      ) {
        setStrokeDashoffset(
          element as SVGPathElement | SVGPolygonElement,
          value,
        );
      }
    } else if (property === "opacity") {
      // For opacity, we can apply to any SVG element
      applyNumericStyle(element, "opacity", value);
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
    this.timeline = createTimeline([]);
    this.elementCache.clear();
  }
}
