import {
  canEnemyDealContactDamage,
  isEnemyStateValid,
  type EnemyState,
} from "../enemies/index.js";
import { doCirclesIntersect } from "../geometry/index.js";
import type { PlayerState } from "../state/RuntimeState.js";

/**
 * Apply one contact hit from the lowest-ID overlapping active enemy.
 *
 * Repeated calls may apply repeated damage. WS-4.9 owns the simulation-time
 * invulnerability guard that will wrap this single damage path.
 */
export function resolvePlayerContactDamage(
  player: PlayerState,
  enemies: readonly Readonly<EnemyState>[],
): boolean {
  if (
    !Number.isFinite(player.maximumHealth) ||
    player.maximumHealth <= 0 ||
    !Number.isFinite(player.currentHealth)
  ) {
    throw new RangeError("Player health must be finite and valid.");
  }

  let contactEnemy: Readonly<EnemyState> | null = null;

  for (const enemy of enemies) {
    if (!isEnemyStateValid(enemy) || !canEnemyDealContactDamage(enemy)) {
      continue;
    }
    if (contactEnemy !== null && enemy.id >= contactEnemy.id) continue;
    if (
      !doCirclesIntersect(
        player.position,
        player.collisionRadius,
        enemy.position,
        enemy.collisionRadius,
      )
    ) {
      continue;
    }

    contactEnemy = enemy;
  }

  if (!contactEnemy) return false;

  const boundedCurrentHealth = Math.max(
    0,
    Math.min(player.currentHealth, player.maximumHealth),
  );
  player.currentHealth = Math.max(
    0,
    boundedCurrentHealth - contactEnemy.contactDamage,
  );
  return true;
}
