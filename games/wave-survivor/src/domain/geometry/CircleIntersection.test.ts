import { describe, expect, it } from "vitest";
import { doCirclesIntersect } from "./CircleIntersection.js";

describe("doCirclesIntersect", () => {
  it("rejects separated circles", () => {
    expect(doCirclesIntersect({ x: 0, y: 0 }, 2, { x: 5, y: 0 }, 2)).toBe(
      false,
    );
  });

  it("detects overlapping circles", () => {
    expect(doCirclesIntersect({ x: 0, y: 0 }, 3, { x: 4, y: 0 }, 2)).toBe(true);
  });

  it("counts exact external tangency as intersection", () => {
    expect(doCirclesIntersect({ x: 0, y: 0 }, 4, { x: 10, y: 0 }, 6)).toBe(
      true,
    );
  });

  it("detects circles with the same center", () => {
    expect(doCirclesIntersect({ x: 3, y: 4 }, 1, { x: 3, y: 4 }, 2)).toBe(true);
  });

  it("detects two zero-radius points at the same position", () => {
    expect(doCirclesIntersect({ x: 3, y: 4 }, 0, { x: 3, y: 4 }, 0)).toBe(true);
  });

  it("rejects two zero-radius points at different positions", () => {
    expect(doCirclesIntersect({ x: 3, y: 4 }, 0, { x: 3, y: 5 }, 0)).toBe(
      false,
    );
  });

  it("detects a zero-radius point touching another circle", () => {
    expect(doCirclesIntersect({ x: 5, y: 0 }, 0, { x: 0, y: 0 }, 5)).toBe(true);
  });

  it.each([
    [{ x: Number.NaN, y: 0 }, 1, { x: 0, y: 0 }, 1],
    [{ x: 0, y: Number.POSITIVE_INFINITY }, 1, { x: 0, y: 0 }, 1],
    [{ x: 0, y: 0 }, 1, { x: Number.NEGATIVE_INFINITY, y: 0 }, 1],
    [{ x: 0, y: 0 }, 1, { x: 0, y: Number.NaN }, 1],
  ])(
    "rejects invalid circle coordinates %#",
    (firstCenter, firstRadius, secondCenter, secondRadius) => {
      expect(() =>
        doCirclesIntersect(
          firstCenter,
          firstRadius,
          secondCenter,
          secondRadius,
        ),
      ).toThrow(RangeError);
    },
  );

  it.each([
    [-1, 1],
    [1, -1],
    [Number.NaN, 1],
    [1, Number.POSITIVE_INFINITY],
  ])("rejects invalid circle radii %#", (firstRadius, secondRadius) => {
    expect(() =>
      doCirclesIntersect(
        { x: 0, y: 0 },
        firstRadius,
        { x: 1, y: 0 },
        secondRadius,
      ),
    ).toThrow(RangeError);
  });

  it.each([
    [{ x: Number.MAX_VALUE, y: 0 }, 0, { x: 0, y: 0 }, 0],
    [{ x: Number.MAX_VALUE, y: 0 }, 0, { x: -Number.MAX_VALUE, y: 0 }, 0],
    [{ x: 0, y: 0 }, Number.MAX_VALUE, { x: 0, y: 0 }, 0],
    [{ x: 0, y: 0 }, Number.MAX_VALUE, { x: 0, y: 0 }, Number.MAX_VALUE],
  ])(
    "rejects overflowing circle arithmetic %#",
    (firstCenter, firstRadius, secondCenter, secondRadius) => {
      expect(() =>
        doCirclesIntersect(
          firstCenter,
          firstRadius,
          secondCenter,
          secondRadius,
        ),
      ).toThrow(RangeError);
    },
  );
});
