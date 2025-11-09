/**
 * Easing functions and utilities for animation interpolation
 */

/**
 * Linear interpolation between two values
 * @param from Start value
 * @param to End value
 * @param t Progress factor [0, 1] (clamped)
 * @returns Interpolated value
 */
export function lerp(from: number, to: number, t: number): number {
  const clampedT = Math.max(0, Math.min(1, t));
  return from + (to - from) * clampedT;
}

/**
 * Easing function type: takes progress [0, 1] and returns eased progress [0, 1]
 */
export type EasingFunction = (t: number) => number;

/**
 * Linear easing (no easing)
 */
export function linear(t: number): number {
  return t;
}

/**
 * Parse cubic-bezier string and create easing function
 * @param bezierString e.g., "cubic-bezier(0.2, 0, 0, 1)"
 * @returns Easing function
 */
function parseCubicBezier(bezierString: string): EasingFunction {
  const match = bezierString.match(/cubic-bezier\(([^)]+)\)/);
  if (!match) {
    return linear; // Fallback to linear
  }

  const values = match[1].split(",").map((v) => parseFloat(v.trim()));
  if (values.length !== 4) {
    return linear; // Fallback to linear
  }

  const [x1, y1, x2, y2] = values;

  // Simple cubic bezier approximation using binary search
  // This is a simplified version; for production, consider using a more accurate implementation
  return (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    // Binary search for t that gives us the desired x
    let low = 0;
    let high = 1;
    let mid = 0.5;
    const epsilon = 0.0001;

    for (let i = 0; i < 20; i++) {
      const x = cubicBezierPoint(mid, 0, x1, x2, 1);
      if (Math.abs(x - t) < epsilon) break;
      if (x < t) {
        low = mid;
      } else {
        high = mid;
      }
      mid = (low + high) / 2;
    }

    return cubicBezierPoint(mid, 0, y1, y2, 1);
  };
}

/**
 * Calculate point on cubic bezier curve
 */
function cubicBezierPoint(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number,
): number {
  const u = 1 - t;
  return (
    u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  );
}

/**
 * Preset easing functions
 */
const easingPresets: Record<string, EasingFunction> = {
  linear,
  standard: (t: number) => {
    // cubic-bezier(0.2, 0, 0, 1)
    return parseCubicBezier("cubic-bezier(0.2, 0, 0, 1)")(t);
  },
  emph: (t: number) => {
    // cubic-bezier(0.05, 0.7, 0.1, 1)
    return parseCubicBezier("cubic-bezier(0.05, 0.7, 0.1, 1)")(t);
  },
};

/**
 * Get easing function from easing name
 * @param easingName Easing name or cubic-bezier string
 * @returns Easing function
 */
export function getEasingFunction(easingName: string): EasingFunction {
  // Check if it's a preset
  if (easingName in easingPresets) {
    return easingPresets[easingName];
  }

  // Check if it's a cubic-bezier string
  if (easingName.startsWith("cubic-bezier(")) {
    return parseCubicBezier(easingName);
  }

  // Fallback to linear
  return linear;
}

/**
 * Interpolate with easing
 * @param from Start value
 * @param to End value
 * @param t Progress factor [0, 1]
 * @param easing Easing function or name
 * @returns Interpolated value
 */
export function lerpWithEasing(
  from: number,
  to: number,
  t: number,
  easing: EasingFunction | string = "linear",
): number {
  const easingFn =
    typeof easing === "string" ? getEasingFunction(easing) : easing;
  const easedT = easingFn(t);
  return lerp(from, to, easedT);
}
