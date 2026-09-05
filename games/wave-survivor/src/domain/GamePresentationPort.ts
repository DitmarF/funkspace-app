import type { GameTheme } from "../GameTheme.js";
import type { EnemyPhase } from "./enemies/EnemyState.js";
import type { RuntimePhase } from "./state/RuntimeState.js";

/** Immutable enemy data required by the Canvas renderer. */
export interface EnemyRenderSnapshot {
  /** Static top-edge warning during the deliberate boss entry only. */
  readonly entryWarning?: "boss";
  readonly id: number;
  readonly phase: EnemyPhase;
  readonly x: number;
  readonly y: number;
  readonly collisionRadius: number;
}

/** Immutable projectile data required by the Canvas renderer. */
export interface ProjectileRenderSnapshot {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly collisionRadius: number;
}

/** Fixed virtual-joystick geometry expressed in logical arena units. */
export interface JoystickRenderSnapshot {
  readonly active: boolean;
  readonly centerX: number;
  readonly centerY: number;
  readonly baseRadius: number;
  readonly knobX: number;
  readonly knobY: number;
  readonly knobRadius: number;
}

/** Immutable, renderer-facing view of the current session. */
export interface GameRenderSnapshot {
  readonly phase: RuntimePhase;
  readonly simulationTimeSeconds: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly playerCollisionRadius: number;
  readonly playerCurrentHealth: number;
  readonly playerMaximumHealth: number;
  readonly isPlayerInvulnerable: boolean;
  readonly killCount: number;
  readonly enemies: readonly EnemyRenderSnapshot[];
  readonly projectiles: readonly ProjectileRenderSnapshot[];
  readonly joystick: JoystickRenderSnapshot | null;
}

/** Application-facing boundary for the active game renderer. */
export interface GamePresentationPort {
  render(snapshot: GameRenderSnapshot): void;
  setTheme(theme: GameTheme): void;
  destroy(): void;
}
