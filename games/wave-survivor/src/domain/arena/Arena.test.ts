import { describe, expect, expectTypeOf, it } from "vitest";
import type { ArenaRegions, Bounds } from "./Arena.js";
import { ARENA, createBounds, VISIBLE_ARENA_BOUNDS } from "./Arena.js";

describe("logical arena", () => {
  it("has fixed immutable portrait dimensions", () => {
    expect(ARENA).toEqual({ width: 360, height: 640 });
    expect(Object.isFrozen(ARENA)).toBe(true);
  });

  it("defines the visible bounds in logical coordinates", () => {
    expect(VISIBLE_ARENA_BOUNDS).toEqual({
      x: 0,
      y: 0,
      width: ARENA.width,
      height: ARENA.height,
    });
    expect(Object.isFrozen(VISIBLE_ARENA_BOUNDS)).toBe(true);
  });
});

describe("createBounds", () => {
  it("creates immutable bounds from logical coordinates", () => {
    const bounds = createBounds(-24, 16, 408, 672);

    expect(bounds).toEqual({ x: -24, y: 16, width: 408, height: 672 });
    expect(Object.isFrozen(bounds)).toBe(true);
  });
});

describe("arena regions", () => {
  it("exposes logical bounds for future gameplay systems", () => {
    expectTypeOf<ArenaRegions["playerArea"]>().toEqualTypeOf<Bounds>();
    expectTypeOf<ArenaRegions["spawnBounds"]>().toEqualTypeOf<Bounds>();
    expectTypeOf<ArenaRegions["despawnBounds"]>().toEqualTypeOf<Bounds>();
  });
});
