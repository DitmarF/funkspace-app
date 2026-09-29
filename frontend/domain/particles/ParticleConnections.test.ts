// @vitest-environment node
import {
  PARTICLE_SETTINGS as settings,
  MAX_PARTICLE_COUNT,
} from "./ParticleSettings";
import { describe, expect, it, vi } from "vitest";
import {
  createParticleConnectionSampler,
  PARTICLE_CONNECTIONS as rules,
} from "./ParticleConnections";
import { createParticleScene, advanceParticles } from "./ParticleScene";

const bounds = { width: 640, height: 360 };
type Point = { x: number; y: number };
const pairs = (points: readonly Point[], distance: number) => {
  const found: string[] = [];
  for (let i = 0; i < points.length; i++)
    for (let j = i + 1; j < points.length; j++) {
      const d = Math.hypot(
        points[i].x - points[j].x,
        points[i].y - points[j].y,
      );
      if (d > 0 && d < distance) found.push(`${i}:${j}`);
    }
  return found.sort();
};
const sampledPairs = (points: readonly Point[], geometry = bounds) => {
  const sample = createParticleConnectionSampler()(points, geometry);
  return {
    ...sample,
    pairs: sample.links
      .slice(0, sample.count)
      .map((l) => `${l.from}:${l.to}`)
      .sort(),
  };
};
describe("complete density-adjusted proximity connections", () => {
  it("connects every close pair, including across cells, with no degree quota", () => {
    const points = [
      { x: 39, y: 39 },
      { x: 41, y: 39 },
      { x: 39, y: 41 },
      { x: 41, y: 41 },
      { x: 40, y: 40 },
    ];
    const result = sampledPairs(points);
    expect(result.count).toBe(10);
    expect(result.pairs).toEqual(pairs(points, result.distance));
    expect(new Set(result.pairs).size).toBe(result.count);
  });
  it("is translation and input-order invariant rather than grid-cell grouped", () => {
    const points = createParticleScene(bounds, { count: 240 }).particles;
    const original = sampledPairs(points);
    expect(original.limited).toBe(false);
    expect(original.pairs).toEqual(pairs(points, original.distance));
    const moved = points.map((p) => ({ x: p.x + 13.17, y: p.y - 7.31 }));
    expect(sampledPairs(moved).pairs).toEqual(original.pairs);
    const reverse = sampledPairs([...points].reverse());
    const mapped = reverse.links
      .slice(0, reverse.count)
      .map((l) =>
        [points.length - 1 - l.to, points.length - 1 - l.from].join(":"),
      )
      .sort();
    expect(mapped).toEqual(original.pairs);
  });
  it("keeps the configured range complete and spatially distributed at both counts", () => {
    for (const count of [settings.controls.count.min, MAX_PARTICLE_COUNT]) {
      const state = createParticleScene(bounds, { count });
      const result = sampledPairs(state.particles);
      expect(result.limited).toBe(false);
      const expectedDistance = Math.min(
        rules.distance,
        settings.connections.distanceMultiplier *
          Math.sqrt(
            (2 *
              Math.min(
                rules.targetLines,
                count * settings.connections.densityTargetPerParticle,
              ) *
              bounds.width *
              bounds.height) /
              (Math.PI * count * (count - 1)),
          ),
      );
      expect(result.distance).toBeCloseTo(expectedDistance, 10);
      expect(result.count).toBeGreaterThan(count);
      expect(result.count).toBeLessThanOrEqual(rules.maxLines);
      expect(result.pairs).toEqual(pairs(state.particles, result.distance));
      const quadrants = new Set(
        result.links.slice(0, result.count).map((l) => {
          const p = state.particles[l.from];
          return `${p.x < 320}:${p.y < 180}`;
        }),
      );
      expect(quadrants.size).toBe(4);
    }
  });
  it("scales the threshold with area and density, independently of particle radius", () => {
    const points = createParticleScene(bounds, {
      count: settings.controls.count.min,
    }).particles;
    const sample = createParticleConnectionSampler();
    const small = sample(points, bounds).distance;
    expect(
      sample(
        points.map((p) => ({ x: p.x * 2, y: p.y * 2 })),
        { width: 1280, height: 720 },
      ).distance,
    ).toBeCloseTo(small * 2);
    const dense = createParticleScene(bounds, {
      count: MAX_PARTICLE_COUNT,
    }).particles;
    expect(sample(dense, bounds).distance).toBeLessThan(small);
    expect(
      createParticleConnectionSampler(() => 6)(points, bounds).distance,
    ).toBe(small);
  });
  it("keeps radius-dependent width/brightness and fades to zero at the actual cutoff", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ];
    const small = createParticleConnectionSampler(() => 1)(points, bounds)
      .links[0];
    const large = createParticleConnectionSampler(() => 3)(points, bounds)
      .links[0];
    expect(small.width).toBeCloseTo(
      rules.width * settings.connections.sizeScale[0],
    );
    expect(large.width).toBeCloseTo(
      rules.width * settings.connections.sizeScale[1],
    );
    expect(large.opacity).toBeGreaterThan(small.opacity);
    for (const r of [NaN, Infinity, -1, 0, Number.MAX_VALUE]) {
      const link = createParticleConnectionSampler(() => r)(points, bounds)
        .links[0];
      expect(link.width).toBeGreaterThanOrEqual(
        rules.width * settings.connections.sizeScale[0],
      );
      expect(link.width).toBeLessThanOrEqual(
        rules.width * settings.connections.sizeScale[1],
      );
      expect(link.opacity).toBeGreaterThan(0);
      expect(link.opacity).toBeLessThanOrEqual(settings.connections.maxOpacity);
    }
    points[1].x = rules.distance;
    expect(createParticleConnectionSampler()(points, bounds).count).toBe(0);
  });
  it("reduces the radius for a dense patch instead of returning an order-biased prefix", () => {
    const points = Array.from({ length: 120 }, (_, i) => ({
      x: (i % 10) * 4,
      y: Math.floor(i / 10) * 4,
    }));
    const result = sampledPairs(points);
    expect(result.limited).toBe(true);
    expect(result.count).toBeGreaterThan(0);
    expect(result.count).toBeLessThanOrEqual(rules.maxLines);
    expect(result.pairs).toEqual(pairs(points, result.distance));
    expect(result.candidateChecks).toBeLessThanOrEqual(
      rules.maxParticles * rules.candidatesPerParticle,
    );
  });
  it("bounds pathological work and clears partial output rather than starving a region", async () => {
    // A fixed low work budget makes exhaustion independent of authored capacity.
    vi.resetModules();
    vi.doMock("./ParticleSettings", () => ({
      PARTICLE_SETTINGS: {
        ...settings,
        connections: { ...settings.connections, candidateVisitsPerParticle: 1 },
      },
      MAX_PARTICLE_COUNT,
    }));
    try {
      const { createParticleConnectionSampler: boundedSampler } = await import(
        "./ParticleConnections"
      );
      const points = Array.from({ length: MAX_PARTICLE_COUNT }, (_, i) => ({
        x: 1 + i / MAX_PARTICLE_COUNT,
        y: 1,
      }));
      const result = boundedSampler()(points, bounds);
      expect(result.count).toBe(0);
      expect(result.distance).toBe(0);
      expect(result.limited).toBe(true);
      expect(result.candidateChecks).toBe(MAX_PARTICLE_COUNT);
    } finally {
      vi.doUnmock("./ParticleSettings");
      vi.resetModules();
    }
  });
  it("never changes simulation state and stays deterministic", () => {
    const a = createParticleScene(bounds),
      b = createParticleScene(bounds);
    const sample = createParticleConnectionSampler();
    expect(sampledPairs(a.particles).pairs).toEqual(
      sampledPairs(b.particles).pairs,
    );
    for (let i = 0; i < 20; i++) {
      sample(a.particles, bounds);
      advanceParticles(a, 16);
      advanceParticles(b, 16);
    }
    expect(a).toEqual(b);
  });
  it("clears output for invalid geometry and ignores malformed/nonfinite points", () => {
    const sample = createParticleConnectionSampler();
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ];
    expect(sample(points, bounds).count).toBe(1);
    for (const geometry of [
      null,
      { width: 0, height: 1 },
      { width: NaN, height: 1 },
      { width: 1, height: Infinity },
    ])
      expect(sample(points, geometry).count).toBe(0);
    expect(
      sample(
        [
          { x: NaN, y: 0 },
          { x: Infinity, y: 1 },
          { x: Number.MAX_VALUE, y: 0 },
        ],
        bounds,
      ).count,
    ).toBe(0);
    expect(sample([], bounds).count).toBe(0);
    expect(
      sample(
        [
          { x: 1, y: 10 },
          { x: 639, y: 10 },
        ],
        { width: 100, height: 100 },
      ).count,
    ).toBe(0);
  });
});
