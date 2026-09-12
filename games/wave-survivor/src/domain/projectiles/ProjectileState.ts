import type { Bounds } from "../arena/index.js";
import { BASIC_ATTACK_DEFINITION } from "../combat/index.js";
import {
  doesCircleIntersectBounds,
  type LogicalPosition,
} from "../geometry/index.js";

/** Mutable runtime data for one deterministic non-homing projectile. */
export interface ProjectileState {
  readonly id: number;
  position: LogicalPosition;
  readonly velocity: Readonly<LogicalPosition>;
  readonly collisionRadius: number;
  readonly damage: number;
  readonly expiresAtSimulationSeconds: number;
}

function assertFinitePosition(
  position: Readonly<LogicalPosition>,
  name: string,
): void {
  if (
    !Number.isFinite(position.x) ||
    !Number.isFinite(position.y) ||
    !Number.isFinite(position.x * position.x + position.y * position.y)
  ) {
    throw new RangeError(`${name} must contain finite logical coordinates.`);
  }
}

function createVelocityTowardTarget(
  origin: Readonly<LogicalPosition>,
  target: Readonly<LogicalPosition>,
): Readonly<LogicalPosition> {
  const directionX = target.x - origin.x;
  const directionY = target.y - origin.y;
  const distance = Math.hypot(directionX, directionY);

  if (!Number.isFinite(distance)) {
    throw new RangeError("Projectile direction must remain finite.");
  }

  if (distance === 0) {
    return Object.freeze({
      x: BASIC_ATTACK_DEFINITION.projectileSpeedUnitsPerSecond,
      y: 0,
    });
  }

  return Object.freeze({
    x:
      (directionX / distance) *
      BASIC_ATTACK_DEFINITION.projectileSpeedUnitsPerSecond,
    y:
      (directionY / distance) *
      BASIC_ATTACK_DEFINITION.projectileSpeedUnitsPerSecond,
  });
}

/** Create one basic projectile with direction fixed at creation time. */
export function createBasicProjectileState(
  id: number,
  origin: Readonly<LogicalPosition>,
  target: Readonly<LogicalPosition>,
  createdAtSimulationSeconds: number,
): ProjectileState {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new RangeError("Projectile ID must be a positive safe integer.");
  }
  assertFinitePosition(origin, "Projectile origin");
  assertFinitePosition(target, "Projectile target");
  if (
    !Number.isFinite(createdAtSimulationSeconds) ||
    createdAtSimulationSeconds < 0
  ) {
    throw new RangeError(
      "Projectile creation time must be finite and non-negative.",
    );
  }

  const expiresAtSimulationSeconds =
    createdAtSimulationSeconds +
    BASIC_ATTACK_DEFINITION.projectileLifetimeSeconds;
  if (!Number.isFinite(expiresAtSimulationSeconds)) {
    throw new RangeError("Projectile expiration time must remain finite.");
  }

  return {
    id,
    position: { ...origin },
    velocity: createVelocityTowardTarget(origin, target),
    collisionRadius: BASIC_ATTACK_DEFINITION.projectileCollisionRadius,
    damage: BASIC_ATTACK_DEFINITION.projectileDamage,
    expiresAtSimulationSeconds,
  };
}

/** Check the numeric invariants required to simulate a projectile safely. */
export function isProjectileStateValid(
  projectile: Readonly<ProjectileState>,
): boolean {
  const squaredVelocity =
    projectile.velocity.x * projectile.velocity.x +
    projectile.velocity.y * projectile.velocity.y;

  return (
    Number.isSafeInteger(projectile.id) &&
    projectile.id > 0 &&
    Number.isFinite(projectile.position.x) &&
    Number.isFinite(projectile.position.y) &&
    Number.isFinite(
      projectile.position.x * projectile.position.x +
        projectile.position.y * projectile.position.y,
    ) &&
    Number.isFinite(projectile.velocity.x) &&
    Number.isFinite(projectile.velocity.y) &&
    Number.isFinite(squaredVelocity) &&
    squaredVelocity > 0 &&
    Number.isFinite(projectile.collisionRadius) &&
    projectile.collisionRadius > 0 &&
    Number.isFinite(projectile.collisionRadius * projectile.collisionRadius) &&
    Number.isFinite(projectile.damage) &&
    projectile.damage > 0 &&
    Number.isFinite(projectile.expiresAtSimulationSeconds) &&
    projectile.expiresAtSimulationSeconds >= 0
  );
}

/** Expiration begins at the exact configured simulation-time boundary. */
export function hasProjectileExpired(
  projectile: Readonly<ProjectileState>,
  simulationTimeSeconds: number,
): boolean {
  return (
    !Number.isFinite(simulationTimeSeconds) ||
    simulationTimeSeconds < 0 ||
    simulationTimeSeconds >= projectile.expiresAtSimulationSeconds
  );
}

/** Retain a valid projectile while its circle touches the despawn bounds. */
export function shouldRetainProjectileWithinBounds(
  projectile: Readonly<ProjectileState>,
  despawnBounds: Bounds,
): boolean {
  if (!isProjectileStateValid(projectile)) return false;

  return doesCircleIntersectBounds(
    projectile.position,
    projectile.collisionRadius,
    despawnBounds,
  );
}
