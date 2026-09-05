import type { UpgradeId } from "./domain/upgrades/index.js";

/** Immutable player-facing details for one offered run upgrade. */
export interface UpgradeOption {
  readonly id: UpgradeId;
  readonly title: string;
  readonly description: string;
}

/** Discrete immutable gameplay milestones emitted to standalone hosts. */
export type GameEvent =
  | {
      readonly type: "wave-started";
      readonly waveNumber: number;
      /** Omitted by legacy normal-wave events; lets hosts announce boss entry. */
      readonly encounterKind?: "normal-wave" | "boss";
    }
  | {
      readonly type: "wave-cleared";
      readonly waveNumber: number;
    }
  | {
      readonly type: "upgrade-choice-requested";
      readonly clearedWaveNumber: number;
      readonly options: readonly UpgradeOption[];
    };
