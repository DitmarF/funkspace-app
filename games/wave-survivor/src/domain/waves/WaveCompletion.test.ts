import { describe, expect, it } from "vitest";
import {
  createBasicEnemyState,
  type EnemyPhase,
  type EnemyState,
} from "../enemies/index.js";
import { PROVISIONAL_EPIC_5_WAVES } from "./WaveDefinition.js";
import { isWaveComplete } from "./WaveCompletion.js";
import {
  createWaveScheduleProgress,
  type WaveScheduleProgress,
} from "./WaveSchedule.js";

function createSchedule(exhausted: boolean): WaveScheduleProgress {
  const schedule = createWaveScheduleProgress(1, PROVISIONAL_EPIC_5_WAVES[0]!);
  if (exhausted) {
    schedule.nextScheduledSpawnIndex = schedule.requests.length;
  }
  return schedule;
}

function createEnemy(id: number, phase: EnemyPhase): EnemyState {
  const enemy = createBasicEnemyState(id, { x: 100, y: 100 });
  enemy.phase = phase;
  if (phase === "dying") enemy.removeAtSimulationSeconds = 1;
  return enemy;
}

describe("isWaveComplete", () => {
  it("returns true for an exhausted schedule with no enemies", () => {
    expect(isWaveComplete(createSchedule(true), [])).toBe(true);
  });

  it("returns false while a scheduled request remains", () => {
    expect(isWaveComplete(createSchedule(false), [])).toBe(false);
  });

  it.each(["entering", "active"] as const)(
    "returns false while a valid %s enemy remains",
    (phase) => {
      expect(
        isWaveComplete(createSchedule(true), [createEnemy(1, phase)]),
      ).toBe(false);
    },
  );

  it("allows dying enemies to finish their visual cleanup", () => {
    expect(
      isWaveComplete(createSchedule(true), [createEnemy(1, "dying")]),
    ).toBe(true);
  });

  it("remains incomplete for mixed dying and active enemies", () => {
    expect(
      isWaveComplete(createSchedule(true), [
        createEnemy(1, "dying"),
        createEnemy(2, "active"),
      ]),
    ).toBe(false);
  });

  it("leaves invalid enemies for the existing cleanup path", () => {
    const invalid = createEnemy(1, "active");
    invalid.position.x = Number.NaN;

    expect(isWaveComplete(createSchedule(true), [invalid])).toBe(false);
  });

  it("is stable and side-effect free across repeated evaluation", () => {
    const schedule = createSchedule(true);
    const enemies = [createEnemy(1, "dying")];
    const scheduleBefore = structuredClone(schedule);
    const enemiesBefore = structuredClone(enemies);

    expect(isWaveComplete(schedule, enemies)).toBe(true);
    expect(isWaveComplete(schedule, enemies)).toBe(true);
    expect(schedule).toEqual(scheduleBefore);
    expect(enemies).toEqual(enemiesBefore);
  });
});
