import { describe, expect, it } from "vitest";
import { BASIC_ATTACK_DEFINITION } from "../combat/index.js";
import {
  PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
  PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
} from "../state/index.js";
import { applyRunUpgrade } from "./ApplyUpgrade.js";
import {
  createInitialRunUpgradeState,
  createRunUpgradeState,
  getEffectiveAttackCooldownSeconds,
  getEffectiveMaximumHealth,
  getEffectiveMovementSpeedUnitsPerSecond,
} from "./RunUpgradeState.js";

describe("applyRunUpgrade", () => {
  it("applies rapid fire without changing movement, health, or projectile stats", () => {
    const initial = createInitialRunUpgradeState();
    const result = applyRunUpgrade(
      "rapid-fire",
      initial,
      2,
      PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
    );

    expect(result?.upgrades.levels).toEqual({
      "rapid-fire": 1,
      "swift-movement": 0,
      vitality: 0,
    });
    expect(result?.currentHealth).toBe(2);
    expect(
      getEffectiveAttackCooldownSeconds(
        BASIC_ATTACK_DEFINITION.cooldownSeconds,
        result!.upgrades,
      ),
    ).toBeCloseTo(BASIC_ATTACK_DEFINITION.cooldownSeconds / 1.1);
    expect(
      getEffectiveMovementSpeedUnitsPerSecond(
        PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
        result!.upgrades,
      ),
    ).toBe(PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND);
    expect(
      getEffectiveMaximumHealth(
        PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
        result!.upgrades,
      ),
    ).toBe(PROVISIONAL_PLAYER_MAXIMUM_HEALTH);
    expect(BASIC_ATTACK_DEFINITION.projectileDamage).toBe(1);
    expect(BASIC_ATTACK_DEFINITION.projectileCollisionRadius).toBe(4);
  });

  it("applies swift movement without changing cooldown or health", () => {
    const result = applyRunUpgrade(
      "swift-movement",
      createInitialRunUpgradeState(),
      2,
      PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
    );

    expect(result?.upgrades.levels).toEqual({
      "rapid-fire": 0,
      "swift-movement": 1,
      vitality: 0,
    });
    expect(result?.currentHealth).toBe(2);
    expect(
      getEffectiveMovementSpeedUnitsPerSecond(
        PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
        result!.upgrades,
      ),
    ).toBeCloseTo(PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND * 1.1);
    expect(
      getEffectiveAttackCooldownSeconds(
        BASIC_ATTACK_DEFINITION.cooldownSeconds,
        result!.upgrades,
      ),
    ).toBe(BASIC_ATTACK_DEFINITION.cooldownSeconds);
    expect(
      getEffectiveMaximumHealth(
        PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
        result!.upgrades,
      ),
    ).toBe(PROVISIONAL_PLAYER_MAXIMUM_HEALTH);
  });

  it("applies vitality and heals by one without exceeding the new maximum", () => {
    const damaged = applyRunUpgrade(
      "vitality",
      createInitialRunUpgradeState(),
      1,
      PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
    );
    const full = applyRunUpgrade(
      "vitality",
      createInitialRunUpgradeState(),
      PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
      PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
    );

    expect(damaged?.upgrades.levels.vitality).toBe(1);
    expect(damaged?.currentHealth).toBe(2);
    expect(full?.currentHealth).toBe(4);
    expect(
      getEffectiveMaximumHealth(
        PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
        full!.upgrades,
      ),
    ).toBe(4);
    expect(
      getEffectiveAttackCooldownSeconds(
        BASIC_ATTACK_DEFINITION.cooldownSeconds,
        full!.upgrades,
      ),
    ).toBe(BASIC_ATTACK_DEFINITION.cooldownSeconds);
    expect(
      getEffectiveMovementSpeedUnitsPerSecond(
        PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
        full!.upgrades,
      ),
    ).toBe(PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND);
  });

  it("increments an existing level without mutating the input state", () => {
    const initial = createRunUpgradeState({ "rapid-fire": 2 });
    const initialSnapshot = structuredClone(initial);

    const result = applyRunUpgrade(
      "rapid-fire",
      initial,
      3,
      PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
    );

    expect(result?.upgrades.levels["rapid-fire"]).toBe(3);
    expect(initial).toEqual(initialSnapshot);
    expect(result?.upgrades).not.toBe(initial);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result?.upgrades)).toBe(true);
  });

  it("rejects unknown and capped upgrades without mutating inputs", () => {
    const capped = createRunUpgradeState({ "rapid-fire": 5 });
    const snapshot = structuredClone(capped);

    expect(
      applyRunUpgrade("unknown", capped, 3, PROVISIONAL_PLAYER_MAXIMUM_HEALTH),
    ).toBeNull();
    expect(
      applyRunUpgrade(
        "rapid-fire",
        capped,
        3,
        PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
      ),
    ).toBeNull();
    expect(capped).toEqual(snapshot);
  });

  it.each([
    [Number.NaN, PROVISIONAL_PLAYER_MAXIMUM_HEALTH],
    [-1, PROVISIONAL_PLAYER_MAXIMUM_HEALTH],
    [4, PROVISIONAL_PLAYER_MAXIMUM_HEALTH],
    [1, 0],
  ])(
    "rejects invalid health state (%s, %s)",
    (currentHealth, baseMaximumHealth) => {
      expect(
        applyRunUpgrade(
          "vitality",
          createInitialRunUpgradeState(),
          currentHealth,
          baseMaximumHealth,
        ),
      ).toBeNull();
    },
  );
});
