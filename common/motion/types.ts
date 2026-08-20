import type { MotionEasingToken } from "../generated/motion";

export type EasingName =
  | MotionEasingToken
  | "ease-in"
  | `cubic-bezier(${string})`;

export type EasingFunction = (progress: number) => number;

export type Easing = string | EasingFunction;

export type TimelineDirection = 1 | -1;

export type TweenPhase = "before" | "active" | "after";

export interface TweenDefinition<TProperty extends string = string> {
  readonly target: string;
  readonly property: TProperty;
  readonly from: number;
  readonly to: number;
  readonly duration: number;
  readonly delay?: number;
  readonly easing?: string;
}

export interface ResolvedTween<TProperty extends string = string> {
  readonly target: string;
  readonly property: TProperty;
  readonly from: number;
  readonly to: number;
  readonly duration: number;
  readonly delay: number;
  readonly startTime: number;
  readonly endTime: number;
  readonly easing: string;
}

export interface MotionTimeline<TProperty extends string = string> {
  readonly tweens: readonly ResolvedTween<TProperty>[];
  readonly duration: number;
}

export interface TweenSample<TProperty extends string = string> {
  readonly tween: ResolvedTween<TProperty>;
  readonly phase: TweenPhase;
  readonly progress: number;
  readonly easedProgress: number;
  readonly value: number;
}

export interface TimelineState {
  readonly time: number;
  readonly duration: number;
  readonly direction: TimelineDirection;
  readonly speed: number;
}

export interface TimelineAdvance {
  readonly state: TimelineState;
  readonly completed: boolean;
}
