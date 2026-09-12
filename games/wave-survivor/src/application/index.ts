/**
 * Game-session orchestration and lifecycle use cases belong here.
 */
export { GameControllerImpl } from "./GameControllerImpl.js";
export type {
  GameLifecycleState,
  RuntimeLoopControl,
} from "./GameControllerImpl.js";
export { GameRuntimeSession } from "./GameRuntimeSession.js";
