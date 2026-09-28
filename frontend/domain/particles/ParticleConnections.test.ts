// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  createParticleConnectionSampler,
  PARTICLE_CONNECTIONS as rules,
} from "./ParticleConnections";
import { createParticleScene, advanceParticles } from "./ParticleScene";

const active = (points: readonly { x: number; y: number }[]) => {
  const result = createParticleConnectionSampler()(points);
  return result.links.slice(0, result.count);
};
describe("temporary proximity connections", () => {
  it("fades with distance and disappears at the threshold without a timer", () => {
    const sample = createParticleConnectionSampler();
    const points = [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
    ];
    expect(sample(points).links[0].opacity).toBeCloseTo(rules.opacity * 0.75);
    points[1].x = 60;
    expect(sample(points).links[0].opacity).toBeCloseTo(rules.opacity * 0.25);
    points[1].x = 80;
    expect(sample(points).count).toBe(0);
    points[1].x = 79;
    expect(sample(points).count).toBe(1);
  });
  it("finds neighbors across cell edges, never duplicates pairs or wraps screen edges", () => {
    expect(
      active([
        { x: 79, y: 79 },
        { x: 81, y: 81 },
      ]),
    ).toHaveLength(1);
    expect(
      active([
        { x: 1, y: 10 },
        { x: 639, y: 10 },
      ]),
    ).toHaveLength(0);
    const links = active([
      { x: 5, y: 5 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ]);
    expect(links).toHaveLength(3);
    expect(new Set(links.map((link) => `${link.from}:${link.to}`)).size).toBe(
      3,
    );
  });
  it("is deterministic and cannot change particle motion, seed or identities", () => {
    const a = createParticleScene({ width: 640, height: 360 });
    const b = createParticleScene({ width: 640, height: 360 });
    const before = structuredClone(a);
    expect(active(a.particles)).toEqual(active(b.particles));
    expect(a).toEqual(before);
    const sample = createParticleConnectionSampler();
    for (let i = 0; i < 20; i++) {
      sample(a.particles);
      advanceParticles(a, 16);
      advanceParticles(b, 16);
    }
    expect(a).toEqual(b);
  });
  it("bounds dense work, degree and total lines even for oversized caller input", () => {
    const points = Array.from({ length: 1000 }, (_, i) => ({
      x: (i % 15) * 2,
      y: Math.floor(i / 15) * 2,
    }));
    const result = createParticleConnectionSampler()(points);
    expect(result.count).toBeGreaterThan(0);
    expect(result.count).toBeLessThanOrEqual(rules.maxLines);
    expect(result.candidateChecks).toBeLessThanOrEqual(
      rules.maxParticles * rules.candidatesPerParticle,
    );
    const degrees = new Map<number, number>();
    for (const link of result.links.slice(0, result.count))
      for (const index of [link.from, link.to]) {
        expect(index).toBeLessThan(240);
        degrees.set(index, (degrees.get(index) ?? 0) + 1);
      }
    expect(Math.max(...degrees.values())).toBeLessThanOrEqual(3);
  });
  it("clears derived links between samples and rejects nonfinite/coincident coordinates", () => {
    const sample = createParticleConnectionSampler();
    expect(
      sample([
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ]).count,
    ).toBe(1);
    expect(sample([]).count).toBe(0);
    expect(
      sample([
        { x: NaN, y: 0 },
        { x: Infinity, y: 1 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ]).count,
    ).toBe(0);
    expect(
      sample([
        { x: Number.MAX_VALUE, y: 0 },
        { x: Number.MAX_VALUE, y: 1 },
      ]).count,
    ).toBe(0);
  });
});
