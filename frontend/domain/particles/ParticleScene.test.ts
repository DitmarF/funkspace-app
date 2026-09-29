// @vitest-environment node
import {
  PARTICLE_SETTINGS as settings,
  MAX_PARTICLE_COUNT,
} from "./ParticleSettings";
import { describe, expect, it, vi } from "vitest";
import {
  advanceParticles,
  configureParticles,
  createParticleScene,
  DEFAULT_PARTICLE_CONFIG,
  DEFAULT_PARTICLE_SEED,
  getParticleStill,
  resetParticles,
  resizeParticleScene,
  type ParticleSceneState,
} from "./ParticleScene";

const bounds = { width: 640, height: 360 };
const copy = (state: ParticleSceneState) => structuredClone(state);

function expectBounded(state: ParticleSceneState) {
  expect(state.particles).toHaveLength(state.config.count);
  expect(new Set(state.particles.map((p) => p.id)).size).toBe(
    state.config.count,
  );
  for (const p of state.particles) {
    expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
    expect(p.x).toBeGreaterThanOrEqual(0);
    expect(p.y).toBeGreaterThanOrEqual(0);
    expect(p.x).toBeLessThan(state.bounds!.width);
    expect(p.y).toBeLessThan(state.bounds!.height);
    expect(Math.hypot(p.velocityX, p.velocityY)).toBeGreaterThanOrEqual(
      settings.particles.speedCssPxPerSecond[0] - 1e-12,
    );
    expect(Math.hypot(p.velocityX, p.velocityY)).toBeLessThanOrEqual(
      settings.particles.speedCssPxPerSecond[1] + 1e-12,
    );
    expect(p.baseRadius).toBeGreaterThanOrEqual(
      settings.particles.radiusCssPx[0],
    );
    expect(p.baseRadius).toBeLessThanOrEqual(settings.particles.radiusCssPx[1]);
  }
}

function expectPositionsClose(a: ParticleSceneState, b: ParticleSceneState) {
  expect(a.config).toEqual(b.config);
  expect(a.particles).toHaveLength(b.particles.length);
  a.particles.forEach((p, i) => {
    const other = b.particles[i];
    expect(p.id).toBe(other.id);
    expect(p.velocityX).toBe(other.velocityX);
    expect(p.velocityY).toBe(other.velocityY);
    expect(p.baseRadius).toBe(other.baseRadius);
    expect(Math.abs(p.x - other.x)).toBeLessThan(1e-9);
    expect(Math.abs(p.y - other.y)).toBeLessThan(1e-9);
  });
}

describe("particle initialization and effective configuration", () => {
  it("uses approved defaults and copies inputs rather than borrowing them", () => {
    const inputBounds = { ...bounds };
    const inputConfig = { count: 60, speed: 0.5, size: 1.5 };
    const state = createParticleScene(inputBounds, inputConfig);
    inputBounds.width = 1;
    inputConfig.count = 240;
    expect(state.bounds).toEqual(bounds);
    expect(state.config).toEqual({ count: 60, speed: 0.5, size: 1.5 });
    const defaults = createParticleScene(bounds);
    expect(defaults.seed).toBe(0x46533431);
    expect(defaults.config).toEqual(DEFAULT_PARTICLE_CONFIG);
    expectBounded(defaults);
  });

  it.each([0, 1, 0xffffffff, DEFAULT_PARTICLE_SEED])(
    "repeats seed %s and keeps bounded state",
    (seed) => {
      const a = createParticleScene(
        bounds,
        { count: MAX_PARTICLE_COUNT },
        seed,
      );
      expect(a).toEqual(
        createParticleScene(bounds, { count: MAX_PARTICLE_COUNT }, seed),
      );
      expect(a.particles).not.toBe(
        createParticleScene(bounds, { count: MAX_PARTICLE_COUNT }, seed)
          .particles,
      );
      expectBounded(a);
    },
  );

  it("different seeds vary positions, velocities and radii, not slot identity", () => {
    const a = createParticleScene(bounds, undefined, 11);
    const b = createParticleScene(bounds, undefined, 12);
    expect(a.particles.map((p) => p.id)).toEqual(b.particles.map((p) => p.id));
    expect(a.particles.map((p) => [p.x, p.y])).not.toEqual(
      b.particles.map((p) => [p.x, p.y]),
    );
    expect(a.particles.map((p) => p.velocityX)).not.toEqual(
      b.particles.map((p) => p.velocityX),
    );
    expect(a.particles.map((p) => p.baseRadius)).not.toEqual(
      b.particles.map((p) => p.baseRadius),
    );
  });

  it.each([null, "3", -1, 0x100000000, 0.5, NaN, Infinity])(
    "rejects invalid seed %s",
    (seed) => {
      expect(createParticleScene(bounds, undefined, seed).seed).toBe(
        DEFAULT_PARTICLE_SEED,
      );
    },
  );

  it.each([null, [], "120", false, undefined, 4, NaN])(
    "rejects malformed config container %s",
    (input) => {
      const state = createParticleScene(bounds);
      const previous = configureParticles(state, {
        count: 72,
        speed: 0.5,
        size: 1.5,
      });
      expect(configureParticles(state, input)).toEqual(previous);
      expect(createParticleScene(bounds, input).config).toEqual(
        DEFAULT_PARTICLE_CONFIG,
      );
    },
  );

  it.each([NaN, Infinity, -Infinity, "240", null, undefined, [], {}, true])(
    "retains invalid config fields %s",
    (input) => {
      const state = createParticleScene(bounds, {
        count: 72,
        speed: 0.5,
        size: 1.5,
      });
      expect(
        configureParticles(state, { count: input, speed: input, size: input }),
      ).toEqual({ count: 72, speed: 0.5, size: 1.5 });
      expect(
        createParticleScene(bounds, { count: input, speed: input, size: input })
          .config,
      ).toEqual(DEFAULT_PARTICLE_CONFIG);
    },
  );

  it("rejects malformed fields independently and returns exactly the stored effective config", () => {
    const state = createParticleScene(bounds);
    const effective = configureParticles(state, {
      count: "80",
      speed: settings.controls.speed.min + settings.controls.speed.step * 0.34,
      size: null,
    });
    expect(effective).toBe(state.config);
    expect(effective).toEqual({
      ...DEFAULT_PARTICLE_CONFIG,
      speed: settings.controls.speed.min,
    });
    expect(Object.isFrozen(effective)).toBe(true);
  });

  it("clamps every finite extreme before snapping, including maximum finite numbers", () => {
    const state = createParticleScene(bounds);
    expect(
      configureParticles(state, {
        count: -Number.MAX_VALUE,
        speed: -Number.MAX_VALUE,
        size: -Number.MAX_VALUE,
      }),
    ).toEqual({
      count: settings.controls.count.min,
      speed: settings.controls.speed.min,
      size: settings.controls.size.min,
    });
    expectBounded(state);
    expect(
      configureParticles(state, {
        count: Number.MAX_VALUE,
        speed: Number.MAX_VALUE,
        size: Number.MAX_VALUE,
      }),
    ).toEqual({
      count: MAX_PARTICLE_COUNT,
      speed: settings.controls.speed.max,
      size: settings.controls.size.max,
    });
    expectBounded(state);
  });

  it("normalizes every approved step and midpoint upward, with neighbors on both sides", () => {
    const state = createParticleScene(bounds);
    for (const [key, minimum, maximum, step] of [
      [
        "count",
        settings.controls.count.min,
        MAX_PARTICLE_COUNT,
        settings.controls.count.step,
      ],
      [
        "speed",
        settings.controls.speed.min,
        settings.controls.speed.max,
        settings.controls.speed.step,
      ],
      [
        "size",
        settings.controls.size.min,
        settings.controls.size.max,
        settings.controls.size.step,
      ],
    ] as const) {
      const n = Math.round((maximum - minimum) / step);
      for (let i = 0; i <= n; i++) {
        const value = Number((minimum + step * i).toFixed(2));
        expect(configureParticles(state, { [key]: value })[key]).toBe(value);
        if (i === n) continue;
        const midpoint = Number((value + step / 2).toFixed(3));
        const next = Number((value + step).toFixed(2));
        expect(configureParticles(state, { [key]: midpoint })[key]).toBe(next);
        expect(configureParticles(state, { [key]: midpoint - 1e-8 })[key]).toBe(
          value,
        );
        expect(configureParticles(state, { [key]: midpoint + 1e-8 })[key]).toBe(
          next,
        );
      }
    }
  });
});

describe("movement, delta and independence", () => {
  it("moves at half speed without changing seeded traits", () => {
    const slow = createParticleScene(bounds, { speed: 0.2 });
    const normal = createParticleScene(bounds, { speed: 0.4 });
    for (const state of [slow, normal])
      for (const particle of state.particles) {
        particle.x = 100;
        particle.y = 100;
      }
    advanceParticles(slow, 50);
    advanceParticles(normal, 50);
    slow.particles.forEach((particle, i) => {
      expect(particle.x - 100).toBeCloseTo(
        (normal.particles[i].x - 100) / 2,
        10,
      );
      expect(particle.y - 100).toBeCloseTo(
        (normal.particles[i].y - 100) / 2,
        10,
      );
      expect(particle.velocityX).toBe(normal.particles[i].velocityX);
    });
  });
  it("advances using CSS px/s and wraps both signs into half-open bounds", () => {
    const state = createParticleScene(
      { width: 1, height: 2 },
      { count: 60, speed: 0.5 },
    );
    state.particles[0] = {
      ...state.particles[0],
      x: 0.1,
      y: 1.9,
      velocityX: -14.4,
      velocityY: 19.2,
    };
    expect(advanceParticles(state, 50)).toBe(50);
    expect(state.particles[0].x).toBeCloseTo(0.74, 12);
    expect(state.particles[0].y).toBeCloseTo(0.38, 12);
    expectBounded(state);
  });

  it.each([NaN, Infinity, -Infinity, null, "16", [], {}, undefined, -1, 0])(
    "does not advance for invalid/nonpositive delta %s",
    (delta) => {
      const state = createParticleScene(bounds);
      const before = copy(state);
      expect(advanceParticles(state, delta)).toBe(0);
      expect(state).toEqual(before);
    },
  );

  it("preserves all object identities while advancing without random or clock reads", () => {
    const state = createParticleScene(bounds);
    const particles = [...state.particles];
    const array = state.particles;
    const random = vi.spyOn(Math, "random").mockImplementation(() => {
      throw Error("uncontrolled random");
    });
    const clock = vi.spyOn(Date, "now").mockImplementation(() => {
      throw Error("clock read");
    });
    try {
      for (let i = 0; i < 100; i++) advanceParticles(state, 16);
      configureParticles(state, { size: 2, speed: 1 });
      resizeParticleScene(state, { width: 700, height: 400 });
      getParticleStill(state);
      expect(state.particles).toBe(array);
      particles.forEach((p, i) => expect(state.particles[i]).toBe(p));
      expect(random).not.toHaveBeenCalled();
      expect(clock).not.toHaveBeenCalled();
    } finally {
      random.mockRestore();
      clock.mockRestore();
    }
  });

  it("equal accepted time partitions agree within 1e-9 CSS px without ordered intervening events", () => {
    const a = createParticleScene(bounds);
    const b = createParticleScene(bounds);
    for (let i = 0; i < 200; i++) advanceParticles(a, 5);
    for (let i = 0; i < 20; i++) advanceParticles(b, 50);
    expectPositionsClose(a, b);
  });

  it("drops excess time: 100 ms matches 50 ms, but not two accepted 50 ms updates", () => {
    const a = createParticleScene(bounds);
    const b = createParticleScene(bounds);
    const c = createParticleScene(bounds);
    expect(advanceParticles(a, 100)).toBe(50);
    advanceParticles(b, 50);
    advanceParticles(c, 50);
    advanceParticles(c, 50);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
    resetParticles(a);
    expect(advanceParticles(a, Number.MAX_VALUE)).toBe(50);
    expect(a).toEqual(b);
  });

  it("speed affects displacement only; size affects radius only", () => {
    const base = createParticleScene(bounds, { speed: 0.2, size: 1 });
    const sized = createParticleScene(bounds, { speed: 0.2, size: 2 });
    const fast = createParticleScene(bounds, { speed: 0.4, size: 1 });
    expect(base.config.speed).toBe(0.2);
    expect(fast.config.speed).toBe(base.config.speed * 2);
    expect(base.particles).toEqual(sized.particles);
    expect(base.particles).toEqual(fast.particles);
    expect(getParticleStill(base).particles).toEqual(
      getParticleStill(fast).particles,
    );
    getParticleStill(sized).particles.forEach((p, i) =>
      expect(p.radius).toBe(getParticleStill(base).particles[i].radius * 2),
    );
    advanceParticles(base, 20);
    advanceParticles(sized, 20);
    advanceParticles(fast, 10);
    expect(base.particles).toEqual(sized.particles);
    expect(base.particles).toEqual(fast.particles);
  });

  it("does not accept theme, mask or DPR as simulation inputs", () => {
    const state = createParticleScene({ ...bounds, dpr: 3 });
    const before = copy(state);
    configureParticles(state, { theme: "dark", mask: "SPACE", dpr: 10 });
    resizeParticleScene(state, { ...bounds, dpr: 1 });
    expect(state).toEqual(before);
    expect(Object.keys(state.config).sort()).toEqual([
      "count",
      "size",
      "speed",
    ]);
    expect(Object.keys(state.bounds!).sort()).toEqual(["height", "width"]);
  });
});

describe("population, resizing, reset and static data", () => {
  it("grows from half capacity to capacity without moving survivors and resets at the current count", () => {
    const initialCount = Math.floor(MAX_PARTICLE_COUNT / 20) * 10;
    const state = createParticleScene(bounds, { count: initialCount });
    advanceParticles(state, 50);
    const survivors = state.particles.slice();
    const positions = structuredClone(survivors);
    expect(configureParticles(state, { count: MAX_PARTICLE_COUNT }).count).toBe(
      MAX_PARTICLE_COUNT,
    );
    expect(state.particles).toHaveLength(MAX_PARTICLE_COUNT);
    survivors.forEach((particle, i) =>
      expect(state.particles[i]).toBe(particle),
    );
    expect(state.particles.slice(0, initialCount)).toEqual(positions);
    resetParticles(state);
    expect(state).toEqual(
      createParticleScene(bounds, { count: MAX_PARTICLE_COUNT }),
    );
    expectBounded(state);
    configureParticles(state, DEFAULT_PARTICLE_CONFIG);
    resetParticles(state);
    expect(state).toEqual(createParticleScene(bounds));
  });
  it("keeps survivor objects/traits/positions on shrink/grow; new slots initialize at current bounds", () => {
    const state = createParticleScene(bounds);
    advanceParticles(state, 50);
    resizeParticleScene(state, { width: 320, height: 180 });
    const survivingCount = settings.controls.count.min;
    const survivors = state.particles.slice(0, survivingCount);
    const before = structuredClone(survivors);
    const array = state.particles;
    configureParticles(state, { count: survivingCount });
    configureParticles(state, { count: MAX_PARTICLE_COUNT });
    expect(state.particles).toBe(array);
    survivors.forEach((p, i) => expect(state.particles[i]).toBe(p));
    expect(state.particles.slice(0, survivingCount)).toEqual(before);
    const initial = createParticleScene(state.bounds, {
      count: MAX_PARTICLE_COUNT,
    });
    expect(state.particles.slice(survivingCount)).toEqual(
      initial.particles.slice(survivingCount),
    );
    expectBounded(state);
  });

  it.each([
    null,
    undefined,
    [],
    {},
    { width: 0, height: 10 },
    { width: -1, height: 10 },
    { width: 10, height: 0 },
    { width: NaN, height: 10 },
    { width: 10, height: Infinity },
    { width: "10", height: 10 },
  ])(
    "defers initialization and suspends without losing last state for bounds %s",
    (invalid) => {
      const state = createParticleScene(invalid);
      expect(state.bounds).toBeNull();
      expect(state.suspended).toBe(true);
      expect(state.particles).toEqual([]);
      configureParticles(state, { count: 60 });
      resetParticles(state);
      expect(advanceParticles(state, 50)).toBe(0);
      expect(getParticleStill(state).particles).toEqual([]);
      resizeParticleScene(state, bounds);
      expect(state.particles).toHaveLength(60);
      advanceParticles(state, 50);
      const before = copy(state);
      expect(resizeParticleScene(state, invalid)).toBe(false);
      expect(advanceParticles(state, 50)).toBe(0);
      expect(state.particles).toEqual(before.particles);
      expect(state.bounds).toEqual(before.bounds);
      resizeParticleScene(state, bounds);
      expect(state).toEqual(before);
    },
  );

  it("preserves fractional positions and unchanged axes across valid/invalid/resume resize sequences", () => {
    const state = createParticleScene(bounds);
    advanceParticles(state, 50);
    const before = copy(state);
    resizeParticleScene(state, { width: 320, height: 360 });
    state.particles.forEach((p, i) => {
      expect(p.x).toBeCloseTo(before.particles[i].x / 2, 12);
      expect(p.y).toBe(before.particles[i].y);
      expect(p.velocityX).toBe(before.particles[i].velocityX);
      expect(p.baseRadius).toBe(before.particles[i].baseRadius);
    });
    resizeParticleScene(state, { width: 0, height: 0 });
    advanceParticles(state, 5000);
    resizeParticleScene(state, { width: 1280, height: 180 });
    resizeParticleScene(state, bounds);
    expectPositionsClose(state, before);
  });

  it("keeps finite half-open positions at extreme positive finite bounds", () => {
    const state = createParticleScene(bounds);
    for (const value of [
      Number.MIN_VALUE,
      1e-100,
      Number.MAX_VALUE,
      0.001,
      4096,
    ]) {
      resizeParticleScene(state, { width: value, height: value });
      advanceParticles(state, 50);
      expectBounded(state);
    }
  });

  it("reset restores the seeded composition at current configuration and bounds, retaining suspension", () => {
    const state = createParticleScene(bounds, undefined, 42);
    advanceParticles(state, 50);
    configureParticles(state, { count: 84, speed: 0.5, size: 1.5 });
    resizeParticleScene(state, { width: 320, height: 800 });
    const expected = createParticleScene(state.bounds, state.config, 42);
    resetParticles(state);
    expect(state).toEqual(expected);
    advanceParticles(state, 50);
    resizeParticleScene(state, null);
    resetParticles(state);
    expect(state.suspended).toBe(true);
    expect(state.particles).toEqual(expected.particles);
    expect(state.config).toEqual({ count: 84, speed: 0.5, size: 1.5 });
    expect(advanceParticles(state, 50)).toBe(0);
    resetParticles(state);
    expect(state.particles).toEqual(expected.particles);
  });

  it("repeats ordered traces but does not claim event-order equivalence", () => {
    const run = () => {
      const s = createParticleScene(bounds, { count: 40 }, 123);
      for (let i = 0; i < 12; i++) {
        configureParticles(s, { count: 40 + 10 * i, speed: 0.25 + i * 0.05 });
        advanceParticles(s, 16 + i);
        resizeParticleScene(s, { width: 300 + i, height: 600 - i });
        if (i === 4) resetParticles(s);
        if (i === 7) {
          resizeParticleScene(s, null);
          advanceParticles(s, 4000);
        }
      }
      return s;
    };
    expect(run()).toEqual(run());
    expectBounded(run());
    const a = createParticleScene(bounds);
    const b = createParticleScene(bounds);
    advanceParticles(a, 50);
    configureParticles(a, { speed: 1 });
    configureParticles(b, { speed: 1 });
    advanceParticles(b, 50);
    expect(a.particles).not.toEqual(b.particles);
  });

  it("produces independent immutable still data without a second simulation", () => {
    const state = createParticleScene(bounds);
    const still = getParticleStill(state);
    const before = structuredClone(still);
    expect(still.particles).toHaveLength(DEFAULT_PARTICLE_CONFIG.count);
    expect(Object.isFrozen(still.particles[0])).toBe(true);
    expect(Object.isFrozen(still.particles)).toBe(true);
    expect(Object.keys(still.particles[0]).sort()).toEqual([
      "id",
      "radius",
      "x",
      "y",
    ]);
    advanceParticles(state, 50);
    configureParticles(state, { count: MAX_PARTICLE_COUNT, size: 2 });
    resizeParticleScene(state, { width: 320, height: 600 });
    resetParticles(state);
    expect(still).toEqual(before);
    expect(getParticleStill(state).particles).toHaveLength(MAX_PARTICLE_COUNT);
  });
});
