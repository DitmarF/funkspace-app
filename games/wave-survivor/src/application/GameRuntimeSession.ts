import type { GameEvent, UpgradeOption } from "../GameEvent.js";
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
import { advanceChargerBoss } from "../domain/enemies/ChargerBoss.js";
import {
  advanceBossEntry,
  BOSS_DESPAWN_BOUNDS,
  createEnteringBoss,
} from "../domain/enemies/BossEntry.js";
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
  applyRunUpgrade,
  generateUpgradeOptionIds,
  getEffectiveAttackCooldownSeconds,
  getEffectiveMaximumHealth,
  getEffectiveMovementSpeedUnitsPerSecond,
  getUpgradeDefinition,
  INITIAL_UPGRADE_DEFINITIONS,
  type UpgradeId,
} from "../domain/upgrades/index.js";
import {
  advanceWaveSchedule,
  consumeNextScheduledSpawnRequest,
  countEnemiesOccupyingWaveCapacity,
  createWaveScheduleProgress,
  getDueScheduledSpawnRequest,
  isWaveComplete,
  PROVISIONAL_RUN_DEFINITION,
  resolveNextEncounter,
  type ScheduledSpawnRequest,
  type WaveScheduleProgress,
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
const UPGRADE_OPTION_COUNT = 3;
const NO_PENDING_UPGRADE_OPTIONS: readonly UpgradeId[] = Object.freeze([]);

/** Owns the current deterministic session and coordinates one fixed update. */
export class GameRuntimeSession {
  private destroyed = false;
  private lastStatusSnapshot: GameStatusSnapshot | null = null;

  constructor(
    private state: RuntimeState,
    private input: MovementInputPort | null,
    private presentation: GamePresentationPort | null,
    private readonly spawnRandomSource: RandomSource,
    private readonly upgradeRandomSource: RandomSource,
    private readJoystickSnapshot:
      | (() => JoystickRenderSnapshot | null)
      | null = null,
    private onStatusChange:
      | ((snapshot: GameStatusSnapshot) => void)
      | null = null,
    private onEvent: ((event: GameEvent) => void) | null = null,
  ) {
    this.emitStatusIfChanged();
  }

  get phase(): RuntimePhase {
    return this.state.phase;
  }

  get pendingUpgradeOptionIds(): readonly UpgradeId[] {
    return this.state.pendingUpgradeOptionIds;
  }

  start(): boolean {
    if (this.state.phase !== "idle") return false;

    this.state.phase = "playing";
    this.emitStatusIfChanged();
    this.emitWaveStarted();
    return true;
  }

  pause(): boolean {
    if (this.state.phase !== "playing") return false;

    this.state.phase = "paused";
    this.resetMovementInput();
    this.emitStatusIfChanged();
    return true;
  }

  resume(): boolean {
    if (this.state.phase !== "paused") return false;

    this.state.phase = "playing";
    this.emitStatusIfChanged();
    return true;
  }

  /** Enter upgrade choice after the application has prepared valid options. */
  beginUpgradeSelection(): boolean {
    if (
      this.state.waveSchedule === null ||
      this.state.phase !== "wave-cleared" ||
      this.state.pendingUpgradeOptionIds.length === 0
    ) {
      return false;
    }

    this.state.phase = "choosing-upgrade";
    this.emitStatusIfChanged();
    return true;
  }

  /** Apply one pending choice and prepare the next finite wave. */
  chooseUpgrade(upgradeId: string): boolean {
    if (
      this.destroyed ||
      this.state.waveSchedule === null ||
      this.state.phase !== "choosing-upgrade" ||
      !this.state.pendingUpgradeOptionIds.some(
        (pendingUpgradeId) => pendingUpgradeId === upgradeId,
      )
    ) {
      return false;
    }

    const applied = applyRunUpgrade(
      upgradeId,
      this.state.upgrades,
      this.state.player.currentHealth,
      this.state.player.maximumHealth,
    );
    if (!applied) return false;

    let nextWaveSchedule: WaveScheduleProgress | null;
    let boss: ReturnType<typeof createEnteringBoss> | null = null;
    try {
      const next = resolveNextEncounter(
        PROVISIONAL_RUN_DEFINITION,
        this.state.waveSchedule.currentWaveNumber - 1,
      );
      if (next.kind !== "upgrade") return false;
      nextWaveSchedule =
        next.nextEncounter.kind === "normal-wave"
          ? createWaveScheduleProgress(
              this.state.waveSchedule.currentWaveNumber + 1,
              next.nextEncounter.wave,
            )
          : null;
      if (nextWaveSchedule === null)
        boss = createEnteringBoss(
          this.state.nextEnemyId,
          this.state.simulationTimeSeconds,
        );
    } catch {
      return false;
    }

    this.state.upgrades = applied.upgrades;
    this.state.player.currentHealth = applied.currentHealth;
    this.state.pendingUpgradeOptionIds = NO_PENDING_UPGRADE_OPTIONS;
    this.state.waveSchedule = nextWaveSchedule;
    this.state.enemies = boss ? [boss] : [];
    this.state.projectiles = [];
    if (boss) this.state.nextEnemyId += 1;
    this.state.nextAttackAtSeconds = 0;
    this.resetMovementInput();

    const completed = this.completeUpgradeSelection();
    if (completed) this.emitWaveStarted();
    return completed;
  }

  private completeUpgradeSelection(): boolean {
    if (this.state.phase !== "choosing-upgrade") return false;

    this.state.phase = "playing";
    this.emitStatusIfChanged();
    return true;
  }

  restart(): void {
    this.resetMovementInput();
    this.spawnRandomSource.reset();
    this.upgradeRandomSource.reset();
    this.state = createInitialRuntimeState();
    this.state.phase = "playing";
    this.lastStatusSnapshot = null;
    this.emitStatusIfChanged();
    this.emitWaveStarted();
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
      getEffectiveMovementSpeedUnitsPerSecond(
        this.state.player.movementSpeedUnitsPerSecond,
        this.state.upgrades,
      ),
    );
    this.transitionDefeatedEnemies(nextSimulationTimeSeconds);
    if (
      this.state.waveSchedule !== null &&
      countEnemiesOccupyingWaveCapacity(this.state.enemies) <
        this.state.waveSchedule.maxActiveEnemies
    ) {
      advanceWaveSchedule(this.state.waveSchedule, deltaSeconds);
      this.spawnScheduledEnemyIfDue();
    }
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

    if (this.transitionToWaveClearedIfComplete()) {
      const clearedWaveNumber = this.currentEncounterNumber;
      this.emitEvent(
        Object.freeze({
          type: "wave-cleared",
          waveNumber: clearedWaveNumber,
        }),
      );
      this.prepareUpgradeSelection(clearedWaveNumber);
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
          ...(enemy.kind === "charger" &&
          enemy.phase === "entering" &&
          enemy.entryStartedAtSeconds !== null
            ? { entryWarning: "boss" as const }
            : {}),
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
    const playerMaximumHealth = getEffectiveMaximumHealth(
      this.state.player.maximumHealth,
      this.state.upgrades,
    );
    const snapshot: GameRenderSnapshot = Object.freeze({
      phase: this.state.phase,
      simulationTimeSeconds: this.state.simulationTimeSeconds,
      playerX: this.state.player.position.x,
      playerY: this.state.player.position.y,
      playerCollisionRadius: this.state.player.collisionRadius,
      playerCurrentHealth: this.state.player.currentHealth,
      playerMaximumHealth,
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
    if (this.destroyed) return;
    this.destroyed = true;
    this.state.enemies = [];
    this.state.projectiles = [];

    this.input?.reset();
    this.input?.destroy();
    this.input = null;
    this.readJoystickSnapshot = null;
    this.lastStatusSnapshot = null;
    this.onStatusChange = null;
    this.onEvent = null;

    this.presentation?.destroy();
    this.presentation = null;
  }

  private spawnScheduledEnemyIfDue(): void {
    if (this.state.waveSchedule === null) return;
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
      this.spawnRandomSource,
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

      if (
        enemy.kind === "charger" &&
        enemy.phase === "entering" &&
        enemy.entryStartedAtSeconds !== null
      ) {
        advanceBossEntry(
          enemy,
          this.state.simulationTimeSeconds + deltaSeconds,
        );
        continue;
      }
      if (enemy.kind === "charger" && enemy.phase === "active") {
        advanceChargerBoss(
          enemy,
          this.state.player.position,
          this.state.simulationTimeSeconds,
          deltaSeconds,
        );
        continue;
      }
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
      if (enemy.kind === "charger" && enemy.entryStartedAtSeconds !== null)
        continue;

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
        shouldRetainEnemyWithinBounds(
          enemy,
          enemy.kind === "charger" ? BOSS_DESPAWN_BOUNDS : ENEMY_DESPAWN_BOUNDS,
        ) && !hasEnemyDyingExpired(enemy, simulationTimeSeconds),
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
      simulationTimeSeconds +
      getEffectiveAttackCooldownSeconds(
        BASIC_ATTACK_DEFINITION.cooldownSeconds,
        this.state.upgrades,
      );
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
      getEffectiveMaximumHealth(
        this.state.player.maximumHealth,
        this.state.upgrades,
      ),
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
    this.state.phase = "lost";
    this.resetMovementInput();
    return true;
  }

  private transitionToWaveClearedIfComplete(): boolean {
    if (
      this.state.phase !== "playing" ||
      this.state.waveSchedule === null ||
      !isWaveComplete(this.state.waveSchedule, this.state.enemies)
    ) {
      return false;
    }

    this.state.phase = "wave-cleared";
    this.clearCompletedWaveArtifacts();
    return true;
  }

  /** Establish one clean, frozen boundary between completed and future waves. */
  private clearCompletedWaveArtifacts(): void {
    this.state.enemies = [];
    this.state.projectiles = [];
    this.resetMovementInput();
  }

  private prepareUpgradeSelection(clearedWaveNumber: number): void {
    if (
      this.state.phase !== "wave-cleared" ||
      this.state.pendingUpgradeOptionIds.length > 0
    ) {
      return;
    }

    this.state.pendingUpgradeOptionIds = generateUpgradeOptionIds(
      INITIAL_UPGRADE_DEFINITIONS,
      this.state.upgrades,
      UPGRADE_OPTION_COUNT,
      this.upgradeRandomSource,
    );
    if (this.state.pendingUpgradeOptionIds.length === 0) {
      // Temporary EPIC 5 endpoint: publish wave-cleared so hosts can offer
      // restart when every upgrade is capped. Do not request an empty choice.
      this.emitStatusIfChanged();
      return;
    }
    if (!this.beginUpgradeSelection()) return;

    const options = this.createPendingUpgradeOptions();
    this.emitEvent(
      Object.freeze({
        type: "upgrade-choice-requested",
        clearedWaveNumber,
        options,
      }),
    );
  }

  private createPendingUpgradeOptions(): readonly UpgradeOption[] {
    const options: UpgradeOption[] = [];
    for (const upgradeId of this.state.pendingUpgradeOptionIds) {
      const definition = getUpgradeDefinition(upgradeId);
      if (!definition) continue;

      options.push(
        Object.freeze({
          id: definition.id,
          title: definition.title,
          description: definition.description,
        }),
      );
    }

    return Object.freeze(options);
  }

  private emitWaveStarted(): void {
    this.emitEvent(
      Object.freeze({
        type: "wave-started",
        waveNumber: this.currentEncounterNumber,
        ...(this.state.waveSchedule === null
          ? { encounterKind: "boss" as const }
          : {}),
      }),
    );
  }

  private emitEvent(event: GameEvent): void {
    this.onEvent?.(event);
  }

  private resetMovementInput(): void {
    this.state.movementIntent = ZERO_MOVEMENT_INTENT;
    this.input?.reset();
  }

  private emitStatusIfChanged(): void {
    if (!this.onStatusChange) return;

    const maximumHealth = getEffectiveMaximumHealth(
      this.state.player.maximumHealth,
      this.state.upgrades,
    );
    const previous = this.lastStatusSnapshot;
    if (
      previous?.phase === this.state.phase &&
      previous.waveNumber === this.currentEncounterNumber &&
      previous.currentHealth === this.state.player.currentHealth &&
      previous.maximumHealth === maximumHealth &&
      previous.killCount === this.state.killCount
    ) {
      return;
    }

    const snapshot: GameStatusSnapshot = Object.freeze({
      phase: this.state.phase,
      waveNumber: this.currentEncounterNumber,
      currentHealth: this.state.player.currentHealth,
      maximumHealth,
      killCount: this.state.killCount,
    });
    this.lastStatusSnapshot = snapshot;
    this.onStatusChange(snapshot);
  }

  private get currentEncounterNumber(): number {
    return (
      this.state.waveSchedule?.currentWaveNumber ??
      PROVISIONAL_RUN_DEFINITION.normalWaves.length + 1
    );
  }
}
