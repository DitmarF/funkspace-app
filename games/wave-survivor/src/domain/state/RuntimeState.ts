import { ARENA } from "../arena/index.js";
import type { EnemyState } from "../enemies/index.js";
import type { LogicalPosition } from "../geometry/index.js";
import {
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../movement/index.js";
import type { ProjectileState } from "../projectiles/index.js";
import {
  createInitialRunUpgradeState,
  type RunUpgradeState,
  type UpgradeId,
} from "../upgrades/index.js";
import {
  createWaveScheduleProgress,
  PROVISIONAL_EPIC_5_WAVES,
  type WaveScheduleProgress,
} from "../waves/index.js";

export const PLAYER_COLLISION_RADIUS = 12;

/** Initial movement tuning value; subject to playtesting and balance changes. */
export const PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND = 120;

/** Provisional Gate 1 player-health tuning; subject to playtesting. */
export const PROVISIONAL_PLAYER_MAXIMUM_HEALTH = 3;

/** Session lifecycle phases that affect deterministic runtime updates. */
export type RuntimePhase =
  | "idle"
  | "playing"
  | "wave-cleared"
  | "choosing-upgrade"
  | "paused"
  | "lost";

/** Complete mutable runtime state for the single player. */
export interface PlayerState {
  position: LogicalPosition;
  collisionRadius: number;
  /** Immutable run base; effective speed is derived from upgrade levels. */
  readonly movementSpeedUnitsPerSecond: number;
  /** Immutable run base; effective maximum is derived from upgrade levels. */
  readonly maximumHealth: number;
  currentHealth: number;
  invulnerableUntilSeconds: number;
}

/** Minimal deterministic state owned by one Wave Survivor game session. */
export interface RuntimeState {
  /** Single lifecycle authority for the current game session. */
  phase: RuntimePhase;
  simulationTimeSeconds: number;
  movementIntent: MovementIntent;
  player: PlayerState;
  upgrades: Readonly<RunUpgradeState>;
  pendingUpgradeOptionIds: readonly UpgradeId[];
  enemies: EnemyState[];
  nextEnemyId: number;
  waveSchedule: WaveScheduleProgress;
  projectiles: ProjectileState[];
  nextProjectileId: number;
  nextAttackAtSeconds: number;
  killCount: number;
}

/** Create a fresh session ready to be owned by the application controller. */
export function createInitialRuntimeState(): RuntimeState {
  return {
    phase: "idle",
    simulationTimeSeconds: 0,
    movementIntent: ZERO_MOVEMENT_INTENT,
    player: {
      position: {
        x: ARENA.width / 2,
        y: ARENA.height / 2,
      },
      collisionRadius: PLAYER_COLLISION_RADIUS,
      movementSpeedUnitsPerSecond: PROVISIONAL_PLAYER_SPEED_UNITS_PER_SECOND,
      maximumHealth: PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
      currentHealth: PROVISIONAL_PLAYER_MAXIMUM_HEALTH,
      invulnerableUntilSeconds: 0,
    },
    upgrades: createInitialRunUpgradeState(),
    pendingUpgradeOptionIds: Object.freeze([]),
    enemies: [],
    nextEnemyId: 1,
    waveSchedule: createWaveScheduleProgress(1, PROVISIONAL_EPIC_5_WAVES[0]!),
    projectiles: [],
    nextProjectileId: 1,
    nextAttackAtSeconds: 0,
    killCount: 0,
  };
}
