import { BASIC_ENEMY_DEFINITION, type EnemyKind } from "../enemies/index.js";

/** Spawn patterns supported by the current Wave Survivor domain. */
export type SpawnPattern = "random-perimeter";

/** One finite, ordered group of enemies in a wave schedule. */
export interface SpawnGroup {
  readonly startOffsetSeconds: number;
  readonly enemyId: EnemyKind;
  readonly count: number;
  readonly intervalSeconds: number;
  readonly pattern: SpawnPattern;
}

/** Immutable configuration for one finite wave. */
export interface WaveDefinition {
  readonly groups: readonly SpawnGroup[];
  readonly maxActiveEnemies: number;
}

const RANDOM_PERIMETER_PATTERN: SpawnPattern = "random-perimeter";

function assertFiniteNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be finite and non-negative.`);
  }
}

function assertPositiveSafeInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive safe integer.`);
  }
}

function assertSupportedEnemyId(enemyId: string): asserts enemyId is EnemyKind {
  if (enemyId !== BASIC_ENEMY_DEFINITION.kind) {
    throw new TypeError(`Unsupported enemy ID: ${enemyId}.`);
  }
}

function assertSupportedPattern(
  pattern: string,
): asserts pattern is SpawnPattern {
  if (pattern !== RANDOM_PERIMETER_PATTERN) {
    throw new TypeError(`Unsupported spawn pattern: ${pattern}.`);
  }
}

/** Validate, copy, and freeze one spawn group. */
export function createSpawnGroup(definition: {
  readonly startOffsetSeconds: number;
  readonly enemyId: string;
  readonly count: number;
  readonly intervalSeconds: number;
  readonly pattern: string;
}): Readonly<SpawnGroup> {
  assertFiniteNonNegative(
    definition.startOffsetSeconds,
    "Spawn group start offset",
  );
  assertPositiveSafeInteger(definition.count, "Spawn group count");
  assertFiniteNonNegative(definition.intervalSeconds, "Spawn group interval");

  if (definition.count > 1 && definition.intervalSeconds === 0) {
    throw new RangeError(
      "Spawn group interval must be positive when count is greater than one.",
    );
  }

  assertSupportedEnemyId(definition.enemyId);
  assertSupportedPattern(definition.pattern);

  return Object.freeze({
    startOffsetSeconds: definition.startOffsetSeconds,
    enemyId: definition.enemyId,
    count: definition.count,
    intervalSeconds: definition.intervalSeconds,
    pattern: definition.pattern,
  });
}

/** Validate, deeply copy, and freeze one finite wave definition. */
export function createWaveDefinition(definition: {
  readonly groups: readonly SpawnGroup[];
  readonly maxActiveEnemies: number;
}): Readonly<WaveDefinition> {
  if (definition.groups.length === 0) {
    throw new RangeError("Wave groups must not be empty.");
  }

  assertPositiveSafeInteger(
    definition.maxActiveEnemies,
    "Maximum active enemies",
  );

  const groups = Object.freeze(
    definition.groups.map((group) => createSpawnGroup(group)),
  );

  return Object.freeze({
    groups,
    maxActiveEnemies: definition.maxActiveEnemies,
  });
}

/** Temporary EPIC 5 tuning; EPIC 6 may replace these provisional waves. */
export const PROVISIONAL_EPIC_5_WAVES: readonly Readonly<WaveDefinition>[] =
  Object.freeze([
    createWaveDefinition({
      groups: [
        createSpawnGroup({
          startOffsetSeconds: 0.5,
          enemyId: "basic",
          count: 4,
          intervalSeconds: 1,
          pattern: "random-perimeter",
        }),
      ],
      maxActiveEnemies: 2,
    }),
    createWaveDefinition({
      groups: [
        createSpawnGroup({
          startOffsetSeconds: 0.5,
          enemyId: "basic",
          count: 6,
          intervalSeconds: 0.85,
          pattern: "random-perimeter",
        }),
      ],
      maxActiveEnemies: 3,
    }),
    createWaveDefinition({
      groups: [
        createSpawnGroup({
          startOffsetSeconds: 0.5,
          enemyId: "basic",
          count: 4,
          intervalSeconds: 0.8,
          pattern: "random-perimeter",
        }),
        createSpawnGroup({
          startOffsetSeconds: 4.5,
          enemyId: "basic",
          count: 4,
          intervalSeconds: 0.7,
          pattern: "random-perimeter",
        }),
      ],
      maxActiveEnemies: 4,
    }),
    createWaveDefinition({
      groups: [
        createSpawnGroup({
          startOffsetSeconds: 0.5,
          enemyId: "basic",
          count: 6,
          intervalSeconds: 0.7,
          pattern: "random-perimeter",
        }),
        createSpawnGroup({
          startOffsetSeconds: 5,
          enemyId: "basic",
          count: 4,
          intervalSeconds: 0.6,
          pattern: "random-perimeter",
        }),
      ],
      maxActiveEnemies: 4,
    }),
  ]);
