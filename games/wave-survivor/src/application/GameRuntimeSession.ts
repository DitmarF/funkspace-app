import type { GameTheme } from "../GameTheme.js";
import type { GameStatusSnapshot } from "../GameStatusSnapshot.js";
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
  isPlayerInvulnerable,
  resolvePlayerContactDamage,
  resolveProjectileHit,
} from "../domain/combat/index.js";
import {
  BASIC_ENEMY_DEFINITION,
  calculateNextEnemyPosition,
  createBasicEnemyState,
  getEnemyPhaseAfterBoundsIntersection,
  hasEnemyDyingExpired,
  isEnemyStateValid,
  shouldRetainEnemyWithinBounds,
  transitionEnemyToDying,
} from "../domain/enemies/index.js";
import { calculateNextPlayerPosition } from "../domain/movement/PlayerMovement.js";
import { ZERO_MOVEMENT_INTENT } from "../domain/movement/index.js";
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
  MAX_SPAWN_ATTEMPTS,
  MINIMUM_CONTACT_TIME_SECONDS,
  createEnemyDespawnBounds,
  expandBoundsByOffset,
  tryCreateFairEnemySpawnCandidate,
} from "../domain/spawning/index.js";
import {
  createInitialRuntimeState,
  type RuntimePhase,
  type RuntimeState,
} from "../domain/state/RuntimeState.js";
import {
  advanceWaveSchedule,
  consumeNextScheduledSpawnRequest,
  getDueScheduledSpawnRequest,
  type ScheduledSpawnRequest,
} from "../domain/waves/index.js";

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
  private lastStatusSnapshot: GameStatusSnapshot | null = null;

  constructor(
    private state: RuntimeState,
    private input: MovementInputPort | null,
    private presentation: GamePresentationPort | null,
    private readonly randomSource: RandomSource,
    private readJoystickSnapshot:
      | (() => JoystickRenderSnapshot | null)
      | null = null,
    private onStatusChange:
      | ((snapshot: GameStatusSnapshot) => void)
      | null = null,
  ) {
    this.emitStatusIfChanged();
  }

  get phase(): RuntimePhase {
    return this.state.phase;
  }

  start(): boolean {
    if (this.state.phase !== "idle") return false;

    this.state.phase = "playing";
    this.emitStatusIfChanged();
    return true;
  }

  pause(): boolean {
    if (this.state.phase !== "playing") return false;

    this.state.phase = "paused";
    this.input?.reset();
    this.emitStatusIfChanged();
    return true;
  }

  resume(): boolean {
    if (this.state.phase !== "paused") return false;

    this.state.phase = "playing";
    this.emitStatusIfChanged();
    return true;
  }

  restart(): void {
    this.input?.reset();
    this.randomSource.reset();
    this.state = createInitialRuntimeState();
    this.state.phase = "playing";
    this.lastStatusSnapshot = null;
    this.emitStatusIfChanged();
  }

  fixedUpdate(deltaSeconds: number): void {
    if (this.state.phase !== "playing" || !this.input) return;
    if (this.transitionToLostIfPlayerDefeated()) {
      this.emitStatusIfChanged();
      return;
    }
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
    this.transitionDefeatedEnemies(nextSimulationTimeSeconds);
    advanceWaveSchedule(this.state.waveSchedule, deltaSeconds);
    this.spawnScheduledEnemyIfDue();
    this.moveEnemiesTowardPlayer(deltaSeconds);
    this.activateEnemiesIntersectingVisibleArena();
    this.removeInvalidEscapedOrExpiredEnemies(nextSimulationTimeSeconds);
    this.emitBasicProjectileIfReady(nextSimulationTimeSeconds);
    this.updateProjectiles(deltaSeconds, nextSimulationTimeSeconds);
    // Projectile hits transition defeated enemies before contact eligibility is
    // evaluated, so a same-update defeat cannot damage the player.
    this.resolvePlayerEnemyContact(nextSimulationTimeSeconds);
    this.state.simulationTimeSeconds = nextSimulationTimeSeconds;
    if (this.transitionToLostIfPlayerDefeated()) {
      this.emitStatusIfChanged();
      return;
    }

    this.emitStatusIfChanged();
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
    const joystick = this.readJoystickSnapshot?.() ?? null;
    const snapshot: GameRenderSnapshot = Object.freeze({
      phase: this.state.phase,
      simulationTimeSeconds: this.state.simulationTimeSeconds,
      playerX: this.state.player.position.x,
      playerY: this.state.player.position.y,
      playerCollisionRadius: this.state.player.collisionRadius,
      playerCurrentHealth: this.state.player.currentHealth,
      playerMaximumHealth: this.state.player.maximumHealth,
      isPlayerInvulnerable: isPlayerInvulnerable(
        this.state.player,
        this.state.simulationTimeSeconds,
      ),
      killCount: this.state.killCount,
      enemies,
      projectiles: Object.freeze(projectileSnapshots),
      joystick: joystick ? Object.freeze({ ...joystick }) : null,
    });
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
    this.lastStatusSnapshot = null;
    this.onStatusChange = null;

    this.presentation?.destroy();
    this.presentation = null;
  }

  private spawnScheduledEnemyIfDue(): void {
    const request = getDueScheduledSpawnRequest(this.state.waveSchedule);
    if (!request || !this.isSupportedSpawnRequest(request)) return;

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
    consumeNextScheduledSpawnRequest(this.state.waveSchedule);
  }

  private isSupportedSpawnRequest(request: ScheduledSpawnRequest): boolean {
    return (
      request.enemyId === BASIC_ENEMY_DEFINITION.kind &&
      request.pattern === "random-perimeter"
    );
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

  private transitionDefeatedEnemies(simulationTimeSeconds: number): void {
    for (const enemy of this.state.enemies) {
      if (transitionEnemyToDying(enemy, simulationTimeSeconds)) {
        this.state.killCount += 1;
      }
    }
  }

  private removeInvalidEscapedOrExpiredEnemies(
    simulationTimeSeconds: number,
  ): void {
    this.state.enemies = this.state.enemies.filter(
      (enemy) =>
        shouldRetainEnemyWithinBounds(enemy, ENEMY_DESPAWN_BOUNDS) &&
        !hasEnemyDyingExpired(enemy, simulationTimeSeconds),
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

  /**
   * Projectile IDs are appended monotonically, so this in-place traversal is
   * stable ID order without sorting. Newly emitted projectiles move during
   * their emission update.
   */
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

      if (resolveProjectileHit(projectile, this.state.enemies)) {
        this.transitionDefeatedEnemies(simulationTimeSeconds);
        continue;
      }

      this.state.projectiles[retainedProjectileCount] = projectile;
      retainedProjectileCount += 1;
    }

    this.state.projectiles.length = retainedProjectileCount;
  }

  private resolvePlayerEnemyContact(simulationTimeSeconds: number): void {
    resolvePlayerContactDamage(
      this.state.player,
      this.state.enemies,
      simulationTimeSeconds,
    );
  }

  private transitionToLostIfPlayerDefeated(): boolean {
    if (
      this.state.phase !== "playing" ||
      !Number.isFinite(this.state.player.currentHealth) ||
      this.state.player.currentHealth > 0
    ) {
      return false;
    }

    this.state.player.currentHealth = 0;
    this.state.movementIntent = ZERO_MOVEMENT_INTENT;
    this.state.phase = "lost";
    this.input?.reset();
    return true;
  }

  private emitStatusIfChanged(): void {
    if (!this.onStatusChange) return;

    const previous = this.lastStatusSnapshot;
    if (
      previous?.phase === this.state.phase &&
      previous.currentHealth === this.state.player.currentHealth &&
      previous.maximumHealth === this.state.player.maximumHealth &&
      previous.killCount === this.state.killCount
    ) {
      return;
    }

    const snapshot: GameStatusSnapshot = Object.freeze({
      phase: this.state.phase,
      currentHealth: this.state.player.currentHealth,
      maximumHealth: this.state.player.maximumHealth,
      killCount: this.state.killCount,
    });
    this.lastStatusSnapshot = snapshot;
    this.onStatusChange(snapshot);
  }
}
