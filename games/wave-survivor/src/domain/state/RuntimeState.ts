import { ARENA } from "../arena/index.js";
import {
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../movement/index.js";

export const PLAYER_COLLISION_RADIUS = 12;

/** Initial movement tuning value; subject to playtesting and balance changes. */
export const PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND = 120;

/** Logical arena coordinates, independent from display and Canvas dimensions. */
export interface LogicalPosition {
  x: number;
  y: number;
}

/** Player data required by the EPIC 2 movement slice. */
export interface PlayerMovementState {
  position: LogicalPosition;
  collisionRadius: number;
  movementSpeedUnitsPerSecond: number;
}

/** Minimal deterministic state owned by one Wave Survivor game session. */
export interface RuntimeState {
  /**
   * Domain run progression, currently represented by its initial phase only.
   * GameControllerImpl remains the lifecycle authority until WS-2.4 owns and
   * coordinates this session data.
   */
  phase: "idle";
  simulationTimeSeconds: number;
  movementIntent: MovementIntent;
  player: PlayerMovementState;
}

/** Create a fresh session ready to be owned by the application controller. */
export function createInitialRuntimeState(): RuntimeState {
  return {
    phase: "idle",
    simulationTimeSeconds: 0,
    movementIntent: ZERO_MOVEMENT_INTENT,
    player: {
      position: {
        x: ARENA.width / 2,
        y: ARENA.height / 2,
      },
      collisionRadius: PLAYER_COLLISION_RADIUS,
      movementSpeedUnitsPerSecond: PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
    },
  };
}
