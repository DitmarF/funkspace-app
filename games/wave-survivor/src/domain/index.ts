/**
 * Deterministic game state, rules, actions, and port contracts belong here.
 */
export type {
  GamePresentationPort,
  GameRenderSnapshot,
  JoystickRenderSnapshot,
} from "./GamePresentationPort.js";
export type { MovementInputPort } from "./MovementInputPort.js";
export type { RandomSource } from "./RandomSource.js";
export type { FrameScheduler, MonotonicClock } from "./RuntimeTimingPort.js";
export { ARENA, createBounds, VISIBLE_ARENA_BOUNDS } from "./arena/index.js";
export type { ArenaRegions, Bounds } from "./arena/index.js";
export {
  BASIC_ENEMY_DEFINITION,
  canEnemyDealContactDamage,
  canEnemyPursue,
  createBasicEnemyState,
  isEnemyTargetable,
} from "./enemies/index.js";
export type {
  EnemyDefinition,
  EnemyKind,
  EnemyPhase,
  EnemyState,
} from "./enemies/index.js";
export type { LogicalPosition } from "./geometry/index.js";
export {
  calculateNextPlayerPosition,
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
} from "./movement/index.js";
export type { MovementIntent } from "./movement/index.js";
export {
  createInitialRuntimeState,
  PLAYER_COLLISION_RADIUS,
  PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
} from "./state/index.js";
export type {
  PlayerMovementState,
  RuntimePhase,
  RuntimeState,
} from "./state/index.js";
