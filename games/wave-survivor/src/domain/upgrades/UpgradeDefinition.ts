/** Stable IDs for the initial, intentionally small run-upgrade set. */
export type UpgradeId = "rapid-fire" | "swift-movement" | "vitality";

export interface FireRateUpgradeEffect {
  readonly kind: "fire-rate";
  readonly rateIncreasePerLevel: number;
  readonly minimumCooldownSeconds: number;
}

export interface MovementSpeedUpgradeEffect {
  readonly kind: "movement-speed";
  readonly baseSpeedIncreasePerLevel: number;
}

export interface VitalityUpgradeEffect {
  readonly kind: "vitality";
  readonly maximumHealthIncrease: number;
  readonly immediateHeal: number;
}

export type UpgradeEffect =
  | FireRateUpgradeEffect
  | MovementSpeedUpgradeEffect
  | VitalityUpgradeEffect;

/** Immutable player-facing configuration for one run upgrade. */
export interface UpgradeDefinition {
  readonly id: UpgradeId;
  readonly title: string;
  readonly description: string;
  readonly maximumLevel: number;
  readonly effect: UpgradeEffect;
}

const MAXIMUM_UPGRADE_LEVEL = 5;

const RAPID_FIRE_EFFECT = Object.freeze({
  kind: "fire-rate",
  rateIncreasePerLevel: 0.1,
  minimumCooldownSeconds: 0.6,
} as const satisfies FireRateUpgradeEffect);

const SWIFT_MOVEMENT_EFFECT = Object.freeze({
  kind: "movement-speed",
  baseSpeedIncreasePerLevel: 0.1,
} as const satisfies MovementSpeedUpgradeEffect);

const VITALITY_EFFECT = Object.freeze({
  kind: "vitality",
  maximumHealthIncrease: 1,
  immediateHeal: 1,
} as const satisfies VitalityUpgradeEffect);

export const RAPID_FIRE_UPGRADE = Object.freeze({
  id: "rapid-fire",
  title: "Rapid Fire",
  description: "Increase fire rate by 10% per level.",
  maximumLevel: MAXIMUM_UPGRADE_LEVEL,
  effect: RAPID_FIRE_EFFECT,
} as const satisfies UpgradeDefinition);

export const SWIFT_MOVEMENT_UPGRADE = Object.freeze({
  id: "swift-movement",
  title: "Swift Movement",
  description: "Increase movement speed by 10% of its base value per level.",
  maximumLevel: MAXIMUM_UPGRADE_LEVEL,
  effect: SWIFT_MOVEMENT_EFFECT,
} as const satisfies UpgradeDefinition);

export const VITALITY_UPGRADE = Object.freeze({
  id: "vitality",
  title: "Vitality",
  description: "Increase maximum health by 1 and immediately heal 1 health.",
  maximumLevel: MAXIMUM_UPGRADE_LEVEL,
  effect: VITALITY_EFFECT,
} as const satisfies UpgradeDefinition);

/** Initial run upgrades in stable presentation order. */
export const INITIAL_UPGRADE_DEFINITIONS: readonly Readonly<UpgradeDefinition>[] =
  Object.freeze([RAPID_FIRE_UPGRADE, SWIFT_MOVEMENT_UPGRADE, VITALITY_UPGRADE]);

/** Resolve a supported upgrade ID without introducing a generic registry. */
export function getUpgradeDefinition(
  upgradeId: string,
): Readonly<UpgradeDefinition> | null {
  return (
    INITIAL_UPGRADE_DEFINITIONS.find(
      (definition) => definition.id === upgradeId,
    ) ?? null
  );
}
