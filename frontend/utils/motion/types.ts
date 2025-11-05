/**
 * Animation timeline types
 */

export type EasingName =
  | "standard"
  | "emph"
  | "linear"
  | `cubic-bezier(${string})`;

export interface AnimationStep {
  target: string; // '#logo-path-1'
  property: "strokeDashoffset" | "opacity";
  from: number;
  to: number;
  duration: number; // ms
  delay?: number; // ms
  easing?: EasingName;
}

export interface AnimationManifest {
  steps: AnimationStep[];
}

/**
 * Timeline direction: forward (1) or reverse (-1)
 */
export type Direction = 1 | -1;

/**
 * Tween represents a single animation segment
 */
export interface Tween {
  step: AnimationStep;
  startTime: number; // ms from timeline start
  endTime: number; // ms from timeline start
  from: number;
  to: number;
  duration: number;
  delay: number;
  easing: EasingName;
}

/**
 * Timeline step with resolved timing
 */
export interface TimelineStep {
  tween: Tween;
  target: string;
  property: string;
}
