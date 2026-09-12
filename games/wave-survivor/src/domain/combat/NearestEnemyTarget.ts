import {
  isEnemyStateValid,
  isEnemyTargetable,
  type EnemyState,
} from "../enemies/index.js";
import type { LogicalPosition } from "../geometry/index.js";

/**
 * Select the nearest valid active enemy without retaining targeting state.
 *
 * Squared center-to-center distance avoids a square root per candidate. Enemy
 * ID provides deterministic ordering when multiple candidates are equidistant.
 */
export function findNearestTargetableEnemy(
  playerPosition: Readonly<LogicalPosition>,
  enemies: readonly Readonly<EnemyState>[],
): Readonly<EnemyState> | null {
  let nearestEnemy: Readonly<EnemyState> | null = null;
  let nearestSquaredDistance = Number.POSITIVE_INFINITY;

  for (const enemy of enemies) {
    if (!isEnemyStateValid(enemy) || !isEnemyTargetable(enemy)) continue;

    const distanceX = enemy.position.x - playerPosition.x;
    const distanceY = enemy.position.y - playerPosition.y;
    const squaredDistance = distanceX * distanceX + distanceY * distanceY;

    if (!Number.isFinite(squaredDistance)) continue;

    if (
      squaredDistance < nearestSquaredDistance ||
      (squaredDistance === nearestSquaredDistance &&
        nearestEnemy !== null &&
        enemy.id < nearestEnemy.id)
    ) {
      nearestEnemy = enemy;
      nearestSquaredDistance = squaredDistance;
    }
  }

  return nearestEnemy;
}
