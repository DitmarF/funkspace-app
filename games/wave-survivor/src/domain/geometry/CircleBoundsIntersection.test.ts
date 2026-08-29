import { describe, expect, it } from "vitest";
import { createBounds } from "../arena/index.js";
import { doesCircleIntersectBounds } from "./CircleBoundsIntersection.js";

const BOUNDS = createBounds(10, 20, 100, 200);

describe("doesCircleIntersectBounds", () => {
  it.each([
    ["left", { x: 5, y: 120 }],
    ["right", { x: 115, y: 120 }],
    ["top", { x: 60, y: 15 }],
    ["bottom", { x: 60, y: 225 }],
  ] as const)(
    "counts exact %s-edge tangency as intersection",
    (_edge, center) => {
      expect(doesCircleIntersectBounds(center, 5, BOUNDS)).toBe(true);
    },
  );

  it.each([
    ["top-left", { x: 7, y: 16 }],
    ["top-right", { x: 113, y: 16 }],
    ["bottom-right", { x: 113, y: 224 }],
    ["bottom-left", { x: 7, y: 224 }],
  ] as const)(
    "counts exact %s-corner tangency as intersection",
    (_corner, center) => {
      expect(doesCircleIntersectBounds(center, 5, BOUNDS)).toBe(true);
    },
  );

  it("detects partial overlap", () => {
    expect(doesCircleIntersectBounds({ x: 7, y: 120 }, 5, BOUNDS)).toBe(true);
  });

  it("detects a fully contained circle", () => {
    expect(doesCircleIntersectBounds({ x: 60, y: 120 }, 5, BOUNDS)).toBe(true);
  });

  it("rejects a fully outside circle", () => {
    expect(doesCircleIntersectBounds({ x: 4, y: 120 }, 5, BOUNDS)).toBe(false);
    expect(doesCircleIntersectBounds({ x: 6, y: 16 }, 5, BOUNDS)).toBe(false);
  });

  it("supports a zero-radius point", () => {
    expect(doesCircleIntersectBounds({ x: 10, y: 20 }, 0, BOUNDS)).toBe(true);
    expect(doesCircleIntersectBounds({ x: 9, y: 20 }, 0, BOUNDS)).toBe(false);
  });

  it.each([
    [{ x: Number.NaN, y: 0 }, 1, BOUNDS],
    [{ x: 0, y: Number.POSITIVE_INFINITY }, 1, BOUNDS],
    [{ x: 0, y: 0 }, Number.NaN, BOUNDS],
    [{ x: 0, y: 0 }, Number.POSITIVE_INFINITY, BOUNDS],
    [{ x: 0, y: 0 }, -1, BOUNDS],
    [{ x: 0, y: 0 }, 1, { x: Number.NaN, y: 0, width: 10, height: 10 }],
    [{ x: 0, y: 0 }, 1, { x: 0, y: 0, width: 0, height: 10 }],
    [{ x: 0, y: 0 }, 1, { x: 0, y: 0, width: 10, height: -1 }],
    [
      { x: 0, y: 0 },
      1,
      { x: Number.MAX_VALUE, y: 0, width: Number.MAX_VALUE, height: 10 },
    ],
    [{ x: Number.MAX_VALUE, y: 0 }, Number.MAX_VALUE, BOUNDS],
  ])("rejects invalid geometry %#", (center, radius, bounds) => {
    expect(() => doesCircleIntersectBounds(center, radius, bounds)).toThrow(
      RangeError,
    );
  });
});
