import type { MovementIntent } from "./movement/MovementIntent.js";

/** Current device-independent movement input required by one simulation step. */
export interface MovementInputPort {
  readMovementIntent(): MovementIntent;
  reset(): void;
  destroy(): void;
}
