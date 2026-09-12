import { ARENA, VISIBLE_ARENA_BOUNDS } from "../arena/index.js";
import {
  calculateEnemySpawnOffset,
  createEnemyDespawnBounds,
  DESPAWN_EXTRA_MARGIN,
} from "../spawning/SpawnGeometry.js";
import {
  CHARGER_BOSS_DEFINITION,
  createChargerBossState,
} from "./ChargerBoss.js";
import type { ChargerBossState } from "./EnemyState.js";

/** Provisional top-center entry: longer than the normal 0.75s lead. */
export const BOSS_ENTRY_LEAD_SECONDS = 1.5;
const ENTRY_OFFSET = calculateEnemySpawnOffset(
  CHARGER_BOSS_DEFINITION.collisionRadius,
  CHARGER_BOSS_DEFINITION.movementSpeedUnitsPerSecond,
  BOSS_ENTRY_LEAD_SECONDS,
);
export const BOSS_ENTRY_DURATION_SECONDS =
  (ENTRY_OFFSET + CHARGER_BOSS_DEFINITION.collisionRadius) /
  CHARGER_BOSS_DEFINITION.movementSpeedUnitsPerSecond;
export const BOSS_DESPAWN_BOUNDS = createEnemyDespawnBounds(
  VISIBLE_ARENA_BOUNDS,
  CHARGER_BOSS_DEFINITION,
  BOSS_ENTRY_LEAD_SECONDS,
  DESPAWN_EXTRA_MARGIN,
);

export function createEnteringBoss(
  id: number,
  simulationTimeSeconds: number,
): ChargerBossState {
  if (
    !Number.isFinite(simulationTimeSeconds) ||
    simulationTimeSeconds < 0 ||
    !Number.isFinite(simulationTimeSeconds + BOSS_ENTRY_DURATION_SECONDS)
  ) {
    throw new RangeError("Boss entry requires finite gameplay time.");
  }
  const boss = createChargerBossState(id, {
    x: ARENA.width / 2,
    y: -ENTRY_OFFSET,
  });
  boss.entryStartedAtSeconds = simulationTimeSeconds;
  return boss;
}

/** Entry is harmless until the whole body is inside; no player tracking. */
export function advanceBossEntry(
  boss: ChargerBossState,
  simulationTimeSeconds: number,
): void {
  if (
    boss.phase !== "entering" ||
    boss.entryStartedAtSeconds === null ||
    !Number.isFinite(simulationTimeSeconds) ||
    simulationTimeSeconds < boss.entryStartedAtSeconds
  )
    return;
  const elapsed = Math.min(
    BOSS_ENTRY_DURATION_SECONDS,
    simulationTimeSeconds - boss.entryStartedAtSeconds,
  );
  boss.position = {
    x: ARENA.width / 2,
    y:
      -ENTRY_OFFSET +
      elapsed * CHARGER_BOSS_DEFINITION.movementSpeedUnitsPerSecond,
  };
  if (elapsed >= BOSS_ENTRY_DURATION_SECONDS) {
    boss.phase = "active";
    boss.entryStartedAtSeconds = null;
  }
}
