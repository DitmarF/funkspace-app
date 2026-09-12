import { describe, expect, it } from "vitest";
import type { LogicalPosition } from "../geometry/index.js";
import { createBasicEnemyState } from "./EnemyState.js";
import { calculateNextEnemyPosition } from "./EnemyMovement.js";

function expectPositionCloseTo(
  actual: Readonly<LogicalPosition>,
  expected: Readonly<LogicalPosition>,
): void {
  expect(actual.x).toBeCloseTo(expected.x);
  expect(actual.y).toBeCloseTo(expected.y);
}

describe("calculateNextEnemyPosition", () => {
  it("moves an entering enemy horizontally using speed and delta", () => {
    const enemy = createBasicEnemyState(1, { x: 0, y: 10 });

    expect(calculateNextEnemyPosition(enemy, { x: 100, y: 10 }, 0.5)).toEqual({
      x: 36,
      y: 10,
    });
  });

  it("moves an active enemy vertically using speed and delta", () => {
    const enemy = createBasicEnemyState(1, { x: 10, y: 100 });
    enemy.phase = "active";

    expect(calculateNextEnemyPosition(enemy, { x: 10, y: 0 }, 0.25)).toEqual({
      x: 10,
      y: 82,
    });
  });

  it("normalizes diagonal pursuit to the configured travel speed", () => {
    const enemy = createBasicEnemyState(1, { x: 0, y: 0 });
    const nextPosition = calculateNextEnemyPosition(
      enemy,
      { x: 100, y: 100 },
      0.5,
    );
    const displacement = Math.hypot(nextPosition.x, nextPosition.y);

    expect(displacement).toBeCloseTo(enemy.movementSpeedUnitsPerSecond * 0.5);
    expect(nextPosition.x).toBeCloseTo(nextPosition.y);
  });

  it("returns a new unchanged position when already at the target", () => {
    const enemy = createBasicEnemyState(1, { x: 20, y: 30 });

    const nextPosition = calculateNextEnemyPosition(enemy, enemy.position, 1);

    expect(nextPosition).toEqual(enemy.position);
    expect(nextPosition).not.toBe(enemy.position);
  });

  it("does not move a dying enemy", () => {
    const enemy = createBasicEnemyState(1, { x: 0, y: 0 });
    enemy.phase = "dying";

    expect(calculateNextEnemyPosition(enemy, { x: 100, y: 100 }, 1)).toEqual(
      enemy.position,
    );
  });

  it.each([
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])("does not move for an invalid delta (%s)", (deltaSeconds) => {
    const enemy = createBasicEnemyState(1, { x: 0, y: 0 });

    expect(
      calculateNextEnemyPosition(enemy, { x: 100, y: 100 }, deltaSeconds),
    ).toEqual(enemy.position);
  });

  it("stops at the target instead of overshooting it", () => {
    const enemy = createBasicEnemyState(1, { x: 0, y: 0 });

    expect(calculateNextEnemyPosition(enemy, { x: 10, y: 0 }, 1)).toEqual({
      x: 10,
      y: 0,
    });
  });

  it("produces equal displacement for equal simulated time", () => {
    const singleStepEnemy = createBasicEnemyState(1, { x: 0, y: 0 });
    const groupedStepEnemy = createBasicEnemyState(1, { x: 0, y: 0 });
    const target = { x: 500, y: 300 };

    singleStepEnemy.position = calculateNextEnemyPosition(
      singleStepEnemy,
      target,
      1,
    );
    for (const deltaSeconds of [0.1, 0.2, 0.3, 0.4]) {
      groupedStepEnemy.position = calculateNextEnemyPosition(
        groupedStepEnemy,
        target,
        deltaSeconds,
      );
    }

    expectPositionCloseTo(groupedStepEnemy.position, singleStepEnemy.position);
  });

  it("does not clamp enemies at the visible arena boundary", () => {
    const remainingOutside = createBasicEnemyState(1, { x: -20, y: 320 });
    const crossingInside = createBasicEnemyState(2, { x: -20, y: 320 });
    const target = { x: 100, y: 320 };

    expect(calculateNextEnemyPosition(remainingOutside, target, 0.1).x).toBe(
      -12.8,
    );
    expect(calculateNextEnemyPosition(crossingInside, target, 0.5).x).toBe(16);
  });
});
