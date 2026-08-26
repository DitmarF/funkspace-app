import type { GameController } from "../GameController.js";
import type { GameTheme } from "../GameTheme.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

export type GameLifecycleState = "idle" | "running" | "paused" | "destroyed";

/** Scheduling controls needed by the public lifecycle coordinator. */
export interface RuntimeLoopControl {
  start(): void;
  stop(): void;
  destroy(): void;
}

/** Public lifecycle adapter over the current session and its single loop. */
export class GameControllerImpl implements GameController {
  constructor(
    private session: GameRuntimeSession | null,
    private loop: RuntimeLoopControl | null = null,
  ) {}

  get lifecycleState(): GameLifecycleState {
    if (!this.session) return "destroyed";

    return this.session.phase === "playing" ? "running" : this.session.phase;
  }

  start(): void {
    if (this.session?.start()) {
      this.loop?.start();
    }
  }

  pause(): void {
    if (!this.session || this.session.phase !== "playing") return;

    this.loop?.stop();
    this.session.pause();
  }

  resume(): void {
    if (this.session?.resume()) {
      this.loop?.start();
    }
  }

  restart(): void {
    if (!this.session) return;

    this.loop?.stop();
    this.session.restart();
    this.loop?.start();
  }

  setTheme(theme: GameTheme): void {
    this.session?.setTheme(theme);
  }

  destroy(): void {
    if (!this.session) return;

    this.loop?.destroy();
    this.loop = null;
    this.session.destroy();
    this.session = null;
  }
}
