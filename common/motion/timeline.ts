import { applyEasing } from "./easing";
import { clamp, clampProgress, lerp } from "./interpolation";
import type {
  MotionTimeline,
  ResolvedTween,
  TimelineAdvance,
  TimelineState,
  TweenDefinition,
  TweenPhase,
  TweenSample,
} from "./types";

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/** Resolve optional tween timing into an immutable renderer-neutral record. */
export function resolveTween<TProperty extends string>(
  definition: TweenDefinition<TProperty>,
): ResolvedTween<TProperty> {
  const duration = nonNegative(definition.duration);
  const delay = nonNegative(definition.delay ?? 0);

  return {
    target: definition.target,
    property: definition.property,
    from: definition.from,
    to: definition.to,
    duration,
    delay,
    startTime: delay,
    endTime: delay + duration,
    easing: definition.easing ?? "linear",
  };
}

/** Build timeline timing data without creating a clock or renderer. */
export function createTimeline<TProperty extends string>(
  definitions: readonly TweenDefinition<TProperty>[],
): MotionTimeline<TProperty> {
  const tweens = definitions.map(resolveTween);
  const duration = tweens.reduce(
    (maximum, tween) => Math.max(maximum, tween.endTime),
    0,
  );

  return { tweens, duration };
}

/** Identify whether timeline time is before, inside, or after a tween. */
export function getTweenPhase(tween: ResolvedTween, time: number): TweenPhase {
  if (time < tween.startTime) return "before";
  if (time > tween.endTime) return "after";
  return "active";
}

/** Sample one tween at an arbitrary timeline time. */
export function sampleTween<TProperty extends string>(
  tween: ResolvedTween<TProperty>,
  time: number,
): TweenSample<TProperty> {
  const phase = getTweenPhase(tween, time);
  const progress =
    phase === "before"
      ? 0
      : phase === "after" || tween.duration === 0
        ? 1
        : clampProgress((time - tween.startTime) / tween.duration);
  const easedProgress = applyEasing(progress, tween.easing);

  return {
    tween,
    phase,
    progress,
    easedProgress,
    value: lerp(tween.from, tween.to, easedProgress),
  };
}

/** Sample every tween without applying values to a rendering target. */
export function sampleTimeline<TProperty extends string>(
  timeline: MotionTimeline<TProperty>,
  time: number,
): readonly TweenSample<TProperty>[] {
  const timelineTime = seekTimeline(timeline, time);
  return timeline.tweens.map((tween) => sampleTween(tween, timelineTime));
}

/** Clamp an arbitrary seek time to a timeline's valid range. */
export function seekTimeline(timeline: MotionTimeline, time: number): number {
  return clamp(time, 0, timeline.duration);
}

/** Advance timeline state using an injected delta instead of a platform clock. */
export function advanceTimeline(
  state: TimelineState,
  deltaMilliseconds: number,
): TimelineAdvance {
  const duration = nonNegative(state.duration);
  const speed = nonNegative(state.speed);
  const currentTime = clamp(state.time, 0, duration);
  const delta = nonNegative(deltaMilliseconds) * speed * state.direction;
  const time = clamp(currentTime + delta, 0, duration);
  const completed =
    duration === 0 || (state.direction === 1 ? time === duration : time === 0);

  return {
    state: {
      time,
      duration,
      direction: state.direction,
      speed,
    },
    completed,
  };
}
