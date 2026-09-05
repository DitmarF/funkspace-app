import type { Bounds } from "../arena/index.js";
import {
  doesCircleIntersectBounds,
  type LogicalPosition,
} from "../geometry/index.js";
import { BASIC_ENEMY_DEFINITION } from "./EnemyDefinition.js";

/** Complete lifecycle phases for an enemy runtime instance. */
export type EnemyPhase = "entering" | "active" | "dying";

/** Mutable runtime data for one deterministic enemy instance. */
interface EnemyBodyState {
  readonly id: number;
  phase: EnemyPhase;
  position: LogicalPosition;
  readonly collisionRadius: number;
  readonly movementSpeedUnitsPerSecond: number;
  currentHealth: number;
  readonly contactDamage: number;
  removeAtSimulationSeconds: number | null;
}

/** Action state is separate from entering/active/dying and has no second body. */
export type BossActionState =
  | { readonly phase: "approach" | "recovery"; readonly endsAtSeconds: number }
  | {
      readonly phase: "wind-up" | "charge";
      readonly endsAtSeconds: number;
      readonly direction: Readonly<LogicalPosition>;
    };

export interface BasicEnemyState extends EnemyBodyState {
  readonly kind: "basic";
}

export interface ChargerBossState extends EnemyBodyState {
  readonly kind: "charger";
  /** Initialized on the first active update, never while entering. */
  action: BossActionState | null;
  entryStartedAtSeconds: number | null;
}

export type EnemyState = BasicEnemyState | ChargerBossState;

function isBossActionValid(action: BossActionState | null): boolean {
  if (action === null) return true;
  if (!Number.isFinite(action.endsAtSeconds) || action.endsAtSeconds < 0)
    return false;
  if (action.phase === "approach" || action.phase === "recovery") return true;
  return (
    (action.phase === "wind-up" || action.phase === "charge") &&
    Number.isFinite(action.direction.x) &&
    Number.isFinite(action.direction.y) &&
    Math.abs(Math.hypot(action.direction.x, action.direction.y) - 1) <= 1e-12
  );
}

/** Create one basic enemy entering at the supplied logical position. */
export function createBasicEnemyState(
  id: number,
  position: Readonly<LogicalPosition>,
): BasicEnemyState {
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
    removeAtSimulationSeconds: null,
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
    (enemy.kind === "basic" ||
      (enemy.kind === "charger" &&
        isBossActionValid(enemy.action) &&
        (enemy.entryStartedAtSeconds === null ||
          (Number.isFinite(enemy.entryStartedAtSeconds) &&
            enemy.entryStartedAtSeconds >= 0)))) &&
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
    enemy.contactDamage >= 0 &&
    (enemy.phase === "dying"
      ? enemy.removeAtSimulationSeconds !== null &&
        Number.isFinite(enemy.removeAtSimulationSeconds) &&
        enemy.removeAtSimulationSeconds >= 0
      : enemy.removeAtSimulationSeconds === null)
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
