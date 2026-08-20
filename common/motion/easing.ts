import { motion } from "../generated/motion";
import { clampProgress, lerp } from "./interpolation";
import type { Easing, EasingFunction } from "./types";

/** Linear easing with normalized progress. */
export function linear(progress: number): number {
  return clampProgress(progress);
}

/** Create an easing function from cubic Bézier control points. */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): EasingFunction {
  if (
    ![x1, y1, x2, y2].every(Number.isFinite) ||
    x1 < 0 ||
    x1 > 1 ||
    x2 < 0 ||
    x2 > 1
  ) {
    return linear;
  }

  return (progress: number): number => {
    const normalizedProgress = clampProgress(progress);
    if (normalizedProgress === 0 || normalizedProgress === 1) {
      return normalizedProgress;
    }

    let lower = 0;
    let upper = 1;
    let curvePosition = 0.5;

    for (let iteration = 0; iteration < 20; iteration += 1) {
      const x = cubicBezierPoint(curvePosition, 0, x1, x2, 1);
      if (Math.abs(x - normalizedProgress) < 0.0001) break;

      if (x < normalizedProgress) {
        lower = curvePosition;
      } else {
        upper = curvePosition;
      }
      curvePosition = (lower + upper) / 2;
    }

    return cubicBezierPoint(curvePosition, 0, y1, y2, 1);
  };
}

/** Parse a CSS cubic-bezier value, falling back to linear when invalid. */
export function parseCubicBezier(value: string): EasingFunction {
  const match = value.match(/^cubic-bezier\(([^)]+)\)$/);
  if (!match) return linear;

  const controlPoints = match[1]
    .split(",")
    .map((controlPoint) => Number(controlPoint.trim()));

  if (
    controlPoints.length !== 4 ||
    controlPoints.some((controlPoint) => !Number.isFinite(controlPoint))
  ) {
    return linear;
  }

  return cubicBezier(
    controlPoints[0],
    controlPoints[1],
    controlPoints[2],
    controlPoints[3],
  );
}

function cubicBezierPoint(
  progress: number,
  start: number,
  controlStart: number,
  controlEnd: number,
  end: number,
): number {
  const inverse = 1 - progress;

  return (
    inverse * inverse * inverse * start +
    3 * inverse * inverse * progress * controlStart +
    3 * inverse * progress * progress * controlEnd +
    progress * progress * progress * end
  );
}

export const standard = parseCubicBezier(motion.easing.standard);
export const emph = parseCubicBezier(motion.easing.emph);
export const easeOut = parseCubicBezier(motion.easing["ease-out"]);
export const easeInOut = parseCubicBezier(motion.easing["ease-in-out"]);

/** Cubic ease-in retained for compatibility with the existing HTML timeline. */
export function easeIn(progress: number): number {
  const normalizedProgress = clampProgress(progress);
  return normalizedProgress * normalizedProgress * normalizedProgress;
}

const easingPresets: Readonly<Record<string, EasingFunction>> = {
  linear,
  standard,
  emph,
  "ease-in": easeIn,
  "ease-out": easeOut,
  "ease-in-out": easeInOut,
};

/** Resolve a named or cubic Bézier easing, with a safe linear fallback. */
export function getEasingFunction(easing: string): EasingFunction {
  const preset = easingPresets[easing];
  if (preset) return preset;

  if (easing.startsWith("cubic-bezier(")) {
    return parseCubicBezier(easing);
  }

  return linear;
}

/** Apply a named or custom easing function to normalized progress. */
export function applyEasing(
  progress: number,
  easing: Easing = "linear",
): number {
  const easingFunction =
    typeof easing === "string" ? getEasingFunction(easing) : easing;

  return easingFunction(clampProgress(progress));
}

/** Interpolate a number after applying easing to its progress. */
export function lerpWithEasing(
  from: number,
  to: number,
  progress: number,
  easing: Easing = "linear",
): number {
  return lerp(from, to, applyEasing(progress, easing));
}
