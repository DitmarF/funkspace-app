import {
  canEnemyPursue,
  isEnemyStateValid,
  type EnemyState,
} from "../enemies/index.js";

/** Count valid entering and active enemies that occupy the current wave cap. */
export function countEnemiesOccupyingWaveCapacity(
  enemies: readonly Readonly<EnemyState>[],
): number {
  let liveEnemyCount = 0;

  for (const enemy of enemies) {
    if (isEnemyStateValid(enemy) && canEnemyPursue(enemy)) {
      liveEnemyCount += 1;
    }
  }

  return liveEnemyCount;
}
