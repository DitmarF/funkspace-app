import { describe, expect, it } from "vitest";
import { createBasicEnemyState, type EnemyState } from "../enemies/index.js";
import { findNearestTargetableEnemy } from "./index.js";

const PLAYER_POSITION = { x: 180, y: 320 };

function createEnemy(
  id: number,
  x: number,
  y: number,
  phase: EnemyState["phase"] = "active",
): EnemyState {
  const enemy = createBasicEnemyState(id, { x, y });
  enemy.phase = phase;
  return enemy;
}

describe("findNearestTargetableEnemy", () => {
  it("returns null when there are no enemies", () => {
    expect(findNearestTargetableEnemy(PLAYER_POSITION, [])).toBeNull();
  });

  it("selects one active enemy", () => {
    const enemy = createEnemy(1, 200, 320);

    expect(findNearestTargetableEnemy(PLAYER_POSITION, [enemy])).toBe(enemy);
  });

  it("selects the nearest of several active enemies", () => {
    const farthest = createEnemy(1, 300, 320);
    const nearest = createEnemy(2, 190, 325);
    const middle = createEnemy(3, 220, 320);

    expect(
      findNearestTargetableEnemy(PLAYER_POSITION, [farthest, nearest, middle]),
    ).toBe(nearest);
  });

  it("ignores a closer entering enemy", () => {
    const entering = createEnemy(1, 181, 320, "entering");
    const active = createEnemy(2, 220, 320);

    expect(
      findNearestTargetableEnemy(PLAYER_POSITION, [entering, active]),
    ).toBe(active);
  });

  it("ignores a closer dying enemy", () => {
    const dying = createEnemy(1, 181, 320, "dying");
    const active = createEnemy(2, 220, 320);

    expect(findNearestTargetableEnemy(PLAYER_POSITION, [dying, active])).toBe(
      active,
    );
  });

  it("ignores invalid enemy data", () => {
    const invalid = createEnemy(1, Number.NaN, 320);
    const active = createEnemy(2, 240, 320);

    expect(findNearestTargetableEnemy(PLAYER_POSITION, [invalid, active])).toBe(
      active,
    );
  });

  it("breaks exact distance ties using the lowest enemy ID", () => {
    const higherId = createEnemy(8, 170, 320);
    const lowerId = createEnemy(3, 190, 320);

    expect(
      findNearestTargetableEnemy(PLAYER_POSITION, [higherId, lowerId]),
    ).toBe(lowerId);
  });

  it("selects the same target when collection order changes", () => {
    const higherId = createEnemy(8, 170, 320);
    const lowerId = createEnemy(3, 190, 320);
    const farther = createEnemy(1, 240, 320);

    expect(
      findNearestTargetableEnemy(PLAYER_POSITION, [higherId, farther, lowerId]),
    ).toBe(lowerId);
    expect(
      findNearestTargetableEnemy(PLAYER_POSITION, [lowerId, higherId, farther]),
    ).toBe(lowerId);
  });

  it("does not mutate the enemy collection or its enemy objects", () => {
    const farther = createEnemy(2, 240, 320);
    const nearest = createEnemy(1, 190, 320);
    const enemies = [farther, nearest];
    const before = enemies.map((enemy) => ({
      ...enemy,
      position: { ...enemy.position },
    }));

    const selected = findNearestTargetableEnemy(PLAYER_POSITION, enemies);

    expect(selected).toBe(nearest);
    expect(enemies).toEqual(before);
    expect(enemies).toEqual([farther, nearest]);
    expect(enemies[0]).toBe(farther);
    expect(enemies[1]).toBe(nearest);
  });
});
