/** Clamp a number to an inclusive range. */
export function clamp(value: number, first: number, second: number): number {
  const minimum = Math.min(first, second);
  const maximum = Math.max(first, second);

  if (Number.isNaN(value)) return minimum;

  return Math.max(minimum, Math.min(maximum, value));
}

/** Clamp animation progress to the normalized 0–1 range. */
export function clampProgress(progress: number): number {
  return clamp(progress, 0, 1);
}

/** Linearly interpolate between two numeric values. */
export function lerp(from: number, to: number, progress: number): number {
  const normalizedProgress = clampProgress(progress);
  return from + (to - from) * normalizedProgress;
}

/** Descriptive alias for numeric interpolation at renderer boundaries. */
export const interpolateNumber = lerp;
