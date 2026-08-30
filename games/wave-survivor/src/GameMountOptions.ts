import type { GameTheme } from "./GameTheme.js";
import type { GameStatusSnapshot } from "./GameStatusSnapshot.js";

/** Browser resources and settings supplied when the game is embedded. */
export interface GameMountOptions {
  readonly canvas: HTMLCanvasElement;
  readonly viewport: HTMLElement;
  readonly theme: GameTheme;
  readonly onStatusChange?: (snapshot: GameStatusSnapshot) => void;
}
