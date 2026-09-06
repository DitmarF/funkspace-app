import { describe, expect, it, vi } from "vitest";
import { createGame } from "../createGame.js";
import type { GameTheme } from "../GameTheme.js";
import type { GameEvent } from "../GameEvent.js";
import type {
  GamePresentationPort,
  GameRenderSnapshot,
  JoystickRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import { createBasicEnemyState } from "../domain/enemies/index.js";
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
import { createRunUpgradeState } from "../domain/upgrades/index.js";
import {
  FIXED_SIMULATION_STEP_SECONDS,
  FixedStepLoop,
} from "../infrastructure/loop/FixedStepLoop.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameControllerImpl } from "./GameControllerImpl.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";
import type { GameStatusSnapshot } from "../GameStatusSnapshot.js";
import { createChargerBossState } from "../domain/enemies/ChargerBoss.js";

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
  onStatusChange: ((status: GameStatusSnapshot) => void) | null = null,
  onEvent: ((event: GameEvent) => void) | null = null,
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
  const state = createInitialRuntimeState();
  const session = new GameRuntimeSession(
    state,
    input,
    presentation,
    new SeededRandomSource(1),
    new SeededRandomSource(2),
    readJoystickSnapshot,
    onStatusChange,
    onEvent,
  );
  const loop = new FixedStepLoop(clock, frameScheduler, {
    fixedUpdate: (deltaSeconds) => session.fixedUpdate(deltaSeconds),
    render: () => session.render(),
    shouldSuspend: () => session.phase !== "playing",
  });
  const controller = new GameControllerImpl(session, loop);

  return {
    clock,
    controller,
    frameScheduler,
    input,
    loop,
    presentation,
    readMovementIntent,
    session,
    state,
    setMovementIntent(nextIntent: MovementIntent) {
      movementIntent = nextIntent;
    },
    snapshots,
  };
}

const FIXED_SIMULATION_STEP_MILLISECONDS = FIXED_SIMULATION_STEP_SECONDS * 1000;

function reachUpgradeChoice(harness: ReturnType<typeof createHarness>): void {
  harness.state.waveSchedule!.nextScheduledSpawnIndex =
    harness.state.waveSchedule!.requests.length;
  harness.controller.start();
  harness.clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
  harness.frameScheduler.runNextFrame();
}

describe("createGame", () => {
  it("retains safe lifecycle-only behavior without browser mount options", () => {
    const controller = createGame();

    expect(controller.chooseUpgrade("rapid-fire")).toBe(false);
    expect(() => {
      controller.start();
      expect(controller.chooseUpgrade("rapid-fire")).toBe(false);
      controller.pause();
      controller.resume();
      controller.restart();
      expect(controller.chooseUpgrade("unknown")).toBe(false);
      controller.setTheme(initialTheme);
      controller.destroy();
      expect(controller.chooseUpgrade("rapid-fire")).toBe(false);
      controller.destroy();
    }).not.toThrow();
  });
});

describe("GameController runtime lifecycle", () => {
  describe.each(["start", "resume", "chooseUpgrade"] as const)(
    "%s status callback boundary",
    (transition) => {
      it.each(["restart", "pause", "destroy"] as const)(
        "honors callback %s without obsolete events or frames",
        (action) => {
          let armed = false;
          const events: GameEvent[] = [];
          const harness = createHarness(
            null,
            (status) => {
              if (!armed || status.phase !== "playing") return;
              armed = false;
              harness.controller[action]();
            },
            (event) => events.push(event),
          );
          if (transition === "resume") {
            harness.controller.start();
            harness.controller.pause();
          } else if (transition === "chooseUpgrade") {
            // Constructed wave-completion boundary, not full-run evidence.
            reachUpgradeChoice(harness);
          }
          events.length = 0;
          armed = true;
          if (transition === "chooseUpgrade") {
            const choice = harness.session.pendingUpgradeOptionIds[0]!;
            // Acceptance stays true even when its notification abandons the run.
            expect(harness.controller.chooseUpgrade(choice)).toBe(true);
          } else {
            harness.controller[transition]();
          }

          expect(events).toEqual(
            action === "destroy" ||
              (action === "pause" && transition === "resume")
              ? []
              : [
                  {
                    type: "wave-started",
                    waveNumber:
                      action === "pause" && transition === "chooseUpgrade"
                        ? 2
                        : 1,
                  },
                ],
          );
          expect(harness.controller.lifecycleState).toBe(
            action === "restart"
              ? "running"
              : action === "pause"
                ? "paused"
                : "destroyed",
          );
          expect(harness.frameScheduler.pendingFrameCount).toBe(
            action === "restart" ? 1 : 0,
          );
          if (action === "restart") {
            harness.frameScheduler.runNextFrame();
            expect(harness.snapshots.at(-1)?.simulationTimeSeconds).toBe(0);
            expect(events).toHaveLength(1);
          }
          harness.controller.destroy();
          expect(harness.frameScheduler.pendingFrameCount).toBe(0);
          expect(harness.input.destroy).toHaveBeenCalledTimes(1);
          expect(harness.presentation.destroy).toHaveBeenCalledTimes(1);
        },
      );
    },
  );

  it.each(["restart", "pause", "destroy"] as const)(
    "honors %s from choosing status without an abandoned upgrade request",
    (action) => {
      let armed = true;
      const events: GameEvent[] = [];
      const harness = createHarness(
        null,
        (status) => {
          if (!armed || status.phase !== "choosing-upgrade") return;
          armed = false;
          harness.controller[action]();
        },
        (event) => events.push(event),
      );
      reachUpgradeChoice(harness);
      expect(events.slice(0, 2)).toEqual([
        { type: "wave-started", waveNumber: 1 },
        { type: "wave-cleared", waveNumber: 1 },
      ]);
      if (action === "pause") {
        // Pause is intentionally a no-op during the already suspended choice.
        expect(harness.controller.lifecycleState).toBe("choosing-upgrade");
        const request = events[2];
        expect(request?.type).toBe("upgrade-choice-requested");
        if (request?.type !== "upgrade-choice-requested")
          throw new Error("Expected a valid upgrade request");
        expect(request.options.map((option) => option.id)).toEqual(
          harness.session.pendingUpgradeOptionIds,
        );
        expect(request.options).toHaveLength(3);
        expect(events).toHaveLength(3);
      } else {
        expect(events.slice(2)).toEqual(
          action === "restart" ? [{ type: "wave-started", waveNumber: 1 }] : [],
        );
        expect(harness.controller.lifecycleState).toBe(
          action === "restart" ? "running" : "destroyed",
        );
      }
      expect(harness.frameScheduler.pendingFrameCount).toBe(
        action === "restart" ? 1 : 0,
      );
      harness.controller.destroy();
      expect(harness.frameScheduler.pendingFrameCount).toBe(0);
    },
  );

  it("does not request a choice already accepted from its status callback", () => {
    const events: GameEvent[] = [];
    const harness = createHarness(
      null,
      (status) => {
        if (status.phase !== "choosing-upgrade") return;
        expect(
          harness.controller.chooseUpgrade(
            harness.session.pendingUpgradeOptionIds[0]!,
          ),
        ).toBe(true);
        harness.controller.pause();
      },
      (event) => events.push(event),
    );
    reachUpgradeChoice(harness);
    expect(events).toEqual([
      { type: "wave-started", waveNumber: 1 },
      { type: "wave-cleared", waveNumber: 1 },
      { type: "wave-started", waveNumber: 2 },
    ]);
    expect(harness.controller.lifecycleState).toBe("paused");
    expect(harness.frameScheduler.pendingFrameCount).toBe(0);
    harness.controller.destroy();
  });

  it.each(["restart", "pause", "destroy"] as const)(
    "respects a %s callback during replay without duplicate wave notifications",
    (action) => {
      let armed = false;
      const events: GameEvent[] = [];
      const harness = createHarness(
        null,
        (status) => {
          if (!armed || status.phase !== "playing") return;
          armed = false;
          harness.controller[action]();
        },
        (event) => events.push(event),
      );
      harness.controller.start();
      events.length = 0;
      armed = true;
      harness.controller.restart();
      expect(events.map((event) => event.type)).toEqual(
        action === "destroy" ? [] : ["wave-started"],
      );
      expect(harness.frameScheduler.pendingFrameCount).toBe(
        action === "restart" ? 1 : 0,
      );
      expect(harness.controller.lifecycleState).toBe(
        action === "restart"
          ? "running"
          : action === "pause"
            ? "paused"
            : "destroyed",
      );
      harness.controller.destroy();
    },
  );

  it("suspends an exhausted upgrade pool and restarts with exactly one frame", () => {
    const harness = createHarness();
    harness.state.upgrades = createRunUpgradeState({
      "rapid-fire": 5,
      "swift-movement": 5,
      vitality: 5,
    });
    reachUpgradeChoice(harness);

    expect(harness.controller.lifecycleState).toBe("wave-cleared");
    expect(harness.snapshots.at(-1)?.phase).toBe("wave-cleared");
    expect(harness.frameScheduler.pendingFrameCount).toBe(0);
    harness.controller.resume();
    expect(harness.controller.chooseUpgrade("vitality")).toBe(false);
    expect(harness.frameScheduler.pendingFrameCount).toBe(0);

    harness.controller.restart();
    expect(harness.controller.lifecycleState).toBe("running");
    expect(harness.frameScheduler.pendingFrameCount).toBe(1);
    expect(harness.frameScheduler.requestedFrameIds).toHaveLength(2);
  });

  it.each(["won", "lost"] as const)(
    "renders one %s frame, stops scheduling, and ignores start/pause/resume/choice",
    (outcome) => {
      const {
        clock,
        controller,
        frameScheduler,
        input,
        readMovementIntent,
        snapshots,
        state,
      } = createHarness();
      state.player.currentHealth = 1;
      state.nextAttackAtSeconds = 100;
      state.waveSchedule!.nextScheduledSpawnIndex =
        state.waveSchedule!.requests.length;
      const enemy = createBasicEnemyState(1, state.player.position);
      enemy.phase = "active";
      state.enemies.push(enemy);
      if (outcome === "won") {
        const boss = createChargerBossState(1, { x: 180, y: 160 });
        boss.phase = "active";
        boss.currentHealth = 0;
        state.waveSchedule = null;
        state.enemies = [boss];
      }
      controller.start();
      clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS * 3);

      frameScheduler.runNextFrame();

      expect(controller.lifecycleState).toBe(outcome);
      expect(snapshots).toHaveLength(1);
      expect(snapshots[0]).toMatchObject({
        phase: outcome,
        simulationTimeSeconds: FIXED_SIMULATION_STEP_SECONDS,
      });
      expect(frameScheduler.pendingFrameCount).toBe(0);
      expect(frameScheduler.requestedFrameIds).toHaveLength(1);
      expect(readMovementIntent).toHaveBeenCalledOnce();
      expect(input.reset).toHaveBeenCalledOnce();

      controller.pause();
      controller.resume();
      controller.start();
      expect(controller.chooseUpgrade("vitality")).toBe(false);

      expect(controller.lifecycleState).toBe(outcome);
      expect(frameScheduler.pendingFrameCount).toBe(0);
      expect(frameScheduler.requestedFrameIds).toHaveLength(1);
      expect(input.reset).toHaveBeenCalledOnce();
    },
  );

  it.each([
    ["restart", "status"],
    ["destroy", "status"],
    ["restart", "event"],
    ["destroy", "event"],
  ] as const)(
    "abandons the old frame on %s from the completion %s callback",
    (action, notification) => {
      const complete = () => {
        expect(harness.session.result?.outcome).toBe("won");
        harness.controller[action]();
      };
      const harness = createHarness(
        null,
        (status) => {
          if (notification === "status" && status.phase === "won") complete();
        },
        (event) => {
          if (notification === "event" && event.type === "run-finished")
            complete();
        },
      );
      const boss = createChargerBossState(1, { x: 180, y: 160 });
      boss.phase = "active";
      boss.currentHealth = 0;
      harness.state.waveSchedule = null;
      harness.state.enemies = [boss];
      harness.controller.start();
      harness.clock.advanceByMilliseconds(200);
      harness.frameScheduler.runNextFrame();
      expect(harness.snapshots).toEqual([]);
      expect(harness.frameScheduler.pendingFrameCount).toBe(
        action === "restart" ? 1 : 0,
      );
      if (action === "restart") {
        expect(harness.session.result).toBeNull();
        harness.clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
        harness.frameScheduler.runNextFrame();
        expect(harness.snapshots.at(-1)).toMatchObject({
          phase: "playing",
          simulationTimeSeconds: FIXED_SIMULATION_STEP_SECONDS,
        });
        expect(harness.frameScheduler.pendingFrameCount).toBe(1);
      }
      harness.controller.destroy();
    },
  );

  it("renders one choosing-upgrade frame before suspending the loop", () => {
    const {
      clock,
      controller,
      frameScheduler,
      input,
      readMovementIntent,
      snapshots,
      state,
    } = createHarness();
    state.waveSchedule!.nextScheduledSpawnIndex =
      state.waveSchedule!.requests.length;
    controller.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS * 3);

    frameScheduler.runNextFrame();

    expect(controller.lifecycleState).toBe("choosing-upgrade");
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0]).toMatchObject({
      phase: "choosing-upgrade",
      simulationTimeSeconds: FIXED_SIMULATION_STEP_SECONDS,
    });
    expect(frameScheduler.pendingFrameCount).toBe(0);
    expect(frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(readMovementIntent).toHaveBeenCalledOnce();
    expect(input.reset).toHaveBeenCalledOnce();
  });

  it("can render choosing-upgrade once without resuming updates", () => {
    const {
      clock,
      controller,
      frameScheduler,
      loop,
      readMovementIntent,
      session,
      snapshots,
      state,
    } = createHarness();
    state.waveSchedule!.nextScheduledSpawnIndex =
      state.waveSchedule!.requests.length;
    controller.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();
    expect(session.beginUpgradeSelection()).toBe(false);
    readMovementIntent.mockClear();

    loop.start();
    frameScheduler.runNextFrame();

    expect(controller.lifecycleState).toBe("choosing-upgrade");
    expect(snapshots.at(-1)?.phase).toBe("choosing-upgrade");
    expect(readMovementIntent).not.toHaveBeenCalled();
    expect(frameScheduler.pendingFrameCount).toBe(0);
    expect(frameScheduler.requestedFrameIds).toHaveLength(2);
  });

  it("applies one valid choice and starts exactly one existing loop", () => {
    const harness = createHarness();
    reachUpgradeChoice(harness);
    const offeredId = harness.session.pendingUpgradeOptionIds[0]!;

    expect(harness.controller.lifecycleState).toBe("choosing-upgrade");
    expect(harness.frameScheduler.pendingFrameCount).toBe(0);
    expect(harness.controller.chooseUpgrade(offeredId)).toBe(true);

    expect(harness.controller.lifecycleState).toBe("running");
    expect(harness.state.upgrades.levels[offeredId]).toBe(1);
    expect(harness.frameScheduler.pendingFrameCount).toBe(1);
    expect(harness.frameScheduler.requestedFrameIds).toHaveLength(2);

    const selectedState = structuredClone(harness.state);
    expect(harness.controller.chooseUpgrade(offeredId)).toBe(false);
    expect(harness.state).toEqual(selectedState);
    expect(harness.frameScheduler.pendingFrameCount).toBe(1);
    expect(harness.frameScheduler.requestedFrameIds).toHaveLength(2);
  });

  it("does not touch state or scheduling for unknown and unoffered choices", () => {
    const harness = createHarness();
    reachUpgradeChoice(harness);
    harness.state.pendingUpgradeOptionIds = Object.freeze(["vitality"]);
    const choosingState = structuredClone(harness.state);

    expect(harness.controller.chooseUpgrade("unknown")).toBe(false);
    expect(harness.controller.chooseUpgrade("rapid-fire")).toBe(false);

    expect(harness.state).toEqual(choosingState);
    expect(harness.controller.lifecycleState).toBe("choosing-upgrade");
    expect(harness.frameScheduler.pendingFrameCount).toBe(0);
    expect(harness.frameScheduler.requestedFrameIds).toHaveLength(1);
  });

  it.each(["idle", "playing", "paused", "wave-cleared", "lost"] as const)(
    "rejects upgrade selection during %s without touching the loop",
    (phase) => {
      const harness = createHarness();
      if (phase === "playing" || phase === "paused") {
        harness.controller.start();
      }
      if (phase === "paused") harness.controller.pause();
      if (phase === "wave-cleared" || phase === "lost") {
        harness.state.phase = phase;
      }
      const phaseState = structuredClone(harness.state);
      const pendingFrameCount = harness.frameScheduler.pendingFrameCount;
      const requestedFrameCount =
        harness.frameScheduler.requestedFrameIds.length;

      expect(harness.controller.chooseUpgrade("vitality")).toBe(false);

      expect(harness.state).toEqual(phaseState);
      expect(harness.frameScheduler.pendingFrameCount).toBe(pendingFrameCount);
      expect(harness.frameScheduler.requestedFrameIds).toHaveLength(
        requestedFrameCount,
      );
    },
  );

  it("ignores a stale stopped-run callback after a choice restarts the loop", () => {
    const harness = createHarness();
    harness.state.waveSchedule!.nextScheduledSpawnIndex =
      harness.state.waveSchedule!.requests.length;
    harness.controller.start();
    const originalFrameId = harness.frameScheduler.requestedFrameIds[0];
    if (originalFrameId === undefined)
      throw new Error("No frame was requested.");
    const staleCallback =
      harness.frameScheduler.getRequestedCallback(originalFrameId);
    if (!staleCallback) throw new Error("No frame callback was stored.");
    harness.clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    harness.frameScheduler.runNextFrame();

    const offeredId = harness.session.pendingUpgradeOptionIds[0]!;
    expect(harness.controller.chooseUpgrade(offeredId)).toBe(true);
    staleCallback();

    expect(harness.controller.lifecycleState).toBe("running");
    expect(harness.frameScheduler.pendingFrameCount).toBe(1);
    expect(harness.frameScheduler.requestedFrameIds).toHaveLength(2);
  });

  it("restarts cleanly from a real pending upgrade choice", () => {
    const harness = createHarness();
    reachUpgradeChoice(harness);
    const staleOfferedId = harness.session.pendingUpgradeOptionIds[0]!;

    harness.controller.restart();

    expect(harness.controller.lifecycleState).toBe("running");
    expect(harness.session.pendingUpgradeOptionIds).toEqual([]);
    expect(harness.controller.chooseUpgrade(staleOfferedId)).toBe(false);
    expect(harness.frameScheduler.pendingFrameCount).toBe(1);
    expect(harness.frameScheduler.requestedFrameIds).toHaveLength(2);
  });

  it("keeps restart available after loss without creating a second loop", () => {
    const { clock, controller, frameScheduler, snapshots, state } =
      createHarness();
    state.player.currentHealth = 0;
    controller.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();
    expect(controller.lifecycleState).toBe("lost");

    controller.restart();

    expect(controller.lifecycleState).toBe("running");
    expect(frameScheduler.pendingFrameCount).toBe(1);
    expect(frameScheduler.requestedFrameIds).toHaveLength(2);
    frameScheduler.runNextFrame();
    expect(snapshots.at(-1)).toMatchObject({
      phase: "playing",
      simulationTimeSeconds: 0,
      enemies: [],
      projectiles: [],
    });
  });

  it.each([
    "playing",
    "paused",
    "wave-cleared",
    "choosing-upgrade",
    "lost",
    "won",
  ] as const)(
    "keeps exactly one pending frame after repeated restart from %s",
    (startingPhase) => {
      const { clock, controller, frameScheduler, snapshots, state } =
        createHarness();
      controller.start();
      if (startingPhase === "paused") controller.pause();
      if (
        startingPhase === "wave-cleared" ||
        startingPhase === "choosing-upgrade"
      ) {
        state.phase = startingPhase;
        expect(controller.lifecycleState).toBe(startingPhase);
      }
      if (startingPhase === "lost") {
        state.player.currentHealth = 0;
        clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
        frameScheduler.runNextFrame();
        expect(controller.lifecycleState).toBe("lost");
      }
      if (startingPhase === "won") {
        state.waveSchedule = null;
        const boss = createChargerBossState(29, { x: 180, y: 100 });
        boss.phase = "active";
        boss.currentHealth = 0;
        state.enemies = [boss];
        clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
        frameScheduler.runNextFrame();
        expect(controller.lifecycleState).toBe("won");
      }

      controller.restart();
      controller.restart();
      controller.restart();

      expect(controller.lifecycleState).toBe("running");
      expect(frameScheduler.pendingFrameCount).toBe(1);
      expect(frameScheduler.requestedFrameIds).toHaveLength(4);
      frameScheduler.runNextFrame();
      expect(snapshots.at(-1)).toMatchObject({
        phase: "playing",
        simulationTimeSeconds: 0,
        playerX: 180,
        playerY: 320,
        isPlayerInvulnerable: false,
        killCount: 0,
        enemies: [],
        projectiles: [],
      });
      expect(frameScheduler.pendingFrameCount).toBe(1);
    },
  );

  it("destroys idempotently from lost without restoring scheduling", () => {
    const { clock, controller, frameScheduler, input, presentation, state } =
      createHarness();
    state.player.currentHealth = 0;
    controller.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();

    controller.destroy();
    controller.destroy();
    controller.resume();
    expect(controller.chooseUpgrade("rapid-fire")).toBe(false);

    expect(controller.lifecycleState).toBe("destroyed");
    expect(frameScheduler.pendingFrameCount).toBe(0);
    expect(frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(input.destroy).toHaveBeenCalledOnce();
    expect(presentation.destroy).toHaveBeenCalledOnce();
  });

  it("destroys every owned resource from a pending upgrade choice", () => {
    const harness = createHarness();
    reachUpgradeChoice(harness);
    expect(harness.controller.lifecycleState).toBe("choosing-upgrade");
    expect(harness.frameScheduler.pendingFrameCount).toBe(0);

    harness.controller.destroy();
    harness.controller.destroy();
    harness.controller.pause();
    harness.controller.resume();
    expect(harness.controller.chooseUpgrade("rapid-fire")).toBe(false);

    expect(harness.controller.lifecycleState).toBe("destroyed");
    expect(harness.frameScheduler.pendingFrameCount).toBe(0);
    expect(harness.frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(harness.input.reset).toHaveBeenCalledTimes(2);
    expect(harness.input.destroy).toHaveBeenCalledOnce();
    expect(harness.presentation.destroy).toHaveBeenCalledOnce();
  });

  it("ignores pause and resume while choosing an upgrade", () => {
    const { clock, controller, frameScheduler, input, state } = createHarness();
    state.waveSchedule!.nextScheduledSpawnIndex =
      state.waveSchedule!.requests.length;
    controller.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();
    expect(controller.lifecycleState).toBe("choosing-upgrade");

    controller.pause();
    controller.resume();

    expect(controller.lifecycleState).toBe("choosing-upgrade");
    expect(frameScheduler.pendingFrameCount).toBe(0);
    expect(frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(input.reset).toHaveBeenCalledOnce();
  });

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
        playerCurrentHealth: 3,
        playerMaximumHealth: 3,
        isPlayerInvulnerable: false,
        killCount: 0,
        enemies: [],
        projectiles: [],
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
    expect(snapshots.at(-1)?.joystick).not.toBe(joystick);
    expect(Object.isFrozen(snapshots.at(-1))).toBe(true);
    expect(Object.isFrozen(snapshots.at(-1)?.joystick)).toBe(true);
  });

  it("copies immutable renderer-facing enemy values from runtime state", () => {
    const { session, snapshots, state } = createHarness();
    const enemy = createBasicEnemyState(7, { x: -24, y: 288 });
    state.enemies.push(enemy);

    session.render();

    const renderedEnemies = snapshots.at(-1)?.enemies;
    const renderedEnemy = renderedEnemies?.[0];
    expect(renderedEnemy).toEqual({
      id: 7,
      phase: "entering",
      x: -24,
      y: 288,
      collisionRadius: 12,
    });
    expect(renderedEnemy).not.toBe(enemy);
    expect(Object.isFrozen(renderedEnemies)).toBe(true);
    expect(Object.isFrozen(renderedEnemy)).toBe(true);
    expect(renderedEnemy).not.toHaveProperty("currentHealth");
    expect(renderedEnemy).not.toHaveProperty("contactDamage");

    enemy.phase = "active";
    enemy.position.x = 99;

    expect(renderedEnemy).toMatchObject({ phase: "entering", x: -24 });
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
      session,
      snapshots,
      state,
    } = createHarness();
    state.enemies.push(createBasicEnemyState(1, { x: -20, y: 320 }));
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
    session.fixedUpdate(10);
    session.render();

    expect(controller.lifecycleState).toBe("destroyed");
    expect(state.enemies).toEqual([]);
    expect(snapshots).toEqual([]);
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
