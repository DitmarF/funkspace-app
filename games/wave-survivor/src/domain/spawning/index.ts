export {
  mapPerimeterDistance,
  samplePerimeterPoint,
} from "./PerimeterSampling.js";
export type { PerimeterEdge, PerimeterSample } from "./PerimeterSampling.js";
export {
  calculateEnemySpawnOffset,
  createEnemySpawnCandidate,
  ENTRY_LEAD_SECONDS,
  expandBoundsByOffset,
} from "./SpawnGeometry.js";
