// @vitest-environment node
import { describe, expect, it } from "vitest";
import { PARTICLE_SETTINGS as settings } from "./ParticleSettings";

describe("authored particle settings safety", () => {
  it("has finite immutable values and valid control defaults/steps", () => {
    const inspect = (value: unknown): void => {
      if (typeof value === "number") expect(Number.isFinite(value)).toBe(true);
      else if (typeof value === "object" && value !== null) {
        expect(Object.isFrozen(value)).toBe(true);
        Object.values(value).forEach(inspect);
      }
    };
    inspect(settings);
    for (const control of Object.values(settings.controls)) {
      expect(control.min).toBeGreaterThan(0);
      expect(control.max).toBeGreaterThanOrEqual(control.min);
      expect(control.default).toBeGreaterThanOrEqual(control.min);
      expect(control.default).toBeLessThanOrEqual(control.max);
      expect(control.step).toBeGreaterThanOrEqual(0.01);
      for (const value of [control.default, control.max]) {
        const units = (value - control.min) / control.step;
        expect(units).toBeCloseTo(Math.round(units), 8);
      }
    }
    // The connection search index reserves -1 as its Int16 sentinel.
    expect(settings.controls.count.max).toBeLessThanOrEqual(32767);
    for (const n of Object.values(settings.controls.count))
      expect(Number.isInteger(n)).toBe(true);
  });
  it("keeps ranges, retry and rendering budgets usable", () => {
    for (const [min, max] of [
      settings.particles.radiusCssPx,
      settings.particles.speedCssPxPerSecond,
      settings.connections.sizeScale,
    ]) {
      expect(min).toBeGreaterThan(0);
      expect(max).toBeGreaterThanOrEqual(min);
    }
    const c = settings.connections;
    for (const value of Object.values(c))
      if (typeof value === "number") expect(value).toBeGreaterThan(0);
    expect(c.opacity).toBeLessThanOrEqual(1);
    expect(c.maxOpacity).toBeLessThanOrEqual(1);
    expect(c.retryDistanceMultiplier).toBeLessThan(1);
    for (const n of [c.maxPasses, c.maxCandidateChecks, c.maxLines])
      expect(Number.isInteger(n)).toBe(true);
    expect(settings.simulation.maxDeltaMs).toBeGreaterThan(0);
    for (const n of Object.values(settings.raster))
      expect(n).toBeGreaterThan(0);
    expect(Number.isInteger(settings.particles.seed)).toBe(true);
    expect(settings.particles.seed).toBeGreaterThanOrEqual(0);
    expect(settings.particles.seed).toBeLessThanOrEqual(0xffffffff);
  });
});
