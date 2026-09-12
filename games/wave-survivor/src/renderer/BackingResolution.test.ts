import { describe, expect, it } from "vitest";
import { calculateBackingResolution } from "./BackingResolution.js";

describe("calculateBackingResolution", () => {
  it("uses DPR 1 and rounds backing dimensions to whole pixels", () => {
    expect(calculateBackingResolution(319.5, 568, 1)).toEqual({
      effectiveDpr: 1,
      backingWidth: 320,
      backingHeight: 568,
    });
  });

  it("uses DPR 2", () => {
    expect(calculateBackingResolution(390, 640 * (390 / 360), 2)).toEqual({
      effectiveDpr: 2,
      backingWidth: 780,
      backingHeight: 1387,
    });
  });

  it("caps a DPR above 2", () => {
    expect(calculateBackingResolution(540, 960, 3)).toEqual({
      effectiveDpr: 2,
      backingWidth: 1080,
      backingHeight: 1920,
    });
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "falls back to DPR 1 for an invalid value (%s)",
    (devicePixelRatio) => {
      expect(calculateBackingResolution(360, 640, devicePixelRatio)).toEqual({
        effectiveDpr: 1,
        backingWidth: 360,
        backingHeight: 640,
      });
    },
  );

  it.each([
    [0, 640],
    [360, 0],
    [Number.NaN, 640],
    [360, Number.POSITIVE_INFINITY],
  ])(
    "returns an empty buffer for invalid display dimensions (%s × %s)",
    (displayWidth, displayHeight) => {
      expect(
        calculateBackingResolution(displayWidth, displayHeight, 2),
      ).toEqual({
        effectiveDpr: 2,
        backingWidth: 0,
        backingHeight: 0,
      });
    },
  );
});
