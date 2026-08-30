import {
  canEnemyDealContactDamage,
  isEnemyStateValid,
  type EnemyState,
} from "../enemies/index.js";
import { doCirclesIntersect } from "../geometry/index.js";
import type { PlayerState } from "../state/RuntimeState.js";

/** Provisional Gate 1 contact-immunity tuning; subject to playtesting. */
export const PROVISIONAL_PLAYER_INVULNERABILITY_DURATION_SECONDS = 0.65;

/** Check player immunity against the single simulation clock. */
export function isPlayerInvulnerable(
  player: Readonly<PlayerState>,
  simulationTimeSeconds: number,
): boolean {
  return (
    Number.isFinite(simulationTimeSeconds) &&
    simulationTimeSeconds >= 0 &&
    Number.isFinite(player.invulnerableUntilSeconds) &&
    player.invulnerableUntilSeconds >= 0 &&
    simulationTimeSeconds < player.invulnerableUntilSeconds
  );
}

/**
 * Apply one contact hit from the lowest-ID overlapping active enemy.
 */
export function resolvePlayerContactDamage(
  player: PlayerState,
  enemies: readonly Readonly<EnemyState>[],
  simulationTimeSeconds: number,
): boolean {
  if (
    !Number.isFinite(player.maximumHealth) ||
    player.maximumHealth <= 0 ||
    !Number.isFinite(player.currentHealth) ||
    !Number.isFinite(player.invulnerableUntilSeconds) ||
    player.invulnerableUntilSeconds < 0 ||
    !Number.isFinite(simulationTimeSeconds) ||
    simulationTimeSeconds < 0
  ) {
    throw new RangeError("Player health timing must be finite and valid.");
  }

  if (isPlayerInvulnerable(player, simulationTimeSeconds)) return false;

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
  const invulnerableUntilSeconds =
    simulationTimeSeconds + PROVISIONAL_PLAYER_INVULNERABILITY_DURATION_SECONDS;
  if (!Number.isFinite(invulnerableUntilSeconds)) {
    throw new RangeError("Player invulnerability deadline must remain finite.");
  }
  player.invulnerableUntilSeconds = invulnerableUntilSeconds;
  return true;
}
