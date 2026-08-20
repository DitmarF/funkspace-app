import type { GameController } from "./GameController.js";
import type { GameMountOptions } from "./GameMountOptions.js";
import { GameControllerImpl } from "./application/GameControllerImpl.js";
import { CanvasGameRenderer } from "./renderer/CanvasGameRenderer.js";

/**
 * Create an isolated Wave Survivor game instance.
 *
 * Rendering and gameplay dependencies will be composed here when they exist.
 * Mount options are optional while the package still supports lifecycle-only
 * use, but portfolio hosts provide them when embedding the game.
 */
export function createGame(options?: GameMountOptions): GameController {
  const renderer = options ? new CanvasGameRenderer(options) : null;
  return new GameControllerImpl(renderer);
}
