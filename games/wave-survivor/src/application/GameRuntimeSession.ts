import type { GameTheme } from "../GameTheme.js";
import type {
  GamePresentationPort,
  GameRenderSnapshot,
  JoystickRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import type { RandomSource } from "../domain/RandomSource.js";
import { VISIBLE_ARENA_BOUNDS } from "../domain/arena/index.js";
import {
  BASIC_ENEMY_DEFINITION,
  calculateNextEnemyPosition,
  createBasicEnemyState,
} from "../domain/enemies/index.js";
import { calculateNextPlayerPosition } from "../domain/movement/PlayerMovement.js";
import {
  ENTRY_LEAD_SECONDS,
  MAX_LIVE_ENEMIES,
  MAX_SPAWN_ATTEMPTS,
  MINIMUM_CONTACT_TIME_SECONDS,
  SPAWN_INTERVAL_SECONDS,
  tryCreateFairEnemySpawnCandidate,
} from "../domain/spawning/index.js";
import {
  createInitialRuntimeState,
  type RuntimePhase,
  type RuntimeState,
} from "../domain/state/RuntimeState.js";

const SPAWN_TIME_EPSILON_SECONDS = 1e-9;

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
    this.state.simulationTimeSeconds = nextSimulationTimeSeconds;
  }

  render(): void {
    if (!this.presentation) return;

    const snapshot: GameRenderSnapshot = {
      phase: this.state.phase,
      simulationTimeSeconds: this.state.simulationTimeSeconds,
      playerX: this.state.player.position.x,
      playerY: this.state.player.position.y,
      playerCollisionRadius: this.state.player.collisionRadius,
      joystick: this.readJoystickSnapshot?.() ?? null,
    };
    this.presentation.render(snapshot);
  }

  setTheme(theme: GameTheme): void {
    this.presentation?.setTheme(theme);
  }

  destroy(): void {
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
      (enemy) => enemy.phase === "entering" || enemy.phase === "active",
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
      enemy.position = calculateNextEnemyPosition(
        enemy,
        this.state.player.position,
        deltaSeconds,
      );
    }
  }
}
