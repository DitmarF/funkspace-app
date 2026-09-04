import {
  getUpgradeDefinition,
  INITIAL_UPGRADE_DEFINITIONS,
  RAPID_FIRE_UPGRADE,
  SWIFT_MOVEMENT_UPGRADE,
  VITALITY_UPGRADE,
  type UpgradeId,
} from "./UpgradeDefinition.js";

export type UpgradeLevels = Readonly<Record<UpgradeId, number>>;

/** Immutable run-local progress; WS-5.8 may replace it after valid choices. */
export interface RunUpgradeState {
  readonly levels: UpgradeLevels;
}

export interface VitalityHealthResult {
  readonly currentHealth: number;
  readonly maximumHealth: number;
}

function assertFinitePositive(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be finite and positive.`);
  }
}

/** Validate, copy, and deeply freeze explicit run-upgrade levels. */
export function createRunUpgradeState(
  levels: Partial<Record<UpgradeId, number>> = {},
): Readonly<RunUpgradeState> {
  for (const upgradeId of Object.keys(levels)) {
    if (!getUpgradeDefinition(upgradeId)) {
      throw new TypeError(`Unsupported upgrade ID: ${upgradeId}.`);
    }
  }

  const validatedLevels = {} as Record<UpgradeId, number>;
  for (const definition of INITIAL_UPGRADE_DEFINITIONS) {
    const level = levels[definition.id] ?? 0;
    if (
      !Number.isSafeInteger(level) ||
      level < 0 ||
      level > definition.maximumLevel
    ) {
      throw new RangeError(
        `${definition.title} level must be a safe integer from 0 through ${definition.maximumLevel}.`,
      );
    }
    validatedLevels[definition.id] = level;
  }

  return Object.freeze({ levels: Object.freeze(validatedLevels) });
}

export function createInitialRunUpgradeState(): Readonly<RunUpgradeState> {
  return createRunUpgradeState();
}

/** A leveled upgrade remains eligible only below its configured cap. */
export function isUpgradeEligible(
  upgradeId: string,
  state: Readonly<RunUpgradeState>,
): boolean {
  const definition = getUpgradeDefinition(upgradeId);
  if (!definition) return false;

  const level = state.levels[definition.id];
  return (
    Number.isSafeInteger(level) && level >= 0 && level < definition.maximumLevel
  );
}

/** Derive cooldown from a true fire-rate increase, capped at a safe floor. */
export function getEffectiveAttackCooldownSeconds(
  baseCooldownSeconds: number,
  state: Readonly<RunUpgradeState>,
): number {
  assertFinitePositive(baseCooldownSeconds, "Base attack cooldown");
  const level = state.levels[RAPID_FIRE_UPGRADE.id];
  const rateMultiplier =
    1 + RAPID_FIRE_UPGRADE.effect.rateIncreasePerLevel * level;

  return Math.max(
    RAPID_FIRE_UPGRADE.effect.minimumCooldownSeconds,
    baseCooldownSeconds / rateMultiplier,
  );
}

/** Derive speed as a linear percentage of the immutable base value. */
export function getEffectiveMovementSpeedUnitsPerSecond(
  baseSpeedUnitsPerSecond: number,
  state: Readonly<RunUpgradeState>,
): number {
  assertFinitePositive(baseSpeedUnitsPerSecond, "Base movement speed");
  const level = state.levels[SWIFT_MOVEMENT_UPGRADE.id];

  return (
    baseSpeedUnitsPerSecond *
    (1 + SWIFT_MOVEMENT_UPGRADE.effect.baseSpeedIncreasePerLevel * level)
  );
}

/** Derive maximum health without rewriting the player's immutable base value. */
export function getEffectiveMaximumHealth(
  baseMaximumHealth: number,
  state: Readonly<RunUpgradeState>,
): number {
  assertFinitePositive(baseMaximumHealth, "Base maximum health");
  const level = state.levels[VITALITY_UPGRADE.id];

  return (
    baseMaximumHealth + VITALITY_UPGRADE.effect.maximumHealthIncrease * level
  );
}

/** Calculate vitality's immediate health change without mutating player state. */
export function calculateVitalityUpgradeHealth(
  currentHealth: number,
  currentMaximumHealth: number,
): Readonly<VitalityHealthResult> {
  if (!Number.isFinite(currentHealth) || currentHealth < 0) {
    throw new RangeError("Current health must be finite and non-negative.");
  }
  assertFinitePositive(currentMaximumHealth, "Current maximum health");

  const maximumHealth =
    currentMaximumHealth + VITALITY_UPGRADE.effect.maximumHealthIncrease;
  const boundedCurrentHealth = Math.min(currentHealth, currentMaximumHealth);

  return Object.freeze({
    currentHealth: Math.min(
      maximumHealth,
      boundedCurrentHealth + VITALITY_UPGRADE.effect.immediateHeal,
    ),
    maximumHealth,
  });
}
