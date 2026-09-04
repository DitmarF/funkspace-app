import {
  canEnemyPursue,
  isEnemyStateValid,
  type EnemyState,
} from "../enemies/index.js";
import type { WaveScheduleProgress } from "./WaveSchedule.js";

/**
 * Derive whether the current finite wave has no pending combat work.
 *
 * Invalid enemies deliberately prevent completion until the existing enemy
 * cleanup path removes them. Dying enemies are valid visual-only state and do
 * not block completion.
 */
export function isWaveComplete(
  schedule: Readonly<WaveScheduleProgress>,
  enemies: readonly Readonly<EnemyState>[],
): boolean {
  if (schedule.nextScheduledSpawnIndex !== schedule.requests.length) {
    return false;
  }

  for (const enemy of enemies) {
    if (!isEnemyStateValid(enemy) || canEnemyPursue(enemy)) return false;
  }

  return true;
}
