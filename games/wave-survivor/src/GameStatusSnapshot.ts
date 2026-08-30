/** Discrete, immutable game state that a semantic host may present. */
export interface GameStatusSnapshot {
  readonly phase: "idle" | "playing" | "paused" | "lost";
  readonly currentHealth: number;
  readonly maximumHealth: number;
  readonly killCount: number;
}
