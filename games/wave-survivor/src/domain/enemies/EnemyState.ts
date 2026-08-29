import type { Bounds } from "../arena/index.js";
import {
  doesCircleIntersectBounds,
  type LogicalPosition,
} from "../geometry/index.js";
import { BASIC_ENEMY_DEFINITION, type EnemyKind } from "./EnemyDefinition.js";

/** Complete lifecycle phases for an enemy runtime instance. */
export type EnemyPhase = "entering" | "active" | "dying";

/** Mutable runtime data for one deterministic enemy instance. */
export interface EnemyState {
  readonly id: number;
  readonly kind: EnemyKind;
  phase: EnemyPhase;
  position: LogicalPosition;
  readonly collisionRadius: number;
  readonly movementSpeedUnitsPerSecond: number;
  currentHealth: number;
  readonly contactDamage: number;
}

/** Create one basic enemy entering at the supplied logical position. */
export function createBasicEnemyState(
  id: number,
  position: Readonly<LogicalPosition>,
): EnemyState {
  return {
    id,
    kind: BASIC_ENEMY_DEFINITION.kind,
    phase: "entering",
    position: { ...position },
    collisionRadius: BASIC_ENEMY_DEFINITION.collisionRadius,
    movementSpeedUnitsPerSecond:
      BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
    currentHealth: BASIC_ENEMY_DEFINITION.maximumHealth,
    contactDamage: BASIC_ENEMY_DEFINITION.contactDamage,
  };
}

/** Entering and active enemies continue pursuing; dying enemies do not. */
export function canEnemyPursue(enemy: Readonly<EnemyState>): boolean {
  return enemy.phase === "entering" || enemy.phase === "active";
}

/** Only active enemies are eligible for targeting. */
export function isEnemyTargetable(enemy: Readonly<EnemyState>): boolean {
  return enemy.phase === "active";
}

/** Only active enemies are eligible to deal contact damage. */
export function canEnemyDealContactDamage(
  enemy: Readonly<EnemyState>,
): boolean {
  return enemy.phase === "active";
}

/**
 * Check the numeric invariants required to simulate and render an enemy.
 * Current health may be zero or negative so future dying-state behavior is not
 * treated as invalid cleanup.
 */
export function isEnemyStateValid(enemy: Readonly<EnemyState>): boolean {
  return (
    Number.isSafeInteger(enemy.id) &&
    enemy.id > 0 &&
    Number.isFinite(enemy.position.x) &&
    Number.isFinite(enemy.position.y) &&
    Number.isFinite(
      enemy.position.x * enemy.position.x + enemy.position.y * enemy.position.y,
    ) &&
    Number.isFinite(enemy.collisionRadius) &&
    enemy.collisionRadius >= 0 &&
    Number.isFinite(enemy.collisionRadius * enemy.collisionRadius) &&
    Number.isFinite(enemy.movementSpeedUnitsPerSecond) &&
    enemy.movementSpeedUnitsPerSecond >= 0 &&
    Number.isFinite(enemy.currentHealth) &&
    Number.isFinite(enemy.contactDamage) &&
    enemy.contactDamage >= 0
  );
}

/**
 * Retain valid enemies while their collision circles touch or overlap the
 * despawn bounds. Exact boundary tangency is retained.
 */
export function shouldRetainEnemyWithinBounds(
  enemy: Readonly<EnemyState>,
  despawnBounds: Bounds,
): boolean {
  if (!isEnemyStateValid(enemy)) return false;

  return doesCircleIntersectBounds(
    enemy.position,
    enemy.collisionRadius,
    despawnBounds,
  );
}

/** Activate an entering enemy once its collision circle reaches the bounds. */
export function getEnemyPhaseAfterBoundsIntersection(
  enemy: Readonly<EnemyState>,
  bounds: Bounds,
): EnemyPhase {
  if (enemy.phase !== "entering") return enemy.phase;

  return doesCircleIntersectBounds(
    enemy.position,
    enemy.collisionRadius,
    bounds,
  )
    ? "active"
    : "entering";
}
