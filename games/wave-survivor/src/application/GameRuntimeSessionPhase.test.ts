import { describe, expect, it, vi } from "vitest";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import type { RandomSource } from "../domain/RandomSource.js";
import { createBasicEnemyState } from "../domain/enemies/index.js";
import {
  ZERO_MOVEMENT_INTENT,
  createMovementIntent,
  type MovementIntent,
} from "../domain/movement/index.js";
import { createBasicProjectileState } from "../domain/projectiles/index.js";
import {
  createInitialRuntimeState,
  type RuntimeState,
} from "../domain/state/index.js";
import { createRunUpgradeState } from "../domain/upgrades/index.js";
import {
  createWaveScheduleProgress,
  getProvisionalEpic5WaveDefinition,
} from "../domain/waves/index.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

class TrackingMovementInput implements MovementInputPort {
  readCount = 0;
  resetCount = 0;

  constructor(
    private readonly movementIntent: MovementIntent = createMovementIntent(
      1,
      0,
    ),
  ) {}

  readMovementIntent() {
    this.readCount += 1;
    return this.movementIntent;
  }

  reset(): void {
    this.resetCount += 1;
  }

  destroy(): void {}
}

class TrackingRandomSource implements RandomSource {
  nextFloatCount = 0;
  resetCount = 0;
  private readonly source: SeededRandomSource;

  constructor(seed: number) {
    this.source = new SeededRandomSource(seed);
  }

  nextFloat(minInclusive: number, maxExclusive: number): number {
    this.nextFloatCount += 1;
    return this.source.nextFloat(minInclusive, maxExclusive);
  }

  reset(): void {
    this.resetCount += 1;
    this.source.reset();
  }
}

function createHarness(
  spawnRandomSource: RandomSource = new SeededRandomSource(1),
  upgradeRandomSource: RandomSource = new SeededRandomSource(2),
) {
  const state = createInitialRuntimeState();
  const input = new TrackingMovementInput();
  const session = new GameRuntimeSession(
    state,
    input,
    null,
    spawnRandomSource,
    upgradeRandomSource,
  );

  return { input, session, state };
}

function exhaustWaveSchedule(state: RuntimeState): void {
  state.waveSchedule.nextScheduledSpawnIndex =
    state.waveSchedule.requests.length;
}

function readOwnedRuntimeState(session: GameRuntimeSession): RuntimeState {
  return (session as unknown as { readonly state: RuntimeState }).state;
}

describe("GameRuntimeSession phase transitions", () => {
  it("follows every guarded finite-wave transition", () => {
    const { input, session, state } = createHarness();

    expect(session.start()).toBe(true);
    expect(state.phase).toBe("playing");

    expect(session.pause()).toBe(true);
    expect(state.phase).toBe("paused");
    expect(state.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.resetCount).toBe(1);

    expect(session.resume()).toBe(true);
    expect(state.phase).toBe("playing");

    exhaustWaveSchedule(state);
    session.fixedUpdate(0.01);
    expect(state.phase).toBe("choosing-upgrade");
    expect(state.pendingUpgradeOptionIds).toHaveLength(3);
    expect(state.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.resetCount).toBe(2);

    expect(session.chooseUpgrade(state.pendingUpgradeOptionIds[0]!)).toBe(true);
    expect(state.phase).toBe("playing");

    state.player.currentHealth = 0;
    session.fixedUpdate(0.01);
    expect(state.phase).toBe("lost");
    expect(state.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.resetCount).toBe(4);

    session.restart();
    expect(session.phase).toBe("playing");
    expect(input.resetCount).toBe(5);
  });

  it("rejects lifecycle and upgrade transitions from the wrong phases", () => {
    const { session, state } = createHarness();

    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.chooseUpgrade("vitality")).toBe(false);

    expect(session.start()).toBe(true);
    expect(session.start()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.chooseUpgrade("vitality")).toBe(false);

    expect(session.pause()).toBe(true);
    expect(session.pause()).toBe(false);
    expect(session.start()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.chooseUpgrade("vitality")).toBe(false);

    expect(session.resume()).toBe(true);
    state.phase = "wave-cleared";
    expect(state.phase).toBe("wave-cleared");
    expect(session.start()).toBe(false);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.chooseUpgrade("vitality")).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);

    state.pendingUpgradeOptionIds = Object.freeze(["vitality"]);
    expect(session.beginUpgradeSelection()).toBe(true);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.start()).toBe(false);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);

    expect(session.chooseUpgrade("vitality")).toBe(true);
    state.player.currentHealth = 0;
    session.fixedUpdate(0.01);
    expect(state.phase).toBe("lost");
    expect(session.start()).toBe(false);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.chooseUpgrade("vitality")).toBe(false);
  });

  it("generates one option set, enters choosing-upgrade, and freezes progress", () => {
    const { input, session, state } = createHarness();
    session.start();
    exhaustWaveSchedule(state);

    session.fixedUpdate(0.01);
    const pendingOptions = session.pendingUpgradeOptionIds;
    const choosingState = structuredClone(state);
    session.fixedUpdate(1);
    session.fixedUpdate(1);

    expect(state.phase).toBe("choosing-upgrade");
    expect(state).toEqual(choosingState);
    expect(session.pendingUpgradeOptionIds).toBe(pendingOptions);
    expect(Object.isFrozen(pendingOptions)).toBe(true);
    expect(input.resetCount).toBe(1);
  });

  it("cleans the completed wave and freezes every gameplay authority until a valid choice", () => {
    const spawnRandomSource = new TrackingRandomSource(31);
    const upgradeRandomSource = new TrackingRandomSource(32);
    const input = new TrackingMovementInput(ZERO_MOVEMENT_INTENT);
    const presentation = {
      destroy: vi.fn(),
      render: vi.fn(),
      setTheme: vi.fn(),
    };
    const state = createInitialRuntimeState();
    state.phase = "playing";
    state.simulationTimeSeconds = 10;
    state.player.position = { x: 140, y: 260 };
    state.player.currentHealth = 2;
    state.player.invulnerableUntilSeconds = 14;
    state.upgrades = createRunUpgradeState({ "rapid-fire": 1 });
    state.killCount = 7;
    state.nextEnemyId = 12;
    state.nextProjectileId = 9;
    state.nextAttackAtSeconds = 42;
    state.waveSchedule.elapsedSeconds = 3;
    exhaustWaveSchedule(state);
    const dyingEnemy = createBasicEnemyState(11, { x: 80, y: 120 });
    dyingEnemy.phase = "dying";
    dyingEnemy.currentHealth = 0;
    dyingEnemy.removeAtSimulationSeconds = 20;
    state.enemies.push(dyingEnemy);
    state.projectiles.push(
      createBasicProjectileState(
        8,
        state.player.position,
        { x: 300, y: 260 },
        state.simulationTimeSeconds,
      ),
    );
    const session = new GameRuntimeSession(
      state,
      input,
      presentation,
      spawnRandomSource,
      upgradeRandomSource,
    );

    session.fixedUpdate(0.25);

    expect(state).toMatchObject({
      phase: "choosing-upgrade",
      simulationTimeSeconds: 10.25,
      movementIntent: ZERO_MOVEMENT_INTENT,
      player: {
        position: { x: 140, y: 260 },
        currentHealth: 2,
        invulnerableUntilSeconds: 14,
      },
      killCount: 7,
      nextEnemyId: 12,
      nextProjectileId: 9,
      nextAttackAtSeconds: 42,
    });
    expect(state.upgrades.levels["rapid-fire"]).toBe(1);
    expect(state.waveSchedule).toMatchObject({
      currentWaveNumber: 1,
      elapsedSeconds: 3.25,
      nextScheduledSpawnIndex: state.waveSchedule.requests.length,
    });
    expect(state.enemies).toEqual([]);
    expect(state.projectiles).toEqual([]);
    expect(input.readCount).toBe(1);
    expect(input.resetCount).toBe(1);
    expect(spawnRandomSource.nextFloatCount).toBe(0);
    expect(upgradeRandomSource.nextFloatCount).toBe(2);

    const pendingOptions = state.pendingUpgradeOptionIds;
    const frozenState = structuredClone(state);
    const frozenSpawnRandomCount = spawnRandomSource.nextFloatCount;
    const frozenUpgradeRandomCount = upgradeRandomSource.nextFloatCount;

    session.fixedUpdate(1);
    session.fixedUpdate(1);
    session.render();
    session.render();
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.chooseUpgrade("unknown")).toBe(false);

    expect(state).toEqual(frozenState);
    expect(state.pendingUpgradeOptionIds).toBe(pendingOptions);
    expect(input.readCount).toBe(1);
    expect(input.resetCount).toBe(1);
    expect(spawnRandomSource.nextFloatCount).toBe(frozenSpawnRandomCount);
    expect(upgradeRandomSource.nextFloatCount).toBe(frozenUpgradeRandomCount);
    expect(presentation.render).toHaveBeenCalledTimes(2);
    expect(presentation.render).toHaveBeenLastCalledWith(
      expect.objectContaining({
        phase: "choosing-upgrade",
        simulationTimeSeconds: 10.25,
        enemies: [],
        projectiles: [],
      }),
    );

    expect(session.chooseUpgrade("rapid-fire")).toBe(true);
    expect(state).toMatchObject({
      phase: "playing",
      simulationTimeSeconds: 10.25,
      player: {
        position: { x: 140, y: 260 },
        currentHealth: 2,
        invulnerableUntilSeconds: 14,
      },
      pendingUpgradeOptionIds: [],
      killCount: 7,
      nextEnemyId: 12,
      nextProjectileId: 9,
      nextAttackAtSeconds: 0,
      waveSchedule: {
        currentWaveNumber: 2,
        elapsedSeconds: 0,
        nextScheduledSpawnIndex: 0,
      },
    });
    expect(state.upgrades.levels["rapid-fire"]).toBe(2);
    expect(input.resetCount).toBe(2);
    expect(spawnRandomSource.nextFloatCount).toBe(frozenSpawnRandomCount);
    expect(upgradeRandomSource.nextFloatCount).toBe(frozenUpgradeRandomCount);
  });

  it("restart from upgrade choice recreates the complete fresh-run state", () => {
    const spawnRandomSource = new TrackingRandomSource(41);
    const upgradeRandomSource = new TrackingRandomSource(42);
    const { session, state } = createHarness(
      spawnRandomSource,
      upgradeRandomSource,
    );
    session.start();
    state.simulationTimeSeconds = 9;
    state.player.currentHealth = 1;
    state.killCount = 4;
    state.nextEnemyId = 8;
    state.nextProjectileId = 6;
    state.nextAttackAtSeconds = 11;
    state.upgrades = createRunUpgradeState({ vitality: 2 });
    exhaustWaveSchedule(state);
    session.fixedUpdate(0.01);
    expect(state.phase).toBe("choosing-upgrade");

    session.restart();

    const expected = createInitialRuntimeState();
    expected.phase = "playing";
    expect(readOwnedRuntimeState(session)).toEqual(expected);
    expect(spawnRandomSource.resetCount).toBe(1);
    expect(upgradeRandomSource.resetCount).toBe(1);
  });

  it("publishes a recoverable wave-cleared stop when the final enemy falls with all upgrades capped", () => {
    const state = createInitialRuntimeState();
    state.upgrades = createRunUpgradeState({
      "rapid-fire": 5,
      "swift-movement": 5,
      vitality: 5,
    });
    state.waveSchedule = createWaveScheduleProgress(
      16,
      getProvisionalEpic5WaveDefinition(16),
    );
    exhaustWaveSchedule(state);
    const enemy = createBasicEnemyState(1, state.player.position);
    enemy.phase = "active";
    state.enemies.push(enemy);
    state.projectiles.push(
      createBasicProjectileState(
        1,
        state.player.position,
        { x: 200, y: 320 },
        0,
      ),
    );
    state.nextAttackAtSeconds = 100;
    const spawnRandom = new TrackingRandomSource(1);
    const upgradeRandom = new TrackingRandomSource(2);
    const statuses = vi.fn();
    const events = vi.fn();
    const session = new GameRuntimeSession(
      state,
      new TrackingMovementInput(ZERO_MOVEMENT_INTENT),
      null,
      spawnRandom,
      upgradeRandom,
      null,
      statuses,
      events,
    );
    session.start();

    session.fixedUpdate(0.01);

    expect(state.phase).toBe("wave-cleared");
    expect(state.killCount).toBe(1);
    expect(state.enemies).toEqual([]);
    expect(state.projectiles).toEqual([]);
    expect(state.pendingUpgradeOptionIds).toEqual([]);
    expect(statuses).toHaveBeenLastCalledWith({
      phase: "wave-cleared",
      waveNumber: 16,
      currentHealth: 3,
      maximumHealth: 8,
      killCount: 1,
    });
    expect(events.mock.calls.map(([event]) => event.type)).toEqual([
      "wave-started",
      "wave-cleared",
    ]);
    const stopped = structuredClone(state);
    statuses.mockClear();
    events.mockClear();
    session.fixedUpdate(10);
    session.fixedUpdate(10);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.chooseUpgrade("vitality")).toBe(false);
    expect(state).toEqual(stopped);
    expect(statuses).not.toHaveBeenCalled();
    expect(events).not.toHaveBeenCalled();
    expect(spawnRandom.nextFloatCount).toBe(0);
    expect(upgradeRandom.nextFloatCount).toBe(0);

    session.restart();

    expect(readOwnedRuntimeState(session)).toEqual({
      ...createInitialRuntimeState(),
      phase: "playing",
    });
    expect(spawnRandom.resetCount).toBe(1);
    expect(upgradeRandom.resetCount).toBe(1);
    expect(events).toHaveBeenLastCalledWith({
      type: "wave-started",
      waveNumber: 1,
    });
  });

  it("does not reroll options during repeated reads, rendering, or status work", () => {
    const upgradeRandomSource = new TrackingRandomSource(9);
    const state = createInitialRuntimeState();
    const statuses = vi.fn();
    const session = new GameRuntimeSession(
      state,
      new TrackingMovementInput(),
      { render: vi.fn(), setTheme: vi.fn(), destroy: vi.fn() },
      new TrackingRandomSource(8),
      upgradeRandomSource,
      null,
      statuses,
    );
    session.start();
    exhaustWaveSchedule(state);

    session.fixedUpdate(0.01);
    const options = session.pendingUpgradeOptionIds;
    session.render();
    session.render();
    session.fixedUpdate(1);

    expect(options).toHaveLength(3);
    expect(session.pendingUpgradeOptionIds).toBe(options);
    expect(upgradeRandomSource.nextFloatCount).toBe(2);
    expect(statuses).toHaveBeenCalledTimes(3);
  });

  it("keeps spawn-random consumption independent from upgrade choices", () => {
    const firstSpawnRandom = new TrackingRandomSource(3);
    const secondSpawnRandom = new TrackingRandomSource(3);
    const first = createHarness(firstSpawnRandom, new SeededRandomSource(17));
    const second = createHarness(secondSpawnRandom, new SeededRandomSource(17));
    first.session.start();
    second.session.start();

    for (let index = 0; index < 12; index += 1) {
      firstSpawnRandom.nextFloat(0, 1);
    }
    exhaustWaveSchedule(first.state);
    exhaustWaveSchedule(second.state);
    first.session.fixedUpdate(0.01);
    second.session.fixedUpdate(0.01);

    expect(first.session.pendingUpgradeOptionIds).toEqual(
      second.session.pendingUpgradeOptionIds,
    );
    expect(firstSpawnRandom.nextFloatCount).toBe(12);
    expect(secondSpawnRandom.nextFloatCount).toBe(0);
  });

  it("restart resets both random streams and restores the original options", () => {
    const spawnRandomSource = new TrackingRandomSource(4);
    const upgradeRandomSource = new TrackingRandomSource(5);
    const { session, state } = createHarness(
      spawnRandomSource,
      upgradeRandomSource,
    );
    session.start();
    exhaustWaveSchedule(state);
    session.fixedUpdate(0.01);
    const firstOptions = [...session.pendingUpgradeOptionIds];

    session.restart();

    const restartedState = readOwnedRuntimeState(session);
    expect(restartedState.pendingUpgradeOptionIds).toEqual([]);
    expect(spawnRandomSource.resetCount).toBe(1);
    expect(upgradeRandomSource.resetCount).toBe(1);
    exhaustWaveSchedule(restartedState);
    session.fixedUpdate(0.01);
    expect(session.pendingUpgradeOptionIds).toEqual(firstOptions);
  });
});
