import { describe, expect, it } from "vitest";
import { BASIC_ATTACK_DEFINITION } from "../combat/index.js";
import { BASIC_ENEMY_DEFINITION } from "../enemies/index.js";
import {
  PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
  PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
} from "../state/index.js";
import {
  calculateVitalityUpgradeHealth,
  createInitialRunUpgradeState,
  createRunUpgradeState,
  getEffectiveAttackCooldownSeconds,
  getEffectiveMaximumHealth,
  getEffectiveMovementSpeedUnitsPerSecond,
  isUpgradeEligible,
} from "./RunUpgradeState.js";

describe("run upgrade state", () => {
  it("starts with zero levels and neutral effective stats", () => {
    const state = createInitialRunUpgradeState();

    expect(state.levels).toEqual({
      "rapid-fire": 0,
      "swift-movement": 0,
      vitality: 0,
    });
    expect(
      getEffectiveAttackCooldownSeconds(
        BASIC_ATTACK_DEFINITION.cooldownSeconds,
        state,
      ),
    ).toBe(BASIC_ATTACK_DEFINITION.cooldownSeconds);
    expect(
      getEffectiveMovementSpeedUnitsPerSecond(
        PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
        state,
      ),
    ).toBe(PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND);
    expect(
      getEffectiveMaximumHealth(PROVISIONAL_PLAYER_MAXIMUM_HEALTH, state),
    ).toBe(PROVISIONAL_PLAYER_MAXIMUM_HEALTH);
    expect(Object.isFrozen(state)).toBe(true);
    expect(Object.isFrozen(state.levels)).toBe(true);
  });

  it("copies caller levels before freezing them", () => {
    const callerLevels = { "rapid-fire": 1 };
    const state = createRunUpgradeState(callerLevels);

    callerLevels["rapid-fire"] = 4;

    expect(state.levels["rapid-fire"]).toBe(1);
  });

  it("increases true fire rate by 10% per level", () => {
    const state = createRunUpgradeState({ "rapid-fire": 3 });

    expect(
      getEffectiveAttackCooldownSeconds(
        BASIC_ATTACK_DEFINITION.cooldownSeconds,
        state,
      ),
    ).toBeCloseTo(BASIC_ATTACK_DEFINITION.cooldownSeconds / 1.3);
  });

  it("never derives an attack cooldown below 0.6 seconds", () => {
    const state = createRunUpgradeState({ "rapid-fire": 5 });

    expect(getEffectiveAttackCooldownSeconds(0.7, state)).toBe(0.6);
  });

  it("adds 10% of original movement speed per level", () => {
    const state = createRunUpgradeState({ "swift-movement": 3 });

    expect(
      getEffectiveMovementSpeedUnitsPerSecond(
        PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
        state,
      ),
    ).toBeCloseTo(PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND * 1.3);
  });

  it("adds one maximum health per vitality level", () => {
    const state = createRunUpgradeState({ vitality: 3 });

    expect(
      getEffectiveMaximumHealth(PROVISIONAL_PLAYER_MAXIMUM_HEALTH, state),
    ).toBe(PROVISIONAL_PLAYER_MAXIMUM_HEALTH + 3);
  });

  it("increases maximum health and immediately heals one", () => {
    expect(calculateVitalityUpgradeHealth(1, 3)).toEqual({
      currentHealth: 2,
      maximumHealth: 4,
    });
    expect(calculateVitalityUpgradeHealth(3, 3)).toEqual({
      currentHealth: 4,
      maximumHealth: 4,
    });
  });

  it("keeps supported upgrades eligible only below their level caps", () => {
    const levelFour = createRunUpgradeState({
      "rapid-fire": 4,
      "swift-movement": 4,
      vitality: 4,
    });
    const levelFive = createRunUpgradeState({
      "rapid-fire": 5,
      "swift-movement": 5,
      vitality: 5,
    });

    for (const upgradeId of [
      "rapid-fire",
      "swift-movement",
      "vitality",
    ] as const) {
      expect(isUpgradeEligible(upgradeId, levelFour)).toBe(true);
      expect(isUpgradeEligible(upgradeId, levelFive)).toBe(false);
    }
    expect(isUpgradeEligible("unsupported", levelFour)).toBe(false);
  });

  it.each([-1, 1.5, 6, Number.MAX_SAFE_INTEGER + 1])(
    "rejects an invalid level of %s",
    (level) => {
      expect(() => createRunUpgradeState({ "rapid-fire": level })).toThrow(
        RangeError,
      );
    },
  );

  it("derives effective values without mutating base definitions", () => {
    const attackBefore = structuredClone(BASIC_ATTACK_DEFINITION);
    const enemyBefore = structuredClone(BASIC_ENEMY_DEFINITION);
    const state = createRunUpgradeState({
      "rapid-fire": 5,
      "swift-movement": 5,
      vitality: 5,
    });

    getEffectiveAttackCooldownSeconds(
      BASIC_ATTACK_DEFINITION.cooldownSeconds,
      state,
    );
    getEffectiveMovementSpeedUnitsPerSecond(
      PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
      state,
    );
    getEffectiveMaximumHealth(PROVISIONAL_PLAYER_MAXIMUM_HEALTH, state);

    expect(BASIC_ATTACK_DEFINITION).toEqual(attackBefore);
    expect(Object.isFrozen(BASIC_ATTACK_DEFINITION)).toBe(true);
    expect(BASIC_ENEMY_DEFINITION).toEqual(enemyBefore);
    expect(BASIC_ENEMY_DEFINITION.maximumHealth).toBe(1);
    expect(Object.isFrozen(BASIC_ENEMY_DEFINITION)).toBe(true);
  });
});
