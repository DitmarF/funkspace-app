import { clamp } from "@funkspace/common/motion";

import {
  PARTICLE_SETTINGS,
  DEFAULT_PARTICLE_CONFIG,
  DEFAULT_PARTICLE_SEED,
  type ParticleConfig,
} from "./ParticleSettings";
export {
  DEFAULT_PARTICLE_CONFIG,
  DEFAULT_PARTICLE_SEED,
  MAX_PARTICLE_COUNT,
  type ParticleConfig,
} from "./ParticleSettings";

/** Simulation dimensions and positions are CSS pixels, never backing pixels. */
export type ParticleBounds = Readonly<{ width: number; height: number }>;

export type Particle = {
  readonly id: number;
  x: number;
  y: number;
  /** Seeded base velocity in CSS px/s; configuration speed is applied at update. */
  readonly velocityX: number;
  readonly velocityY: number;
  readonly baseRadius: number;
};

/**
 * One owner's mutable state. Create with createParticleScene; change only through
 * this module's functions. Renderers may borrow it synchronously, but must not
 * mutate it. Updates allocate no particle objects/arrays. Snapshot with
 * getParticleStill when a consumer needs independently retained data.
 */
export type ParticleSceneState = {
  readonly seed: number;
  config: ParticleConfig;
  /** Last valid bounds, retained while suspended; null before any valid bounds. */
  bounds: ParticleBounds | null;
  suspended: boolean;
  readonly particles: Particle[];
};

export type ParticleStill = Readonly<{
  seed: number;
  config: ParticleConfig;
  bounds: ParticleBounds | null;
  particles: readonly Readonly<{
    id: number;
    x: number;
    y: number;
    radius: number;
  }>[];
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalize(
  value: unknown,
  previous: number,
  minimum: number,
  maximum: number,
  step: number,
): number {
  if (!finite(value)) return previous;
  const units = (clamp(value, minimum, maximum) - minimum) / step;
  // Compensate only for floating-point noise at a half-step; ties go upward.
  const rounded = Math.round(units + 4 * Number.EPSILON * Math.max(1, units));
  return Number(clamp(minimum + rounded * step, minimum, maximum).toFixed(2));
}

export function normalizeParticleSetting(
  value: unknown,
  previous: number,
  key: keyof ParticleConfig,
): number {
  const { min, max, step } = PARTICLE_SETTINGS.controls[key];
  return normalize(value, previous, min, max, step);
}

function effectiveConfig(
  input: unknown,
  previous: ParticleConfig,
): ParticleConfig {
  if (!isRecord(input)) return previous;
  return Object.freeze({
    count: normalizeParticleSetting(input.count, previous.count, "count"),
    speed: normalizeParticleSetting(input.speed, previous.speed, "speed"),
    size: normalizeParticleSetting(input.size, previous.size, "size"),
    connectionsPerParticle: normalizeParticleSetting(
      input.connectionsPerParticle,
      previous.connectionsPerParticle,
      "connectionsPerParticle",
    ),
    connectionDistance: normalizeParticleSetting(
      input.connectionDistance,
      previous.connectionDistance,
      "connectionDistance",
    ),
  });
}

function validBounds(input: unknown): ParticleBounds | null {
  if (
    !isRecord(input) ||
    !finite(input.width) ||
    !finite(input.height) ||
    input.width <= 0 ||
    input.height <= 0
  )
    return null;
  return Object.freeze({ width: input.width, height: input.height });
}

/** Euclidean wrap, including rounding back to the upper edge on tiny bounds. */
function wrap(position: number, extent: number): number {
  const remainder = position % extent;
  const positive = remainder < 0 ? remainder + extent : remainder;
  return positive === 0 || positive >= extent ? 0 : positive;
}

function seedValue(input: unknown): number {
  return finite(input) &&
    Number.isInteger(input) &&
    input >= 0 &&
    input <= 0xffffffff
    ? input
    : DEFAULT_PARTICLE_SEED;
}

function createParticle(
  seed: number,
  id: number,
  bounds: ParticleBounds,
): Particle {
  // Local Mulberry32 stream keyed by seed and population slot. No retained PRNG
  // cursor: appending/resetting never consumes randomness for surviving particles.
  let cursor = (seed + Math.imul(id, 0x9e3779b9)) >>> 0;
  const sample = () => {
    cursor = (cursor + 0x6d2b79f5) >>> 0;
    let value = Math.imul(cursor ^ (cursor >>> 15), cursor | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
  };
  const x = wrap(sample() * bounds.width, bounds.width);
  const y = wrap(sample() * bounds.height, bounds.height);
  const direction = sample() * 2 * Math.PI;
  const [minSpeed, maxSpeed] = PARTICLE_SETTINGS.particles.speedCssPxPerSecond;
  const speed = minSpeed + sample() * (maxSpeed - minSpeed);
  const [minRadius, maxRadius] = PARTICLE_SETTINGS.particles.radiusCssPx;
  const baseRadius = minRadius + sample() * (maxRadius - minRadius);
  return {
    id,
    x,
    y,
    velocityX: Math.cos(direction) * speed,
    velocityY: Math.sin(direction) * speed,
    baseRadius,
  };
}

function reconcilePopulation(state: ParticleSceneState): void {
  if (!state.bounds) return;
  state.particles.length = Math.min(state.particles.length, state.config.count);
  while (state.particles.length < state.config.count) {
    state.particles.push(
      createParticle(state.seed, state.particles.length, state.bounds),
    );
  }
}

/** Invalid initial values use defaults; malformed config fields retain prior values. */
export function createParticleScene(
  bounds: unknown,
  config: unknown = DEFAULT_PARTICLE_CONFIG,
  seed: unknown = DEFAULT_PARTICLE_SEED,
): ParticleSceneState {
  const state: ParticleSceneState = {
    seed: seedValue(seed),
    config: effectiveConfig(config, DEFAULT_PARTICLE_CONFIG),
    bounds: null,
    suspended: true,
    particles: [],
  };
  resizeParticleScene(state, bounds);
  return state;
}

/** Partial config; invalid fields retain prior values, finite values clamp/snap. */
export function configureParticles(
  state: ParticleSceneState,
  input: unknown,
): ParticleConfig {
  state.config = effectiveConfig(input, state.config);
  reconcilePopulation(state);
  return state.config;
}

/** Invalid/zero bounds suspend; later valid bounds scale from the last valid size. */
export function resizeParticleScene(
  state: ParticleSceneState,
  input: unknown,
): boolean {
  const next = validBounds(input);
  if (!next) {
    state.suspended = true;
    return false;
  }
  if (state.bounds) {
    for (const particle of state.particles) {
      if (next.width !== state.bounds.width) {
        particle.x = wrap(
          (particle.x / state.bounds.width) * next.width,
          next.width,
        );
      }
      if (next.height !== state.bounds.height) {
        particle.y = wrap(
          (particle.y / state.bounds.height) * next.height,
          next.height,
        );
      }
    }
  }
  state.bounds = next;
  state.suspended = false;
  reconcilePopulation(state);
  return true;
}

/** Apply the configured bounded delta; excess is dropped. The eventual adapter supplies zero on resume. */
export function advanceParticles(
  state: ParticleSceneState,
  deltaMilliseconds: unknown,
): number {
  if (state.suspended || !state.bounds || !finite(deltaMilliseconds)) return 0;
  const elapsed = clamp(
    deltaMilliseconds,
    0,
    PARTICLE_SETTINGS.simulation.maxDeltaMs,
  );
  if (elapsed === 0) return 0;
  const seconds = (elapsed / 1000) * state.config.speed;
  for (const particle of state.particles) {
    particle.x = wrap(
      particle.x + particle.velocityX * seconds,
      state.bounds.width,
    );
    particle.y = wrap(
      particle.y + particle.velocityY * seconds,
      state.bounds.height,
    );
  }
  return elapsed;
}

/** Reset at current config/last valid bounds; no clock, play intent or default restore. */
export function resetParticles(state: ParticleSceneState): void {
  state.particles.length = 0;
  reconcilePopulation(state);
}

/** Discrete independent snapshot, shared by static presentation and diagnostic fixtures. */
export function getParticleStill(state: ParticleSceneState): ParticleStill {
  return Object.freeze({
    seed: state.seed,
    config: state.config,
    bounds: state.bounds,
    particles: Object.freeze(
      state.particles.map((particle) =>
        Object.freeze({
          id: particle.id,
          x: particle.x,
          y: particle.y,
          radius: particle.baseRadius * state.config.size,
        }),
      ),
    ),
  });
}
