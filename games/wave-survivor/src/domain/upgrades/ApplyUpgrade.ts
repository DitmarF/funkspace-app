import {
  calculateVitalityUpgradeHealth,
  createRunUpgradeState,
  getEffectiveMaximumHealth,
  isUpgradeEligible,
  type RunUpgradeState,
} from "./RunUpgradeState.js";
import { getUpgradeDefinition } from "./UpgradeDefinition.js";

export interface AppliedRunUpgrade {
  readonly upgrades: Readonly<RunUpgradeState>;
  readonly currentHealth: number;
}

/**
 * Validate and calculate one run-upgrade application without mutating inputs.
 */
export function applyRunUpgrade(
  upgradeId: string,
  state: Readonly<RunUpgradeState>,
  currentHealth: number,
  baseMaximumHealth: number,
): Readonly<AppliedRunUpgrade> | null {
  const definition = getUpgradeDefinition(upgradeId);
  if (!definition) return null;

  let validatedState: Readonly<RunUpgradeState>;
  try {
    validatedState = createRunUpgradeState(state.levels);
  } catch {
    return null;
  }

  if (!isUpgradeEligible(definition.id, validatedState)) return null;
  if (!Number.isFinite(baseMaximumHealth) || baseMaximumHealth <= 0) {
    return null;
  }

  const currentMaximumHealth = getEffectiveMaximumHealth(
    baseMaximumHealth,
    validatedState,
  );
  if (
    !Number.isFinite(currentHealth) ||
    currentHealth < 0 ||
    currentHealth > currentMaximumHealth
  ) {
    return null;
  }

  const upgrades = createRunUpgradeState({
    ...validatedState.levels,
    [definition.id]: validatedState.levels[definition.id] + 1,
  });
  const nextCurrentHealth =
    definition.effect.kind === "vitality"
      ? calculateVitalityUpgradeHealth(currentHealth, currentMaximumHealth)
          .currentHealth
      : currentHealth;

  return Object.freeze({ upgrades, currentHealth: nextCurrentHealth });
}
