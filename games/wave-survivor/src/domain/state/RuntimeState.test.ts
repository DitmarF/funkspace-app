import { describe, expect, it } from "vitest";
import { ARENA } from "../arena/index.js";
import { createBasicEnemyState } from "../enemies/index.js";
import { ZERO_MOVEMENT_INTENT } from "../movement/index.js";
import { createBasicProjectileState } from "../projectiles/index.js";
import { FIRST_SPAWN_DELAY_SECONDS } from "../spawning/index.js";
import {
  createInitialRuntimeState,
  PLAYER_COLLISION_RADIUS,
  PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
} from "./RuntimeState.js";

describe("createInitialRuntimeState", () => {
  it("centers the player in the logical arena", () => {
    expect(createInitialRuntimeState().player.position).toEqual({
      x: ARENA.width / 2,
      y: ARENA.height / 2,
    });
  });

  it("starts in the idle phase", () => {
    expect(createInitialRuntimeState().phase).toBe("idle");
  });

  it("starts at zero simulation seconds", () => {
    expect(createInitialRuntimeState().simulationTimeSeconds).toBe(0);
  });

  it("starts with zero movement intention", () => {
    expect(createInitialRuntimeState().movementIntent).toBe(
      ZERO_MOVEMENT_INTENT,
    );
  });

  it("starts with deterministic empty enemy state", () => {
    const state = createInitialRuntimeState();

    expect(state.enemies).toEqual([]);
    expect(state.nextEnemyId).toBe(1);
    expect(state.nextEnemySpawnAtSeconds).toBe(FIRST_SPAWN_DELAY_SECONDS);
    expect(state.killCount).toBe(0);
  });

  it("starts with deterministic empty projectile state", () => {
    const state = createInitialRuntimeState();

    expect(state.projectiles).toEqual([]);
    expect(state.nextProjectileId).toBe(1);
    expect(state.nextAttackAtSeconds).toBe(0);
  });

  it("uses the marker radius and provisional movement speed", () => {
    const state = createInitialRuntimeState();

    expect(PLAYER_COLLISION_RADIUS).toBe(12);
    expect(PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND).toBe(120);
    expect(state.player.collisionRadius).toBe(PLAYER_COLLISION_RADIUS);
    expect(state.player.movementSpeedUnitsPerSecond).toBe(
      PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
    );
  });

  it("creates independent state and player instances", () => {
    const first = createInitialRuntimeState();
    const second = createInitialRuntimeState();

    expect(first).not.toBe(second);
    expect(first.player).not.toBe(second.player);
  });

  it("does not share player positions between sessions", () => {
    const first = createInitialRuntimeState();
    const second = createInitialRuntimeState();

    expect(first.player.position).not.toBe(second.player.position);

    first.player.position.x = 0;

    expect(second.player.position.x).toBe(ARENA.width / 2);
  });

  it("does not share mutable enemy collections between sessions", () => {
    const first = createInitialRuntimeState();
    const second = createInitialRuntimeState();

    expect(first.enemies).not.toBe(second.enemies);

    first.enemies.push(
      createBasicEnemyState(first.nextEnemyId, { x: 0, y: 0 }),
    );

    expect(second.enemies).toEqual([]);
  });

  it("does not share mutable projectile collections between sessions", () => {
    const first = createInitialRuntimeState();
    const second = createInitialRuntimeState();

    expect(first.projectiles).not.toBe(second.projectiles);

    first.projectiles.push(
      createBasicProjectileState(
        first.nextProjectileId,
        first.player.position,
        { x: first.player.position.x + 1, y: first.player.position.y },
        first.simulationTimeSeconds,
      ),
    );

    expect(second.projectiles).toEqual([]);
  });

  it("creates clean enemy state for a restarted session", () => {
    const progressedState = createInitialRuntimeState();
    progressedState.enemies.push(
      createBasicEnemyState(progressedState.nextEnemyId, { x: -12, y: 320 }),
    );
    progressedState.nextEnemyId += 1;
    progressedState.nextEnemySpawnAtSeconds = 99;
    progressedState.enemies[0]!.phase = "dying";
    progressedState.enemies[0]!.removeAtSimulationSeconds = 99;
    progressedState.killCount = 1;

    const restartedState = createInitialRuntimeState();

    expect(restartedState.enemies).toEqual([]);
    expect(restartedState.nextEnemyId).toBe(1);
    expect(restartedState.nextEnemySpawnAtSeconds).toBe(
      FIRST_SPAWN_DELAY_SECONDS,
    );
    expect(restartedState.killCount).toBe(0);
  });

  it("creates clean projectile state for a restarted session", () => {
    const progressedState = createInitialRuntimeState();
    progressedState.projectiles.push(
      createBasicProjectileState(
        progressedState.nextProjectileId,
        progressedState.player.position,
        {
          x: progressedState.player.position.x + 1,
          y: progressedState.player.position.y,
        },
        progressedState.simulationTimeSeconds,
      ),
    );
    progressedState.nextProjectileId += 1;
    progressedState.nextAttackAtSeconds = 99;

    const restartedState = createInitialRuntimeState();

    expect(restartedState.projectiles).toEqual([]);
    expect(restartedState.nextProjectileId).toBe(1);
    expect(restartedState.nextAttackAtSeconds).toBe(0);
  });
});
