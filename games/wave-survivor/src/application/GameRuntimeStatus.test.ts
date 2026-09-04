import { describe, expect, it, vi } from "vitest";
import type { GameStatusSnapshot } from "../GameStatusSnapshot.js";
import type {
  GamePresentationPort,
  GameRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import { createBasicEnemyState } from "../domain/enemies/index.js";
import {
  createInitialRuntimeState,
  type RuntimeState,
} from "../domain/state/index.js";
import { ZeroMovementInput } from "../infrastructure/input/ZeroMovementInput.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

function addActiveEnemyAtPlayer(state: RuntimeState): void {
  const enemy = createBasicEnemyState(state.nextEnemyId, state.player.position);
  enemy.phase = "active";
  state.enemies.push(enemy);
  state.nextEnemyId += 1;
}

function createStatusHarness() {
  const state = createInitialRuntimeState();
  state.nextAttackAtSeconds = 100;
  const statuses: GameStatusSnapshot[] = [];
  const onStatusChange = vi.fn((snapshot: GameStatusSnapshot) => {
    statuses.push(snapshot);
  });
  const session = new GameRuntimeSession(
    state,
    new ZeroMovementInput(),
    null,
    new SeededRandomSource(1),
    new SeededRandomSource(2),
    null,
    onStatusChange,
  );

  return { onStatusChange, session, state, statuses };
}

describe("GameRuntimeSession discrete status", () => {
  it("emits one immutable initial status", () => {
    const { onStatusChange, statuses } = createStatusHarness();

    expect(onStatusChange).toHaveBeenCalledOnce();
    expect(statuses[0]).toEqual({
      phase: "idle",
      waveNumber: 1,
      currentHealth: 3,
      maximumHealth: 3,
      killCount: 0,
    });
    expect(Object.isFrozen(statuses[0])).toBe(true);
  });

  it("does not emit again while all status values are unchanged", () => {
    const { onStatusChange, session } = createStatusHarness();
    session.start();
    onStatusChange.mockClear();

    session.fixedUpdate(0.01);
    session.render();
    session.fixedUpdate(0.01);

    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it("emits when player health changes", () => {
    const { onStatusChange, session, state } = createStatusHarness();
    session.start();
    onStatusChange.mockClear();
    addActiveEnemyAtPlayer(state);

    session.fixedUpdate(0.01);

    expect(onStatusChange).toHaveBeenCalledOnce();
    expect(onStatusChange).toHaveBeenLastCalledWith({
      phase: "playing",
      waveNumber: 1,
      currentHealth: 2,
      maximumHealth: 3,
      killCount: 0,
    });
  });

  it("emits when kill count changes", () => {
    const { onStatusChange, session, state } = createStatusHarness();
    session.start();
    onStatusChange.mockClear();
    addActiveEnemyAtPlayer(state);
    state.enemies[0]!.currentHealth = 0;

    session.fixedUpdate(0.01);

    expect(onStatusChange).toHaveBeenCalledOnce();
    expect(onStatusChange).toHaveBeenLastCalledWith({
      phase: "playing",
      waveNumber: 1,
      currentHealth: 3,
      maximumHealth: 3,
      killCount: 1,
    });
  });

  it("represents finite-wave phases through the shared status type", () => {
    const { onStatusChange, session, state, statuses } = createStatusHarness();
    session.start();
    onStatusChange.mockClear();
    statuses.length = 0;
    state.waveSchedule.nextScheduledSpawnIndex =
      state.waveSchedule.requests.length;

    session.fixedUpdate(0.01);
    expect(session.phase).toBe("choosing-upgrade");
    expect(session.chooseUpgrade(session.pendingUpgradeOptionIds[0]!)).toBe(
      true,
    );

    expect(statuses.map((status) => status.phase)).toEqual([
      "choosing-upgrade",
      "playing",
    ]);
    expect(statuses.map((status) => status.waveNumber)).toEqual([1, 2]);
    expect(statuses.every(Object.isFrozen)).toBe(true);
  });

  it("emits lost once and a fresh initial status after restart", () => {
    const { onStatusChange, session, state } = createStatusHarness();
    session.start();
    onStatusChange.mockClear();
    state.player.currentHealth = 1;
    addActiveEnemyAtPlayer(state);

    session.fixedUpdate(0.01);
    session.fixedUpdate(1);
    session.render();

    expect(onStatusChange).toHaveBeenCalledOnce();
    expect(onStatusChange).toHaveBeenLastCalledWith({
      phase: "lost",
      waveNumber: 1,
      currentHealth: 0,
      maximumHealth: 3,
      killCount: 0,
    });

    session.restart();

    expect(onStatusChange).toHaveBeenCalledTimes(2);
    expect(onStatusChange).toHaveBeenLastCalledWith({
      phase: "playing",
      waveNumber: 1,
      currentHealth: 3,
      maximumHealth: 3,
      killCount: 0,
    });
  });

  it("remains safe when the optional callback is absent", () => {
    const session = new GameRuntimeSession(
      createInitialRuntimeState(),
      new ZeroMovementInput(),
      null,
      new SeededRandomSource(1),
      new SeededRandomSource(2),
    );

    expect(() => {
      session.start();
      session.fixedUpdate(0.01);
      session.pause();
      session.resume();
      session.restart();
      session.destroy();
    }).not.toThrow();
  });
});

describe("GameRuntimeSession combat render snapshot", () => {
  it("copies health and combat values into an immutable snapshot", () => {
    const state = createInitialRuntimeState();
    state.player.currentHealth = 2;
    state.killCount = 4;
    const snapshots: GameRenderSnapshot[] = [];
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const session = new GameRuntimeSession(
      state,
      new ZeroMovementInput(),
      presentation,
      new SeededRandomSource(1),
      new SeededRandomSource(2),
    );

    session.render();

    const snapshot = snapshots[0];
    expect(snapshot).toMatchObject({
      phase: "idle",
      playerCurrentHealth: 2,
      playerMaximumHealth: 3,
      isPlayerInvulnerable: false,
      killCount: 4,
      projectiles: [],
    });
    expect(Object.isFrozen(snapshot)).toBe(true);

    state.player.currentHealth = 1;
    state.killCount = 5;

    expect(snapshot).toMatchObject({
      playerCurrentHealth: 2,
      playerMaximumHealth: 3,
      killCount: 4,
    });
  });
});
