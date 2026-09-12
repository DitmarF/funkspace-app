import { describe, expect, expectTypeOf, it } from "vitest";
import type { MovementIntent } from "./MovementIntent.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
} from "./MovementIntent.js";

describe("movement intent", () => {
  it("defines readonly numeric components", () => {
    expectTypeOf<MovementIntent>().toEqualTypeOf<
      Readonly<{ x: number; y: number }>
    >();
  });

  it("provides immutable zero movement", () => {
    expect(ZERO_MOVEMENT_INTENT).toEqual({ x: 0, y: 0 });
    expect(Object.isFrozen(ZERO_MOVEMENT_INTENT)).toBe(true);
    expect(createMovementIntent(0, 0)).toBe(ZERO_MOVEMENT_INTENT);
  });

  it.each([
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ])("preserves axis-aligned intention (%s, %s)", (x, y) => {
    expect(createMovementIntent(x, y)).toEqual({ x, y });
  });

  it("normalizes a diagonal intention", () => {
    const intent = createMovementIntent(1, 1);

    expect(intent.x).toBeCloseTo(Math.SQRT1_2);
    expect(intent.y).toBeCloseTo(Math.SQRT1_2);
    expect(Math.hypot(intent.x, intent.y)).toBeCloseTo(1);
  });

  it("preserves partial analog magnitude", () => {
    const intent = createMovementIntent(0.3, 0.4);

    expect(intent).toEqual({ x: 0.3, y: 0.4 });
    expect(Math.hypot(intent.x, intent.y)).toBeCloseTo(0.5);
  });

  it("constrains an oversized intention", () => {
    const intent = createMovementIntent(3, 4);

    expect(intent.x).toBeCloseTo(0.6);
    expect(intent.y).toBeCloseTo(0.8);
    expect(Math.hypot(intent.x, intent.y)).toBeCloseTo(1);
  });

  it("constrains finite values whose direct magnitude overflows", () => {
    const intent = createMovementIntent(Number.MAX_VALUE, Number.MAX_VALUE);

    expect(intent.x).toBeCloseTo(Math.SQRT1_2);
    expect(intent.y).toBeCloseTo(Math.SQRT1_2);
    expect(Math.hypot(intent.x, intent.y)).toBeCloseTo(1);
  });

  it.each([
    [Number.NaN, 0],
    [0, Number.NaN],
    [Number.POSITIVE_INFINITY, 0],
    [0, Number.NEGATIVE_INFINITY],
  ])("returns zero movement for non-finite input (%s, %s)", (x, y) => {
    expect(createMovementIntent(x, y)).toBe(ZERO_MOVEMENT_INTENT);
  });

  it("creates independent immutable values for non-zero movement", () => {
    const first = createMovementIntent(0.25, -0.5);
    const second = createMovementIntent(0.25, -0.5);

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(second)).toBe(true);
  });
});
