/**
 * Deterministic game state, rules, actions, and port contracts belong here.
 */
export type { GamePresentationPort } from "./GamePresentationPort.js";
export { ARENA, createBounds, VISIBLE_ARENA_BOUNDS } from "./arena/index.js";
export type { ArenaRegions, Bounds } from "./arena/index.js";
export {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
} from "./movement/index.js";
export type { MovementIntent } from "./movement/index.js";
