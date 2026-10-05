/** Authoring source of truth. Edit values here, then reload the scene. No live store. */
export type NumericParticleSetting = Readonly<{
  default: number;
  min: number;
  max: number;
  step: number;
}>;
export type ParticleConfig = Readonly<{
  count: number;
  speed: number;
  size: number;
  connectionsPerParticle: number;
  connectionDistance: number;
}>;
type Range = readonly [min: number, max: number];

export interface ParticleSettings {
  readonly controls: Readonly<
    Record<keyof ParticleConfig, NumericParticleSetting>
  >;
  readonly particles: Readonly<{
    seed: number;
    radiusCssPx: Range;
    speedCssPxPerSecond: Range;
  }>;
  readonly connections: Readonly<{
    maxDistanceCssPx: number;
    densityTargetLines: number;
    densityTargetPerParticle: number;
    maxLines: number;
    widthCssPx: number;
    opacity: number;
    referenceRadiusCssPx: number;
    sizeScale: Range;
    maxOpacity: number;
    maxCandidateChecks: number;
    maxPasses: number;
    retryDistanceMultiplier: number;
  }>;
  readonly simulation: Readonly<{ maxDeltaMs: number }>;
  readonly raster: Readonly<{
    maxDpr: number;
    maxDimensionPx: number;
    maxPixels: number;
  }>;
}

export const PARTICLE_SETTINGS: ParticleSettings = Object.freeze({
  // Controls and direct callers share these defaults, clamps and steps.
  controls: Object.freeze({
    count: Object.freeze({ default: 286, min: 10, max: 1000, step: 1 }),
    speed: Object.freeze({ default: 0.2, min: 0.1, max: 2, step: 0.1 }),
    size: Object.freeze({ default: 0.1, min: 0.1, max: 4, step: 0.1 }),
    connectionsPerParticle: Object.freeze({
      default: 100,
      min: 1,
      max: 100,
      step: 1,
    }),
    connectionDistance: Object.freeze({
      default: 6,
      min: 1,
      max: 10,
      step: 0.1,
    }),
  }),
  particles: Object.freeze({
    seed: 0x46533431,
    // Actual radius = seeded radius × size (CSS px); no viewport/DPR scaling.
    radiusCssPx: Object.freeze([1, 3] as const),
    // Actual velocity = seeded velocity × speed.
    speedCssPxPerSecond: Object.freeze([8, 24] as const),
  }),
  connections: Object.freeze({
    maxDistanceCssPx: 10000, // Ceiling; density normally gives a shorter distance.
    densityTargetLines: 1000, // Formula input, not a promised output line count.
    densityTargetPerParticle: 0.5,
    maxLines: 4800, // Preserve the existing absolute output budget as density grows.
    widthCssPx: 0.4,
    opacity: 1,
    referenceRadiusCssPx: 2,
    sizeScale: Object.freeze([0.8, 1.5] as const),
    maxOpacity: 1,
    // Engineering ceiling, separate from the visitor's per-particle degree cap.
    maxCandidateChecks: 38400, // Shared across all retry passes; independent of count.
    maxPasses: 16,
    retryDistanceMultiplier: 0.5,
  }),
  // Engineering limits; not intended as visitor controls.
  simulation: Object.freeze({ maxDeltaMs: 50 }),
  raster: Object.freeze({
    maxDpr: 2,
    maxDimensionPx: 4096,
    maxPixels: 4000000,
  }),
});

// Derived compatibility exports; never tune these separately.
export const MAX_PARTICLE_COUNT = PARTICLE_SETTINGS.controls.count.max;
export const DEFAULT_PARTICLE_SEED = PARTICLE_SETTINGS.particles.seed;
export const DEFAULT_PARTICLE_CONFIG: ParticleConfig = Object.freeze({
  count: PARTICLE_SETTINGS.controls.count.default,
  speed: PARTICLE_SETTINGS.controls.speed.default,
  size: PARTICLE_SETTINGS.controls.size.default,
  connectionsPerParticle:
    PARTICLE_SETTINGS.controls.connectionsPerParticle.default,
  connectionDistance: PARTICLE_SETTINGS.controls.connectionDistance.default,
});
