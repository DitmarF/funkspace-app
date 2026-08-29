import { describe, expect, it, vi } from "vitest";
import type { RandomSource } from "../RandomSource.js";
import { createBounds } from "../arena/index.js";
import {
  mapPerimeterDistance,
  samplePerimeterPoint,
} from "./PerimeterSampling.js";

const BOUNDS = createBounds(10, 20, 4, 6);

describe("mapPerimeterDistance", () => {
  it.each([
    ["start of top", 0, "top", 10, 20],
    ["middle of top", 2, "top", 12, 20],
    ["top-right transition", 4, "right", 14, 20],
    ["middle of right", 7, "right", 14, 23],
    ["right-bottom transition", 10, "bottom", 14, 26],
    ["middle of bottom", 12, "bottom", 12, 26],
    ["bottom-left transition", 14, "left", 10, 26],
    ["middle of left", 17, "left", 10, 23],
    ["final in-range left point", 19.75, "left", 10, 20.25],
  ] as const)(
    "maps the %s clockwise",
    (_case, distance, edge, expectedX, expectedY) => {
      expect(mapPerimeterDistance(BOUNDS, distance)).toEqual({
        edge,
        position: { x: expectedX, y: expectedY },
      });
    },
  );

  it("allocates portrait-edge intervals by their exact lengths", () => {
    const portraitBounds = createBounds(0, 0, 4, 10);
    const counts = { top: 0, right: 0, bottom: 0, left: 0 };

    for (let distance = 0; distance < 28; distance += 1) {
      counts[mapPerimeterDistance(portraitBounds, distance).edge] += 1;
    }

    expect(counts).toEqual({ top: 4, right: 10, bottom: 4, left: 10 });
    expect(counts.right + counts.left).toBeGreaterThan(
      counts.top + counts.bottom,
    );
  });

  it.each([
    [Number.NaN, 0, 4, 6],
    [0, Number.POSITIVE_INFINITY, 4, 6],
    [0, 0, Number.NaN, 6],
    [0, 0, 4, Number.NEGATIVE_INFINITY],
    [0, 0, 0, 6],
    [0, 0, -1, 6],
    [0, 0, 4, 0],
    [0, 0, 4, -1],
  ])("rejects invalid bounds (%s, %s, %s, %s)", (x, y, width, height) => {
    expect(() => mapPerimeterDistance({ x, y, width, height }, 0)).toThrow(
      RangeError,
    );
  });

  it.each([
    Number.NaN,
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    -0.01,
    20,
    20.01,
  ])("rejects invalid perimeter distance %s", (distance) => {
    expect(() => mapPerimeterDistance(BOUNDS, distance)).toThrow(RangeError);
  });
});

describe("samplePerimeterPoint", () => {
  it("requests exactly one value across the total perimeter range", () => {
    const nextFloat = vi.fn(() => 7);
    const randomSource: RandomSource = {
      nextFloat,
      reset: vi.fn(),
    };

    expect(samplePerimeterPoint(BOUNDS, randomSource)).toEqual({
      edge: "right",
      position: { x: 14, y: 23 },
    });
    expect(nextFloat).toHaveBeenCalledOnce();
    expect(nextFloat).toHaveBeenCalledWith(0, 20);
  });
});
