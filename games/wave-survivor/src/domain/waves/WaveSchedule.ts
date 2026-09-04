import type { EnemyKind } from "../enemies/index.js";
import type { SpawnPattern, WaveDefinition } from "./WaveDefinition.js";

/** One host-independent spawn request compiled from a finite wave definition. */
export interface ScheduledSpawnRequest {
  readonly scheduledAtSeconds: number;
  readonly enemyId: EnemyKind;
  readonly pattern: SpawnPattern;
  readonly sequenceIndex: number;
}

/** Minimal mutable progress through one immutable compiled wave schedule. */
export interface WaveScheduleProgress {
  readonly currentWaveNumber: number;
  elapsedSeconds: number;
  nextScheduledSpawnIndex: number;
  readonly requests: readonly ScheduledSpawnRequest[];
}

/** Compile groups into one immutable schedule with deterministic tie ordering. */
export function compileWaveSchedule(
  definition: Readonly<WaveDefinition>,
): readonly ScheduledSpawnRequest[] {
  const requests: ScheduledSpawnRequest[] = [];
  let sequenceIndex = 0;

  for (const group of definition.groups) {
    for (
      let groupSpawnIndex = 0;
      groupSpawnIndex < group.count;
      groupSpawnIndex += 1
    ) {
      const scheduledAtSeconds =
        group.startOffsetSeconds + group.intervalSeconds * groupSpawnIndex;
      if (!Number.isFinite(scheduledAtSeconds)) {
        throw new RangeError("Scheduled spawn time must remain finite.");
      }

      requests.push(
        Object.freeze({
          scheduledAtSeconds,
          enemyId: group.enemyId,
          pattern: group.pattern,
          sequenceIndex,
        }),
      );
      sequenceIndex += 1;
    }
  }

  requests.sort(
    (first, second) =>
      first.scheduledAtSeconds - second.scheduledAtSeconds ||
      first.sequenceIndex - second.sequenceIndex,
  );

  return Object.freeze(requests);
}

/** Create fresh progress for one finite wave. */
export function createWaveScheduleProgress(
  currentWaveNumber: number,
  definition: Readonly<WaveDefinition>,
): WaveScheduleProgress {
  if (!Number.isSafeInteger(currentWaveNumber) || currentWaveNumber <= 0) {
    throw new RangeError(
      "Current wave number must be a positive safe integer.",
    );
  }

  return {
    currentWaveNumber,
    elapsedSeconds: 0,
    nextScheduledSpawnIndex: 0,
    requests: compileWaveSchedule(definition),
  };
}

/** Advance wave-local time without consuming a scheduled request. */
export function advanceWaveSchedule(
  progress: WaveScheduleProgress,
  deltaSeconds: number,
): boolean {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return false;

  const nextElapsedSeconds = progress.elapsedSeconds + deltaSeconds;
  if (!Number.isFinite(nextElapsedSeconds)) return false;

  progress.elapsedSeconds = nextElapsedSeconds;
  return true;
}

/** Read the next due request without consuming it. */
export function getDueScheduledSpawnRequest(
  progress: Readonly<WaveScheduleProgress>,
): ScheduledSpawnRequest | null {
  const request = progress.requests[progress.nextScheduledSpawnIndex];
  if (!request || progress.elapsedSeconds < request.scheduledAtSeconds) {
    return null;
  }

  return request;
}

/** Consume exactly one due request after its enemy was successfully created. */
export function consumeNextScheduledSpawnRequest(
  progress: WaveScheduleProgress,
): boolean {
  if (!getDueScheduledSpawnRequest(progress)) return false;

  progress.nextScheduledSpawnIndex += 1;
  return true;
}
