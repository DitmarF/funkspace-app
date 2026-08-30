import {
  isEnemyStateValid,
  isEnemyTargetable,
  type EnemyState,
} from "../enemies/index.js";
import { doCirclesIntersect } from "../geometry/index.js";
import type { ProjectileState } from "../projectiles/index.js";

/**
 * Apply one projectile's damage to the lowest-ID overlapping active enemy.
 *
 * Returns whether the projectile hit and must be retired by its owner.
 */
export function resolveProjectileHit(
  projectile: Readonly<ProjectileState>,
  enemies: readonly EnemyState[],
): boolean {
  let hitEnemy: EnemyState | null = null;

  for (const enemy of enemies) {
    if (!isEnemyStateValid(enemy) || !isEnemyTargetable(enemy)) continue;
    if (hitEnemy !== null && enemy.id >= hitEnemy.id) continue;
    if (
      !doCirclesIntersect(
        projectile.position,
        projectile.collisionRadius,
        enemy.position,
        enemy.collisionRadius,
      )
    ) {
      continue;
    }

    hitEnemy = enemy;
  }

  if (!hitEnemy) return false;

  const nextHealth = hitEnemy.currentHealth - projectile.damage;
  if (!Number.isFinite(nextHealth)) {
    throw new RangeError("Enemy health must remain finite after damage.");
  }

  hitEnemy.currentHealth = nextHealth;
  return true;
}
