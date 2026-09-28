/** Provisional visual tuning, not additional user controls or accepted budgets. */
export const PARTICLE_CONNECTIONS = Object.freeze({
  distance: 80, // CSS pixels between centers; unrelated to DPR or particle size.
  width: 1, // CSS pixel stroke.
  opacity: 0.35, // Maximum; linearly fades to zero at distance.
  perParticle: 3,
  maxLines: 240,
  candidatesPerParticle: 64,
  maxParticles: 240,
});

type Point = Readonly<{ x: number; y: number }>;
type Connection = { from: number; to: number; opacity: number };
type Sample = {
  readonly links: readonly Readonly<Connection>[];
  count: number;
  candidateChecks: number;
};

/**
 * A pure derived view, not a simulation: no lifetime, randomness or forces.
 * Each owner keeps one sampler. Its result is borrowed until the next sample;
 * only links[0..count) are active. Points and their order are never modified.
 * Reused buffers bound work/allocation; grid keys still allocate per sample.
 */
export function createParticleConnectionSampler() {
  const rules = PARTICLE_CONNECTIONS;
  const heads = new Map<string, number>();
  const next = new Int16Array(rules.maxParticles);
  const degree = new Uint8Array(rules.maxParticles);
  const links = Array.from({ length: rules.maxLines }, () => ({
    from: 0,
    to: 0,
    opacity: 0,
  }));
  const result: Sample = { links, count: 0, candidateChecks: 0 };
  const valid = (point: Point) =>
    Number.isFinite(point.x) &&
    Number.isFinite(point.y) &&
    Math.abs(point.x / rules.distance) < Number.MAX_SAFE_INTEGER - 1 &&
    Math.abs(point.y / rules.distance) < Number.MAX_SAFE_INTEGER - 1;
  const key = (x: number, y: number) => `${x}:${y}`;

  return (points: readonly Point[]): Readonly<Sample> => {
    const length = Math.min(points.length, rules.maxParticles);
    heads.clear();
    degree.fill(0);
    next.fill(-1);
    result.count = 0;
    result.candidateChecks = 0;
    // Reverse insertion leaves each cell in stable ascending input order.
    for (let i = length - 1; i >= 0; i--) {
      const point = points[i];
      if (!valid(point)) continue;
      const cell = key(
        Math.floor(point.x / rules.distance),
        Math.floor(point.y / rules.distance),
      );
      next[i] = heads.get(cell) ?? -1;
      heads.set(cell, i);
    }
    for (let i = 0; i < length && result.count < rules.maxLines; i++) {
      const from = points[i];
      if (!valid(from) || degree[i] >= rules.perParticle) continue;
      const x = Math.floor(from.x / rules.distance),
        y = Math.floor(from.y / rules.distance);
      let checked = 0;
      search: for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          for (
            let j = heads.get(key(x + dx, y + dy)) ?? -1;
            j !== -1;
            j = next[j]
          ) {
            if (checked >= rules.candidatesPerParticle) break search;
            checked++;
            result.candidateChecks++;
            if (j <= i || degree[j] >= rules.perParticle) continue;
            const to = points[j];
            const distance = Math.hypot(to.x - from.x, to.y - from.y);
            // Euclidean screen-space distance: never join across wrap seams.
            if (distance <= 0 || distance >= rules.distance) continue;
            const link = links[result.count++];
            link.from = i;
            link.to = j;
            link.opacity = rules.opacity * (1 - distance / rules.distance);
            degree[i]++;
            degree[j]++;
            if (
              degree[i] >= rules.perParticle ||
              result.count >= rules.maxLines
            )
              break search;
          }
        }
      }
    }
    return result;
  };
}
