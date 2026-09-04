/**
 * Public entry point for Wave Survivor.
 *
 * Internal layer modules are not package API by default.
 */
export { createGame } from "./createGame.js";
export type { GameController } from "./GameController.js";
export type { GameEvent, UpgradeOption } from "./GameEvent.js";
export type { GameMountOptions } from "./GameMountOptions.js";
export type { GameStatusSnapshot } from "./GameStatusSnapshot.js";
export type { GameTheme } from "./GameTheme.js";
export type { RuntimePhase } from "./domain/state/RuntimeState.js";
