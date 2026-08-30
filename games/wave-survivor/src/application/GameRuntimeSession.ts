import type { GameTheme } from "../GameTheme.js";
import type {
  GamePresentationPort,
  GameRenderSnapshot,
  JoystickRenderSnapshot,
  ProjectileRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import type { RandomSource } from "../domain/RandomSource.js";
import { VISIBLE_ARENA_BOUNDS } from "../domain/arena/index.js";
import {
  BASIC_ATTACK_DEFINITION,
  findNearestTargetableEnemy,
} from "../domain/combat/index.js";
import {
  BASIC_ENEMY_DEFINITION,
  calculateNextEnemyPosition,
  createBasicEnemyState,
  getEnemyPhaseAfterBoundsIntersection,
  isEnemyStateValid,
  shouldRetainEnemyWithinBounds,
} from "../domain/enemies/index.js";
import { calculateNextPlayerPosition } from "../domain/movement/PlayerMovement.js";
import {
  createBasicProjectileState,
  hasProjectileExpired,
  isProjectileStateValid,
  moveProjectile,
  shouldRetainProjectileWithinBounds,
} from "../domain/projectiles/index.js";
import {
  ENTRY_LEAD_SECONDS,
  DESPAWN_EXTRA_MARGIN,
  MAX_LIVE_ENEMIES,
  MAX_SPAWN_ATTEMPTS,
  MINIMUM_CONTACT_TIME_SECONDS,
  SPAWN_INTERVAL_SECONDS,
  createEnemyDespawnBounds,
  expandBoundsByOffset,
  tryCreateFairEnemySpawnCandidate,
} from "../domain/spawning/index.js";
import {
  createInitialRuntimeState,
  type RuntimePhase,
  type RuntimeState,
} from "../domain/state/RuntimeState.js";

const SPAWN_TIME_EPSILON_SECONDS = 1e-9;
const ENEMY_DESPAWN_BOUNDS = createEnemyDespawnBounds(
  VISIBLE_ARENA_BOUNDS,
  BASIC_ENEMY_DEFINITION,
  ENTRY_LEAD_SECONDS,
  DESPAWN_EXTRA_MARGIN,
);
const PROJECTILE_DESPAWN_BOUNDS = expandBoundsByOffset(
  VISIBLE_ARENA_BOUNDS,
  BASIC_ATTACK_DEFINITION.projectileDespawnMargin,
);

/** Owns the current deterministic session and coordinates one fixed update. */
export class GameRuntimeSession {
  constructor(
    private state: RuntimeState,
    private input: MovementInputPort | null,
    private presentation: GamePresentationPort | null,
    private readonly randomSource: RandomSource,
    private readJoystickSnapshot:
      | (() => JoystickRenderSnapshot | null)
      | null = null,
  ) {}

  get phase(): RuntimePhase {
    return this.state.phase;
  }

  start(): boolean {
    if (this.state.phase !== "idle") return false;

    this.state.phase = "playing";
    return true;
  }

  pause(): boolean {
    if (this.state.phase !== "playing") return false;

    this.state.phase = "paused";
    this.input?.reset();
    return true;
  }

  resume(): boolean {
    if (this.state.phase !== "paused") return false;

    this.state.phase = "playing";
    return true;
  }

  restart(): void {
    this.input?.reset();
    this.randomSource.reset();
    this.state = createInitialRuntimeState();
    this.state.phase = "playing";
  }

  fixedUpdate(deltaSeconds: number): void {
    if (this.state.phase !== "playing" || !this.input) return;
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;

    const nextSimulationTimeSeconds =
      this.state.simulationTimeSeconds + deltaSeconds;
    if (!Number.isFinite(nextSimulationTimeSeconds)) return;

    const movementIntent = this.input.readMovementIntent();
    this.state.movementIntent = movementIntent;
    this.state.player.position = calculateNextPlayerPosition(
      this.state.player,
      movementIntent,
      deltaSeconds,
    );
    this.spawnEnemyIfDue(nextSimulationTimeSeconds);
    this.moveEnemiesTowardPlayer(deltaSeconds);
    this.activateEnemiesIntersectingVisibleArena();
    this.removeInvalidOrEscapedEnemies();
    this.emitBasicProjectileIfReady(nextSimulationTimeSeconds);
    this.updateProjectiles(deltaSeconds, nextSimulationTimeSeconds);
    this.state.simulationTimeSeconds = nextSimulationTimeSeconds;
  }

  render(): void {
    if (!this.presentation) return;

    const enemies = Object.freeze(
      this.state.enemies.filter(isEnemyStateValid).map((enemy) =>
        Object.freeze({
          id: enemy.id,
          phase: enemy.phase,
          x: enemy.position.x,
          y: enemy.position.y,
          collisionRadius: enemy.collisionRadius,
        }),
      ),
    );
    const projectileSnapshots: ProjectileRenderSnapshot[] = [];
    for (const projectile of this.state.projectiles) {
      if (!isProjectileStateValid(projectile)) continue;

      projectileSnapshots.push(
        Object.freeze({
          id: projectile.id,
          x: projectile.position.x,
          y: projectile.position.y,
          collisionRadius: projectile.collisionRadius,
        }),
      );
    }
    const snapshot: GameRenderSnapshot = {
      phase: this.state.phase,
      simulationTimeSeconds: this.state.simulationTimeSeconds,
      playerX: this.state.player.position.x,
      playerY: this.state.player.position.y,
      playerCollisionRadius: this.state.player.collisionRadius,
      enemies,
      projectiles: Object.freeze(projectileSnapshots),
      joystick: this.readJoystickSnapshot?.() ?? null,
    };
    this.presentation.render(snapshot);
  }

  setTheme(theme: GameTheme): void {
    this.presentation?.setTheme(theme);
  }

  destroy(): void {
    this.state.enemies = [];
    this.state.projectiles = [];

    this.input?.reset();
    this.input?.destroy();
    this.input = null;
    this.readJoystickSnapshot = null;

    this.presentation?.destroy();
    this.presentation = null;
  }

  private spawnEnemyIfDue(simulationTimeSeconds: number): void {
    if (
      simulationTimeSeconds + SPAWN_TIME_EPSILON_SECONDS <
      this.state.nextEnemySpawnAtSeconds
    ) {
      return;
    }

    const nextEnemySpawnAtSeconds =
      simulationTimeSeconds + SPAWN_INTERVAL_SECONDS;
    if (!Number.isFinite(nextEnemySpawnAtSeconds)) return;

    // A due opportunity is always consumed, preventing cap or failed-sampling
    // conditions from accumulating a backlog across fixed updates.
    this.state.nextEnemySpawnAtSeconds = nextEnemySpawnAtSeconds;

    const liveEnemyCount = this.state.enemies.filter(
      (enemy) =>
        isEnemyStateValid(enemy) &&
        (enemy.phase === "entering" || enemy.phase === "active"),
    ).length;
    if (liveEnemyCount >= MAX_LIVE_ENEMIES) return;

    const candidate = tryCreateFairEnemySpawnCandidate(
      VISIBLE_ARENA_BOUNDS,
      BASIC_ENEMY_DEFINITION,
      ENTRY_LEAD_SECONDS,
      this.state.player.position,
      this.state.player.collisionRadius,
      MINIMUM_CONTACT_TIME_SECONDS,
      MAX_SPAWN_ATTEMPTS,
      this.randomSource,
    );
    if (!candidate) return;

    this.state.enemies.push(
      createBasicEnemyState(this.state.nextEnemyId, candidate.position),
    );
    this.state.nextEnemyId += 1;
  }

  /** Newly spawned enemies participate in pursuit during their spawn update. */
  private moveEnemiesTowardPlayer(deltaSeconds: number): void {
    for (const enemy of this.state.enemies) {
      if (!isEnemyStateValid(enemy)) continue;

      enemy.position = calculateNextEnemyPosition(
        enemy,
        this.state.player.position,
        deltaSeconds,
      );
    }
  }

  private activateEnemiesIntersectingVisibleArena(): void {
    for (const enemy of this.state.enemies) {
      if (!isEnemyStateValid(enemy)) continue;

      enemy.phase = getEnemyPhaseAfterBoundsIntersection(
        enemy,
        VISIBLE_ARENA_BOUNDS,
      );
    }
  }

  private removeInvalidOrEscapedEnemies(): void {
    this.state.enemies = this.state.enemies.filter((enemy) =>
      shouldRetainEnemyWithinBounds(enemy, ENEMY_DESPAWN_BOUNDS),
    );
  }

  private emitBasicProjectileIfReady(simulationTimeSeconds: number): void {
    if (
      !Number.isFinite(this.state.nextAttackAtSeconds) ||
      this.state.nextAttackAtSeconds < 0 ||
      simulationTimeSeconds < this.state.nextAttackAtSeconds
    ) {
      return;
    }

    const target = findNearestTargetableEnemy(
      this.state.player.position,
      this.state.enemies,
    );
    if (!target) return;

    const nextAttackAtSeconds =
      simulationTimeSeconds + BASIC_ATTACK_DEFINITION.cooldownSeconds;
    if (!Number.isFinite(nextAttackAtSeconds)) return;

    this.state.projectiles.push(
      createBasicProjectileState(
        this.state.nextProjectileId,
        this.state.player.position,
        target.position,
        simulationTimeSeconds,
      ),
    );
    this.state.nextProjectileId += 1;
    this.state.nextAttackAtSeconds = nextAttackAtSeconds;
  }

  /** Newly emitted projectiles move during their emission update. */
  private updateProjectiles(
    deltaSeconds: number,
    simulationTimeSeconds: number,
  ): void {
    let retainedProjectileCount = 0;

    for (const projectile of this.state.projectiles) {
      moveProjectile(projectile, deltaSeconds);

      if (
        !isProjectileStateValid(projectile) ||
        hasProjectileExpired(projectile, simulationTimeSeconds) ||
        !shouldRetainProjectileWithinBounds(
          projectile,
          PROJECTILE_DESPAWN_BOUNDS,
        )
      ) {
        continue;
      }

      this.state.projectiles[retainedProjectileCount] = projectile;
      retainedProjectileCount += 1;
    }

    this.state.projectiles.length = retainedProjectileCount;
  }
}
