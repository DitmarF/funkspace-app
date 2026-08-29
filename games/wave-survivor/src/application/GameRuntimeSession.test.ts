import { describe, expect, it } from "vitest";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import type { RandomSource } from "../domain/RandomSource.js";
import { VISIBLE_ARENA_BOUNDS } from "../domain/arena/index.js";
import {
  BASIC_ENEMY_DEFINITION,
  createBasicEnemyState,
} from "../domain/enemies/index.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../domain/movement/index.js";
import {
  calculateEnemySpawnOffset,
  ENTRY_LEAD_SECONDS,
  expandBoundsByOffset,
  FIRST_SPAWN_DELAY_SECONDS,
  MAX_LIVE_ENEMIES,
  MAX_SPAWN_ATTEMPTS,
  SPAWN_INTERVAL_SECONDS,
} from "../domain/spawning/index.js";
import {
  createInitialRuntimeState,
  type RuntimeState,
} from "../domain/state/index.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

const SPAWN_BOUNDS = expandBoundsByOffset(
  VISIBLE_ARENA_BOUNDS,
  calculateEnemySpawnOffset(
    BASIC_ENEMY_DEFINITION.collisionRadius,
    BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
    ENTRY_LEAD_SECONDS,
  ),
);
const TOP_CENTER_DISTANCE = SPAWN_BOUNDS.width / 2;
const BOTTOM_CENTER_DISTANCE =
  SPAWN_BOUNDS.width + SPAWN_BOUNDS.height + SPAWN_BOUNDS.width / 2;

class ControlledMovementInput implements MovementInputPort {
  movementIntent: MovementIntent = ZERO_MOVEMENT_INTENT;

  readMovementIntent(): MovementIntent {
    return this.movementIntent;
  }

  reset(): void {
    this.movementIntent = ZERO_MOVEMENT_INTENT;
  }

  destroy(): void {
    this.reset();
  }
}

class SequenceRandomSource implements RandomSource {
  readonly calls: Array<readonly [number, number]> = [];
  resetCount = 0;
  private index = 0;

  constructor(private readonly values: readonly number[]) {}

  nextFloat(minInclusive: number, maxExclusive: number): number {
    this.calls.push([minInclusive, maxExclusive]);
    const value = this.values[Math.min(this.index, this.values.length - 1)];
    this.index += 1;

    if (value === undefined || value < minInclusive || value >= maxExclusive) {
      throw new RangeError(
        "Controlled random value is outside the requested range.",
      );
    }

    return value;
  }

  reset(): void {
    this.index = 0;
    this.resetCount += 1;
  }
}

function createSession(
  state: RuntimeState,
  randomSource: RandomSource,
  input = new ControlledMovementInput(),
) {
  const session = new GameRuntimeSession(state, input, null, randomSource);
  session.start();

  return { input, session };
}

describe("GameRuntimeSession enemy spawning and pursuit", () => {
  it("moves the player before validating a due candidate", () => {
    const state = createInitialRuntimeState();
    state.player.position = { x: 180, y: 100 };
    const randomSource = new SequenceRandomSource([TOP_CENTER_DISTANCE]);
    const { input, session } = createSession(state, randomSource);
    input.movementIntent = createMovementIntent(0, -1);

    session.fixedUpdate(FIRST_SPAWN_DELAY_SECONDS);

    expect(state.player.position).toEqual({ x: 180, y: 40 });
    expect(state.enemies).toEqual([]);
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS);
  });

  it("advances the schedule after failed bounded attempts", () => {
    const state = createInitialRuntimeState();
    state.player.position = { x: 180, y: 12 };
    const randomSource = new SequenceRandomSource([
      ...Array.from({ length: MAX_SPAWN_ATTEMPTS }, () => TOP_CENTER_DISTANCE),
      BOTTOM_CENTER_DISTANCE,
    ]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(FIRST_SPAWN_DELAY_SECONDS);

    expect(state.enemies).toEqual([]);
    expect(state.nextEnemySpawnAtSeconds).toBe(
      FIRST_SPAWN_DELAY_SECONDS + SPAWN_INTERVAL_SECONDS,
    );
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS);

    session.fixedUpdate(SPAWN_INTERVAL_SECONDS - 0.01);
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS);

    session.fixedUpdate(0.01);
    expect(state.enemies).toHaveLength(1);
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS + 1);
  });

  it("counts entering and active enemies toward the live-enemy cap", () => {
    const state = createInitialRuntimeState();
    state.enemies.push(
      createBasicEnemyState(1, { x: -66, y: 100 }),
      createBasicEnemyState(2, { x: -66, y: 200 }),
      createBasicEnemyState(3, { x: -66, y: 300 }),
    );
    state.enemies[1]!.phase = "active";
    state.nextEnemyId = 4;
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(FIRST_SPAWN_DELAY_SECONDS);

    expect(MAX_LIVE_ENEMIES).toBe(3);
    expect(state.enemies).toHaveLength(MAX_LIVE_ENEMIES);
    expect(state.nextEnemyId).toBe(4);
    expect(randomSource.calls).toHaveLength(0);
    expect(state.nextEnemySpawnAtSeconds).toBe(
      FIRST_SPAWN_DELAY_SECONDS + SPAWN_INTERVAL_SECONDS,
    );
  });

  it("adds at most one enemy for a due update without a spawn backlog", () => {
    const state = createInitialRuntimeState();
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(10);

    expect(state.enemies).toHaveLength(1);
    expect(state.nextEnemyId).toBe(2);
    expect(randomSource.calls).toHaveLength(1);
    expect(state.nextEnemySpawnAtSeconds).toBe(10 + SPAWN_INTERVAL_SECONDS);
  });

  it("moves a newly spawned enemy during the same fixed update", () => {
    const state = createInitialRuntimeState();
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(FIRST_SPAWN_DELAY_SECONDS);

    expect(state.enemies).toHaveLength(1);
    expect(state.enemies[0]?.position).toEqual({ x: 180, y: 670 });
    expect(state.enemies[0]?.phase).toBe("entering");
  });

  it("pursues the player's newly updated position", () => {
    const state = createInitialRuntimeState();
    state.player.position = { x: 100, y: 100 };
    state.nextEnemySpawnAtSeconds = 100;
    state.enemies.push(createBasicEnemyState(1, { x: 0, y: 0 }));
    state.nextEnemyId = 2;
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { input, session } = createSession(state, randomSource);
    input.movementIntent = createMovementIntent(1, 0);

    session.fixedUpdate(0.5);

    const targetDistance = Math.hypot(160, 100);
    expect(state.player.position).toEqual({ x: 160, y: 100 });
    expect(state.enemies[0]?.position.x).toBeCloseTo(
      (160 / targetDistance) * 36,
    );
    expect(state.enemies[0]?.position.y).toBeCloseTo(
      (100 / targetDistance) * 36,
    );
  });

  it("activates an entering enemy after pursuit reaches the visible arena", () => {
    const state = createInitialRuntimeState();
    state.player.position = { x: 100, y: 320 };
    state.nextEnemySpawnAtSeconds = 100;
    state.enemies.push(createBasicEnemyState(1, { x: -20, y: 320 }));
    state.nextEnemyId = 2;
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(0.125);

    expect(state.enemies[0]?.position).toEqual({ x: -11, y: 320 });
    expect(state.enemies[0]?.phase).toBe("active");
  });

  it("consumes neither simulation time nor random values while paused", () => {
    const state = createInitialRuntimeState();
    state.enemies.push(createBasicEnemyState(1, { x: 0, y: 0 }));
    state.nextEnemyId = 2;
    const initialEnemyPosition = { ...state.enemies[0]!.position };
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.pause();
    session.fixedUpdate(10);

    expect(state.simulationTimeSeconds).toBe(0);
    expect(state.nextEnemySpawnAtSeconds).toBe(FIRST_SPAWN_DELAY_SECONDS);
    expect(state.enemies[0]?.position).toEqual(initialEnemyPosition);
    expect(state.enemies[0]?.phase).toBe("entering");
    expect(randomSource.calls).toHaveLength(0);
  });

  it("restart resets the random sequence and initial spawn timing", () => {
    const state = createInitialRuntimeState();
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);
    session.fixedUpdate(FIRST_SPAWN_DELAY_SECONDS);
    expect(state.enemies.map((enemy) => enemy.id)).toEqual([1]);
    expect(state.nextEnemyId).toBe(2);

    session.restart();

    expect(randomSource.resetCount).toBe(1);
    session.fixedUpdate(FIRST_SPAWN_DELAY_SECONDS - 0.01);
    expect(randomSource.calls).toHaveLength(1);
    session.fixedUpdate(0.01);
    expect(randomSource.calls).toHaveLength(2);
  });

  it("reproduces enemy positions for the same seed and input sequence", () => {
    const firstState = createInitialRuntimeState();
    const secondState = createInitialRuntimeState();
    const first = createSession(firstState, new SeededRandomSource(42));
    const second = createSession(secondState, new SeededRandomSource(42));
    const steps = [
      [createMovementIntent(-1, 0), FIRST_SPAWN_DELAY_SECONDS],
      [createMovementIntent(0, 1), SPAWN_INTERVAL_SECONDS],
      [createMovementIntent(1, 0), SPAWN_INTERVAL_SECONDS],
    ] as const;

    for (const [intent, deltaSeconds] of steps) {
      first.input.movementIntent = intent;
      second.input.movementIntent = intent;
      first.session.fixedUpdate(deltaSeconds);
      second.session.fixedUpdate(deltaSeconds);
    }

    expect(firstState.enemies.map((enemy) => enemy.position)).toEqual(
      secondState.enemies.map((enemy) => enemy.position),
    );
    expect(firstState.enemies.map((enemy) => enemy.phase)).toEqual(
      secondState.enemies.map((enemy) => enemy.phase),
    );
    expect(firstState.enemies.map((enemy) => enemy.id)).toEqual([1, 2, 3]);
    expect(secondState.enemies.map((enemy) => enemy.id)).toEqual([1, 2, 3]);
  });
});
