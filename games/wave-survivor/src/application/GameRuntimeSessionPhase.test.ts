import { describe, expect, it } from "vitest";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
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

function createHarness() {
  const state = createInitialRuntimeState();
  const input = new TrackingMovementInput();
  const session = new GameRuntimeSession(
    state,
    input,
    null,
    new SeededRandomSource(1),
  );

  return { input, session, state };
}

function exhaustWaveSchedule(state: RuntimeState): void {
  state.waveSchedule.nextScheduledSpawnIndex =
    state.waveSchedule.requests.length;
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
    expect(state.phase).toBe("wave-cleared");
    expect(state.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.resetCount).toBe(2);

    expect(session.beginUpgradeSelection()).toBe(true);
    expect(state.phase).toBe("choosing-upgrade");
    expect(state.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.resetCount).toBe(3);

    expect(session.completeUpgradeSelection()).toBe(true);
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
    exhaustWaveSchedule(state);
    session.fixedUpdate(0.01);
    expect(state.phase).toBe("wave-cleared");
    expect(session.start()).toBe(false);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.completeUpgradeSelection()).toBe(false);

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

  it("enters wave-cleared once and freezes deterministic progress", () => {
    const { input, session, state } = createHarness();
    session.start();
    exhaustWaveSchedule(state);

    session.fixedUpdate(0.01);
    const clearedState = structuredClone(state);
    session.fixedUpdate(1);
    session.fixedUpdate(1);

    expect(state.phase).toBe("wave-cleared");
    expect(state).toEqual(clearedState);
    expect(input.resetCount).toBe(1);
  });
});
