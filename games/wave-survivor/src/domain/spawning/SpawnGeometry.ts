import type { RandomSource } from "../RandomSource.js";
import { createBounds, type Bounds } from "../arena/index.js";
import type { EnemyDefinition } from "../enemies/index.js";
import {
  samplePerimeterPoint,
  type PerimeterSample,
} from "./PerimeterSampling.js";

/** Provisional offscreen travel time before an enemy reaches the arena. */
export const ENTRY_LEAD_SECONDS = 0.75;

function assertFiniteNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be finite and non-negative.`);
  }
}

/**
 * Calculate logical spawn distance from collision size and entry travel.
 *
 * At zero speed the offset equals the radius, so a perimeter-sampled circle is
 * tangent to the visible boundary and does not overlap its interior.
 */
export function calculateEnemySpawnOffset(
  enemyCollisionRadius: number,
  enemySpeedUnitsPerSecond: number,
  entryLeadSeconds: number,
): number {
  assertFiniteNonNegative(enemyCollisionRadius, "Enemy collision radius");
  assertFiniteNonNegative(enemySpeedUnitsPerSecond, "Enemy movement speed");
  assertFiniteNonNegative(entryLeadSeconds, "Entry lead duration");

  const offset =
    enemyCollisionRadius + enemySpeedUnitsPerSecond * entryLeadSeconds;

  if (!Number.isFinite(offset)) {
    throw new RangeError("Enemy spawn offset must remain finite.");
  }

  return offset;
}

/** Expand logical bounds equally on every side by a non-negative offset. */
export function expandBoundsByOffset(
  bounds: Bounds,
  offset: number,
): Readonly<Bounds> {
  if (
    !Number.isFinite(bounds.x) ||
    !Number.isFinite(bounds.y) ||
    !Number.isFinite(bounds.width) ||
    !Number.isFinite(bounds.height)
  ) {
    throw new RangeError("Bounds must contain only finite values.");
  }

  if (bounds.width <= 0 || bounds.height <= 0) {
    throw new RangeError("Bounds must have positive dimensions.");
  }

  assertFiniteNonNegative(offset, "Bounds expansion offset");

  const expandedX = bounds.x - offset;
  const expandedY = bounds.y - offset;
  const expandedWidth = bounds.width + 2 * offset;
  const expandedHeight = bounds.height + 2 * offset;

  if (
    !Number.isFinite(expandedX) ||
    !Number.isFinite(expandedY) ||
    !Number.isFinite(expandedWidth) ||
    !Number.isFinite(expandedHeight)
  ) {
    throw new RangeError("Expanded bounds must remain finite.");
  }

  return createBounds(expandedX, expandedY, expandedWidth, expandedHeight);
}

/** Create one pure offscreen candidate without mutating runtime state. */
export function createEnemySpawnCandidate(
  visibleBounds: Bounds,
  enemyDefinition: EnemyDefinition,
  entryLeadSeconds: number,
  randomSource: RandomSource,
): PerimeterSample {
  const offset = calculateEnemySpawnOffset(
    enemyDefinition.collisionRadius,
    enemyDefinition.movementSpeedUnitsPerSecond,
    entryLeadSeconds,
  );
  const spawnBounds = expandBoundsByOffset(visibleBounds, offset);

  return samplePerimeterPoint(spawnBounds, randomSource);
}
