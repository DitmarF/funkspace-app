import { describe, expect, it } from "vitest";
import type { GameEvent } from "../GameEvent.js";
import { createInitialRuntimeState } from "../domain/state/index.js";
import {
  countEnemiesOccupyingWaveCapacity,
  PROVISIONAL_RUN_DEFINITION,
} from "../domain/waves/index.js";
import { ZeroMovementInput } from "../infrastructure/input/ZeroMovementInput.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

function createHarness() {
  const state = createInitialRuntimeState();
  const events: GameEvent[] = [];
  const session = new GameRuntimeSession(
    state,
    new ZeroMovementInput(),
    null,
    new SeededRandomSource(1),
    new SeededRandomSource(2),
    null,
    null,
    (event) => events.push(event),
  );
  session.start();
  return { state, events, session };
}

describe("provisional normal-run integration", () => {
  it("enforces the configured caps and records four stationary-player wave clears", () => {
    const { state, events, session } = createHarness();
    const clearSeconds: number[] = [];

    for (
      let waveIndex = 0;
      waveIndex < PROVISIONAL_RUN_DEFINITION.normalWaves.length;
      waveIndex += 1
    ) {
      const startedAt = state.simulationTimeSeconds;
      // Safety bound for the test, never a gameplay completion timer.
      // Real spawns/combat, unmodified health, no injected kills or queue skips.
      for (
        let step = 0;
        step < 60 * 60 && session.phase === "playing";
        step += 1
      ) {
        session.fixedUpdate(1 / 60);
        const live = countEnemiesOccupyingWaveCapacity(state.enemies);
        expect(live).toBeLessThanOrEqual(state.waveSchedule!.maxActiveEnemies);
      }
      expect(session.phase).toBe("choosing-upgrade");
      expect(state.waveSchedule!.nextScheduledSpawnIndex).toBe(
        state.waveSchedule!.requests.length,
      );
      expect(state.enemies).toEqual([]);
      expect(state.projectiles).toEqual([]);
      clearSeconds.push(state.simulationTimeSeconds - startedAt);
      const frozen = structuredClone(state);
      session.fixedUpdate(30);
      expect(state).toEqual(frozen);
      if (waveIndex < PROVISIONAL_RUN_DEFINITION.normalWaves.length - 1) {
        expect(session.chooseUpgrade("rapid-fire")).toBe(true);
      }
    }

    expect(clearSeconds.map((seconds) => Number(seconds.toFixed(2)))).toEqual([
      6.95, 8.58, 10.48, 11.88,
    ]);
    expect(session.phase).toBe("choosing-upgrade");
    expect(state.waveSchedule!.currentWaveNumber).toBe(4);
    expect(state.simulationTimeSeconds).toBeCloseTo(37.9, 5);
    expect(state.killCount).toBe(28);
    expect(state.player.currentHealth).toBe(2);
    expect(
      events.filter((event) => event.type === "upgrade-choice-requested"),
    ).toHaveLength(4);
    const frozen = structuredClone(state);
    session.fixedUpdate(30);
    expect(state).toEqual(frozen);
    session.destroy();
  });

  it("retains four upgrade opportunities and enters the single boss", () => {
    const { state, events, session } = createHarness();
    for (const [
      index,
      wave,
    ] of PROVISIONAL_RUN_DEFINITION.normalWaves.entries()) {
      expect(state.waveSchedule!.currentWaveNumber).toBe(index + 1);
      expect(state.waveSchedule!.requests).toHaveLength(
        wave.groups.reduce((count, group) => count + group.count, 0),
      );
      // A completed-queue transition fixture, not gameplay or pacing evidence.
      state.waveSchedule!.nextScheduledSpawnIndex =
        state.waveSchedule!.requests.length;
      session.fixedUpdate(1 / 60);
      expect(session.phase).toBe("choosing-upgrade");
      expect(state.pendingUpgradeOptionIds).toHaveLength(3);
      expect(session.chooseUpgrade("rapid-fire")).toBe(true);
    }
    expect(
      events
        .filter((event) => event.type === "upgrade-choice-requested")
        .map((event) => event.clearedWaveNumber),
    ).toEqual([1, 2, 3, 4]);
    expect(state.upgrades.levels["rapid-fire"]).toBe(4);
    expect(session.phase).toBe("playing");
    expect(state.waveSchedule).toBeNull();
    expect(state.enemies).toMatchObject([
      { kind: "charger", phase: "entering" },
    ]);
    expect(events.at(-1)).toEqual({
      type: "wave-started",
      waveNumber: 5,
      encounterKind: "boss",
    });
    session.destroy();
  });
});
