import { describe, expect, it } from "vitest";
import {
  createRunUpgradeState,
  getEffectiveMaximumHealth,
} from "../upgrades/RunUpgradeState.js";
import { PROVISIONAL_RUN_DEFINITION } from "../waves/RunDefinition.js";
import {
  calculateScore,
  SCORE_WEIGHTS,
  type ScoreInput,
} from "./CalculateScore.js";

const ZERO_PROGRESS: Readonly<ScoreInput> = Object.freeze({
  enemiesDefeated: 0,
  normalWavesCleared: 0,
  won: false,
  currentHealth: 3,
  effectiveMaximumHealth: 3,
});

describe("calculateScore", () => {
  it("centralizes immutable candidate weights", () => {
    expect(SCORE_WEIGHTS).toEqual({
      perEnemyDefeated: 10,
      perNormalWaveCleared: 100,
      victory: 500,
      fullHealthOnVictory: 100,
    });
    expect(Object.isFrozen(SCORE_WEIGHTS)).toBe(true);
  });

  it("awards zero for no progress, even at full health", () => {
    expect(calculateScore(ZERO_PROGRESS)).toBe(0);
  });

  it.each([0, 1, 3])(
    "awards kills and clears on loss without bonuses at %s health",
    (currentHealth) => {
      expect(
        calculateScore({
          ...ZERO_PROGRESS,
          enemiesDefeated: 7,
          normalWavesCleared: 1,
          currentHealth,
        }),
      ).toBe(170);
    },
  );

  it("scores all configured normal waves and counts a defeated boss once", () => {
    const normalWaves = PROVISIONAL_RUN_DEFINITION.normalWaves;
    const normalEnemies = normalWaves.reduce(
      (total, wave) =>
        total + wave.groups.reduce((sum, group) => sum + group.count, 0),
      0,
    );
    const completedNormals = {
      ...ZERO_PROGRESS,
      enemiesDefeated: normalEnemies,
      normalWavesCleared: normalWaves.length,
    };
    expect(calculateScore(completedNormals)).toBe(680);
    // Final boss contributes one kill, not an additional normal-wave clear.
    expect(
      calculateScore({
        ...completedNormals,
        enemiesDefeated: normalEnemies + 1,
      }),
    ).toBe(690);
    expect(
      calculateScore({
        ...completedNormals,
        enemiesDefeated: normalEnemies + 1,
        won: true,
      }),
    ).toBe(1290);
  });

  it.each([
    [0, 3, 500],
    [1, 3, 533],
    [2, 3, 566],
    [3, 3, 600],
    [1.5, 4, 537],
    [0.5, 1, 550],
    [29, 100, 529],
    [57, 100, 557],
  ])(
    "floors the victory health bonus for %s / %s health",
    (currentHealth, effectiveMaximumHealth, expected) => {
      expect(
        calculateScore({
          ...ZERO_PROGRESS,
          won: true,
          currentHealth,
          effectiveMaximumHealth,
        }),
      ).toBe(expected);
    },
  );

  it.each([
    [1, 2, 3, 6],
    [1, 3, 2, 6],
    [2, 3, 4, 6],
    [29, 100, 58, 200],
    [3, 3, 7, 7],
  ])(
    "gives equal bonuses for equal health percentages (%s/%s and %s/%s)",
    (health, maximum, otherHealth, otherMaximum) => {
      const first = calculateScore({
        ...ZERO_PROGRESS,
        won: true,
        currentHealth: health,
        effectiveMaximumHealth: maximum,
      });
      expect(
        calculateScore({
          ...ZERO_PROGRESS,
          won: true,
          currentHealth: otherHealth,
          effectiveMaximumHealth: otherMaximum,
        }),
      ).toBe(first);
    },
  );

  it("uses the existing upgraded maximum-health calculation", () => {
    const effectiveMaximumHealth = getEffectiveMaximumHealth(
      3,
      createRunUpgradeState({ vitality: 3 }),
    );
    expect(effectiveMaximumHealth).toBe(6);
    expect(
      calculateScore({
        ...ZERO_PROGRESS,
        enemiesDefeated: 29,
        normalWavesCleared: 4,
        won: true,
        currentHealth: 3,
        effectiveMaximumHealth,
      }),
    ).toBe(1240);
  });

  it.each([Number.MIN_VALUE, Number.MAX_VALUE])(
    "handles full health at finite extreme %s without overflow",
    (health) => {
      expect(
        calculateScore({
          ...ZERO_PROGRESS,
          won: true,
          currentHealth: health,
          effectiveMaximumHealth: health,
        }),
      ).toBe(600);
    },
  );

  it("does not mutate inputs or accumulate points across evaluations", () => {
    const input = Object.freeze({
      ...ZERO_PROGRESS,
      enemiesDefeated: 29,
      normalWavesCleared: 4,
      won: true,
      currentHealth: 2,
    });
    const before = { ...input };
    for (let repetition = 0; repetition < 5; repetition += 1) {
      expect(calculateScore(input)).toBe(1256);
    }
    expect(input).toEqual(before);
    expect(calculateScore(ZERO_PROGRESS)).toBe(0);
  });

  for (const field of ["enemiesDefeated", "normalWavesCleared"] as const) {
    it.each([
      -1,
      0.5,
      Number.NaN,
      Infinity,
      -Infinity,
      Number.MAX_SAFE_INTEGER + 1,
    ])(`rejects invalid ${field}: %s`, (value) => {
      expect(() =>
        calculateScore({ ...ZERO_PROGRESS, [field]: value }),
      ).toThrow(RangeError);
    });
  }

  it.each([-1, 4, Number.NaN, Infinity, -Infinity])(
    "rejects invalid current health %s even on loss",
    (currentHealth) => {
      expect(() => calculateScore({ ...ZERO_PROGRESS, currentHealth })).toThrow(
        RangeError,
      );
    },
  );

  it.each([0, -1, Number.NaN, Infinity, -Infinity])(
    "rejects invalid maximum health %s even on loss",
    (effectiveMaximumHealth) => {
      expect(() =>
        calculateScore({ ...ZERO_PROGRESS, effectiveMaximumHealth }),
      ).toThrow(RangeError);
    },
  );

  it.each(["false", 0, 1, null, undefined])(
    "rejects a non-boolean win flag %s",
    (won) => {
      expect(() =>
        calculateScore({ ...ZERO_PROGRESS, won: won as unknown as boolean }),
      ).toThrow(TypeError);
    },
  );

  it("accepts the largest safe enemy-only score and rejects weighted/summed overflow", () => {
    const safeEnemyCount = Math.floor(Number.MAX_SAFE_INTEGER / 10);
    expect(
      calculateScore({ ...ZERO_PROGRESS, enemiesDefeated: safeEnemyCount }),
    ).toBe(Number.MAX_SAFE_INTEGER - 1);
    for (const input of [
      { ...ZERO_PROGRESS, enemiesDefeated: safeEnemyCount + 1 },
      { ...ZERO_PROGRESS, normalWavesCleared: Number.MAX_SAFE_INTEGER },
      {
        ...ZERO_PROGRESS,
        enemiesDefeated: safeEnemyCount,
        normalWavesCleared: 1,
      },
      { ...ZERO_PROGRESS, enemiesDefeated: safeEnemyCount, won: true },
    ]) {
      expect(() => calculateScore(input)).toThrow(RangeError);
    }
  });
});
