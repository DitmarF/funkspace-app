/** Snapshot values supplied by session/result integration, never score counters. */
export interface ScoreInput {
  /** Authoritative kill count, including a defeated boss exactly once. */
  readonly enemiesDefeated: number;
  /** Completed normal encounters only; excludes the boss and waves merely reached. */
  readonly normalWavesCleared: number;
  /** Authoritative terminal outcome; the scoring rule does not decide victory. */
  readonly won: boolean;
  readonly currentHealth: number;
  /** Maximum health derived from the player's base value and run upgrades. */
  readonly effectiveMaximumHealth: number;
}

/** Provisional WS-6.6 rewards; Dimi's scoring approval is pending. */
export const SCORE_WEIGHTS = Object.freeze({
  perEnemyDefeated: 10,
  perNormalWaveCleared: 100,
  victory: 500,
  fullHealthOnVictory: 100,
});

function assertNonNegativeSafeInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative safe integer.`);
  }
}

/** Pure terminal-score arithmetic. WS-6.5/7 own integration and result creation. */
export function calculateScore(input: Readonly<ScoreInput>): number {
  assertNonNegativeSafeInteger(input.enemiesDefeated, "Enemies defeated");
  assertNonNegativeSafeInteger(
    input.normalWavesCleared,
    "Normal waves cleared",
  );
  if (typeof input.won !== "boolean") {
    throw new TypeError("Won must be a boolean.");
  }
  if (
    !Number.isFinite(input.effectiveMaximumHealth) ||
    input.effectiveMaximumHealth <= 0
  ) {
    throw new RangeError(
      "Effective maximum health must be finite and positive.",
    );
  }
  if (
    !Number.isFinite(input.currentHealth) ||
    input.currentHealth < 0 ||
    input.currentHealth > input.effectiveMaximumHealth
  ) {
    throw new RangeError(
      "Current health must be finite and within 0 and effective maximum health.",
    );
  }

  let score =
    SCORE_WEIGHTS.perEnemyDefeated * input.enemiesDefeated +
    SCORE_WEIGHTS.perNormalWaveCleared * input.normalWavesCleared;

  if (input.won) {
    const scaledHealth =
      SCORE_WEIGHTS.fullHealthOnVictory * input.currentHealth;
    // Preserve the candidate's multiplication order for ordinary values. For
    // extremely large finite health, divide first to avoid intermediate overflow.
    const healthBonus = Math.floor(
      Number.isFinite(scaledHealth)
        ? scaledHealth / input.effectiveMaximumHealth
        : SCORE_WEIGHTS.fullHealthOnVictory *
            (input.currentHealth / input.effectiveMaximumHealth),
    );
    score += SCORE_WEIGHTS.victory + healthBonus;
  }

  assertNonNegativeSafeInteger(score, "Score");
  return score;
}
