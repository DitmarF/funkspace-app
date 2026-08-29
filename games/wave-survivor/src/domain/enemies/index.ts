export { BASIC_ENEMY_DEFINITION } from "./EnemyDefinition.js";
export type { EnemyDefinition, EnemyKind } from "./EnemyDefinition.js";
export { calculateNextEnemyPosition } from "./EnemyMovement.js";
export {
  canEnemyDealContactDamage,
  canEnemyPursue,
  createBasicEnemyState,
  isEnemyTargetable,
} from "./EnemyState.js";
export type { EnemyPhase, EnemyState } from "./EnemyState.js";
