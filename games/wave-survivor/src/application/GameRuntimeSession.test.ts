import { describe, expect, it } from "vitest";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import type { RandomSource } from "../domain/RandomSource.js";
import type {
  GamePresentationPort,
  GameRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import { VISIBLE_ARENA_BOUNDS } from "../domain/arena/index.js";
import { BASIC_ATTACK_DEFINITION } from "../domain/combat/index.js";
import {
  BASIC_ENEMY_DEFINITION,
  createBasicEnemyState,
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

function addEnemy(
  state: RuntimeState,
  id: number,
  position: Readonly<LogicalPosition>,
  phase: EnemyPhase,
): void {
  const enemy = createBasicEnemyState(id, position);
  enemy.phase = phase;
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

  it("retains an active enemy while its circle remains outside the visible arena", () => {
    const state = createInitialRuntimeState();
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
    const enemy = createBasicEnemyState(1, {
      x: DESPAWN_BOUNDS.x - BASIC_ENEMY_DEFINITION.collisionRadius,
      y: 320,
    });
    enemy.phase = "dying";
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.enemies.push(escapedEnemy);
    state.nextEnemyId = 3;
    const initialEnemyPosition = { ...state.enemies[0]!.position };
    const randomSource = new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]);
    const { session } = createSession(state, randomSource);

    session.pause();
    session.fixedUpdate(10);

    expect(state.simulationTimeSeconds).toBe(0);
    expect(state.nextEnemySpawnAtSeconds).toBe(FIRST_SPAWN_DELAY_SECONDS);
    expect(state.enemies[0]?.position).toEqual(initialEnemyPosition);
    expect(state.enemies[0]?.phase).toBe("entering");
    expect(state.enemies).toContain(escapedEnemy);
    expect(randomSource.calls).toHaveLength(0);

    session.resume();
    session.fixedUpdate(1 / 60);

    expect(state.enemies).not.toContain(escapedEnemy);
    expect(state.simulationTimeSeconds).toBeCloseTo(1 / 60);
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
      [createMovementIntent(-1, 0), FIRST_SPAWN_DELAY_SECONDS],
      [createMovementIntent(0, 1), SPAWN_INTERVAL_SECONDS],
      [createMovementIntent(1, 0), SPAWN_INTERVAL_SECONDS],
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
    expect(state.nextAttackAtSeconds).toBe(1);
  });

  it("does not fire before the cooldown deadline", () => {
    const state = createInitialRuntimeState();
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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

  it("replays the same first attack and projectile ID after restart", () => {
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
    const steps = [FIRST_SPAWN_DELAY_SECONDS, 0.25] as const;
    session.start();

    for (const deltaSeconds of steps) session.fixedUpdate(deltaSeconds);
    session.render();
    const firstRun = snapshots.at(-1);

    session.restart();
    for (const deltaSeconds of steps) session.fixedUpdate(deltaSeconds);
    session.render();
    const restartedRun = snapshots.at(-1);

    expect(firstRun?.projectiles).toEqual([
      { id: 1, x: 180, y: 400, collisionRadius: 4 },
    ]);
    expect(randomSource.resetCount).toBe(1);
    expect(restartedRun).toEqual(firstRun);
  });
});

describe("GameRuntimeSession projectile hit resolution", () => {
  it("retires a hitting projectile before the next renderer snapshot", () => {
    const state = createInitialRuntimeState();
    state.nextEnemySpawnAtSeconds = 100;
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
    expect(state.enemies[0]?.phase).toBe("active");
    expect(state.projectiles).toEqual([]);
    expect(snapshots.at(-1)?.projectiles).toEqual([]);
  });

  it("does not apply damage again on the next fixed update", () => {
    const state = createInitialRuntimeState();
    state.nextEnemySpawnAtSeconds = 100;
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
    expect(state.projectiles).toEqual([]);

    session.fixedUpdate(0.01);
    expect(state.enemies[0]?.currentHealth).toBe(2);
  });

  it("allows two projectiles to damage the same active enemy in one update", () => {
    const state = createInitialRuntimeState();
    state.nextEnemySpawnAtSeconds = 100;
    state.nextAttackAtSeconds = 100;
    addEnemy(state, 1, state.player.position, "active");
    addProjectile(state, 1, state.player.position);
    addProjectile(state, 2, state.player.position);
    const { session } = createSession(
      state,
      new SequenceRandomSource([BOTTOM_CENTER_DISTANCE]),
    );

    session.fixedUpdate(0.01);

    expect(state.enemies[0]?.currentHealth).toBe(-1);
    expect(state.enemies[0]?.phase).toBe("active");
    expect(state.projectiles).toEqual([]);
  });
});

describe("GameRuntimeSession projectile movement and presentation", () => {
  it("moves a seeded projectile without an eligible target", () => {
    const state = createInitialRuntimeState();
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
    state.nextEnemySpawnAtSeconds = 100;
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
