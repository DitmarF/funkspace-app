import { describe, expect, it } from "vitest";
import { VISIBLE_ARENA_BOUNDS } from "../domain/arena/index.js";
import { calculateEntryWarningGeometry } from "./EntryWarningGeometry.js";

describe("calculateEntryWarningGeometry", () => {
  it.each([
    [
      "top",
      { x: 180, y: -66 },
      { edge: "top", x: 180, y: 0, inwardDirectionX: 0, inwardDirectionY: 1 },
    ],
    [
      "right",
      { x: 426, y: 320 },
      {
        edge: "right",
        x: 360,
        y: 320,
        inwardDirectionX: -1,
        inwardDirectionY: 0,
      },
    ],
    [
      "bottom",
      { x: 180, y: 706 },
      {
        edge: "bottom",
        x: 180,
        y: 640,
        inwardDirectionX: 0,
        inwardDirectionY: -1,
      },
    ],
    [
      "left",
      { x: -66, y: 320 },
      { edge: "left", x: 0, y: 320, inwardDirectionX: 1, inwardDirectionY: 0 },
    ],
  ] as const)(
    "projects the pursuit line onto the %s border with an inward normal",
    (_edge, enemyPosition, expected) => {
      expect(
        calculateEntryWarningGeometry(
          enemyPosition,
          { x: 180, y: 320 },
          VISIBLE_ARENA_BOUNDS,
        ),
      ).toEqual(expected);
    },
  );

  it("uses top-edge precedence for an exact top-left corner entry", () => {
    expect(
      calculateEntryWarningGeometry(
        { x: -10, y: -10 },
        { x: 100, y: 100 },
        VISIBLE_ARENA_BOUNDS,
      ),
    ).toEqual({
      edge: "top",
      x: 0,
      y: 0,
      inwardDirectionX: 0,
      inwardDirectionY: 1,
    });
  });

  it("returns no warning for degenerate or non-intersecting lines", () => {
    expect(
      calculateEntryWarningGeometry(
        { x: -10, y: -10 },
        { x: -10, y: -10 },
        VISIBLE_ARENA_BOUNDS,
      ),
    ).toBeNull();
    expect(
      calculateEntryWarningGeometry(
        { x: -10, y: -10 },
        { x: -10, y: 100 },
        VISIBLE_ARENA_BOUNDS,
      ),
    ).toBeNull();
  });

  it("returns no warning for invalid geometry", () => {
    expect(
      calculateEntryWarningGeometry(
        { x: Number.NaN, y: -10 },
        { x: 180, y: 320 },
        VISIBLE_ARENA_BOUNDS,
      ),
    ).toBeNull();
    expect(
      calculateEntryWarningGeometry(
        { x: -10, y: 320 },
        { x: 180, y: 320 },
        { x: 0, y: 0, width: 0, height: 640 },
      ),
    ).toBeNull();
  });
});
