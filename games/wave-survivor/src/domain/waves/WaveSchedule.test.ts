import { describe, expect, it } from "vitest";
import {
  createSpawnGroup,
  createWaveDefinition,
  PROVISIONAL_EPIC_5_WAVES,
} from "./WaveDefinition.js";
import {
  advanceWaveSchedule,
  compileWaveSchedule,
  consumeNextScheduledSpawnRequest,
  createWaveScheduleProgress,
  getDueScheduledSpawnRequest,
} from "./WaveSchedule.js";

function createGroup(
  startOffsetSeconds: number,
  count: number,
  intervalSeconds: number,
) {
  return createSpawnGroup({
    startOffsetSeconds,
    enemyId: "basic",
    count,
    intervalSeconds,
    pattern: "random-perimeter",
  });
}

function createWave(...groups: ReturnType<typeof createGroup>[]) {
  return createWaveDefinition({ groups, maxActiveEnemies: 4 });
}

describe("compileWaveSchedule", () => {
  it("compiles one group into interval-based requests", () => {
    const requests = compileWaveSchedule(createWave(createGroup(0.5, 3, 1)));

    expect(requests).toEqual([
      {
        scheduledAtSeconds: 0.5,
        enemyId: "basic",
        pattern: "random-perimeter",
        sequenceIndex: 0,
      },
      {
        scheduledAtSeconds: 1.5,
        enemyId: "basic",
        pattern: "random-perimeter",
        sequenceIndex: 1,
      },
      {
        scheduledAtSeconds: 2.5,
        enemyId: "basic",
        pattern: "random-perimeter",
        sequenceIndex: 2,
      },
    ]);
  });

  it("orders multiple groups by scheduled time", () => {
    const requests = compileWaveSchedule(
      createWave(createGroup(2, 2, 1), createGroup(0.5, 2, 1)),
    );

    expect(requests.map((request) => request.scheduledAtSeconds)).toEqual([
      0.5, 1.5, 2, 3,
    ]);
    expect(requests.map((request) => request.sequenceIndex)).toEqual([
      2, 3, 0, 1,
    ]);
  });

  it("resolves equal timestamps by group order and retains group request order", () => {
    const requests = compileWaveSchedule(
      createWave(createGroup(1, 2, 1), createGroup(1, 2, 1)),
    );

    expect(requests.map((request) => request.sequenceIndex)).toEqual([
      0, 2, 1, 3,
    ]);
  });

  it("returns deeply immutable requests", () => {
    const requests = compileWaveSchedule(createWave(createGroup(0.5, 1, 0)));

    expect(Object.isFrozen(requests)).toBe(true);
    expect(Object.isFrozen(requests[0])).toBe(true);
  });
});

describe("wave schedule progress", () => {
  it("uses the cap from each wave definition", () => {
    const firstWave = createWaveScheduleProgress(
      1,
      PROVISIONAL_EPIC_5_WAVES[0]!,
    );
    const secondWave = createWaveScheduleProgress(
      2,
      PROVISIONAL_EPIC_5_WAVES[1]!,
    );

    expect(firstWave.maxActiveEnemies).toBe(2);
    expect(secondWave.maxActiveEnemies).toBe(3);
  });

  it("does not release before the scheduled time and releases at the exact boundary", () => {
    const progress = createWaveScheduleProgress(
      1,
      createWave(createGroup(0.5, 1, 0)),
    );

    expect(advanceWaveSchedule(progress, 0.49)).toBe(true);
    expect(getDueScheduledSpawnRequest(progress)).toBeNull();

    expect(advanceWaveSchedule(progress, 0.01)).toBe(true);
    expect(getDueScheduledSpawnRequest(progress)?.scheduledAtSeconds).toBe(0.5);
  });

  it("keeps a due request pending until explicitly consumed", () => {
    const progress = createWaveScheduleProgress(
      1,
      createWave(createGroup(0, 1, 0)),
    );

    advanceWaveSchedule(progress, 0.01);
    const request = getDueScheduledSpawnRequest(progress);

    expect(request).not.toBeNull();
    expect(getDueScheduledSpawnRequest(progress)).toBe(request);
    expect(progress.nextScheduledSpawnIndex).toBe(0);
    expect(consumeNextScheduledSpawnRequest(progress)).toBe(true);
    expect(progress.nextScheduledSpawnIndex).toBe(1);
    expect(getDueScheduledSpawnRequest(progress)).toBeNull();
  });
});
