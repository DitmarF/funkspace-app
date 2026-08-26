/**
 * Deterministic game state, rules, actions, and port contracts belong here.
 */
export type { GamePresentationPort } from "./GamePresentationPort.js";
export { ARENA, createBounds, VISIBLE_ARENA_BOUNDS } from "./arena/index.js";
export type { ArenaRegions, Bounds } from "./arena/index.js";
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
  LogicalPosition,
  PlayerMovementState,
  RuntimeState,
} from "./state/index.js";
