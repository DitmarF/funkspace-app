import { describe, expect, it, vi } from "vitest";
import { createGame } from "../createGame.js";
import type { GameTheme } from "../GameTheme.js";
import type {
  GamePresentationPort,
  GameRenderSnapshot,
  JoystickRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import type {
  FrameScheduler,
  MonotonicClock,
} from "../domain/RuntimeTimingPort.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../domain/movement/MovementIntent.js";
import { createInitialRuntimeState } from "../domain/state/RuntimeState.js";
import {
  FIXED_SIMULATION_STEP_SECONDS,
  FixedStepLoop,
} from "../infrastructure/loop/FixedStepLoop.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameControllerImpl } from "./GameControllerImpl.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

const initialTheme: GameTheme = {
  colors: {
    background: "background",
    player: "player",
    enemy: "enemy",
    projectile: "projectile",
    effect: "effect",
  },
};

class FakeMonotonicClock implements MonotonicClock {
  constructor(private currentTimeMilliseconds = 0) {}

  nowMilliseconds(): number {
    return this.currentTimeMilliseconds;
  }

  advanceByMilliseconds(deltaMilliseconds: number): void {
    this.currentTimeMilliseconds += deltaMilliseconds;
  }
}

class FakeFrameScheduler implements FrameScheduler {
  readonly cancelledFrameIds: number[] = [];
  readonly requestedFrameIds: number[] = [];
  private readonly callbacks = new Map<number, () => void>();
  private readonly requestedCallbacks = new Map<number, () => void>();
  private nextFrameId = 1;

  get pendingFrameCount(): number {
    return this.callbacks.size;
  }

  requestFrame(callback: () => void): number {
    const frameId = this.nextFrameId;
    this.nextFrameId += 1;
    this.requestedFrameIds.push(frameId);
    this.callbacks.set(frameId, callback);
    this.requestedCallbacks.set(frameId, callback);
    return frameId;
  }

  cancelFrame(frameId: number): void {
    this.cancelledFrameIds.push(frameId);
    this.callbacks.delete(frameId);
  }

  getRequestedCallback(frameId: number): (() => void) | undefined {
    return this.requestedCallbacks.get(frameId);
  }

  runNextFrame(): void {
    const nextFrame = this.callbacks.entries().next().value;
    if (!nextFrame) throw new Error("No frame is pending.");

    const [frameId, callback] = nextFrame;
    this.callbacks.delete(frameId);
    callback();
  }
}

function createHarness(
  readJoystickSnapshot: (() => JoystickRenderSnapshot | null) | null = null,
) {
  const clock = new FakeMonotonicClock();
  const frameScheduler = new FakeFrameScheduler();
  const snapshots: GameRenderSnapshot[] = [];
  let movementIntent: MovementIntent = createMovementIntent(1, 0);
  const readMovementIntent = vi.fn(() => movementIntent);
  const input: MovementInputPort = {
    readMovementIntent,
    reset: vi.fn(() => {
      movementIntent = ZERO_MOVEMENT_INTENT;
    }),
    destroy: vi.fn(() => {
      movementIntent = ZERO_MOVEMENT_INTENT;
    }),
  };
  const presentation: GamePresentationPort = {
    render: vi.fn((snapshot) => snapshots.push(snapshot)),
    setTheme: vi.fn(),
    destroy: vi.fn(),
  };
  const session = new GameRuntimeSession(
    createInitialRuntimeState(),
    input,
    presentation,
    new SeededRandomSource(1),
    readJoystickSnapshot,
  );
  const loop = new FixedStepLoop(clock, frameScheduler, {
    fixedUpdate: (deltaSeconds) => session.fixedUpdate(deltaSeconds),
    render: () => session.render(),
  });
  const controller = new GameControllerImpl(session, loop);

  return {
    clock,
    controller,
    frameScheduler,
    input,
    presentation,
    readMovementIntent,
    session,
    setMovementIntent(nextIntent: MovementIntent) {
      movementIntent = nextIntent;
    },
    snapshots,
  };
}

const FIXED_SIMULATION_STEP_MILLISECONDS = FIXED_SIMULATION_STEP_SECONDS * 1000;

describe("createGame", () => {
  it("retains safe lifecycle-only behavior without browser mount options", () => {
    const controller = createGame();

    expect(() => {
      controller.start();
      controller.pause();
      controller.resume();
      controller.restart();
      controller.setTheme(initialTheme);
      controller.destroy();
      controller.destroy();
    }).not.toThrow();
  });
});

describe("GameController runtime lifecycle", () => {
  it("starts exactly one loop and makes repeated start idempotent", () => {
    const { controller, frameScheduler } = createHarness();

    expect(controller.lifecycleState).toBe("idle");
    controller.start();
    controller.start();

    expect(controller.lifecycleState).toBe("running");
    expect(frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(frameScheduler.pendingFrameCount).toBe(1);
  });

  it("pauses updates, resets input once, and makes repeated pause safe", () => {
    const { controller, frameScheduler, input, readMovementIntent } =
      createHarness();
    controller.start();
    const pendingFrameId = frameScheduler.requestedFrameIds[0];
    if (pendingFrameId === undefined)
      throw new Error("No frame was requested.");
    const staleCallback = frameScheduler.getRequestedCallback(pendingFrameId);
    if (!staleCallback) throw new Error("No frame callback was stored.");

    controller.pause();
    controller.pause();
    staleCallback();

    expect(controller.lifecycleState).toBe("paused");
    expect(frameScheduler.pendingFrameCount).toBe(0);
    expect(input.reset).toHaveBeenCalledOnce();
    expect(readMovementIntent).not.toHaveBeenCalled();
  });

  it("resumes exactly once with a fresh timing baseline", () => {
    const { clock, controller, frameScheduler, readMovementIntent } =
      createHarness();
    controller.start();
    controller.pause();
    clock.advanceByMilliseconds(10_000);

    controller.resume();
    controller.resume();

    expect(frameScheduler.pendingFrameCount).toBe(1);
    expect(frameScheduler.requestedFrameIds).toHaveLength(2);
    frameScheduler.runNextFrame();
    expect(readMovementIntent).not.toHaveBeenCalled();

    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();
    expect(readMovementIntent).toHaveBeenCalledOnce();
  });

  it("requires new input after pause and resume", () => {
    const { clock, controller, frameScheduler, setMovementIntent, snapshots } =
      createHarness();
    controller.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();
    expect(snapshots.at(-1)?.playerX).toBeCloseTo(182);

    controller.pause();
    clock.advanceByMilliseconds(10_000);
    controller.resume();
    frameScheduler.runNextFrame();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();
    expect(snapshots.at(-1)?.playerX).toBeCloseTo(182);

    setMovementIntent(createMovementIntent(1, 0));
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();
    expect(snapshots.at(-1)?.playerX).toBeCloseTo(184);
    expect(frameScheduler.pendingFrameCount).toBe(1);
  });

  it.each(["idle", "running", "paused"] as const)(
    "restarts from %s with one clean running session",
    (startingState) => {
      const { controller, frameScheduler, snapshots } = createHarness();
      if (startingState !== "idle") controller.start();
      if (startingState === "paused") controller.pause();

      controller.restart();

      expect(controller.lifecycleState).toBe("running");
      expect(frameScheduler.pendingFrameCount).toBe(1);
      frameScheduler.runNextFrame();
      expect(snapshots.at(-1)).toEqual({
        phase: "playing",
        simulationTimeSeconds: 0,
        playerX: 180,
        playerY: 320,
        playerCollisionRadius: 12,
        joystick: null,
      });
    },
  );

  it("replaces progressed state on restart without adding loops", () => {
    const { clock, controller, frameScheduler, snapshots } = createHarness();
    controller.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();
    expect(snapshots.at(-1)?.playerX).toBeCloseTo(182);
    expect(snapshots.at(-1)?.simulationTimeSeconds).toBeCloseTo(
      FIXED_SIMULATION_STEP_SECONDS,
    );

    controller.restart();
    controller.restart();

    expect(frameScheduler.pendingFrameCount).toBe(1);
    frameScheduler.runNextFrame();
    expect(snapshots.at(-1)?.playerX).toBe(180);
    expect(snapshots.at(-1)?.simulationTimeSeconds).toBe(0);
  });

  it("requires new input after restarting an active session", () => {
    const { clock, controller, frameScheduler, snapshots } = createHarness();
    controller.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();
    expect(snapshots.at(-1)?.playerX).toBeCloseTo(182);

    controller.restart();
    frameScheduler.runNextFrame();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();

    expect(snapshots.at(-1)).toMatchObject({
      playerX: 180,
      simulationTimeSeconds: FIXED_SIMULATION_STEP_SECONDS,
    });
    expect(frameScheduler.pendingFrameCount).toBe(1);
  });

  it("samples input once per fixed update and moves the player", () => {
    const { clock, controller, frameScheduler, readMovementIntent, snapshots } =
      createHarness();
    controller.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);

    frameScheduler.runNextFrame();

    expect(readMovementIntent).toHaveBeenCalledOnce();
    expect(snapshots.at(-1)).toMatchObject({
      phase: "playing",
      playerX: 182,
      playerY: 320,
      simulationTimeSeconds: FIXED_SIMULATION_STEP_SECONDS,
    });
  });

  it("includes the current joystick presentation in each render snapshot", () => {
    const joystick: JoystickRenderSnapshot = {
      active: true,
      centerX: 72,
      centerY: 568,
      baseRadius: 52,
      knobX: 97,
      knobY: 544,
      knobRadius: 22,
    };
    const readJoystickSnapshot = vi.fn(() => joystick);
    const { session, snapshots } = createHarness(readJoystickSnapshot);

    session.render();

    expect(readJoystickSnapshot).toHaveBeenCalledOnce();
    expect(snapshots.at(-1)?.joystick).toEqual(joystick);
  });

  it("forwards themes only before terminal destruction", () => {
    const { controller, presentation } = createHarness();

    controller.setTheme(initialTheme);
    controller.destroy();
    controller.setTheme(initialTheme);

    expect(presentation.setTheme).toHaveBeenCalledOnce();
    expect(presentation.setTheme).toHaveBeenCalledWith(initialTheme);
  });

  it("destroys scheduling and resources and rejects later lifecycle effects", () => {
    const {
      controller,
      frameScheduler,
      input,
      presentation,
      readMovementIntent,
    } = createHarness();
    controller.start();
    const pendingFrameId = frameScheduler.requestedFrameIds[0];
    if (pendingFrameId === undefined)
      throw new Error("No frame was requested.");
    const staleCallback = frameScheduler.getRequestedCallback(pendingFrameId);
    if (!staleCallback) throw new Error("No frame callback was stored.");

    controller.destroy();
    controller.destroy();
    staleCallback();
    controller.start();
    controller.pause();
    controller.resume();
    controller.restart();
    controller.setTheme(initialTheme);

    expect(controller.lifecycleState).toBe("destroyed");
    expect(frameScheduler.pendingFrameCount).toBe(0);
    expect(frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(input.reset).toHaveBeenCalledOnce();
    expect(input.destroy).toHaveBeenCalledOnce();
    expect(presentation.destroy).toHaveBeenCalledOnce();
    expect(presentation.setTheme).not.toHaveBeenCalled();
    expect(readMovementIntent).not.toHaveBeenCalled();
  });

  it("destroys safely from a paused session without restoring scheduling", () => {
    const { controller, frameScheduler, input, presentation } = createHarness();
    controller.start();
    controller.pause();

    controller.destroy();
    controller.destroy();
    controller.resume();

    expect(controller.lifecycleState).toBe("destroyed");
    expect(frameScheduler.pendingFrameCount).toBe(0);
    expect(frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(input.destroy).toHaveBeenCalledOnce();
    expect(presentation.destroy).toHaveBeenCalledOnce();
  });
});
