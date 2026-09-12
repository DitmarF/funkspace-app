/** Host-facing completion record; contains no live runtime references. */
export interface RunResult {
  readonly outcome: "won" | "lost";
  /** Validated output of calculateScore(), supplied by terminal integration. */
  readonly score: number;
  /** Highest encounter entered, numbered from one; includes the boss. */
  readonly waveReached: number;
  /** Overall gameplay simulation time, including boss entry and wind-up. */
  readonly elapsedSeconds: number;
}

/** Copy and freeze terminal values. Session integration owns their provenance. */
export function createRunResult(input: RunResult): RunResult {
  const { outcome, score, waveReached, elapsedSeconds } = input;
  if (outcome !== "won" && outcome !== "lost") {
    throw new TypeError("Result outcome must be won or lost.");
  }
  if (!Number.isSafeInteger(score) || score < 0) {
    throw new RangeError("Result score must be a non-negative safe integer.");
  }
  if (!Number.isSafeInteger(waveReached) || waveReached <= 0) {
    throw new RangeError("Wave reached must be a positive safe integer.");
  }
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) {
    throw new RangeError("Elapsed seconds must be finite and non-negative.");
  }
  return Object.freeze({ outcome, score, waveReached, elapsedSeconds });
}
