import { MAX_PARTICLE_COUNT, type ParticleBounds } from "./ParticleScene";

import { PARTICLE_SETTINGS } from "./ParticleSettings";
const settings = PARTICLE_SETTINGS.connections;
/** Derived compatibility view; edit ParticleSettings.ts instead. */
export const PARTICLE_CONNECTIONS = Object.freeze({
  distance: settings.maxDistanceCssPx,
  targetLines: settings.densityTargetLines,
  width: settings.widthCssPx,
  opacity: settings.opacity,
  maxLines: Math.floor(MAX_PARTICLE_COUNT * settings.lineBudgetPerParticle),
  candidatesPerParticle: settings.candidateVisitsPerParticle,
  maxParticles: MAX_PARTICLE_COUNT,
  maxPasses: settings.maxPasses,
});

type Point = Readonly<{ x: number; y: number }>;
type Connection = { from: number; to: number; opacity: number; width: number };
type Sample = {
  readonly links: readonly Readonly<Connection>[];
  count: number;
  candidateChecks: number;
  distance: number;
  limited: boolean;
};

/**
 * Pure derived graph: every noncoincident pair inside the returned distance,
 * once, independent of bucket boundaries and point order. No degree quota.
 * Results/buffers are borrowed until the next call; particles are never changed.
 * If a complete graph exceeds a limit, retry with a smaller radius. Never return
 * an input-order prefix. Exhausted work returns an empty graph at distance 0.
 */
export function createParticleConnectionSampler(
  radiusAt: (index: number) => number = () => settings.referenceRadiusCssPx,
) {
  const rules = PARTICLE_CONNECTIONS;
  const safeRadius = (value: number) =>
    Number.isFinite(value) && value > 0
      ? Math.min(
          value,
          PARTICLE_SETTINGS.particles.radiusCssPx[1] *
            PARTICLE_SETTINGS.controls.size.max,
        )
      : settings.referenceRadiusCssPx;
  const heads = new Map<string, number>();
  const next = new Int16Array(rules.maxParticles);
  const links = Array.from({ length: rules.maxLines }, () => ({
    from: 0,
    to: 0,
    opacity: 0,
    width: 0,
  }));
  const result: Sample = {
    links,
    count: 0,
    candidateChecks: 0,
    distance: 0,
    limited: false,
  };
  const key = (x: number, y: number) => `${x}:${y}`;

  return (
    points: readonly Point[],
    bounds: ParticleBounds | null,
  ): Readonly<Sample> => {
    const length = Math.min(points.length, rules.maxParticles);
    result.count = result.candidateChecks = result.distance = 0;
    result.limited = false;
    if (
      length < 2 ||
      !bounds ||
      !Number.isFinite(bounds.width) ||
      !Number.isFinite(bounds.height) ||
      bounds.width <= 0 ||
      bounds.height <= 0
    )
      return result;
    const area = bounds.width * bounds.height;
    if (!Number.isFinite(area)) return result;
    const target = Math.min(
      rules.targetLines,
      length * settings.densityTargetPerParticle,
    );
    let distance = Math.min(
      rules.distance,
      settings.distanceMultiplier *
        Math.sqrt((2 * target * area) / (Math.PI * length * (length - 1))),
    );
    const budget = rules.maxParticles * rules.candidatesPerParticle;

    for (
      let pass = 0;
      pass < rules.maxPasses && distance > 0;
      pass++, distance *= settings.retryDistanceMultiplier
    ) {
      const valid = (point: Point) =>
        Number.isFinite(point.x) &&
        Number.isFinite(point.y) &&
        Math.abs(point.x / distance) < Number.MAX_SAFE_INTEGER - 1 &&
        Math.abs(point.y / distance) < Number.MAX_SAFE_INTEGER - 1;
      heads.clear();
      next.fill(-1);
      result.count = 0;
      for (let i = length - 1; i >= 0; i--) {
        if (!valid(points[i])) continue;
        const cell = key(
          Math.floor(points[i].x / distance),
          Math.floor(points[i].y / distance),
        );
        next[i] = heads.get(cell) ?? -1;
        heads.set(cell, i);
      }
      let overflow = false;
      scan: for (let i = 0; i < length; i++) {
        const from = points[i];
        if (!valid(from)) continue;
        const x = Math.floor(from.x / distance),
          y = Math.floor(from.y / distance);
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            for (
              let j =
                dx === 0 && dy === 0
                  ? next[i]
                  : (heads.get(key(x + dx, y + dy)) ?? -1);
              j !== -1;
              j = next[j]
            ) {
              if (result.candidateChecks >= budget) {
                result.count = result.distance = 0;
                result.limited = true;
                return result;
              }
              result.candidateChecks++;
              if (j <= i) continue;
              const to = points[j],
                separation = Math.hypot(to.x - from.x, to.y - from.y);
              if (separation <= 0 || separation >= distance) continue;
              if (result.count === rules.maxLines) {
                overflow = true;
                break scan;
              }
              const link = links[result.count++];
              link.from = i;
              link.to = j;
              const size = Math.max(
                settings.sizeScale[0],
                Math.min(
                  settings.sizeScale[1],
                  (safeRadius(radiusAt(i)) + safeRadius(radiusAt(j))) /
                    (2 * settings.referenceRadiusCssPx),
                ),
              );
              link.width = rules.width * size;
              link.opacity =
                Math.min(settings.maxOpacity, rules.opacity * Math.sqrt(size)) *
                Math.sqrt(1 - separation / distance);
            }
          }
      }
      if (!overflow) {
        result.distance = distance;
        return result;
      }
      result.limited = true;
    }
    result.count = result.distance = 0;
    result.limited = true;
    return result;
  };
}
