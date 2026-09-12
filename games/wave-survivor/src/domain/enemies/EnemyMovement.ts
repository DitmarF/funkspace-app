import type { LogicalPosition } from "../geometry/index.js";
import { canEnemyPursue, type EnemyState } from "./EnemyState.js";

/**
 * Calculate one deterministic direct-pursuit step toward a logical target.
 *
 * Entering and active enemies move at their configured speed without arena
 * clamping. Travel is capped at the remaining center distance so an enemy
 * cannot overshoot and oscillate around a stationary target.
 */
export function calculateNextEnemyPosition(
  enemy: Readonly<EnemyState>,
  targetPosition: Readonly<LogicalPosition>,
  deltaSeconds: number,
): LogicalPosition {
  const currentPosition = { ...enemy.position };
  if (!canEnemyPursue(enemy)) return currentPosition;
  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
    return currentPosition;
  }
  if (
    !Number.isFinite(enemy.position.x) ||
    !Number.isFinite(enemy.position.y) ||
    !Number.isFinite(targetPosition.x) ||
    !Number.isFinite(targetPosition.y) ||
    !Number.isFinite(enemy.movementSpeedUnitsPerSecond) ||
    enemy.movementSpeedUnitsPerSecond <= 0
  ) {
    return currentPosition;
  }

  const targetVectorX = targetPosition.x - enemy.position.x;
  const targetVectorY = targetPosition.y - enemy.position.y;
  const targetDistance = Math.hypot(targetVectorX, targetVectorY);
  if (!Number.isFinite(targetDistance) || targetDistance === 0) {
    return currentPosition;
  }

  const travelDistance = Math.min(
    targetDistance,
    enemy.movementSpeedUnitsPerSecond * deltaSeconds,
  );

  return {
    x: enemy.position.x + (targetVectorX / targetDistance) * travelDistance,
    y: enemy.position.y + (targetVectorY / targetDistance) * travelDistance,
  };
}
