import { ARENA } from "../arena/index.js";
import type { LogicalPosition } from "../geometry/index.js";
import type { PlayerState } from "../state/RuntimeState.js";
import { createMovementIntent, type MovementIntent } from "./MovementIntent.js";

function clampPlayerPosition(
  position: LogicalPosition,
  radius: number,
): LogicalPosition {
  return {
    x: Math.max(radius, Math.min(ARENA.width - radius, position.x)),
    y: Math.max(radius, Math.min(ARENA.height - radius, position.y)),
  };
}

/**
 * Calculate one deterministic player movement step in logical arena units.
 *
 * The input intention is constrained at the Domain boundary. Invalid or
 * non-positive deltas produce no displacement, while the returned center is
 * always clamped far enough from each arena edge to contain the player circle.
 */
export function calculateNextPlayerPosition(
  player: Readonly<PlayerState>,
  movementIntent: MovementIntent,
  deltaSeconds: number,
): LogicalPosition {
  const safeDeltaSeconds =
    Number.isFinite(deltaSeconds) && deltaSeconds > 0 ? deltaSeconds : 0;
  const safeIntent = createMovementIntent(movementIntent.x, movementIntent.y);
  const travelDistance = player.movementSpeedUnitsPerSecond * safeDeltaSeconds;

  return clampPlayerPosition(
    {
      x:
        safeIntent.x === 0
          ? player.position.x
          : player.position.x + safeIntent.x * travelDistance,
      y:
        safeIntent.y === 0
          ? player.position.y
          : player.position.y + safeIntent.y * travelDistance,
    },
    player.collisionRadius,
  );
}
