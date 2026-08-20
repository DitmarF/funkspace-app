import { describe, expect, it, vi } from "vitest";
import {
  GameLoader,
  type GameImporterMap,
  type GameModule,
} from "./GameLoader";

describe("GameLoader", () => {
  it("does not import a game until it is requested", async () => {
    const gameModule: GameModule = {
      createGame: vi.fn(() => {
        throw new Error("The lazy-loading test does not create a game.");
      }),
    };
    const importer = vi.fn(async () => gameModule);
    const importers: GameImporterMap = {
      "wave-survivor": importer,
    };
    const loader = new GameLoader(importers);

    expect(importer).not.toHaveBeenCalled();

    await expect(loader.load("wave-survivor")).resolves.toBe(gameModule);
    expect(importer).toHaveBeenCalledOnce();
  });

  it("loads Wave Survivor through its public package entry point", async () => {
    const gameModule = await new GameLoader().load("wave-survivor");

    expect(gameModule.createGame).toBeTypeOf("function");
  });
});
