export { BASIC_ENEMY_DEFINITION } from "./EnemyDefinition.js";
export type { EnemyDefinition, EnemyKind } from "./EnemyDefinition.js";
export {
  hasEnemyDyingExpired,
  PROVISIONAL_ENEMY_DYING_DURATION_SECONDS,
  transitionEnemyToDying,
} from "./EnemyDefeat.js";
export { calculateNextEnemyPosition } from "./EnemyMovement.js";
export {
  canEnemyDealContactDamage,
  canEnemyPursue,
  createBasicEnemyState,
  getEnemyPhaseAfterBoundsIntersection,
  isEnemyStateValid,
  isEnemyTargetable,
  shouldRetainEnemyWithinBounds,
} from "./EnemyState.js";
export type { EnemyPhase, EnemyState } from "./EnemyState.js";
