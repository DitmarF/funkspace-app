import type { GameTheme } from "../GameTheme.js";

/** Application-facing boundary for the active game renderer. */
export interface GamePresentationPort {
  setTheme(theme: GameTheme): void;
  destroy(): void;
}
