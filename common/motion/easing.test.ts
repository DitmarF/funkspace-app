// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  applyEasing,
  getEasingFunction,
  lerpWithEasing,
  parseCubicBezier,
} from "./easing";

describe("motion easing", () => {
  it("runs without browser globals", () => {
    expect(globalThis).not.toHaveProperty("document");
  });

  it("resolves generated token presets", () => {
    expect(applyEasing(0, "standard")).toBe(0);
    expect(applyEasing(1, "emph")).toBe(1);
    expect(applyEasing(0.5, "ease-out")).toBeGreaterThan(0.5);
  });

  it("supports the HTML timeline easing vocabulary", () => {
    expect(applyEasing(0.5, "ease-in")).toBe(0.125);
    expect(applyEasing(0.5, "ease-in-out")).toBeGreaterThan(0.5);
  });

  it("parses custom cubic Bézier values", () => {
    const easing = parseCubicBezier("cubic-bezier(0.2, 0, 0, 1)");

    expect(easing(0)).toBe(0);
    expect(easing(0.5)).toBeGreaterThan(0.5);
    expect(easing(1)).toBe(1);
  });

  it("falls back to linear for invalid easing values", () => {
    expect(getEasingFunction("unknown")(0.4)).toBe(0.4);
    expect(parseCubicBezier("cubic-bezier(invalid)")(0.4)).toBe(0.4);
  });

  it("interpolates with named or custom easing functions", () => {
    expect(lerpWithEasing(0, 10, 0.5, "linear")).toBe(5);
    expect(lerpWithEasing(0, 10, 0.5, () => 0.25)).toBe(2.5);
  });
});
