import type { GameController } from "../GameController.js";

export type GameLifecycleState = "idle" | "running" | "paused" | "destroyed";

/**
 * Application-level lifecycle state machine.
 *
 * It deliberately owns no gameplay or rendering behavior yet. Methods are
 * idempotent, and destroy is terminal so repeated host cleanup is safe.
 */
export class GameControllerImpl implements GameController {
  private state: GameLifecycleState = "idle";

  get lifecycleState(): GameLifecycleState {
    return this.state;
  }

  start(): void {
    if (this.state === "idle") {
      this.state = "running";
    }
  }

  pause(): void {
    if (this.state === "running") {
      this.state = "paused";
    }
  }

  resume(): void {
    if (this.state === "paused") {
      this.state = "running";
    }
  }

  restart(): void {
    if (this.state !== "destroyed") {
      this.state = "running";
    }
  }

  destroy(): void {
    this.state = "destroyed";
  }
}
