import type { MovementInputPort } from "../../domain/MovementInputPort.js";
import {
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../../domain/movement/MovementIntent.js";

/** No-op input used until concrete keyboard and joystick adapters are composed. */
export class ZeroMovementInput implements MovementInputPort {
  readMovementIntent(): MovementIntent {
    return ZERO_MOVEMENT_INTENT;
  }

  reset(): void {}

  destroy(): void {}
}
