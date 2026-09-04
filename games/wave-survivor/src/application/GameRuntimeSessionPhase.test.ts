import { describe, expect, it, vi } from "vitest";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import type { RandomSource } from "../domain/RandomSource.js";
import {
  ZERO_MOVEMENT_INTENT,
  createMovementIntent,
} from "../domain/movement/index.js";
import {
  createInitialRuntimeState,
  type RuntimeState,
} from "../domain/state/index.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

class TrackingMovementInput implements MovementInputPort {
  resetCount = 0;

  readMovementIntent() {
    return createMovementIntent(1, 0);
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

    expect(session.completeUpgradeSelection()).toBe(true);
    expect(state.phase).toBe("playing");

    state.player.currentHealth = 0;
    session.fixedUpdate(0.01);
    expect(state.phase).toBe("lost");
    expect(state.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.resetCount).toBe(3);

    session.restart();
    expect(session.phase).toBe("playing");
    expect(input.resetCount).toBe(4);
  });

  it("rejects lifecycle and upgrade transitions from the wrong phases", () => {
    const { session, state } = createHarness();

    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.completeUpgradeSelection()).toBe(false);

    expect(session.start()).toBe(true);
    expect(session.start()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.completeUpgradeSelection()).toBe(false);

    expect(session.pause()).toBe(true);
    expect(session.pause()).toBe(false);
    expect(session.start()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.completeUpgradeSelection()).toBe(false);

    expect(session.resume()).toBe(true);
    state.phase = "wave-cleared";
    expect(state.phase).toBe("wave-cleared");
    expect(session.start()).toBe(false);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.completeUpgradeSelection()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);

    state.pendingUpgradeOptionIds = Object.freeze(["vitality"]);
    expect(session.beginUpgradeSelection()).toBe(true);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.start()).toBe(false);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);

    expect(session.completeUpgradeSelection()).toBe(true);
    state.player.currentHealth = 0;
    session.fixedUpdate(0.01);
    expect(state.phase).toBe("lost");
    expect(session.start()).toBe(false);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);
    expect(session.completeUpgradeSelection()).toBe(false);
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
