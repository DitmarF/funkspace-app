import { describe, expect, it } from "vitest";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import type { RandomSource } from "../domain/RandomSource.js";
import type {
  GamePresentationPort,
  GameRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import { VISIBLE_ARENA_BOUNDS } from "../domain/arena/index.js";
import {
  BASIC_ATTACK_DEFINITION,
  PROVISIONAL_PLAYER_INVULNERABILITY_DURATION_SECONDS,
} from "../domain/combat/index.js";
import {
  BASIC_ENEMY_DEFINITION,
  createBasicEnemyState,
  PROVISIONAL_ENEMY_DYING_DURATION_SECONDS,
  type EnemyPhase,
} from "../domain/enemies/index.js";
import type { LogicalPosition } from "../domain/geometry/index.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../domain/movement/index.js";
import { createBasicProjectileState } from "../domain/projectiles/index.js";
import {
  calculateEnemySpawnOffset,
  createEnemyDespawnBounds,
  DESPAWN_EXTRA_MARGIN,
  ENTRY_LEAD_SECONDS,
  expandBoundsByOffset,
  MAX_SPAWN_ATTEMPTS,
} from "../domain/spawning/index.js";
import {
  createInitialRuntimeState,
  type RuntimeState,
} from "../domain/state/index.js";
import {
  createSpawnGroup,
  createWaveDefinition,
  createWaveScheduleProgress,
  PROVISIONAL_EPIC_5_WAVES,
} from "../domain/waves/index.js";
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
const DESPAWN_BOUNDS = createEnemyDespawnBounds(
  VISIBLE_ARENA_BOUNDS,
  BASIC_ENEMY_DEFINITION,
  ENTRY_LEAD_SECONDS,
  DESPAWN_EXTRA_MARGIN,
);
const PROJECTILE_DESPAWN_BOUNDS = expandBoundsByOffset(
  VISIBLE_ARENA_BOUNDS,
  BASIC_ATTACK_DEFINITION.projectileDespawnMargin,
);
const FIRST_WAVE_GROUP = PROVISIONAL_EPIC_5_WAVES[0]!.groups[0]!;
const FIRST_WAVE_FIRST_SPAWN_SECONDS = FIRST_WAVE_GROUP.startOffsetSeconds;
const FIRST_WAVE_SPAWN_INTERVAL_SECONDS = FIRST_WAVE_GROUP.intervalSeconds;

class ControlledMovementInput implements MovementInputPort {
  movementIntent: MovementIntent = ZERO_MOVEMENT_INTENT;
  resetCount = 0;

  readMovementIntent(): MovementIntent {
    return this.movementIntent;
  }

  reset(): void {
    this.movementIntent = ZERO_MOVEMENT_INTENT;
    this.resetCount += 1;
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

function readOwnedRuntimeState(session: GameRuntimeSession): RuntimeState {
  return (session as unknown as { readonly state: RuntimeState }).state;
}

function readCurrentWaveCompletion(session: GameRuntimeSession): boolean {
  return (
    session as unknown as { isCurrentWaveComplete(): boolean }
  ).isCurrentWaveComplete();
}

function createExpectedPlayingState(): RuntimeState {
  const state = createInitialRuntimeState();
  state.phase = "playing";
  return state;
}

function exhaustWaveSchedule(state: RuntimeState): void {
  state.waveSchedule.nextScheduledSpawnIndex =
    state.waveSchedule.requests.length;
}

function configureTestWave(
  state: RuntimeState,
  maxActiveEnemies: number,
  startOffsetSeconds = 0.5,
  count = 4,
  intervalSeconds = 1,
): void {
  state.waveSchedule = createWaveScheduleProgress(
    1,
    createWaveDefinition({
      groups: [
        createSpawnGroup({
          startOffsetSeconds,
          enemyId: "basic",
          count,
          intervalSeconds,
          pattern: "random-perimeter",
        }),
      ],
      maxActiveEnemies,
    }),
  );
}

function addEnemy(
  state: RuntimeState,
  id: number,
  position: Readonly<LogicalPosition>,
  phase: EnemyPhase,
): void {
  const enemy = createBasicEnemyState(id, position);
  enemy.phase = phase;
  if (phase === "dying") enemy.removeAtSimulationSeconds = 100;
  state.enemies.push(enemy);
  state.nextEnemyId = Math.max(state.nextEnemyId, id + 1);
}

function addProjectile(
  state: RuntimeState,
  id: number,
  position: Readonly<LogicalPosition>,
): void {
  state.projectiles.push(
    createBasicProjectileState(
      id,
      position,
      { x: position.x + 1, y: position.y },
      state.simulationTimeSeconds,
    ),
  );
  state.nextProjectileId = Math.max(state.nextProjectileId, id + 1);
}

describe("GameRuntimeSession loss transition", () => {
  it("enters lost once after lethal contact and freezes all progression", () => {
    const state = createInitialRuntimeState();
    state.player.currentHealth = 1;
    state.nextAttackAtSeconds = 100;
    exhaustWaveSchedule(state);
    addEnemy(state, 1, state.player.position, "active");
    const input = new ControlledMovementInput();
    input.movementIntent = createMovementIntent(1, 0);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
      input,
    );

    session.fixedUpdate(0.01);

    expect(state.phase).toBe("lost");
    expect(state.player.currentHealth).toBe(0);
    expect(state.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
    expect(input.resetCount).toBe(1);
    expect(state.simulationTimeSeconds).toBe(0.01);

    const frozenState = structuredClone(state);
    input.movementIntent = createMovementIntent(0, 1);
    session.fixedUpdate(10);
    session.fixedUpdate(10);

    expect(state).toEqual(frozenState);
    expect(input.resetCount).toBe(1);
    expect(session.pause()).toBe(false);
    expect(session.resume()).toBe(false);
    expect(state).toEqual(frozenState);
  });

  it("transitions a pre-defeated player before moving or spawning", () => {
    const state = createInitialRuntimeState();
    state.player.currentHealth = 0;
    const input = new ControlledMovementInput();
    input.movementIntent = createMovementIntent(1, 0);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
      input,
    );

    session.fixedUpdate(1);

    expect(state).toMatchObject({
      phase: "lost",
      simulationTimeSeconds: 0,
      enemies: [],
    });
    expect(state.player.position).toEqual({ x: 180, y: 320 });
    expect(input.resetCount).toBe(1);
  });

  it("renders the final lost snapshot and restarts through fresh state", () => {
    const state = createInitialRuntimeState();
    state.player.currentHealth = 0;
    const snapshots: GameRenderSnapshot[] = [];
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const session = new GameRuntimeSession(
      state,
      new ControlledMovementInput(),
      presentation,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.start();
    session.fixedUpdate(0.01);
    session.render();

    const lostSnapshot = snapshots.at(-1);
    expect(lostSnapshot).toMatchObject({
      phase: "lost",
      simulationTimeSeconds: 0,
    });
    expect(Object.isFrozen(lostSnapshot)).toBe(true);
    expect(Object.isFrozen(lostSnapshot?.enemies)).toBe(true);
    expect(Object.isFrozen(lostSnapshot?.projectiles)).toBe(true);

    session.restart();

    expect(session.phase).toBe("playing");
    session.render();
    expect(snapshots.at(-1)).toMatchObject({
      phase: "playing",
      simulationTimeSeconds: 0,
      enemies: [],
      projectiles: [],
    });
  });
});

describe("GameRuntimeSession complete restart reset", () => {
  it("replaces every transient field from the initial-state source", () => {
    const input = new ControlledMovementInput();
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(
      createInitialRuntimeState(),
      randomSource,
      input,
    );

    for (let runNumber = 1; runNumber <= 3; runNumber += 1) {
      const progressedState = readOwnedRuntimeState(session);
      progressedState.phase = runNumber === 1 ? "playing" : "lost";
      progressedState.simulationTimeSeconds = 90 + runNumber;
      progressedState.movementIntent = createMovementIntent(1, 0);
      progressedState.player.position = { x: 24, y: 48 };
      progressedState.player.collisionRadius = 99;
      progressedState.player.movementSpeedUnitsPerSecond = 1;
      progressedState.player.maximumHealth = 99;
      progressedState.player.currentHealth = 0;
      progressedState.player.invulnerableUntilSeconds = 100;
      addEnemy(progressedState, 8, { x: 12, y: 12 }, "dying");
      progressedState.enemies[0]!.removeAtSimulationSeconds = 100;
      progressedState.nextEnemyId = 9;
      progressedState.waveSchedule.elapsedSeconds = 99;
      progressedState.waveSchedule.nextScheduledSpawnIndex = 3;
      addProjectile(progressedState, 7, { x: 50, y: 50 });
      progressedState.nextProjectileId = 8;
      progressedState.nextAttackAtSeconds = 99;
      progressedState.killCount = 7;
      input.movementIntent = createMovementIntent(0, 1);

      session.restart();

      const restartedState = readOwnedRuntimeState(session);
      expect(restartedState).toEqual(createExpectedPlayingState());
      expect(restartedState).not.toBe(progressedState);
      expect(restartedState.player).not.toBe(progressedState.player);
      expect(restartedState.enemies).not.toBe(progressedState.enemies);
      expect(restartedState.projectiles).not.toBe(progressedState.projectiles);
      expect(input.movementIntent).toBe(ZERO_MOVEMENT_INTENT);
      expect(input.resetCount).toBe(runNumber);
      expect(randomSource.resetCount).toBe(runNumber);
    }
  });

  it("replays the same complete runtime state across three runs", () => {
    const input = new ControlledMovementInput();
    const session = new GameRuntimeSession(
      createInitialRuntimeState(),
      input,
      null,
      new SeededRandomSource(42),
    );
    const steps = [
      [createMovementIntent(-1, 0), FIRST_WAVE_FIRST_SPAWN_SECONDS],
      [createMovementIntent(0, 1), FIRST_WAVE_SPAWN_INTERVAL_SECONDS],
      [createMovementIntent(1, 0), FIRST_WAVE_SPAWN_INTERVAL_SECONDS],
    ] as const;
    const completedRuns: RuntimeState[] = [];
    session.start();

    for (let runNumber = 0; runNumber < 3; runNumber += 1) {
      for (const [intent, deltaSeconds] of steps) {
        input.movementIntent = intent;
        session.fixedUpdate(deltaSeconds);
      }
      completedRuns.push(structuredClone(readOwnedRuntimeState(session)));
      if (runNumber < 2) session.restart();
    }

    expect(completedRuns[1]).toEqual(completedRuns[0]);
    expect(completedRuns[2]).toEqual(completedRuns[0]);
    expect(completedRuns[0]).toMatchObject({
      phase: "playing",
      player: {
        maximumHealth: 3,
        currentHealth: 3,
        invulnerableUntilSeconds: 0,
      },
      nextEnemyId: 3,
      nextProjectileId: 2,
      killCount: 0,
    });
    expect(completedRuns[0]?.enemies.map((enemy) => enemy.id)).toEqual([1, 2]);
    expect(completedRuns[0]?.projectiles).toEqual([]);
  });
});

describe("GameRuntimeSession enemy spawning and pursuit", () => {
  it("moves the player before validating a due candidate", () => {
    const state = createInitialRuntimeState();
    state.player.position = { x: 180, y: 100 };
    const randomSource = new SequenceRandomSource([TOP_CENTER_DISTANCE]);
    const { input, session } = createSession(state, randomSource);
    input.movementIntent = createMovementIntent(0, -1);

    session.fixedUpdate(FIRST_WAVE_FIRST_SPAWN_SECONDS);

    expect(state.player.position).toEqual({ x: 180, y: 40 });
    expect(state.enemies).toEqual([]);
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS);
  });

  it("leaves a request pending after failed bounded attempts", () => {
    const state = createInitialRuntimeState();
    state.player.position = { x: 180, y: 12 };
    const randomSource = new SequenceRandomSource([
      ...Array.from({ length: MAX_SPAWN_ATTEMPTS }, () => TOP_CENTER_DISTANCE),
      BOTTOM_CENTER_DISTANCE,
    ]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(FIRST_WAVE_FIRST_SPAWN_SECONDS);

    expect(state.enemies).toEqual([]);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(0);
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS);

    session.fixedUpdate(0.01);
    expect(state.enemies).toHaveLength(1);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(1);
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS + 1);
  });

  it("freezes wave time at capacity while movement and combat continue", () => {
    const state = createInitialRuntimeState();
    configureTestWave(state, 1);
    addEnemy(state, 1, { x: 180, y: 200 }, "active");
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(0.1);

    expect(state.simulationTimeSeconds).toBe(0.1);
    expect(state.waveSchedule.elapsedSeconds).toBe(0);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(0);
    expect(state.enemies[0]?.position).toEqual({ x: 180, y: 207.2 });
    expect(state.projectiles).toHaveLength(1);
    expect(randomSource.calls).toHaveLength(0);
  });

  it("preserves a pending request through several capped updates", () => {
    const state = createInitialRuntimeState();
    configureTestWave(state, 1);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, { x: -66, y: 100 }, "entering");
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(0.25);
    session.fixedUpdate(0.25);
    session.fixedUpdate(0.25);

    expect(state.simulationTimeSeconds).toBe(0.75);
    expect(state.waveSchedule.elapsedSeconds).toBe(0);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(0);
    expect(randomSource.calls).toHaveLength(0);
  });

  it("reopens capacity when an enemy becomes dying", () => {
    const state = createInitialRuntimeState();
    configureTestWave(state, 1, 0.1, 2, 0.1);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, { x: 180, y: 200 }, "active");
    state.enemies[0]!.currentHealth = 0;
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(0.1);

    expect(state.enemies.map((enemy) => enemy.phase)).toEqual([
      "dying",
      "entering",
    ]);
    expect(state.waveSchedule.elapsedSeconds).toBe(0.1);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(1);
    expect(randomSource.calls).toHaveLength(1);
  });

  it("reopens after removal without bursting overdue requests", () => {
    const state = createInitialRuntimeState();
    configureTestWave(state, 1, 0.1, 3, 0.1);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, { x: -66, y: 100 }, "entering");
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(0.5);
    expect(state.waveSchedule.elapsedSeconds).toBe(0);

    state.enemies = [];
    session.fixedUpdate(0.5);

    expect(state.enemies).toHaveLength(1);
    expect(state.waveSchedule.elapsedSeconds).toBe(0.5);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(1);

    session.fixedUpdate(0.5);
    expect(state.waveSchedule.elapsedSeconds).toBe(0.5);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(1);

    state.enemies = [];
    session.fixedUpdate(0.01);

    expect(state.enemies).toHaveLength(1);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(2);
    expect(randomSource.calls).toHaveLength(2);
  });

  it("combines cap backpressure with a pending failed fair spawn", () => {
    const state = createInitialRuntimeState();
    configureTestWave(state, 1);
    state.player.position = { x: 180, y: 12 };
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, { x: -66, y: 100 }, "entering");
    const randomSource = new SequenceRandomSource([
      ...Array.from({ length: MAX_SPAWN_ATTEMPTS }, () => TOP_CENTER_DISTANCE),
      BOTTOM_CENTER_DISTANCE,
    ]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(0.5);
    expect(state.waveSchedule.elapsedSeconds).toBe(0);
    expect(randomSource.calls).toHaveLength(0);

    state.enemies = [];
    session.fixedUpdate(0.5);
    expect(state.waveSchedule.elapsedSeconds).toBe(0.5);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(0);
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS);

    addEnemy(state, 1, { x: -66, y: 100 }, "entering");
    session.fixedUpdate(0.1);
    expect(state.waveSchedule.elapsedSeconds).toBe(0.5);
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS);

    state.enemies = [];
    session.fixedUpdate(0.1);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(1);
    expect(randomSource.calls).toHaveLength(MAX_SPAWN_ATTEMPTS + 1);
  });

  it("releases at most one successful request per fixed update", () => {
    const state = createInitialRuntimeState();
    const tiedWave = createWaveDefinition({
      groups: [
        createSpawnGroup({
          startOffsetSeconds: 0.5,
          enemyId: "basic",
          count: 1,
          intervalSeconds: 0,
          pattern: "random-perimeter",
        }),
        createSpawnGroup({
          startOffsetSeconds: 0.5,
          enemyId: "basic",
          count: 1,
          intervalSeconds: 0,
          pattern: "random-perimeter",
        }),
      ],
      maxActiveEnemies: 2,
    });
    state.waveSchedule = createWaveScheduleProgress(1, tiedWave);
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(0.5);

    expect(state.enemies.map((enemy) => enemy.id)).toEqual([1]);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(1);

    session.fixedUpdate(0.01);

    expect(state.enemies.map((enemy) => enemy.id)).toEqual([1, 2]);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(2);
  });

  it("retains overdue finite requests instead of creating a same-update burst", () => {
    const state = createInitialRuntimeState();
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(10);

    expect(state.enemies).toHaveLength(1);
    expect(state.nextEnemyId).toBe(2);
    expect(randomSource.calls).toHaveLength(1);
    expect(state.waveSchedule.elapsedSeconds).toBe(10);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(1);
  });

  it("moves a newly spawned enemy during the same fixed update", () => {
    const state = createInitialRuntimeState();
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(FIRST_WAVE_FIRST_SPAWN_SECONDS);

    expect(state.enemies).toHaveLength(1);
    expect(state.enemies[0]?.position).toEqual({ x: 180, y: 670 });
    expect(state.enemies[0]?.phase).toBe("entering");
  });

  it("stops spawning after the finite first-wave schedule is exhausted", () => {
    const state = createInitialRuntimeState();
    configureTestWave(state, 4);
    state.nextAttackAtSeconds = 100;
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(FIRST_WAVE_FIRST_SPAWN_SECONDS);
    for (
      let spawnIndex = 1;
      spawnIndex < FIRST_WAVE_GROUP.count;
      spawnIndex += 1
    ) {
      session.fixedUpdate(FIRST_WAVE_SPAWN_INTERVAL_SECONDS);
    }

    expect(state.enemies).toHaveLength(FIRST_WAVE_GROUP.count);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(
      state.waveSchedule.requests.length,
    );

    state.enemies = [];
    session.fixedUpdate(10);
    session.fixedUpdate(10);

    expect(state.enemies).toEqual([]);
    expect(randomSource.calls).toHaveLength(FIRST_WAVE_GROUP.count);
  });

  it("pursues the player's newly updated position", () => {
    const state = createInitialRuntimeState();
    state.player.position = { x: 100, y: 100 };
    exhaustWaveSchedule(state);
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
    exhaustWaveSchedule(state);
    state.enemies.push(createBasicEnemyState(1, { x: -20, y: 320 }));
    state.nextEnemyId = 2;
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.fixedUpdate(0.125);

    expect(state.enemies[0]?.position).toEqual({ x: -11, y: 320 });
    expect(state.enemies[0]?.phase).toBe("active");
  });

  it("retains an active enemy while its circle remains outside the visible arena", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    const enemy = createBasicEnemyState(1, { x: -20, y: 320 });
    enemy.phase = "active";
    state.enemies.push(enemy);
    state.nextEnemyId = 2;
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(1 / 120);

    expect(state.enemies).toHaveLength(1);
    expect(state.enemies[0]?.position.x).toBeLessThan(
      -BASIC_ENEMY_DEFINITION.collisionRadius,
    );
    expect(state.enemies[0]?.phase).toBe("active");
  });

  it("retains exact despawn-boundary tangency", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    const enemy = createBasicEnemyState(1, {
      x: DESPAWN_BOUNDS.x - BASIC_ENEMY_DEFINITION.collisionRadius,
      y: 320,
    });
    enemy.phase = "dying";
    enemy.removeAtSimulationSeconds = 100;
    state.enemies.push(enemy);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(1 / 60);

    expect(state.enemies).toEqual([enemy]);
  });

  it("removes an enemy whose circle is fully outside the despawn bounds", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    const enemy = createBasicEnemyState(1, {
      x: DESPAWN_BOUNDS.x - BASIC_ENEMY_DEFINITION.collisionRadius - 10,
      y: 320,
    });
    enemy.phase = "active";
    state.enemies.push(enemy);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(1 / 60);

    expect(state.enemies).toEqual([]);
  });

  it("removes invalid enemy coordinates without simulating or rendering them", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.enemies.push(createBasicEnemyState(1, { x: Number.NaN, y: 320 }));
    const snapshots: GameRenderSnapshot[] = [];
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const input = new ControlledMovementInput();
    const session = new GameRuntimeSession(
      state,
      input,
      presentation,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.start();

    expect(() => session.fixedUpdate(1 / 60)).not.toThrow();
    session.render();

    expect(state.enemies).toEqual([]);
    expect(snapshots.at(-1)?.enemies).toEqual([]);
  });

  it("consumes neither simulation time nor random values while paused", () => {
    const state = createInitialRuntimeState();
    state.enemies.push(createBasicEnemyState(1, { x: 0, y: 0 }));
    const escapedEnemy = createBasicEnemyState(2, {
      x: DESPAWN_BOUNDS.x - BASIC_ENEMY_DEFINITION.collisionRadius - 1,
      y: 320,
    });
    escapedEnemy.phase = "dying";
    escapedEnemy.removeAtSimulationSeconds = 100;
    state.enemies.push(escapedEnemy);
    state.nextEnemyId = 3;
    const initialEnemyPosition = { ...state.enemies[0]!.position };
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.pause();
    session.fixedUpdate(10);

    expect(state.simulationTimeSeconds).toBe(0);
    expect(state.waveSchedule.elapsedSeconds).toBe(0);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(0);
    expect(state.enemies[0]?.position).toEqual(initialEnemyPosition);
    expect(state.enemies[0]?.phase).toBe("entering");
    expect(state.enemies).toContain(escapedEnemy);
    expect(randomSource.calls).toHaveLength(0);

    session.resume();
    session.fixedUpdate(1 / 60);

    expect(state.enemies).not.toContain(escapedEnemy);
    expect(state.simulationTimeSeconds).toBeCloseTo(1 / 60);
  });

  it("does not advance wave-local time before gameplay starts", () => {
    const state = createInitialRuntimeState();
    const session = new GameRuntimeSession(
      state,
      new ControlledMovementInput(),
      null,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(10);

    expect(state.phase).toBe("idle");
    expect(state.waveSchedule.elapsedSeconds).toBe(0);
    expect(state.waveSchedule.nextScheduledSpawnIndex).toBe(0);
  });

  it("restart resets the random sequence and the original wave-one schedule", () => {
    const state = createInitialRuntimeState();
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);
    session.fixedUpdate(FIRST_WAVE_FIRST_SPAWN_SECONDS);
    expect(state.enemies.map((enemy) => enemy.id)).toEqual([1]);
    expect(state.nextEnemyId).toBe(2);

    session.restart();

    expect(randomSource.resetCount).toBe(1);
    const restartedState = readOwnedRuntimeState(session);
    expect(restartedState.waveSchedule.currentWaveNumber).toBe(1);
    expect(restartedState.waveSchedule.maxActiveEnemies).toBe(
      PROVISIONAL_EPIC_5_WAVES[0]!.maxActiveEnemies,
    );
    expect(restartedState.waveSchedule.elapsedSeconds).toBe(0);
    expect(restartedState.waveSchedule.nextScheduledSpawnIndex).toBe(0);
    session.fixedUpdate(FIRST_WAVE_FIRST_SPAWN_SECONDS - 0.01);
    expect(randomSource.calls).toHaveLength(1);
    session.fixedUpdate(0.01);
    expect(randomSource.calls).toHaveLength(2);
    expect(restartedState.waveSchedule.nextScheduledSpawnIndex).toBe(1);
  });

  it("reproduces enemy positions for the same seed and input sequence", () => {
    const firstState = createInitialRuntimeState();
    const secondState = createInitialRuntimeState();
    const first = createSession(firstState, new SeededRandomSource(42));
    const second = createSession(secondState, new SeededRandomSource(42));
    const steps = [
      [createMovementIntent(-1, 0), FIRST_WAVE_FIRST_SPAWN_SECONDS],
      [createMovementIntent(0, 1), FIRST_WAVE_SPAWN_INTERVAL_SECONDS],
      [createMovementIntent(1, 0), FIRST_WAVE_SPAWN_INTERVAL_SECONDS],
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
    expect(firstState.enemies.map((enemy) => enemy.id)).toEqual([1, 2]);
    expect(secondState.enemies.map((enemy) => enemy.id)).toEqual([1, 2]);
  });

  it("replays the same spawn positions, IDs, and schedule after restart", () => {
    const snapshots: GameRenderSnapshot[] = [];
    const input = new ControlledMovementInput();
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const session = new GameRuntimeSession(
      createInitialRuntimeState(),
      input,
      presentation,
      new SeededRandomSource(42),
    );
    const steps = [
      [createMovementIntent(-1, 0), FIRST_WAVE_FIRST_SPAWN_SECONDS],
      [createMovementIntent(0, 1), FIRST_WAVE_SPAWN_INTERVAL_SECONDS],
      [createMovementIntent(1, 0), FIRST_WAVE_SPAWN_INTERVAL_SECONDS],
    ] as const;
    session.start();

    for (const [intent, deltaSeconds] of steps) {
      input.movementIntent = intent;
      session.fixedUpdate(deltaSeconds);
    }
    session.render();
    const firstRun = snapshots.at(-1);

    session.restart();
    for (const [intent, deltaSeconds] of steps) {
      input.movementIntent = intent;
      session.fixedUpdate(deltaSeconds);
    }
    session.render();
    const restartedRun = snapshots.at(-1);

    expect(restartedRun?.enemies).toEqual(firstRun?.enemies);
    expect(restartedRun?.simulationTimeSeconds).toBe(
      firstRun?.simulationTimeSeconds,
    );
    expect(restartedRun?.playerX).toBe(firstRun?.playerX);
    expect(restartedRun?.playerY).toBe(firstRun?.playerY);
  });
});

describe("GameRuntimeSession automatic attack", () => {
  it("keeps an immediately ready attack ready when no target exists", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.25);

    expect(state.projectiles).toEqual([]);
    expect(state.nextProjectileId).toBe(1);
    expect(state.nextAttackAtSeconds).toBe(0);
  });

  it.each([
    ["entering", { x: 180, y: -66 }],
    ["dying", { x: 180, y: 300 }],
  ] as const)("does not fire at an %s enemy", (phase, position) => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    addEnemy(state, 1, position, phase);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.01);

    expect(state.enemies[0]?.phase).toBe(phase);
    expect(state.projectiles).toEqual([]);
    expect(state.nextAttackAtSeconds).toBe(0);
  });

  it("fires immediately at an active target and advances the cooldown", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    addEnemy(state, 1, { x: 300, y: 320 }, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.1);

    expect(state.projectiles).toHaveLength(1);
    expect(state.projectiles[0]).toMatchObject({
      id: 1,
      position: { x: 212, y: 320 },
      velocity: { x: 320, y: 0 },
      expiresAtSimulationSeconds: 2.6,
    });
    expect(state.nextProjectileId).toBe(2);
    expect(state.nextAttackAtSeconds).toBe(
      0.1 + BASIC_ATTACK_DEFINITION.cooldownSeconds,
    );
  });

  it("does not fire before the cooldown deadline", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 0.5;
    addEnemy(state, 1, { x: 180, y: 300 }, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.25);

    expect(state.projectiles).toEqual([]);
    expect(state.nextProjectileId).toBe(1);
    expect(state.nextAttackAtSeconds).toBe(0.5);
  });

  it("fires at the exact cooldown deadline", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.simulationTimeSeconds = 0.25;
    state.nextAttackAtSeconds = 0.5;
    addEnemy(state, 1, { x: 180, y: 300 }, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.25);

    expect(state.projectiles).toHaveLength(1);
    expect(state.nextProjectileId).toBe(2);
    expect(state.nextAttackAtSeconds).toBe(
      0.5 + BASIC_ATTACK_DEFINITION.cooldownSeconds,
    );
  });

  it("fires as soon as a target appears without consuming no-target time", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.fixedUpdate(0.5);

    addEnemy(state, 1, { x: 180, y: 300 }, "active");
    session.fixedUpdate(0.25);

    expect(state.projectiles).toHaveLength(1);
    expect(state.nextProjectileId).toBe(2);
    expect(state.nextAttackAtSeconds).toBe(
      0.75 + BASIC_ATTACK_DEFINITION.cooldownSeconds,
    );
  });

  it("freezes the attack deadline relationship while paused", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 0.5;
    addEnemy(state, 1, { x: 180, y: 300 }, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.pause();
    session.fixedUpdate(10);

    expect(state.simulationTimeSeconds).toBe(0);
    expect(state.nextAttackAtSeconds).toBe(0.5);
    expect(state.nextProjectileId).toBe(1);

    session.resume();
    session.fixedUpdate(0.25);
    expect(state.nextProjectileId).toBe(1);

    session.fixedUpdate(0.25);
    expect(state.nextProjectileId).toBe(2);
    expect(state.nextAttackAtSeconds).toBe(
      0.5 + BASIC_ATTACK_DEFINITION.cooldownSeconds,
    );
  });

  it("emits at most one projectile after a large delta", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(10);

    expect(state.nextProjectileId).toBe(2);
    expect(state.nextAttackAtSeconds).toBe(
      10 + BASIC_ATTACK_DEFINITION.cooldownSeconds,
    );
    expect(state.projectiles).toEqual([]);
  });

  it("aims at the nearest active enemy after enemy movement", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    addEnemy(state, 1, { x: 300, y: 320 }, "active");
    addEnemy(state, 2, { x: 180, y: 300 }, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.000001);

    expect(state.projectiles).toHaveLength(1);
    expect(state.projectiles[0]?.velocity).toEqual({ x: 0, y: -320 });
  });

  it("replays the same first attack and projectile ID across three runs", () => {
    const snapshots: GameRenderSnapshot[] = [];
    const input = new ControlledMovementInput();
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const session = new GameRuntimeSession(
      createInitialRuntimeState(),
      input,
      presentation,
      randomSource,
    );
    const steps = [FIRST_WAVE_FIRST_SPAWN_SECONDS, 0.25] as const;
    session.start();

    for (const deltaSeconds of steps) session.fixedUpdate(deltaSeconds);
    session.render();
    const firstRun = snapshots.at(-1);

    session.restart();
    for (const deltaSeconds of steps) session.fixedUpdate(deltaSeconds);
    session.render();
    const secondRun = snapshots.at(-1);

    session.restart();
    for (const deltaSeconds of steps) session.fixedUpdate(deltaSeconds);
    session.render();
    const thirdRun = snapshots.at(-1);

    expect(firstRun?.projectiles).toEqual([
      { id: 1, x: 180, y: 400, collisionRadius: 4 },
    ]);
    expect(randomSource.resetCount).toBe(2);
    expect(secondRun).toEqual(firstRun);
    expect(thirdRun).toEqual(firstRun);
  });
});

describe("GameRuntimeSession projectile hit resolution", () => {
  it("retires a hitting projectile before the next renderer snapshot", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    addProjectile(state, 1, state.player.position);
    const snapshots: GameRenderSnapshot[] = [];
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const session = new GameRuntimeSession(
      state,
      new ControlledMovementInput(),
      presentation,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.start();

    session.fixedUpdate(0.01);
    session.render();

    expect(state.enemies[0]?.currentHealth).toBe(0);
    expect(state.enemies[0]?.phase).toBe("dying");
    expect(state.killCount).toBe(1);
    expect(state.projectiles).toEqual([]);
    expect(snapshots.at(-1)?.projectiles).toEqual([]);

    const renderedEnemies = snapshots.at(-1)?.enemies;
    expect(snapshots.at(-1)?.killCount).toBe(1);
    expect(renderedEnemies?.[0]?.phase).toBe("dying");
    expect(renderedEnemies?.[0]).not.toBe(state.enemies[0]);
    expect(Object.isFrozen(renderedEnemies)).toBe(true);
    expect(Object.isFrozen(renderedEnemies?.[0])).toBe(true);
  });

  it("does not apply damage again on the next fixed update", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    state.enemies[0]!.currentHealth = 3;
    addProjectile(state, 1, state.player.position);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.01);
    expect(state.enemies[0]?.currentHealth).toBe(2);
    expect(state.killCount).toBe(0);
    expect(state.projectiles).toEqual([]);

    session.fixedUpdate(0.01);
    expect(state.enemies[0]?.currentHealth).toBe(2);
  });

  it("allows two projectiles to damage the same active enemy in one update", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    state.enemies[0]!.currentHealth = 3;
    addProjectile(state, 1, state.player.position);
    addProjectile(state, 2, state.player.position);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.01);

    expect(state.enemies[0]?.currentHealth).toBe(1);
    expect(state.enemies[0]?.phase).toBe("active");
    expect(state.killCount).toBe(0);
    expect(state.projectiles).toEqual([]);
  });
});

describe("GameRuntimeSession wave completion boundary", () => {
  it("detects completion on the fixed update that defeats the final enemy", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    addProjectile(state, 1, state.player.position);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    expect(readCurrentWaveCompletion(session)).toBe(false);

    session.fixedUpdate(0.01);

    expect(state.enemies[0]?.phase).toBe("dying");
    expect(readCurrentWaveCompletion(session)).toBe(true);
  });

  it("lets player loss win when the final enemy falls on the same update", () => {
    const state = createInitialRuntimeState();
    state.player.currentHealth = 1;
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    addProjectile(state, 1, state.player.position);
    const input = new ControlledMovementInput();
    input.readMovementIntent = () => {
      state.player.currentHealth = 0;
      return ZERO_MOVEMENT_INTENT;
    };
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
      input,
    );

    session.fixedUpdate(0.01);

    expect(state.enemies[0]?.phase).toBe("dying");
    expect(readCurrentWaveCompletion(session)).toBe(true);
    expect(state.phase).toBe("lost");
  });

  it("evaluates completion only after invalid and escaped cleanup", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, { x: Number.NaN, y: 100 }, "active");
    addEnemy(
      state,
      2,
      {
        x: DESPAWN_BOUNDS.x + DESPAWN_BOUNDS.width + 100,
        y: DESPAWN_BOUNDS.y + DESPAWN_BOUNDS.height / 2,
      },
      "active",
    );
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    expect(readCurrentWaveCompletion(session)).toBe(false);

    session.fixedUpdate(0.01);

    expect(state.enemies).toEqual([]);
    expect(readCurrentWaveCompletion(session)).toBe(true);
  });
});

describe("GameRuntimeSession enemy defeat lifecycle", () => {
  const FIXED_TEST_STEP_SECONDS = 1 / 64;

  it("does not score or damage a dying enemy again", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    addProjectile(state, 1, state.player.position);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(FIXED_TEST_STEP_SECONDS);
    const dyingPosition = { ...state.enemies[0]!.position };
    addProjectile(state, 2, state.player.position);

    session.fixedUpdate(FIXED_TEST_STEP_SECONDS);

    expect(state.enemies[0]?.phase).toBe("dying");
    expect(state.enemies[0]?.currentHealth).toBe(0);
    expect(state.enemies[0]?.position).toEqual(dyingPosition);
    expect(state.killCount).toBe(1);
    expect(state.projectiles.map((projectile) => projectile.id)).toEqual([2]);
  });

  it("removes a dying enemy at the exact simulation-time deadline", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    state.enemies[0]!.currentHealth = 0;
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(FIXED_TEST_STEP_SECONDS);
    expect(state.enemies[0]?.removeAtSimulationSeconds).toBe(
      FIXED_TEST_STEP_SECONDS + PROVISIONAL_ENEMY_DYING_DURATION_SECONDS,
    );

    session.fixedUpdate(
      PROVISIONAL_ENEMY_DYING_DURATION_SECONDS - FIXED_TEST_STEP_SECONDS,
    );
    expect(state.enemies).toHaveLength(1);

    session.fixedUpdate(FIXED_TEST_STEP_SECONDS);
    expect(state.enemies).toEqual([]);
    expect(state.killCount).toBe(1);
  });

  it("freezes dying cleanup while paused", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    state.enemies[0]!.currentHealth = 0;
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.fixedUpdate(FIXED_TEST_STEP_SECONDS);
    const deadline = state.enemies[0]?.removeAtSimulationSeconds;

    session.pause();
    session.fixedUpdate(10);

    expect(state.simulationTimeSeconds).toBe(FIXED_TEST_STEP_SECONDS);
    expect(state.enemies[0]?.removeAtSimulationSeconds).toBe(deadline);
    expect(state.enemies[0]?.phase).toBe("dying");
    expect(state.killCount).toBe(1);
  });

  it("restart clears the dying renderer state", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    state.enemies[0]!.currentHealth = 0;
    const snapshots: GameRenderSnapshot[] = [];
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const session = new GameRuntimeSession(
      state,
      new ControlledMovementInput(),
      presentation,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.start();
    session.fixedUpdate(FIXED_TEST_STEP_SECONDS);
    session.render();
    expect(snapshots.at(-1)?.enemies[0]?.phase).toBe("dying");

    session.restart();
    session.render();

    expect(snapshots.at(-1)?.enemies).toEqual([]);
  });
});

describe("GameRuntimeSession player contact damage", () => {
  it("applies one active-enemy contact hit after enemy movement", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.01);

    expect(state.player.currentHealth).toBe(2);
    expect(state.player.invulnerableUntilSeconds).toBe(
      0.01 + PROVISIONAL_PLAYER_INVULNERABILITY_DURATION_SECONDS,
    );
    expect(state.enemies[0]?.phase).toBe("active");
  });

  it("ignores continued overlap during invulnerability", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.01);
    session.fixedUpdate(0.1);

    expect(state.player.currentHealth).toBe(2);
  });

  it("does not let another overlapping enemy bypass invulnerability", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.fixedUpdate(0.01);
    addEnemy(state, 2, state.player.position, "active");

    session.fixedUpdate(0.1);

    expect(state.player.currentHealth).toBe(2);
  });

  it("ignores contact just before invulnerability expires", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.fixedUpdate(0.01);
    const deadline = state.player.invulnerableUntilSeconds;

    session.fixedUpdate(deadline - state.simulationTimeSeconds - 0.001);

    expect(state.simulationTimeSeconds).toBeCloseTo(deadline - 0.001);
    expect(state.player.currentHealth).toBe(2);
  });

  it("allows contact at exact invulnerability expiration", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.fixedUpdate(0.01);
    const deadline = state.player.invulnerableUntilSeconds;

    session.fixedUpdate(deadline - state.simulationTimeSeconds);

    expect(state.simulationTimeSeconds).toBe(deadline);
    expect(state.player.currentHealth).toBe(1);
  });

  it("freezes the invulnerability relationship while paused", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.fixedUpdate(0.01);
    const deadline = state.player.invulnerableUntilSeconds;

    session.pause();
    session.fixedUpdate(10);

    expect(state.simulationTimeSeconds).toBe(0.01);
    expect(state.player.invulnerableUntilSeconds).toBe(deadline);
    expect(state.player.currentHealth).toBe(2);
  });

  it("resumes with the remaining simulation-time immunity intact", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.fixedUpdate(0.01);
    const deadline = state.player.invulnerableUntilSeconds;
    session.pause();
    session.fixedUpdate(10);
    session.resume();

    session.fixedUpdate(deadline - state.simulationTimeSeconds - 0.001);
    expect(state.player.currentHealth).toBe(2);

    session.fixedUpdate(0.001);
    expect(state.player.currentHealth).toBe(1);
  });

  it("does not advance immunity for invalid deltas", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.fixedUpdate(0.01);
    const deadline = state.player.invulnerableUntilSeconds;

    for (const deltaSeconds of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      session.fixedUpdate(deltaSeconds);
    }

    expect(state.simulationTimeSeconds).toBe(0.01);
    expect(state.player.invulnerableUntilSeconds).toBe(deadline);
    expect(state.player.currentHealth).toBe(2);
  });

  it("restart reports a fresh vulnerable player", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const snapshots: GameRenderSnapshot[] = [];
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const session = new GameRuntimeSession(
      state,
      new ControlledMovementInput(),
      presentation,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.start();
    session.fixedUpdate(0.01);
    session.render();
    expect(snapshots.at(-1)?.isPlayerInvulnerable).toBe(true);

    session.restart();
    session.render();

    expect(snapshots.at(-1)?.isPlayerInvulnerable).toBe(false);
  });

  it("allows contact damage to reduce health to zero", () => {
    const state = createInitialRuntimeState();
    state.player.currentHealth = 1;
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.01);

    expect(state.player.currentHealth).toBe(0);
    expect(state.player.invulnerableUntilSeconds).toBeGreaterThan(
      state.simulationTimeSeconds,
    );
  });

  it("reports invulnerability only before its renderer-snapshot deadline", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    const snapshots: GameRenderSnapshot[] = [];
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const session = new GameRuntimeSession(
      state,
      new ControlledMovementInput(),
      presentation,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.start();
    session.render();
    expect(snapshots.at(-1)?.isPlayerInvulnerable).toBe(false);

    session.fixedUpdate(0.01);
    session.render();
    expect(snapshots.at(-1)?.isPlayerInvulnerable).toBe(true);

    state.enemies = [];
    session.fixedUpdate(
      state.player.invulnerableUntilSeconds - state.simulationTimeSeconds,
    );
    session.render();
    expect(snapshots.at(-1)?.isPlayerInvulnerable).toBe(false);
  });

  it("does not take contact damage from an enemy defeated earlier in the update", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    addProjectile(state, 1, state.player.position);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.01);

    expect(state.enemies[0]?.phase).toBe("dying");
    expect(state.player.currentHealth).toBe(state.player.maximumHealth);
  });
});

describe("GameRuntimeSession projectile movement and presentation", () => {
  it("moves a seeded projectile without an eligible target", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.projectiles.push(
      createBasicProjectileState(
        state.nextProjectileId,
        state.player.position,
        { x: state.player.position.x + 1, y: state.player.position.y },
        state.simulationTimeSeconds,
      ),
    );
    state.nextProjectileId += 1;
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.25);

    expect(state.projectiles).toHaveLength(1);
    expect(state.projectiles[0]?.position).toEqual({ x: 260, y: 320 });
    expect(state.nextProjectileId).toBe(2);
  });

  it("removes a projectile at its exact expiration boundary", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    state.simulationTimeSeconds =
      BASIC_ATTACK_DEFINITION.projectileLifetimeSeconds - 0.01;
    state.projectiles.push(
      createBasicProjectileState(
        state.nextProjectileId,
        { x: 180, y: 320 },
        { x: 181, y: 320 },
        0,
      ),
    );
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.01);

    expect(state.simulationTimeSeconds).toBe(
      BASIC_ATTACK_DEFINITION.projectileLifetimeSeconds,
    );
    expect(state.projectiles).toEqual([]);
  });

  it("removes invalid and fully escaped projectiles safely", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    const invalid = createBasicProjectileState(
      1,
      { x: 180, y: 320 },
      { x: 181, y: 320 },
      0,
    );
    invalid.position.x = Number.NaN;
    const escaped = createBasicProjectileState(
      2,
      {
        x:
          PROJECTILE_DESPAWN_BOUNDS.x -
          BASIC_ATTACK_DEFINITION.projectileCollisionRadius -
          1,
        y: 320,
      },
      { x: PROJECTILE_DESPAWN_BOUNDS.x - 100, y: 320 },
      0,
    );
    state.projectiles.push(invalid, escaped);
    state.nextProjectileId = 3;
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    expect(() => session.fixedUpdate(1 / 60)).not.toThrow();

    expect(state.projectiles).toEqual([]);
  });

  it("freezes projectile movement while paused", () => {
    const state = createInitialRuntimeState();
    exhaustWaveSchedule(state);
    const projectile = createBasicProjectileState(
      1,
      { x: 180, y: 320 },
      { x: 181, y: 320 },
      0,
    );
    state.projectiles.push(projectile);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.pause();
    session.fixedUpdate(1);

    expect(projectile.position).toEqual({ x: 180, y: 320 });
    expect(state.simulationTimeSeconds).toBe(0);

    session.resume();
    session.fixedUpdate(0.1);

    expect(projectile.position).toEqual({ x: 212, y: 320 });
  });

  it("renders immutable projectile snapshots copied from runtime state", () => {
    const state = createInitialRuntimeState();
    const projectile = createBasicProjectileState(
      1,
      { x: 180, y: 320 },
      { x: 181, y: 320 },
      0,
    );
    state.projectiles.push(projectile);
    const snapshots: GameRenderSnapshot[] = [];
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const session = new GameRuntimeSession(
      state,
      new ControlledMovementInput(),
      presentation,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.render();

    const snapshotProjectiles = snapshots.at(-1)?.projectiles;
    expect(snapshotProjectiles).toEqual([
      { id: 1, x: 180, y: 320, collisionRadius: 4 },
    ]);
    expect(Object.isFrozen(snapshotProjectiles)).toBe(true);
    expect(Object.isFrozen(snapshotProjectiles?.[0])).toBe(true);
    expect(snapshotProjectiles?.[0]).not.toBe(projectile);

    projectile.position.x = 999;

    expect(snapshotProjectiles?.[0]?.x).toBe(180);
  });

  it("renders an empty projectile collection after restart", () => {
    const state = createInitialRuntimeState();
    state.projectiles.push(
      createBasicProjectileState(1, { x: 180, y: 320 }, { x: 181, y: 320 }, 0),
    );
    state.nextProjectileId = 2;
    const snapshots: GameRenderSnapshot[] = [];
    const presentation: GamePresentationPort = {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    };
    const session = new GameRuntimeSession(
      state,
      new ControlledMovementInput(),
      presentation,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );
    session.start();
    session.render();
    expect(snapshots.at(-1)?.projectiles).toHaveLength(1);

    session.restart();
    session.render();

    expect(snapshots.at(-1)?.projectiles).toEqual([]);
  });
});
