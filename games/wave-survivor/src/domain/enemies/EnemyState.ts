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
