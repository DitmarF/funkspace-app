import { describe, expect, it } from "vitest";
import {
  BASIC_ATTACK_DEFINITION,
  createBasicAttackDefinition,
  type BasicAttackDefinition,
} from "./index.js";

const VALID_DEFINITION: BasicAttackDefinition = {
  cooldownSeconds: 1.5,
  projectileSpeedUnitsPerSecond: 320,
  projectileDamage: 1,
  projectileCollisionRadius: 4,
  projectileLifetimeSeconds: 2.5,
  projectileDespawnMargin: 32,
};

describe("BASIC_ATTACK_DEFINITION", () => {
  it("defines the provisional Gate 1 gameplay values", () => {
    expect(BASIC_ATTACK_DEFINITION).toEqual(VALID_DEFINITION);
  });

  it("cannot be mutated through normal runtime use", () => {
    expect(Object.isFrozen(BASIC_ATTACK_DEFINITION)).toBe(true);
    expect(Reflect.set(BASIC_ATTACK_DEFINITION, "cooldownSeconds", 99)).toBe(
      false,
    );
    expect(BASIC_ATTACK_DEFINITION.cooldownSeconds).toBe(1.5);
  });
});

describe("createBasicAttackDefinition", () => {
  it("accepts and freezes a definition with a zero despawn margin", () => {
    const definition = createBasicAttackDefinition({
      ...VALID_DEFINITION,
      projectileDespawnMargin: 0,
    });

    expect(definition.projectileDespawnMargin).toBe(0);
    expect(Object.isFrozen(definition)).toBe(true);
  });

  it.each([
    ["cooldownSeconds", 0],
    ["cooldownSeconds", Number.NaN],
    ["projectileSpeedUnitsPerSecond", -1],
    ["projectileSpeedUnitsPerSecond", Number.POSITIVE_INFINITY],
    ["projectileDamage", 0],
    ["projectileCollisionRadius", Number.NEGATIVE_INFINITY],
    ["projectileLifetimeSeconds", 0],
    ["projectileDespawnMargin", -1],
    ["projectileDespawnMargin", Number.NaN],
  ] as const)("rejects invalid %s value %s", (property, value) => {
    expect(() =>
      createBasicAttackDefinition({
        ...VALID_DEFINITION,
        [property]: value,
      }),
    ).toThrow(RangeError);
  });
});
