import { describe, expect, it } from "vitest";
import { BASIC_ENEMY_DEFINITION } from "./EnemyDefinition.js";

describe("BASIC_ENEMY_DEFINITION", () => {
  it("defines the approved basic enemy gameplay values", () => {
    expect(BASIC_ENEMY_DEFINITION).toEqual({
      kind: "basic",
      collisionRadius: 12,
      movementSpeedUnitsPerSecond: 72,
      maximumHealth: 1,
      contactDamage: 1,
    });
  });

  it("uses finite positive numeric gameplay values", () => {
    const numericValues = [
      BASIC_ENEMY_DEFINITION.collisionRadius,
      BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
      BASIC_ENEMY_DEFINITION.maximumHealth,
      BASIC_ENEMY_DEFINITION.contactDamage,
    ];

    for (const value of numericValues) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThan(0);
    }
  });

  it("cannot be mutated through normal runtime use", () => {
    expect(Object.isFrozen(BASIC_ENEMY_DEFINITION)).toBe(true);
    expect(Reflect.set(BASIC_ENEMY_DEFINITION, "collisionRadius", 999)).toBe(
      false,
    );
    expect(BASIC_ENEMY_DEFINITION.collisionRadius).toBe(12);
  });
});
