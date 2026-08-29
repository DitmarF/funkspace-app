import { describe, expect, expectTypeOf, it } from "vitest";
import { BASIC_ENEMY_DEFINITION } from "./EnemyDefinition.js";
import {
  canEnemyDealContactDamage,
  canEnemyPursue,
  createBasicEnemyState,
  isEnemyTargetable,
  type EnemyPhase,
} from "./EnemyState.js";

describe("createBasicEnemyState", () => {
  it("creates an entering enemy with its ID and definition values", () => {
    const enemy = createBasicEnemyState(7, { x: -12, y: 320 });

    expect(enemy).toEqual({
      id: 7,
      kind: BASIC_ENEMY_DEFINITION.kind,
      phase: "entering",
      position: { x: -12, y: 320 },
      collisionRadius: BASIC_ENEMY_DEFINITION.collisionRadius,
      movementSpeedUnitsPerSecond:
        BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
      currentHealth: BASIC_ENEMY_DEFINITION.maximumHealth,
      contactDamage: BASIC_ENEMY_DEFINITION.contactDamage,
    });
  });

  it("owns a copy of the supplied logical position", () => {
    const position = { x: 24, y: -36 };
    const enemy = createBasicEnemyState(1, position);

    expect(enemy.position).not.toBe(position);

    position.x = 999;

    expect(enemy.position).toEqual({ x: 24, y: -36 });
  });
});

describe("enemy phase eligibility", () => {
  it("defines exactly entering, active, and dying phases", () => {
    expectTypeOf<EnemyPhase>().toEqualTypeOf<"entering" | "active" | "dying">();
  });

  it.each([
    ["entering", true, false, false],
    ["active", true, true, true],
    ["dying", false, false, false],
  ] as const)(
    "applies %s eligibility rules",
    (phase, canPursue, isTargetable, canDealContactDamage) => {
      const enemy = createBasicEnemyState(1, { x: 0, y: 0 });
      enemy.phase = phase;

      expect(canEnemyPursue(enemy)).toBe(canPursue);
      expect(isEnemyTargetable(enemy)).toBe(isTargetable);
      expect(canEnemyDealContactDamage(enemy)).toBe(canDealContactDamage);
    },
  );
});
