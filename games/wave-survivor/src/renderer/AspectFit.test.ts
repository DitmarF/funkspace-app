import { describe, expect, it } from "vitest";
import { ARENA } from "../domain/arena/index.js";
import { calculateAspectFit } from "./AspectFit.js";

function expectFit(
  availableWidth: number,
  availableHeight: number,
  expected: {
    readonly scale: number;
    readonly displayWidth: number;
    readonly displayHeight: number;
    readonly horizontalOffset: number;
    readonly verticalOffset: number;
  },
): void {
  const fit = calculateAspectFit(availableWidth, availableHeight);

  expect(fit.scale).toBeCloseTo(expected.scale);
  expect(fit.displayWidth).toBeCloseTo(expected.displayWidth);
  expect(fit.displayHeight).toBeCloseTo(expected.displayHeight);
  expect(fit.horizontalOffset).toBeCloseTo(expected.horizontalOffset);
  expect(fit.verticalOffset).toBeCloseTo(expected.verticalOffset);
  expect(fit.displayWidth / fit.displayHeight).toBeCloseTo(
    ARENA.width / ARENA.height,
  );
}

describe("calculateAspectFit", () => {
  it("fits a small phone by height", () => {
    expectFit(320, 568, {
      scale: 0.8875,
      displayWidth: 319.5,
      displayHeight: 568,
      horizontalOffset: 0.25,
      verticalOffset: 0,
    });
  });

  it("centers the arena vertically on a tall phone", () => {
    expectFit(390, 844, {
      scale: 390 / 360,
      displayWidth: 390,
      displayHeight: 640 * (390 / 360),
      horizontalOffset: 0,
      verticalOffset: (844 - 640 * (390 / 360)) / 2,
    });
  });

  it("centers the arena horizontally on a tablet", () => {
    expectFit(600, 800, {
      scale: 1.25,
      displayWidth: 450,
      displayHeight: 800,
      horizontalOffset: 75,
      verticalOffset: 0,
    });
  });

  it("applies the display cap and centers the arena on desktop", () => {
    expectFit(1920, 1080, {
      scale: 1.5,
      displayWidth: 540,
      displayHeight: 960,
      horizontalOffset: 690,
      verticalOffset: 60,
    });
  });

  it.each([
    [0, 640],
    [360, 0],
    [0, 0],
  ])(
    "returns an empty fit for a zero-sized area (%s × %s)",
    (width, height) => {
      expect(calculateAspectFit(width, height)).toEqual({
        scale: 0,
        displayWidth: 0,
        displayHeight: 0,
        horizontalOffset: 0,
        verticalOffset: 0,
      });
    },
  );

  it.each([
    [-1, 640],
    [360, -1],
    [Number.NaN, 640],
    [360, Number.NaN],
    [Number.POSITIVE_INFINITY, 640],
    [360, Number.NEGATIVE_INFINITY],
  ])(
    "returns an empty fit for invalid dimensions (%s × %s)",
    (width, height) => {
      expect(calculateAspectFit(width, height)).toEqual({
        scale: 0,
        displayWidth: 0,
        displayHeight: 0,
        horizontalOffset: 0,
        verticalOffset: 0,
      });
    },
  );
});
