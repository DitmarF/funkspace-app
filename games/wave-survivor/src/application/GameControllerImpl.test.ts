import { describe, expect, it } from "vitest";
import { createGame } from "../createGame.js";
import { GameControllerImpl } from "./GameControllerImpl.js";

describe("createGame", () => {
  it("returns the public lifecycle contract", () => {
    const controller = createGame();

    expect(controller.start).toBeTypeOf("function");
    expect(controller.pause).toBeTypeOf("function");
    expect(controller.resume).toBeTypeOf("function");
    expect(controller.restart).toBeTypeOf("function");
    expect(controller.destroy).toBeTypeOf("function");
  });
});

describe("GameController lifecycle", () => {
  it("starts, pauses, and resumes idempotently", () => {
    const controller = new GameControllerImpl();

    expect(controller.lifecycleState).toBe("idle");

    controller.start();
    controller.start();
    expect(controller.lifecycleState).toBe("running");

    controller.pause();
    controller.pause();
    expect(controller.lifecycleState).toBe("paused");

    controller.resume();
    controller.resume();
    expect(controller.lifecycleState).toBe("running");
  });

  it("restarts an idle or paused session into the running state", () => {
    const controller = new GameControllerImpl();

    controller.restart();
    expect(controller.lifecycleState).toBe("running");

    controller.pause();
    controller.restart();
    expect(controller.lifecycleState).toBe("running");
  });

  it("makes destroy terminal and safe to repeat", () => {
    const controller = new GameControllerImpl();
    controller.start();
    controller.destroy();
    controller.destroy();

    controller.start();
    controller.pause();
    controller.resume();
    controller.restart();

    expect(controller.lifecycleState).toBe("destroyed");
  });
});
