import { INITIAL_UPGRADE_DEFINITIONS } from "../upgrades/UpgradeDefinition.js";
import {
  createWaveDefinition,
  PROVISIONAL_EPIC_5_WAVES,
  type WaveDefinition,
} from "./WaveDefinition.js";

export interface NormalWaveEncounter {
  readonly kind: "normal-wave";
  readonly wave: Readonly<WaveDefinition>;
}

/** Final encounter position only; boss behavior and entry belong to WS-6.2/3. */
export interface BossEncounter {
  readonly kind: "boss";
}

export type RunEncounter = NormalWaveEncounter | BossEncounter;

/** At least one normal wave, followed by exactly one explicit boss. */
export interface RunDefinition {
  readonly normalWaves: readonly [
    Readonly<WaveDefinition>,
    ...Readonly<WaveDefinition>[],
  ];
  readonly finalEncounter: Readonly<BossEncounter>;
}

export type NextEncounterResolution =
  | { readonly kind: "upgrade"; readonly nextEncounter: RunEncounter }
  | { readonly kind: "complete" };

/** Validate content and one legal upgrade selection after every normal wave. */
export function createRunDefinition(definition: {
  readonly normalWaves: readonly Readonly<WaveDefinition>[];
  readonly finalEncounter: Readonly<BossEncounter>;
}): Readonly<RunDefinition> {
  const [first, ...rest] = definition.normalWaves;
  if (!first) throw new RangeError("A run needs at least one normal wave.");
  if (definition.finalEncounter.kind !== "boss") {
    throw new TypeError("A run must end with one boss encounter.");
  }

  // Every legal selection consumes exactly one level from this canonical pool.
  // Equality is safe: the final selection is before the boss, never after it.
  const upgradeCapacity = INITIAL_UPGRADE_DEFINITIONS.reduce(
    (total, upgrade) => total + upgrade.maximumLevel,
    0,
  );
  if (definition.normalWaves.length > upgradeCapacity) {
    throw new RangeError("Run upgrade opportunities exceed the upgrade pool.");
  }

  return Object.freeze({
    normalWaves: Object.freeze([
      createWaveDefinition(first),
      ...rest.map(createWaveDefinition),
    ] as const),
    finalEncounter: Object.freeze({ kind: "boss" } as const),
  });
}

/** Zero-based finite lookup. Invalid indexes never repeat normal-wave content. */
export function getRunEncounter(
  run: Readonly<RunDefinition>,
  encounterIndex: number,
): RunEncounter {
  if (
    !Number.isSafeInteger(encounterIndex) ||
    encounterIndex < 0 ||
    encounterIndex > run.normalWaves.length
  ) {
    throw new RangeError("Encounter index is outside the finite run.");
  }

  const wave = run.normalWaves[encounterIndex];
  return wave
    ? Object.freeze({ kind: "normal-wave", wave })
    : run.finalEncounter;
}

/** Called after encounter completion; this does not itself clear a wave/boss. */
export function resolveNextEncounter(
  run: Readonly<RunDefinition>,
  completedEncounterIndex: number,
): NextEncounterResolution {
  const completed = getRunEncounter(run, completedEncounterIndex);
  if (completed.kind === "boss") return Object.freeze({ kind: "complete" });

  return Object.freeze({
    kind: "upgrade",
    nextEncounter: getRunEncounter(run, completedEncounterIndex + 1),
  });
}

/** WS-6.1 candidate; Dimi's pacing review and structure approval are pending. */
export const PROVISIONAL_RUN_DEFINITION = createRunDefinition({
  normalWaves: PROVISIONAL_EPIC_5_WAVES,
  finalEncounter: { kind: "boss" },
});
