export {
  mapPerimeterDistance,
  samplePerimeterPoint,
} from "./PerimeterSampling.js";
export type { PerimeterEdge, PerimeterSample } from "./PerimeterSampling.js";
export {
  calculateEnemyDespawnOffset,
  calculateEnemySpawnOffset,
  createEnemyDespawnBounds,
  createEnemySpawnCandidate,
  DESPAWN_EXTRA_MARGIN,
  ENTRY_LEAD_SECONDS,
  expandBoundsByOffset,
} from "./SpawnGeometry.js";
export {
  calculateEnemyContactTimeSeconds,
  MAX_SPAWN_ATTEMPTS,
  MINIMUM_CONTACT_TIME_SECONDS,
  tryCreateFairEnemySpawnCandidate,
} from "./SpawnFairness.js";
