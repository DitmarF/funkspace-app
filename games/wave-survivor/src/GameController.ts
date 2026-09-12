import type { GameTheme } from "./GameTheme.js";

/**
 * Public lifecycle contract for an embedded Wave Survivor instance.
 */
export interface GameController {
  /** Start a game that has not started yet. */
  start(): void;

  /** Pause a running game while preserving its session. */
  pause(): void;

  /** Resume a paused game. */
  resume(): void;

  /** Reset the session and start it from the beginning. */
  restart(): void;

  /** Apply one currently offered upgrade and resume the existing game loop. */
  chooseUpgrade(id: string): boolean;

  /** Apply resolved host theme values without reading portfolio state. */
  setTheme(theme: GameTheme): void;

  /** Permanently stop the instance and release its resources. */
  destroy(): void;
}
