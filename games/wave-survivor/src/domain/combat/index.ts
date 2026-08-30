export {
  BASIC_ATTACK_DEFINITION,
  createBasicAttackDefinition,
} from "./BasicAttackDefinition.js";
export type { BasicAttackDefinition } from "./BasicAttackDefinition.js";
export { findNearestTargetableEnemy } from "./NearestEnemyTarget.js";
export {
  isPlayerInvulnerable,
  PROVISIONAL_PLAYER_INVULNERABILITY_DURATION_SECONDS,
  resolvePlayerContactDamage,
} from "./PlayerContactDamage.js";
export { resolveProjectileHit } from "./ProjectileHitResolution.js";
