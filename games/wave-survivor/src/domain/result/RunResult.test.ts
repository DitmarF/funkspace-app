import { describe, expect, expectTypeOf, it } from "vitest";
import type { RunResult as PublicRunResult } from "@funkspace/wave-survivor";
import { calculateScore } from "../score/CalculateScore.js";
import {
  PROVISIONAL_RUN_DEFINITION,
  getRunEncounter,
} from "../waves/RunDefinition.js";
import { createRunResult, type RunResult } from "./RunResult.js";

const LOSS: RunResult = {
  outcome: "lost",
  score: 170,
  waveReached: 2,
  elapsedSeconds: 12.5,
};

describe("createRunResult", () => {
  it("exports the exact readonly record type through the package root", () => {
    expectTypeOf<PublicRunResult>().toEqualTypeOf<RunResult>();
    expectTypeOf<PublicRunResult>().toEqualTypeOf<{
      readonly outcome: "won" | "lost";
      readonly score: number;
      readonly waveReached: number;
      readonly elapsedSeconds: number;
    }>();
  });

  it("copies a valid loss, including a partially entered normal wave", () => {
    expect(createRunResult(LOSS)).toEqual(LOSS);
    expect(
      createRunResult({ ...LOSS, score: 0, waveReached: 1, elapsedSeconds: 0 }),
    ).toEqual({
      outcome: "lost",
      score: 0,
      waveReached: 1,
      elapsedSeconds: 0,
    });
  });

  it.each(["won", "lost"] as const)(
    "records %s at the boss without treating it as a normal clear",
    (outcome) => {
      const normalWavesCleared = PROVISIONAL_RUN_DEFINITION.normalWaves.length;
      const waveReached = normalWavesCleared + 1;
      expect(
        getRunEncounter(PROVISIONAL_RUN_DEFINITION, waveReached - 1).kind,
      ).toBe("boss");
      const score = calculateScore({
        enemiesDefeated: outcome === "won" ? 29 : 28,
        normalWavesCleared,
        won: outcome === "won",
        currentHealth: outcome === "won" ? 3 : 0,
        effectiveMaximumHealth: 3,
      });
      expect(
        createRunResult({ outcome, score, waveReached, elapsedSeconds: 67.25 }),
      ).toEqual({
        outcome,
        score: outcome === "won" ? 1290 : 680,
        waveReached: 5,
        elapsedSeconds: 67.25,
      });
    },
  );

  it("isolates copied primitives and excludes extra runtime fields", () => {
    const input = { ...LOSS, enemies: [{ health: 1 }] };
    const result = createRunResult(input);
    input.outcome = "won";
    input.score = 999;
    input.waveReached = 5;
    input.elapsedSeconds = 0;
    input.enemies[0]!.health = 0;
    expect(result).toEqual(LOSS);
    expect(result).not.toBe(input);
    expect(result).not.toHaveProperty("enemies");
    expect(Object.isFrozen(input)).toBe(false);
  });

  it("freezes the result at runtime and creates independent records", () => {
    const result = createRunResult(LOSS);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Reflect.set(result, "score", 999)).toBe(false);
    expect(Reflect.deleteProperty(result, "outcome")).toBe(false);
    expect(() =>
      Object.defineProperty(result, "debug", { value: true }),
    ).toThrow(TypeError);
    const other = createRunResult(LOSS);
    expect(other).not.toBe(result);
    expect(result).toEqual(LOSS);
    expect(other).toEqual(result);
  });

  it.each(["idle", "playing", "paused", "wave-cleared", "", null, undefined])(
    "rejects invalid outcome %s",
    (outcome) => {
      expect(() =>
        createRunResult({ ...LOSS, outcome: outcome as RunResult["outcome"] }),
      ).toThrow(TypeError);
    },
  );

  it.each([-1, 0.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid score %s",
    (score) => {
      expect(() => createRunResult({ ...LOSS, score })).toThrow(RangeError);
    },
  );

  it.each([0, -1, 1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid encounter number %s",
    (waveReached) => {
      expect(() => createRunResult({ ...LOSS, waveReached })).toThrow(
        RangeError,
      );
    },
  );

  it.each([-1, NaN, Infinity, -Infinity])(
    "rejects invalid elapsed time %s",
    (elapsedSeconds) => {
      expect(() => createRunResult({ ...LOSS, elapsedSeconds })).toThrow(
        RangeError,
      );
    },
  );

  it("preserves valid numeric limits without rounding or content-specific caps", () => {
    const input = {
      ...LOSS,
      score: Number.MAX_SAFE_INTEGER,
      waveReached: Number.MAX_SAFE_INTEGER,
      elapsedSeconds: Number.MAX_VALUE,
    };
    expect(createRunResult(input)).toEqual(input);
  });
});
