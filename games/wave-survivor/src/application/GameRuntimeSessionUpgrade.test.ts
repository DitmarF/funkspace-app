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
import {
  createInitialRunUpgradeState,
  createRunUpgradeState,
  getEffectiveMaximumHealth,
  type UpgradeId,
} from "../domain/upgrades/index.js";
import {
  compileWaveSchedule,
  createWaveScheduleProgress,
  getProvisionalEpic5WaveDefinition,
  PROVISIONAL_EPIC_5_WAVES,
} from "../domain/waves/index.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

class TrackingMovementInput implements MovementInputPort {
  resetCount = 0;

  readMovementIntent() {
    return ZERO_MOVEMENT_INTENT;
  }

  reset(): void {
    this.resetCount += 1;
  }

  destroy(): void {}
}

function createChoosingHarness(
  pendingUpgradeOptionIds: readonly UpgradeId[] = ["rapid-fire"],
  currentWaveNumber = 1,
) {
  const state = createInitialRuntimeState();
  state.phase = "choosing-upgrade";
  state.pendingUpgradeOptionIds = Object.freeze([...pendingUpgradeOptionIds]);
  state.waveSchedule = createWaveScheduleProgress(
    currentWaveNumber,
    getProvisionalEpic5WaveDefinition(currentWaveNumber),
  );
  const input = new TrackingMovementInput();
  const session = new GameRuntimeSession(
    state,
    input,
    null,
    new SeededRandomSource(1),
    new SeededRandomSource(2),
  );

  return { input, session, state };
}

function readOwnedRuntimeState(session: GameRuntimeSession): RuntimeState {
  return (session as unknown as { readonly state: RuntimeState }).state;
}

describe("GameRuntimeSession chooseUpgrade", () => {
  it("applies one offered ID and initializes a fresh next wave", () => {
    const { input, session, state } = createChoosingHarness([
      "rapid-fire",
      "vitality",
    ]);
    const originalSchedule = state.waveSchedule;
    state.waveSchedule.elapsedSeconds = 4;
    state.waveSchedule.nextScheduledSpawnIndex = 2;
    state.player.position = { x: 75, y: 125 };
    state.player.currentHealth = 2;
    state.upgrades = createRunUpgradeState({ "swift-movement": 2 });
    state.killCount = 7;
    state.nextAttackAtSeconds = 99;
    state.movementIntent = createMovementIntent(1, 0);

    expect(session.chooseUpgrade("rapid-fire")).toBe(true);

    expect(state.phase).toBe("playing");
    expect(state.upgrades.levels).toEqual({
      "rapid-fire": 1,
      "swift-movement": 2,
      vitality: 0,
    });
    expect(state.pendingUpgradeOptionIds).toEqual([]);
    expect(Object.isFrozen(state.pendingUpgradeOptionIds)).toBe(true);
    expect(state.waveSchedule).not.toBe(originalSchedule);
    expect(state.waveSchedule).toEqual({
      currentWaveNumber: 2,
      maxActiveEnemies: PROVISIONAL_EPIC_5_WAVES[1]!.maxActiveEnemies,
      elapsedSeconds: 0,
      nextScheduledSpawnIndex: 0,
      requests: compileWaveSchedule(PROVISIONAL_EPIC_5_WAVES[1]!),
    });
    expect(state.player.position).toEqual({ x: 75, y: 125 });
    expect(state.player.currentHealth).toBe(2);
    expect(state.killCount).toBe(7);
    expect(state.nextAttackAtSeconds).toBe(0);
    expect(state.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.resetCount).toBe(1);

    const selectedState = structuredClone(state);
    expect(session.chooseUpgrade("rapid-fire")).toBe(false);
    expect(state).toEqual(selectedState);
    expect(input.resetCount).toBe(1);
  });

  it.each([
    ["unknown ID", "unknown", ["rapid-fire"], "choosing-upgrade"],
    ["unoffered ID", "rapid-fire", ["vitality"], "choosing-upgrade"],
    ["wrong phase", "rapid-fire", ["rapid-fire"], "playing"],
  ] as const)(
    "rejects %s without mutating state",
    (_case, upgradeId, pendingIds, phase) => {
      const { input, session, state } = createChoosingHarness(pendingIds);
      state.phase = phase;
      const snapshot = structuredClone(state);

      expect(session.chooseUpgrade(upgradeId)).toBe(false);
      expect(state).toEqual(snapshot);
      expect(input.resetCount).toBe(0);
    },
  );

  it("rejects an offered upgrade that became capped", () => {
    const { input, session, state } = createChoosingHarness(["rapid-fire"]);
    state.upgrades = createRunUpgradeState({ "rapid-fire": 5 });
    const snapshot = structuredClone(state);

    expect(session.chooseUpgrade("rapid-fire")).toBe(false);

    expect(state).toEqual(snapshot);
    expect(input.resetCount).toBe(0);
  });

  it("does not apply before invalid next-wave progress is rejected", () => {
    const { input, session, state } = createChoosingHarness(["rapid-fire"]);
    state.waveSchedule = createWaveScheduleProgress(
      Number.MAX_SAFE_INTEGER,
      PROVISIONAL_EPIC_5_WAVES[3]!,
    );
    const snapshot = structuredClone(state);

    expect(session.chooseUpgrade("rapid-fire")).toBe(false);

    expect(state).toEqual(snapshot);
    expect(input.resetCount).toBe(0);
  });

  it("rejects a stale ID from an earlier choice", () => {
    const { session, state } = createChoosingHarness([
      "vitality",
      "rapid-fire",
    ]);
    expect(session.chooseUpgrade("vitality")).toBe(true);
    state.phase = "choosing-upgrade";
    state.pendingUpgradeOptionIds = Object.freeze(["rapid-fire"]);
    const snapshot = structuredClone(state);

    expect(session.chooseUpgrade("vitality")).toBe(false);
    expect(state).toEqual(snapshot);
  });

  it("applies vitality healing and preserves unrelated run progress", () => {
    const { session, state } = createChoosingHarness(["vitality"]);
    state.player.currentHealth = 1;
    state.player.position = { x: 99, y: 201 };
    state.killCount = 12;

    expect(session.chooseUpgrade("vitality")).toBe(true);

    expect(state.player.currentHealth).toBe(2);
    expect(
      getEffectiveMaximumHealth(state.player.maximumHealth, state.upgrades),
    ).toBe(4);
    expect(state.player.position).toEqual({ x: 99, y: 201 });
    expect(state.killCount).toBe(12);
    expect(state.upgrades.levels).toEqual({
      "rapid-fire": 0,
      "swift-movement": 0,
      vitality: 1,
    });
  });

  it("reuses Wave 4 while later displayed wave numbers keep increasing", () => {
    const { session, state } = createChoosingHarness(["swift-movement"], 4);

    expect(session.chooseUpgrade("swift-movement")).toBe(true);
    expect(state.waveSchedule.currentWaveNumber).toBe(5);
    expect(state.waveSchedule.requests).toEqual(
      compileWaveSchedule(PROVISIONAL_EPIC_5_WAVES[3]!),
    );

    state.phase = "choosing-upgrade";
    state.pendingUpgradeOptionIds = Object.freeze(["rapid-fire"]);
    expect(session.chooseUpgrade("rapid-fire")).toBe(true);
    expect(state.waveSchedule.currentWaveNumber).toBe(6);
    expect(state.waveSchedule.requests).toEqual(
      compileWaveSchedule(PROVISIONAL_EPIC_5_WAVES[3]!),
    );
  });

  it("produces equal next-wave state from equal deterministic state", () => {
    const first = createChoosingHarness(["swift-movement"], 3);
    const second = createChoosingHarness(["swift-movement"], 3);

    expect(first.session.chooseUpgrade("swift-movement")).toBe(true);
    expect(second.session.chooseUpgrade("swift-movement")).toBe(true);

    expect(first.state).toEqual(second.state);
  });

  it("restart clears accumulated upgrades and makes old options stale", () => {
    const { session } = createChoosingHarness(["rapid-fire"]);
    expect(session.chooseUpgrade("rapid-fire")).toBe(true);

    session.restart();

    const restartedState = readOwnedRuntimeState(session);
    expect(restartedState.phase).toBe("playing");
    expect(restartedState.upgrades).toEqual(createInitialRunUpgradeState());
    expect(restartedState.pendingUpgradeOptionIds).toEqual([]);
    expect(restartedState.waveSchedule.currentWaveNumber).toBe(1);
    expect(session.chooseUpgrade("rapid-fire")).toBe(false);
  });

  it("rejects selection after session destruction", () => {
    const { session, state } = createChoosingHarness(["rapid-fire"]);
    session.destroy();
    const destroyedState = structuredClone(state);

    expect(session.chooseUpgrade("rapid-fire")).toBe(false);
    expect(state).toEqual(destroyedState);
  });
});
