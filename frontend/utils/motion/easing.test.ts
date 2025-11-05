import { describe, it, expect } from "vitest";
import { lerp, getEasingFunction, lerpWithEasing, linear } from "./easing";

describe("lerp", () => {
  it("should interpolate linearly", () => {
    expect(lerp(10, 0, 0)).toBe(10);
    expect(lerp(10, 0, 1)).toBe(0);
    expect(lerp(10, 0, 0.5)).toBe(5);
  });

  it("should clamp t to [0, 1]", () => {
    expect(lerp(10, 0, -0.5)).toBe(10); // Clamped to 0
    expect(lerp(10, 0, 1.5)).toBe(0); // Clamped to 1
  });

  it("should handle from=to", () => {
    expect(lerp(5, 5, 0.5)).toBe(5);
  });

  it("should handle reverse interpolation", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});

describe("getEasingFunction", () => {
  it("should return linear for 'linear'", () => {
    const fn = getEasingFunction("linear");
    expect(fn(0)).toBe(0);
    expect(fn(0.5)).toBe(0.5);
    expect(fn(1)).toBe(1);
  });

  it("should return easing function for 'standard'", () => {
    const fn = getEasingFunction("standard");
    expect(fn(0)).toBeCloseTo(0, 5);
    expect(fn(1)).toBeCloseTo(1, 5);
    // Standard easing (cubic-bezier(0.2, 0, 0, 1)) is ease-out (starts fast, ends slow)
    // At t=0.1, eased value should be > 0.1
    expect(fn(0.1)).toBeGreaterThan(0.1);
  });

  it("should return easing function for 'emph'", () => {
    const fn = getEasingFunction("emph");
    expect(fn(0)).toBe(0);
    expect(fn(1)).toBe(1);
  });

  it("should parse cubic-bezier string", () => {
    const fn = getEasingFunction("cubic-bezier(0.2, 0, 0, 1)");
    expect(fn(0)).toBeCloseTo(0, 5);
    expect(fn(1)).toBeCloseTo(1, 5);
  });

  it("should fallback to linear for invalid easing", () => {
    const fn = getEasingFunction("invalid-easing");
    expect(fn(0.5)).toBe(0.5);
  });

  it("should fallback to linear for malformed cubic-bezier", () => {
    const fn = getEasingFunction("cubic-bezier(invalid)");
    expect(fn(0.5)).toBe(0.5);
  });
});

describe("lerpWithEasing", () => {
  it("should interpolate with linear easing", () => {
    expect(lerpWithEasing(10, 0, 0.5, "linear")).toBe(5);
  });

  it("should interpolate with easing function", () => {
    expect(lerpWithEasing(10, 0, 0.5, linear)).toBe(5);
  });

  it("should interpolate with easing name", () => {
    const result = lerpWithEasing(10, 0, 0.5, "standard");
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(10);
  });

  it("should handle edge cases", () => {
    expect(lerpWithEasing(10, 0, 0, "linear")).toBe(10);
    expect(lerpWithEasing(10, 0, 1, "linear")).toBe(0);
  });
});

describe("T-05: Tween interpolation verification", () => {
  it("should yield ~5 at 500ms for from=10, to=0, duration=1000", () => {
    const from = 10;
    const to = 0;
    const duration = 1000;
    const currentTime = 500;

    const t = currentTime / duration; // 0.5
    const result = lerp(from, to, t);

    expect(result).toBe(5);
  });

  it("should handle zero duration edge case", () => {
    const from = 10;
    const to = 0;
    const duration = 0;
    const currentTime = 0;

    // When duration is 0, t = 0 / 0 = NaN, but we should handle it
    const t = duration > 0 ? currentTime / duration : 1;
    const result = isNaN(t) ? to : lerp(from, to, t);

    // Zero duration should jump to end value
    expect(result).toBe(to);
  });

  it("should handle negative duration edge case", () => {
    const from = 10;
    const to = 0;
    const duration = -100;
    const currentTime = 50;

    const t = duration > 0 ? currentTime / duration : 1;
    const result = isNaN(t) || t < 0 ? to : lerp(from, to, t);

    expect(result).toBe(to);
  });

  it("should interpolate opacity correctly", () => {
    const from = 0;
    const to = 1;
    const t = 0.75;
    const result = lerp(from, to, t);
    expect(result).toBe(0.75);
  });

  it("should interpolate strokeDashoffset correctly", () => {
    const pathLength = 420;
    const from = pathLength;
    const to = 0;
    const t = 0.5;
    const result = lerp(from, to, t);
    expect(result).toBe(210);
  });

  it("should work with easing for mid-point", () => {
    const from = 10;
    const to = 0;
    const t = 0.5;
    const result = lerpWithEasing(from, to, t, "standard");

    // With standard easing, the result should be less than 5 (slower start)
    expect(result).toBeLessThan(5);
    expect(result).toBeGreaterThan(0);
  });
});
