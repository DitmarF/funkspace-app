import { describe, expect, it, vi } from "vitest";
import type { GameStatusSnapshot } from "../GameStatusSnapshot.js";
import type { GameEvent } from "../GameEvent.js";
import type { GamePresentationPort } from "../domain/GamePresentationPort.js";
import { createChargerBossState } from "../domain/enemies/ChargerBoss.js";
import { createBasicEnemyState } from "../domain/enemies/EnemyState.js";
import { createInitialRuntimeState } from "../domain/state/RuntimeState.js";
import { createBasicProjectileState } from "../domain/projectiles/index.js";
import { createRunUpgradeState } from "../domain/upgrades/index.js";
import {
  createWaveScheduleProgress,
  PROVISIONAL_RUN_DEFINITION,
} from "../domain/waves/index.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

function fixture(onStatus?: (status: GameStatusSnapshot) => void) {
  const state = createInitialRuntimeState();
  state.waveSchedule = null;
  state.killCount = 28;
  state.simulationTimeSeconds = 40;
  state.nextAttackAtSeconds = 100;
  state.upgrades = createRunUpgradeState({ vitality: 4 });
  state.player.currentHealth = 5;
  state.player.position = { x: 180, y: 320 };
  const boss = createChargerBossState(29, { x: 180, y: 320 });
  boss.phase = "active";
  boss.action = { phase: "recovery", endsAtSeconds: 41 };
  state.enemies = [boss];
  state.nextEnemyId = 30;
  const input = {
    readMovementIntent: vi.fn(() => ({ x: 0, y: 0 })),
    reset: vi.fn(),
    destroy: vi.fn(),
  };
  const presentation: GamePresentationPort = {
    render: vi.fn(),
    setTheme: vi.fn(),
    destroy: vi.fn(),
  };
  const events: GameEvent[] = [];
  const session = new GameRuntimeSession(
    state,
    input,
    presentation,
    new SeededRandomSource(1),
    new SeededRandomSource(2),
    null,
    onStatus ?? null,
    (event) => events.push(event),
  );
  session.start();
  events.length = 0;
  return { state, boss, input, presentation, session, events };
}

function lethalProjectile(state: ReturnType<typeof createInitialRuntimeState>) {
  state.projectiles = [
    createBasicProjectileState(
      1,
      { x: 180, y: 320 },
      { x: 180, y: 200 },
      state.simulationTimeSeconds,
    ),
  ];
}

describe("committed run completion", () => {
  it("finalizes boss victory once with authoritative kills, four normal clears, upgraded health and time", () => {
    const { state, boss, session, input, events, presentation } = fixture();
    boss.currentHealth = 1;
    lethalProjectile(state);
    session.fixedUpdate(1 / 60);
    const result = session.result;
    expect(result).toEqual({
      outcome: "won",
      score: 1261,
      waveReached: 5,
      elapsedSeconds: 40 + 1 / 60,
    });
    expect(state.result).toBe(result);
    expect(Object.isFrozen(result)).toBe(true);
    expect(state.killCount).toBe(29);
    expect(state.player.currentHealth).toBe(5);
    expect(input.reset).toHaveBeenCalled();
    expect(state.movementIntent).toEqual({ x: 0, y: 0 });
    expect(events).toEqual([]); // WS-6.8 owns publication; no extra upgrade/event.
    const completed = structuredClone(state);
    for (let i = 0; i < 10; i += 1) session.fixedUpdate(10);
    expect(session.start()).toBe(false);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.chooseUpgrade("vitality")).toBe(false);
    session.render();
    session.render();
    expect(state).toEqual(completed);
    expect(session.result).toBe(result);
    expect(vi.mocked(presentation.render).mock.calls.at(-1)![0].phase).toBe(
      "won",
    );
    session.restart();
    expect(session.result).toBeNull();
    expect(session.phase).toBe("playing");
    session.render();
    expect(vi.mocked(presentation.render).mock.calls.at(-1)![0]).toMatchObject({
      simulationTimeSeconds: 0,
      killCount: 0,
      playerCurrentHealth: 3,
    });
    expect(result).toEqual({
      outcome: "won",
      score: 1261,
      waveReached: 5,
      elapsedSeconds: 40 + 1 / 60,
    });
    session.destroy();
  });

  it("finalizes partial normal-wave loss without victory or health bonuses", () => {
    const { state, boss, session } = fixture();
    state.waveSchedule = createWaveScheduleProgress(
      3,
      PROVISIONAL_RUN_DEFINITION.normalWaves[2]!,
    );
    state.killCount = 12;
    state.player.currentHealth = 1;
    session.fixedUpdate(1 / 60);
    expect(boss.currentHealth).toBe(24);
    expect(session.result).toEqual({
      outcome: "lost",
      score: 320,
      waveReached: 3,
      elapsedSeconds: 40 + 1 / 60,
    });
    const completed = structuredClone(state);
    session.fixedUpdate(100);
    session.start();
    session.resume();
    session.chooseUpgrade("vitality");
    expect(state).toEqual(completed);
    session.destroy();
  });

  it("a projectile-lethal boss cannot deliver the otherwise lethal same-update contact", () => {
    const { state, boss, session } = fixture();
    state.player.currentHealth = 1;
    boss.currentHealth = 1;
    lethalProjectile(state);
    session.fixedUpdate(1 / 60);
    expect(session.result?.outcome).toBe("won");
    expect(state.player.currentHealth).toBe(1);
    expect(session.result?.score).toBe(1204); // floor(100 / 7).
    session.destroy();
  });

  it("loss takes precedence if another surviving enemy deals lethal contact after boss defeat", () => {
    const { state, boss, session } = fixture();
    boss.currentHealth = 1;
    state.player.currentHealth = 1;
    const other = createBasicEnemyState(30, state.player.position);
    other.phase = "active";
    state.enemies.push(other);
    lethalProjectile(state);
    session.fixedUpdate(1 / 60);
    expect(state.killCount).toBe(29);
    expect(session.result).toMatchObject({
      outcome: "lost",
      score: 690,
      waveReached: 5,
    });
    session.destroy();
  });

  it("a player already defeated at update start loses without advancing or processing a dead boss", () => {
    const { state, boss, session } = fixture();
    state.player.currentHealth = 0;
    boss.currentHealth = 0;
    session.fixedUpdate(1);
    expect(session.result).toEqual({
      outcome: "lost",
      score: 680,
      waveReached: 5,
      elapsedSeconds: 40,
    });
    expect(state.killCount).toBe(28);
    session.destroy();
  });

  it.each([
    "missing",
    "invalid",
    "escaped",
    "already-dying",
    "entering",
    "normal-encounter",
  ] as const)("does not infer victory from %s boss state", (kind) => {
    const { state, boss, session } = fixture();
    state.player.position = { x: 12, y: 12 };
    if (kind === "missing") state.enemies = [];
    if (kind === "invalid") {
      boss.position.x = NaN;
      boss.currentHealth = 0;
    }
    if (kind === "escaped") {
      boss.position.x = 1000;
      boss.currentHealth = 0;
    }
    if (kind === "already-dying") {
      boss.phase = "dying";
      boss.currentHealth = 0;
      boss.removeAtSimulationSeconds = 40;
    }
    if (kind === "entering") {
      boss.phase = "entering";
      boss.entryStartedAtSeconds = 40;
      boss.position = { x: 180, y: -96 };
    }
    if (kind === "normal-encounter") {
      state.waveSchedule = createWaveScheduleProgress(
        1,
        PROVISIONAL_RUN_DEFINITION.normalWaves[0],
      );
      boss.currentHealth = 0;
    }
    session.fixedUpdate(1 / 60);
    expect(session.phase).not.toBe("won");
    expect(session.result).toBeNull();
    session.destroy();
  });

  it("includes actual final-upgrade entry and wind-up but excludes choice/pause/terminal time", () => {
    const { state, session } = fixture();
    state.phase = "choosing-upgrade";
    state.waveSchedule = createWaveScheduleProgress(
      4,
      PROVISIONAL_RUN_DEFINITION.normalWaves[3]!,
    );
    state.upgrades = createRunUpgradeState({ "rapid-fire": 3 });
    state.player.currentHealth = 3;
    state.player.position = { x: 12, y: 628 };
    state.pendingUpgradeOptionIds = ["vitality"];
    session.fixedUpdate(100);
    expect(session.chooseUpgrade("vitality")).toBe(true);
    state.nextAttackAtSeconds = 100;
    for (let i = 0; i < 300; i += 1) session.fixedUpdate(1 / 60);
    expect(state.simulationTimeSeconds).toBeCloseTo(45);
    session.pause();
    session.fixedUpdate(100);
    session.resume();
    const enteredBoss = state.enemies[0]!;
    expect(enteredBoss.kind).toBe("charger");
    enteredBoss.currentHealth = 0;
    session.fixedUpdate(1 / 60);
    expect(session.result).toMatchObject({ outcome: "won", waveReached: 5 });
    expect(session.result?.elapsedSeconds).toBeCloseTo(45 + 1 / 60);
    session.fixedUpdate(100);
    expect(state.simulationTimeSeconds).toBeCloseTo(45 + 1 / 60);
    session.destroy();
  });

  it.each(["won", "lost"] as const)(
    "commits %s before status callbacks that restart or destroy",
    (outcome) => {
      for (const action of ["restart", "destroy"] as const) {
        let callbackCount = 0;
        let observed = null as GameRuntimeSession["result"];
        const { state, boss, session, events } = fixture((status) => {
          if (status.phase !== outcome) return;
          callbackCount += 1;
          observed = session.result;
          expect(observed?.outcome).toBe(outcome);
          expect(state.result).toBe(observed);
          expect(state.phase).toBe(outcome);
          expect(state.movementIntent).toEqual({ x: 0, y: 0 });
          expect(Object.isFrozen(observed)).toBe(true);
          session[action]();
        });
        if (outcome === "won") {
          boss.currentHealth = 1;
          lethalProjectile(state);
        } else state.player.currentHealth = 1;
        session.fixedUpdate(1 / 60);
        expect(callbackCount).toBe(1);
        expect(observed).not.toBeNull();
        if (action === "restart") {
          expect(session.result).toBeNull();
          expect(events).toEqual([{ type: "wave-started", waveNumber: 1 }]);
        } else {
          expect(events).toEqual([]);
          expect(session.start()).toBe(false);
          expect(session.resume()).toBe(false);
          session.restart();
          expect(session.result).toBe(observed);
        }
        session.destroy();
      }
    },
  );
});
