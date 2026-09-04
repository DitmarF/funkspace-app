import type { RuntimePhase } from "@funkspace/wave-survivor";
import type { GameTheme } from "./theme";

export type GameId = "wave-survivor";

export interface HostedGameController {
  start(): void;
  pause(): void;
  resume(): void;
  restart(): void;
  setTheme(theme: GameTheme): void;
  destroy(): void;
}

export interface GameStatusSnapshot {
  readonly phase: RuntimePhase;
  readonly currentHealth: number;
  readonly maximumHealth: number;
  readonly killCount: number;
}

export interface GameMountOptions {
  readonly canvas: HTMLCanvasElement;
  readonly viewport: HTMLElement;
  readonly theme: GameTheme;
  readonly onStatusChange?: (snapshot: GameStatusSnapshot) => void;
}

export interface GameModule {
  createGame(options: GameMountOptions): HostedGameController;
}

export type GameModuleImporter = () => Promise<GameModule>;
export type GameImporterMap = Readonly<Record<GameId, GameModuleImporter>>;

const gameImporters: GameImporterMap = {
  "wave-survivor": () => import("@funkspace/wave-survivor"),
};

/**
 * Resolves standalone game packages only when a host requests them.
 *
 * Keep every importer explicit so bundlers can create an isolated chunk and
 * the portfolio never reaches into a game's private source tree.
 */
export class GameLoader {
  constructor(private readonly importers: GameImporterMap = gameImporters) {}

  load(gameId: GameId): Promise<GameModule> {
    return this.importers[gameId]();
  }
}

export type GameModuleLoader = Pick<GameLoader, "load">;

export const gameLoader = new GameLoader();
