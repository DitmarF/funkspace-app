import type { MovementInputPort } from "../../domain/MovementInputPort.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../../domain/movement/MovementIntent.js";

/** Combines owned movement sources into one normalized runtime input. */
export class CompositeMovementInput implements MovementInputPort {
  private destroyed = false;
  private sources: readonly MovementInputPort[];

  constructor(...sources: readonly MovementInputPort[]) {
    this.sources = sources;
  }

  readMovementIntent(): MovementIntent {
    if (this.destroyed) return ZERO_MOVEMENT_INTENT;

    let combinedX = 0;
    let combinedY = 0;
    for (const source of this.sources) {
      const intent = source.readMovementIntent();
      combinedX += intent.x;
      combinedY += intent.y;
    }

    return createMovementIntent(combinedX, combinedY);
  }

  reset(): void {
    if (this.destroyed) return;

    for (const source of this.sources) {
      source.reset();
    }
  }

  destroy(): void {
    if (this.destroyed) return;

    this.destroyed = true;
    const sources = this.sources;
    this.sources = [];
    for (const source of sources) {
      source.destroy();
    }
  }
}
