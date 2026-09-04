export {
  getUpgradeDefinition,
  INITIAL_UPGRADE_DEFINITIONS,
} from "./UpgradeDefinition.js";
export type {
  FireRateUpgradeEffect,
  MovementSpeedUpgradeEffect,
  UpgradeDefinition,
  UpgradeEffect,
  UpgradeId,
  VitalityUpgradeEffect,
} from "./UpgradeDefinition.js";
export {
  calculateVitalityUpgradeHealth,
  createInitialRunUpgradeState,
  createRunUpgradeState,
  getEffectiveAttackCooldownSeconds,
  getEffectiveMaximumHealth,
  getEffectiveMovementSpeedUnitsPerSecond,
  isUpgradeEligible,
} from "./RunUpgradeState.js";
export type {
  RunUpgradeState,
  UpgradeLevels,
  VitalityHealthResult,
} from "./RunUpgradeState.js";
