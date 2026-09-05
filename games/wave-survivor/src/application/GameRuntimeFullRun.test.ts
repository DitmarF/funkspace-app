import { describe, expect, it, vi } from "vitest";
import type { GameEvent } from "../GameEvent.js";
import type { GameRenderSnapshot } from "../domain/GamePresentationPort.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
} from "../domain/movement/index.js";
import { SCORE_WEIGHTS } from "../domain/score/CalculateScore.js";
import {
  createInitialRuntimeState,
  type RuntimeState,
} from "../domain/state/index.js";
import { getEffectiveMaximumHealth } from "../domain/upgrades/index.js";
import { PROVISIONAL_RUN_DEFINITION } from "../domain/waves/index.js";
import { FIXED_SIMULATION_STEP_SECONDS as STEP } from "../infrastructure/loop/FixedStepLoop.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

const MAX_STEPS = 9000; // Safety bound (150 simulated seconds), not a completion timer.
type Script = "circle-at-boss" | "stationary";
type BossStage = "entering" | "wind-up" | "charge" | "recovery";

/** Read-only inspection, following existing internal session tests; never exposed to hosts. */
function inspect(session: GameRuntimeSession): Readonly<RuntimeState> {
  return (session as unknown as { readonly state: RuntimeState }).state;
}

/** Real production configuration/combat only. No state writes or manufactured outcomes. */
function fixture(script: Script) {
  const events: GameEvent[] = [];
  const notifications: string[] = [];
  const samples: number[][] = [];
  let steps = 0;
  let bossStartedAtStep: number | null = null;
  let latest: GameRenderSnapshot | null = null;
  const input = {
    intent: ZERO_MOVEMENT_INTENT,
    readMovementIntent() {
      return this.intent;
    },
    reset() {
      this.intent = ZERO_MOVEMENT_INTENT;
    },
    destroy: vi.fn(),
  };
  const presentation = {
    render: vi.fn((snapshot: GameRenderSnapshot) => {
      latest = snapshot;
    }),
    setTheme: vi.fn(),
    destroy: vi.fn(),
  };
  const session = new GameRuntimeSession(
    createInitialRuntimeState(),
    input,
    presentation,
    new SeededRandomSource(1),
    new SeededRandomSource(2),
    null,
    (status) => notifications.push(status.phase),
    (event) => {
      events.push(event);
      notifications.push(event.type);
      if (event.type === "wave-started" && event.encounterKind === "boss")
        bossStartedAtStep = steps;
    },
  );

  function begin(replay = false) {
    steps = 0;
    bossStartedAtStep = null;
    events.length = 0;
    notifications.length = 0;
    samples.length = 0;
    if (replay) session.restart();
    else session.start();
  }

  function diagnostic() {
    const state = inspect(session);
    return JSON.stringify({
      script,
      seeds: [1, 2],
      steps,
      maxSteps: MAX_STEPS,
      phase: session.phase,
      time: state.simulationTimeSeconds,
      health: state.player.currentHealth,
      kills: state.killCount,
      wave: state.waveSchedule?.currentWaveNumber ?? "boss",
      queued:
        state.waveSchedule &&
        state.waveSchedule.requests.length -
          state.waveSchedule.nextScheduledSpawnIndex,
      enemies: state.enemies.map((enemy) => ({
        id: enemy.id,
        phase: enemy.phase,
        health: enemy.currentHealth,
        action: enemy.kind === "charger" ? enemy.action : null,
      })),
      lastEvent: events.at(-1),
    });
  }

  function tick() {
    if (steps >= MAX_STEPS)
      throw new Error(`Full-run step bound exceeded: ${diagnostic()}`);
    if (session.phase === "choosing-upgrade") {
      const offer = events.at(-1);
      expect(offer?.type, diagnostic()).toBe("upgrade-choice-requested");
      if (offer?.type !== "upgrade-choice-requested")
        throw new Error(diagnostic());
      expect(
        offer.options.some(({ id }) => id === "rapid-fire"),
        diagnostic(),
      ).toBe(true);
      const time = inspect(session).simulationTimeSeconds;
      session.fixedUpdate(STEP); // Selection consumes no gameplay time.
      expect(inspect(session).simulationTimeSeconds).toBe(time);
      expect(session.chooseUpgrade("rapid-fire"), diagnostic()).toBe(true);
    }
    expect(session.phase, diagnostic()).toBe("playing");
    // Stand still for normal waves. At boss entry rotate the input by 1 radian/s.
    // This is an open-loop script: it neither reads nor changes enemy positions.
    const bossSeconds = (steps - (bossStartedAtStep ?? steps)) * STEP;
    input.intent =
      script === "circle-at-boss" && bossStartedAtStep !== null
        ? createMovementIntent(Math.cos(bossSeconds), Math.sin(bossSeconds))
        : ZERO_MOVEMENT_INTENT;
    session.fixedUpdate(STEP);
    steps += 1;
    if (steps % 60 === 0 || session.result) {
      session.render();
      if (latest)
        samples.push([
          latest.simulationTimeSeconds,
          latest.playerX,
          latest.playerY,
          latest.playerCurrentHealth,
          latest.killCount,
          latest.enemies.length,
          latest.projectiles.length,
        ]);
    }
  }

  function finish() {
    while (session.result === null) tick();
    return {
      events: [...events],
      notifications: [...notifications],
      samples: samples.map((sample) => [...sample]),
      result: session.result,
      steps,
    };
  }

  function reach(stage: BossStage) {
    while (true) {
      const boss = inspect(session).enemies.find(
        (enemy) => enemy.kind === "charger",
      );
      if (
        boss &&
        (stage === "entering"
          ? boss.phase === "entering"
          : boss.action?.phase === stage)
      )
        return;
      if (session.result)
        throw new Error(`Did not reach ${stage}: ${diagnostic()}`);
      tick();
    }
  }

  return {
    session,
    input,
    presentation,
    events,
    notifications,
    begin,
    tick,
    finish,
    reach,
    diagnostic,
    render: () => {
      session.render();
      return latest;
    },
  };
}

function assertCompletion(
  harness: ReturnType<typeof fixture>,
  outcome: "won" | "lost",
) {
  const { session, events, notifications, diagnostic } = harness;
  const state = inspect(session);
  const normalCount = PROVISIONAL_RUN_DEFINITION.normalWaves.length;
  const expectedEvents: string[] = [];
  for (let wave = 1; wave <= normalCount; wave += 1)
    expectedEvents.push(`start:${wave}`, `clear:${wave}`, `choice:${wave}`);
  expectedEvents.push(`start:${normalCount + 1}`, `finish:${outcome}`);
  expect(
    events.map((event) => {
      switch (event.type) {
        case "wave-started":
          return `start:${event.waveNumber}`;
        case "wave-cleared":
          return `clear:${event.waveNumber}`;
        case "upgrade-choice-requested":
          return `choice:${event.clearedWaveNumber}`;
        case "run-finished":
          return `finish:${event.result.outcome}`;
      }
    }),
    diagnostic(),
  ).toEqual(expectedEvents);
  expect(notifications.slice(-2)).toEqual(["run-finished", outcome]);
  const normalEnemies = PROVISIONAL_RUN_DEFINITION.normalWaves.reduce(
    (total, wave) =>
      total + wave.groups.reduce((count, group) => count + group.count, 0),
    0,
  );
  expect(state.killCount).toBe(normalEnemies + Number(outcome === "won"));
  const boss = state.enemies.find((enemy) => enemy.kind === "charger");
  expect(boss?.phase).toBe(outcome === "won" ? "dying" : "active");
  expect(state.player.currentHealth).toBeLessThan(state.player.maximumHealth);
  if (outcome === "lost") expect(state.player.currentHealth).toBe(0);
  else expect(state.player.currentHealth).toBeGreaterThan(0);
  const healthBonus =
    outcome === "won"
      ? Math.floor(
          (SCORE_WEIGHTS.fullHealthOnVictory * state.player.currentHealth) /
            getEffectiveMaximumHealth(
              state.player.maximumHealth,
              state.upgrades,
            ),
        )
      : 0;
  expect(session.result).toEqual({
    outcome,
    waveReached: normalCount + 1,
    elapsedSeconds: state.simulationTimeSeconds,
    score:
      normalEnemies * SCORE_WEIGHTS.perEnemyDefeated +
      normalCount * SCORE_WEIGHTS.perNormalWaveCleared +
      (outcome === "won"
        ? SCORE_WEIGHTS.perEnemyDefeated + SCORE_WEIGHTS.victory
        : 0) +
      healthBonus,
  });
  const event = events.at(-1);
  expect(event?.type).toBe("run-finished");
  if (event?.type === "run-finished") expect(event.result).toBe(session.result);
  expect(Object.isFrozen(event)).toBe(true);
  expect(Object.isFrozen(session.result)).toBe(true);
  expect(Reflect.set(session.result!, "score", -1)).toBe(false);
  const frozenState = structuredClone(state);
  const oldEvents = [...events];
  session.start();
  session.resume();
  expect(session.chooseUpgrade("rapid-fire")).toBe(false);
  for (let step = 0; step < 120; step += 1) session.fixedUpdate(STEP);
  session.render();
  expect(inspect(session)).toEqual(frozenState);
  expect(events).toEqual(oldEvents);
}

describe("production full runs without state injection", () => {
  it.each([
    ["circle-at-boss", "won"],
    ["stationary", "lost"],
  ] as const)(
    "%s earns %s and replays identically to a fresh run",
    (script, outcome) => {
      const fresh = fixture(script);
      const replay = fixture(script);
      try {
        fresh.begin();
        const expected = fresh.finish();
        expect(expected.result.elapsedSeconds).toBeCloseTo(
          expected.steps * STEP,
          8,
        );
        assertCompletion(fresh, outcome);
        replay.begin();
        replay.finish();
        assertCompletion(replay, outcome);
        const retained = replay.session.result;
        const copy = { ...retained };
        replay.begin(true);
        expect(replay.session.result).toBeNull();
        expect(replay.finish()).toEqual(expected);
        assertCompletion(replay, outcome);
        expect(retained).toEqual(copy);
      } finally {
        fresh.session.destroy();
        replay.session.destroy();
      }
    },
  );

  describe.each(["entering", "wind-up", "charge", "recovery"] as const)(
    "naturally reached boss %s interruption companions",
    (stage) => {
      it.each(["resume", "restart", "destroy"] as const)(
        "pause then %s",
        (action) => {
          const harness = fixture("circle-at-boss");
          try {
            harness.begin();
            harness.reach(stage);
            expect(harness.session.pause()).toBe(true);
            const paused = structuredClone(inspect(harness.session));
            const warning = harness.render()?.enemies;
            for (let step = 0; step < 120; step += 1)
              harness.session.fixedUpdate(STEP);
            expect(inspect(harness.session)).toEqual(paused);
            expect(harness.render()?.enemies).toEqual(warning);
            expect(harness.input.intent).toBe(ZERO_MOVEMENT_INTENT);
            if (action === "resume") {
              harness.session.resume();
              const run = harness.finish();
              expect(run.result.elapsedSeconds).toBeCloseTo(
                run.steps * STEP,
                8,
              );
              assertCompletion(harness, "won");
            } else if (action === "restart") {
              const abandonedEvents = [...harness.events];
              harness.begin(true);
              expect(
                abandonedEvents.some((event) => event.type === "run-finished"),
              ).toBe(false);
              expect(harness.render()).toMatchObject({
                simulationTimeSeconds: 0,
                enemies: [],
                projectiles: [],
                killCount: 0,
              });
              harness.finish();
              assertCompletion(harness, "won");
            } else {
              const calls = harness.presentation.render.mock.calls.length;
              const events = [...harness.events];
              harness.session.destroy();
              harness.session.restart();
              harness.session.resume();
              harness.session.fixedUpdate(STEP);
              harness.session.render();
              expect(inspect(harness.session).enemies).toEqual([]);
              expect(inspect(harness.session).projectiles).toEqual([]);
              expect(harness.presentation.render).toHaveBeenCalledTimes(calls);
              expect(harness.events).toEqual(events);
              expect(harness.session.result).toBeNull();
              expect(harness.input.destroy).toHaveBeenCalledOnce();
              expect(harness.presentation.destroy).toHaveBeenCalledOnce();
            }
          } finally {
            harness.session.destroy();
          }
        },
      );
    },
  );
});
