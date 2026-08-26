import type { GameTheme } from "../GameTheme.js";
import type { RuntimePhase } from "./state/RuntimeState.js";

/** Immutable, renderer-facing view of the current session. */
export interface GameRenderSnapshot {
  readonly phase: RuntimePhase;
  readonly simulationTimeSeconds: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly playerCollisionRadius: number;
}

/** Application-facing boundary for the active game renderer. */
export interface GamePresentationPort {
  render(snapshot: GameRenderSnapshot): void;
  setTheme(theme: GameTheme): void;
  destroy(): void;
}
