import { describe, expect, it, vi } from "vitest";
import type { GameEvent } from "../GameEvent.js";
import {
  createInitialRuntimeState,
  type RuntimeState,
} from "../domain/state/index.js";
import {
  getUpgradeDefinition,
  INITIAL_UPGRADE_DEFINITIONS,
} from "../domain/upgrades/index.js";
import { ZeroMovementInput } from "../infrastructure/input/ZeroMovementInput.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

function createEventHarness() {
  const state = createInitialRuntimeState();
  const events: GameEvent[] = [];
  const onEvent = vi.fn((event: GameEvent) => {
    events.push(event);
  });
  const session = new GameRuntimeSession(
    state,
    new ZeroMovementInput(),
    null,
    new SeededRandomSource(1),
    new SeededRandomSource(2),
    null,
    null,
    onEvent,
  );

  return { events, onEvent, session, state };
}

function exhaustWaveSchedule(state: RuntimeState): void {
  state.waveSchedule.nextScheduledSpawnIndex =
    state.waveSchedule.requests.length;
}

function clearCurrentWave(
  session: GameRuntimeSession,
  state: RuntimeState,
): void {
  exhaustWaveSchedule(state);
  session.fixedUpdate(0.01);
}

describe("GameRuntimeSession public events", () => {
  it("emits one frozen wave-started event for start and each restart", () => {
    const { events, onEvent, session } = createEventHarness();

    expect(events).toEqual([]);
    expect(session.start()).toBe(true);
    expect(session.start()).toBe(false);
    expect(events).toEqual([{ type: "wave-started", waveNumber: 1 }]);
    expect(Object.isFrozen(events[0])).toBe(true);

    session.restart();
    session.restart();

    expect(onEvent).toHaveBeenCalledTimes(3);
    expect(events).toEqual([
      { type: "wave-started", waveNumber: 1 },
      { type: "wave-started", waveNumber: 1 },
      { type: "wave-started", waveNumber: 1 },
    ]);
  });

  it("emits wave clear before one immutable copied upgrade choice", () => {
    const { events, session, state } = createEventHarness();
    session.start();

    clearCurrentWave(session, state);

    expect(events.map((event) => event.type)).toEqual([
      "wave-started",
      "wave-cleared",
      "upgrade-choice-requested",
    ]);
    expect(events[1]).toEqual({ type: "wave-cleared", waveNumber: 1 });
    expect(Object.isFrozen(events[1])).toBe(true);

    const choiceEvent = events[2];
    expect(choiceEvent?.type).toBe("upgrade-choice-requested");
    if (choiceEvent?.type !== "upgrade-choice-requested") {
      throw new Error("Expected an upgrade-choice-requested event.");
    }

    expect(choiceEvent.clearedWaveNumber).toBe(1);
    expect(choiceEvent.options.map((option) => option.id)).toEqual(
      session.pendingUpgradeOptionIds,
    );
    expect(Object.isFrozen(choiceEvent)).toBe(true);
    expect(Object.isFrozen(choiceEvent.options)).toBe(true);
    expect(choiceEvent.options.every(Object.isFrozen)).toBe(true);

    for (const option of choiceEvent.options) {
      const definition = getUpgradeDefinition(option.id);
      expect(definition).not.toBeNull();
      expect(option).toEqual({
        id: definition?.id,
        title: definition?.title,
        description: definition?.description,
      });
      expect(option).not.toBe(definition);
      expect("effect" in option).toBe(false);
      expect("maximumLevel" in option).toBe(false);
    }

    expect(() =>
      (choiceEvent.options as Array<(typeof choiceEvent.options)[number]>).push(
        choiceEvent.options[0]!,
      ),
    ).toThrow();
    expect(
      Reflect.set(choiceEvent.options[0]!, "title", "Changed externally"),
    ).toBe(false);
    expect(session.pendingUpgradeOptionIds).toEqual(
      choiceEvent.options.map((option) => option.id),
    );
    expect(
      choiceEvent.options.some((option) =>
        INITIAL_UPGRADE_DEFINITIONS.some((definition) => definition === option),
      ),
    ).toBe(false);
  });

  it("does not re-emit milestones while waiting for a choice", () => {
    const { events, onEvent, session, state } = createEventHarness();
    session.start();
    clearCurrentWave(session, state);
    const originalEvents = [...events];
    onEvent.mockClear();

    session.fixedUpdate(1);
    session.fixedUpdate(1);
    session.render();
    session.render();
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(session.beginUpgradeSelection()).toBe(false);

    expect(onEvent).not.toHaveBeenCalled();
    expect(events).toEqual(originalEvents);
  });

  it("emits the next wave only after one valid pending selection", () => {
    const { events, session, state } = createEventHarness();
    session.start();
    clearCurrentWave(session, state);
    const offeredId = session.pendingUpgradeOptionIds[0]!;

    expect(session.chooseUpgrade("unsupported")).toBe(false);
    expect(session.chooseUpgrade(offeredId)).toBe(true);
    expect(session.chooseUpgrade(offeredId)).toBe(false);

    expect(events.at(-1)).toEqual({
      type: "wave-started",
      waveNumber: 2,
    });
    expect(
      events.filter((event) => event.type === "wave-started"),
    ).toHaveLength(2);
    expect(
      events.filter((event) => event.type === "wave-cleared"),
    ).toHaveLength(1);
    expect(
      events.filter((event) => event.type === "upgrade-choice-requested"),
    ).toHaveLength(1);
  });

  it("clears the callback reference when destroyed", () => {
    const { events, onEvent, session } = createEventHarness();
    session.destroy();
    onEvent.mockClear();

    session.start();
    session.restart();
    session.fixedUpdate(1);

    expect(onEvent).not.toHaveBeenCalled();
    expect(events).toEqual([]);
  });
});
