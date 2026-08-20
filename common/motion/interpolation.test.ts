// @vitest-environment node

import { describe, expect, it } from "vitest";
import { clamp, clampProgress, interpolateNumber, lerp } from "./interpolation";

describe("motion interpolation", () => {
  it("clamps values to an inclusive range", () => {
    expect(clamp(-4, 0, 10)).toBe(0);
    expect(clamp(14, 0, 10)).toBe(10);
    expect(clamp(4, 10, 0)).toBe(4);
  });

  it("normalizes invalid and out-of-range progress", () => {
    expect(clampProgress(Number.NaN)).toBe(0);
    expect(clampProgress(-0.5)).toBe(0);
    expect(clampProgress(1.5)).toBe(1);
  });

  it("interpolates numbers without extrapolating", () => {
    expect(lerp(10, 20, 0.5)).toBe(15);
    expect(interpolateNumber(10, 20, -1)).toBe(10);
    expect(interpolateNumber(10, 20, 2)).toBe(20);
  });
});
