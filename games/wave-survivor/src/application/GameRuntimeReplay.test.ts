import { describe, expect, it, vi } from "vitest";
import type { GameEvent } from "../GameEvent.js";
import type { GameStatusSnapshot } from "../GameStatusSnapshot.js";
import type { GameRenderSnapshot } from "../domain/GamePresentationPort.js";
import { createChargerBossState } from "../domain/enemies/ChargerBoss.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
} from "../domain/movement/index.js";
import {
  createInitialRuntimeState,
  type RuntimeState,
} from "../domain/state/index.js";
import { createRunUpgradeState } from "../domain/upgrades/index.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

// Internal fixture access only; runtime state remains outside the public API.
function ownedState(session: GameRuntimeSession): RuntimeState {
  return (session as unknown as { state: RuntimeState }).state;
}

function fixture() {
  const output: Array<GameEvent | GameStatusSnapshot | GameRenderSnapshot> = [];
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
  const spawn = new SeededRandomSource(42);
  const upgrade = new SeededRandomSource(84);
  const spawnDraw = vi.spyOn(spawn, "nextFloat");
  const upgradeDraw = vi.spyOn(upgrade, "nextFloat");
  const session = new GameRuntimeSession(
    createInitialRuntimeState(),
    input,
    {
      render: (snapshot) => output.push(snapshot),
      setTheme: vi.fn(),
      destroy: vi.fn(),
    },
    spawn,
    upgrade,
    null,
    (status) => output.push(status),
    (event) => output.push(event),
  );
  output.length = 0; // Fresh construction's idle status precedes both run traces.
  return { session, input, output, spawnDraw, upgradeDraw };
}

/** Combat fixtures speed up clears; actual schedules, streams, choices and boss cycle run. */
function play(harness: ReturnType<typeof fixture>, outcome: "won" | "lost") {
  const { session, input } = harness;
  const state = ownedState(session);
  state.player.invulnerableUntilSeconds = 1000;
  const bossPhases = new Set<string>();
  for (let step = 0; step < 12000 && session.result === null; step += 1) {
    input.intent = createMovementIntent(step % 120 < 60 ? 1 : -1, 0);
    if (session.phase === "choosing-upgrade") {
      expect(session.chooseUpgrade(session.pendingUpgradeOptionIds[0]!)).toBe(
        true,
      );
    }
    for (const enemy of state.enemies) {
      if (enemy.kind === "basic" && enemy.phase === "active")
        enemy.currentHealth = 0;
      if (enemy.kind === "charger") {
        bossPhases.add(enemy.action?.phase ?? "entering");
        if (bossPhases.has("recovery")) {
          if (outcome === "won") enemy.currentHealth = 0;
          else state.player.currentHealth = 0;
        }
      }
    }
    session.fixedUpdate(1 / 60);
    if (step % 30 === 0 || session.result) session.render();
  }
  expect(session.result?.outcome).toBe(outcome);
  expect(bossPhases).toEqual(
    new Set(["entering", "approach", "wind-up", "charge", "recovery"]),
  );
  expect(harness.spawnDraw).toHaveBeenCalled();
  expect(harness.upgradeDraw).toHaveBeenCalled();
  expect(
    harness.output.filter(
      (value) => "type" in value && value.type === "run-finished",
    ),
  ).toHaveLength(1);
  return structuredClone({ output: harness.output, state });
}

describe("constructed combat replay boundaries (not production full-run proof)", () => {
  it.each(["won", "lost"] as const)(
    "matches a fresh %s run through three replays, including both random streams",
    (outcome) => {
      const fresh = fixture();
      fresh.session.start();
      const expected = play(fresh, outcome);
      const retainedResult = fresh.session.result;
      const retainedCopy = { ...retainedResult };
      const replay = fixture();
      replay.session.start();
      play(replay, outcome === "won" ? "lost" : "won");
      for (let run = 0; run < 3; run += 1) {
        replay.output.length = 0;
        replay.spawnDraw.mockClear();
        replay.upgradeDraw.mockClear();
        const previous = replay.session.result;
        const previousCopy = { ...previous };
        replay.session.restart();
        expect(replay.session.result).toBeNull();
        expect(play(replay, outcome)).toEqual(expected);
        expect(previous).toEqual(previousCopy);
        expect(Object.isFrozen(previous)).toBe(true);
      }
      fresh.session.restart();
      fresh.session.destroy();
      expect(retainedResult).toEqual(retainedCopy);
      const beforeDestroy = structuredClone(replay.output);
      replay.session.destroy();
      replay.session.restart();
      replay.session.start();
      replay.session.resume();
      replay.session.fixedUpdate(100);
      expect(replay.output).toEqual(beforeDestroy);
    },
  );

  it.each(["entering", "approach", "wind-up", "charge", "recovery"] as const)(
    "clears %s boss state and every transient field through the initial-state factory",
    (phase) => {
      const { session, input } = fixture();
      session.start();
      const state = ownedState(session);
      state.waveSchedule = null;
      state.simulationTimeSeconds = 80;
      state.killCount = 28;
      state.nextEnemyId = 30;
      state.nextProjectileId = 90;
      state.nextAttackAtSeconds = 81;
      state.player.currentHealth = 5;
      state.player.invulnerableUntilSeconds = 82;
      state.upgrades = createRunUpgradeState({ vitality: 4 });
      const boss = createChargerBossState(29, { x: 180, y: 160 });
      boss.phase = phase === "entering" ? "entering" : "active";
      boss.entryStartedAtSeconds = 79;
      boss.action =
        phase === "entering"
          ? null
          : phase === "charge" || phase === "wind-up"
            ? { phase, endsAtSeconds: 81, direction: { x: 0, y: 1 } }
            : { phase, endsAtSeconds: 81 };
      state.enemies = [boss];
      input.intent = createMovementIntent(1, 1);
      session.restart();
      expect(ownedState(session)).toEqual({
        ...createInitialRuntimeState(),
        phase: "playing",
      });
      expect(input.intent).toBe(ZERO_MOVEMENT_INTENT);
      session.destroy();
    },
  );
});
