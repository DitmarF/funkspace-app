import type { GameTheme } from "./GameTheme.js";

/** Browser resources and settings supplied when the game is embedded. */
export interface GameMountOptions {
  readonly canvas: HTMLCanvasElement;
  readonly theme: GameTheme;
}
