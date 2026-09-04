import type { RuntimePhase } from "./domain/state/RuntimeState.js";

/** Discrete, immutable game state that a semantic host may present. */
export interface GameStatusSnapshot {
  readonly phase: RuntimePhase;
  readonly waveNumber: number;
  readonly currentHealth: number;
  readonly maximumHealth: number;
  readonly killCount: number;
}
