import type { RandomSource } from "../RandomSource.js";
import type { Bounds } from "../arena/index.js";
import type { EnemyDefinition } from "../enemies/index.js";
import type { LogicalPosition } from "../geometry/index.js";
import type { PerimeterSample } from "./PerimeterSampling.js";
import { createEnemySpawnCandidate } from "./SpawnGeometry.js";

/** Provisional delay before the first EPIC 3 spawn opportunity. */
export const FIRST_SPAWN_DELAY_SECONDS = 0.5;

/** Provisional fixed delay between EPIC 3 spawn opportunities. */
export const SPAWN_INTERVAL_SECONDS = 1.75;

/** Provisional cap for enemies that are entering or active. */
export const MAX_LIVE_ENEMIES = 3;

/** Minimum warning time from a candidate center to player-circle contact. */
export const MINIMUM_CONTACT_TIME_SECONDS = 1.25;

/** Maximum candidate samples consumed by one due spawn opportunity. */
export const MAX_SPAWN_ATTEMPTS = 12;

function assertFiniteNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be finite and non-negative.`);
  }
}

function assertFinitePosition(
  position: Readonly<LogicalPosition>,
  name: string,
): void {
  if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
    throw new RangeError(`${name} must contain only finite coordinates.`);
  }
}

/**
 * Estimate travel time until the enemy and player collision circles touch.
 *
 * Overlapping or tangent circles have zero remaining contact time. A
 * stationary, separated enemy has infinite contact time and is therefore fair.
 */
export function calculateEnemyContactTimeSeconds(
  enemyPosition: Readonly<LogicalPosition>,
  playerPosition: Readonly<LogicalPosition>,
  enemyCollisionRadius: number,
  playerCollisionRadius: number,
  enemySpeedUnitsPerSecond: number,
): number {
  assertFinitePosition(enemyPosition, "Enemy position");
  assertFinitePosition(playerPosition, "Player position");
  assertFiniteNonNegative(enemyCollisionRadius, "Enemy collision radius");
  assertFiniteNonNegative(playerCollisionRadius, "Player collision radius");
  assertFiniteNonNegative(enemySpeedUnitsPerSecond, "Enemy movement speed");

  const centerDistance = Math.hypot(
    enemyPosition.x - playerPosition.x,
    enemyPosition.y - playerPosition.y,
  );
  const combinedCollisionRadius = enemyCollisionRadius + playerCollisionRadius;

  if (
    !Number.isFinite(centerDistance) ||
    !Number.isFinite(combinedCollisionRadius)
  ) {
    throw new RangeError("Contact geometry must remain finite.");
  }

  const distanceUntilContact = Math.max(
    0,
    centerDistance - combinedCollisionRadius,
  );

  if (distanceUntilContact === 0) return 0;
  if (enemySpeedUnitsPerSecond === 0) return Number.POSITIVE_INFINITY;

  const contactTimeSeconds = distanceUntilContact / enemySpeedUnitsPerSecond;

  if (!Number.isFinite(contactTimeSeconds)) {
    throw new RangeError("Estimated contact time must remain finite.");
  }

  return contactTimeSeconds;
}

/**
 * Sample at most `maxSpawnAttempts` candidates and accept the first fair one.
 * Exhaustion is a normal no-spawn result; an unfair fallback is never used.
 */
export function tryCreateFairEnemySpawnCandidate(
  visibleBounds: Bounds,
  enemyDefinition: EnemyDefinition,
  entryLeadSeconds: number,
  playerPosition: Readonly<LogicalPosition>,
  playerCollisionRadius: number,
  minimumContactTimeSeconds: number,
  maxSpawnAttempts: number,
  randomSource: RandomSource,
): PerimeterSample | null {
  assertFinitePosition(playerPosition, "Player position");
  assertFiniteNonNegative(playerCollisionRadius, "Player collision radius");
  assertFiniteNonNegative(minimumContactTimeSeconds, "Minimum contact time");

  if (!Number.isInteger(maxSpawnAttempts) || maxSpawnAttempts <= 0) {
    throw new RangeError("Maximum spawn attempts must be a positive integer.");
  }

  for (let attempt = 0; attempt < maxSpawnAttempts; attempt += 1) {
    const candidate = createEnemySpawnCandidate(
      visibleBounds,
      enemyDefinition,
      entryLeadSeconds,
      randomSource,
    );
    const contactTimeSeconds = calculateEnemyContactTimeSeconds(
      candidate.position,
      playerPosition,
      enemyDefinition.collisionRadius,
      playerCollisionRadius,
      enemyDefinition.movementSpeedUnitsPerSecond,
    );

    if (contactTimeSeconds >= minimumContactTimeSeconds) {
      return candidate;
    }
  }

  return null;
}
