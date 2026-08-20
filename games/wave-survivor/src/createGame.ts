import type { GameController } from "./GameController.js";
import { GameControllerImpl } from "./application/GameControllerImpl.js";

/**
 * Create an isolated Wave Survivor game instance.
 *
 * Rendering and gameplay dependencies will be composed here when they exist.
 */
export function createGame(): GameController {
  return new GameControllerImpl();
}
