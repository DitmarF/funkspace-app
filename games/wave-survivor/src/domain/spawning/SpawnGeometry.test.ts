import { describe, expect, it, vi } from "vitest";
import type { RandomSource } from "../RandomSource.js";
import {
  VISIBLE_ARENA_BOUNDS,
  createBounds,
  type Bounds,
} from "../arena/index.js";
import {
  BASIC_ENEMY_DEFINITION,
  type EnemyDefinition,
} from "../enemies/index.js";
import type { LogicalPosition } from "../geometry/index.js";
import {
  calculateEnemyDespawnOffset,
  calculateEnemySpawnOffset,
  createEnemyDespawnBounds,
  createEnemySpawnCandidate,
  DESPAWN_EXTRA_MARGIN,
  ENTRY_LEAD_SECONDS,
  expandBoundsByOffset,
} from "./SpawnGeometry.js";

function createControlledRandomSource(distance: number) {
  const nextFloat = vi.fn(
    (_minInclusive: number, _maxExclusive: number) => distance,
  );

  return {
    nextFloat,
    source: {
      nextFloat,
      reset: vi.fn(),
    },
  };
}

function isPositionOutside(position: LogicalPosition, bounds: Bounds): boolean {
  return (
    position.x < bounds.x ||
    position.x > bounds.x + bounds.width ||
    position.y < bounds.y ||
    position.y > bounds.y + bounds.height
  );
}

function isCircleOutsideOrTangent(
  position: LogicalPosition,
  radius: number,
  bounds: Bounds,
): boolean {
  const right = bounds.x + bounds.width;
  const bottom = bounds.y + bounds.height;

  return (
    position.x + radius <= bounds.x ||
    position.x - radius >= right ||
    position.y + radius <= bounds.y ||
    position.y - radius >= bottom
  );
}

describe("calculateEnemySpawnOffset", () => {
  it("calculates the expected basic enemy offset", () => {
    expect(ENTRY_LEAD_SECONDS).toBe(0.75);
    expect(
      calculateEnemySpawnOffset(
        BASIC_ENEMY_DEFINITION.collisionRadius,
        BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
        ENTRY_LEAD_SECONDS,
      ),
    ).toBe(66);
  });

  it("increases the offset for a faster enemy", () => {
    const normalOffset = calculateEnemySpawnOffset(12, 72, ENTRY_LEAD_SECONDS);
    const fasterOffset = calculateEnemySpawnOffset(12, 144, ENTRY_LEAD_SECONDS);

    expect(fasterOffset).toBeGreaterThan(normalOffset);
  });

  it("increases the offset for a larger collision radius", () => {
    const normalOffset = calculateEnemySpawnOffset(12, 72, ENTRY_LEAD_SECONDS);
    const largerOffset = calculateEnemySpawnOffset(24, 72, ENTRY_LEAD_SECONDS);

    expect(largerOffset).toBeGreaterThan(normalOffset);
  });

  it("uses the collision radius as the full offset at zero speed", () => {
    expect(calculateEnemySpawnOffset(12, 0, ENTRY_LEAD_SECONDS)).toBe(12);
  });

  it.each([
    [Number.NaN, 72, ENTRY_LEAD_SECONDS],
    [12, Number.POSITIVE_INFINITY, ENTRY_LEAD_SECONDS],
    [12, 72, Number.NEGATIVE_INFINITY],
    [-1, 72, ENTRY_LEAD_SECONDS],
    [12, -1, ENTRY_LEAD_SECONDS],
    [12, 72, -0.01],
    [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
  ])(
    "rejects invalid offset inputs (%s, %s, %s)",
    (radius, speed, entryLead) => {
      expect(() => calculateEnemySpawnOffset(radius, speed, entryLead)).toThrow(
        RangeError,
      );
    },
  );
});

describe("enemy despawn geometry", () => {
  it("derives the basic enemy offset from spawn distance plus safety margin", () => {
    expect(DESPAWN_EXTRA_MARGIN).toBe(64);
    expect(
      calculateEnemyDespawnOffset(
        BASIC_ENEMY_DEFINITION.collisionRadius,
        BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
        ENTRY_LEAD_SECONDS,
        DESPAWN_EXTRA_MARGIN,
      ),
    ).toBe(130);
  });

  it("fully contains the expanded spawn perimeter on every side", () => {
    const spawnOffset = calculateEnemySpawnOffset(
      BASIC_ENEMY_DEFINITION.collisionRadius,
      BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
      ENTRY_LEAD_SECONDS,
    );
    const spawnBounds = expandBoundsByOffset(VISIBLE_ARENA_BOUNDS, spawnOffset);
    const despawnBounds = createEnemyDespawnBounds(
      VISIBLE_ARENA_BOUNDS,
      BASIC_ENEMY_DEFINITION,
      ENTRY_LEAD_SECONDS,
      DESPAWN_EXTRA_MARGIN,
    );

    expect(despawnBounds).toEqual({
      x: -130,
      y: -130,
      width: 620,
      height: 900,
    });
    expect(despawnBounds.x).toBeLessThan(spawnBounds.x);
    expect(despawnBounds.y).toBeLessThan(spawnBounds.y);
    expect(despawnBounds.x + despawnBounds.width).toBeGreaterThan(
      spawnBounds.x + spawnBounds.width,
    );
    expect(despawnBounds.y + despawnBounds.height).toBeGreaterThan(
      spawnBounds.y + spawnBounds.height,
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])(
    "rejects invalid despawn margin %s",
    (despawnExtraMargin) => {
      expect(() =>
        calculateEnemyDespawnOffset(
          12,
          72,
          ENTRY_LEAD_SECONDS,
          despawnExtraMargin,
        ),
      ).toThrow(RangeError);
    },
  );

  it("rejects a despawn offset that overflows", () => {
    expect(() =>
      calculateEnemyDespawnOffset(Number.MAX_VALUE, 0, 0, Number.MAX_VALUE),
    ).toThrow(RangeError);
  });
});

describe("expandBoundsByOffset", () => {
  it("expands all four sides while containing the visible bounds", () => {
    const visibleBounds = createBounds(10, 20, 100, 200);
    const expandedBounds = expandBoundsByOffset(visibleBounds, 30);

    expect(expandedBounds).toEqual({
      x: -20,
      y: -10,
      width: 160,
      height: 260,
    });
    expect(expandedBounds.x).toBeLessThanOrEqual(visibleBounds.x);
    expect(expandedBounds.y).toBeLessThanOrEqual(visibleBounds.y);
    expect(expandedBounds.x + expandedBounds.width).toBeGreaterThanOrEqual(
      visibleBounds.x + visibleBounds.width,
    );
    expect(expandedBounds.y + expandedBounds.height).toBeGreaterThanOrEqual(
      visibleBounds.y + visibleBounds.height,
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])(
    "rejects invalid expansion offset %s",
    (offset) => {
      expect(() => expandBoundsByOffset(VISIBLE_ARENA_BOUNDS, offset)).toThrow(
        RangeError,
      );
    },
  );

  it("rejects invalid source bounds", () => {
    expect(() =>
      expandBoundsByOffset({ x: Number.NaN, y: 0, width: 360, height: 640 }, 1),
    ).toThrow(RangeError);
    expect(() =>
      expandBoundsByOffset({ x: 0, y: 0, width: 0, height: 640 }, 1),
    ).toThrow(RangeError);
  });
});

describe("createEnemySpawnCandidate", () => {
  const offset = calculateEnemySpawnOffset(
    BASIC_ENEMY_DEFINITION.collisionRadius,
    BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
    ENTRY_LEAD_SECONDS,
  );
  const spawnBounds = expandBoundsByOffset(VISIBLE_ARENA_BOUNDS, offset);
  const edgeDistances = [
    ["top", spawnBounds.width / 2],
    ["right", spawnBounds.width + spawnBounds.height / 2],
    ["bottom", spawnBounds.width + spawnBounds.height + spawnBounds.width / 2],
    [
      "left",
      2 * spawnBounds.width + spawnBounds.height + spawnBounds.height / 2,
    ],
  ] as const;

  it.each(edgeDistances)(
    "places a complete basic enemy circle outside the %s side",
    (edge, distance) => {
      const { source } = createControlledRandomSource(distance);
      const candidate = createEnemySpawnCandidate(
        VISIBLE_ARENA_BOUNDS,
        BASIC_ENEMY_DEFINITION,
        ENTRY_LEAD_SECONDS,
        source,
      );

      expect(candidate.edge).toBe(edge);
      expect(isPositionOutside(candidate.position, VISIBLE_ARENA_BOUNDS)).toBe(
        true,
      );
      expect(
        isCircleOutsideOrTangent(
          candidate.position,
          BASIC_ENEMY_DEFINITION.collisionRadius,
          VISIBLE_ARENA_BOUNDS,
        ),
      ).toBe(true);
    },
  );

  it("keeps a zero-speed enemy tangent to the visible boundary", () => {
    const stationaryEnemy: EnemyDefinition = {
      ...BASIC_ENEMY_DEFINITION,
      movementSpeedUnitsPerSecond: 0,
    };
    const stationaryBounds = expandBoundsByOffset(
      VISIBLE_ARENA_BOUNDS,
      stationaryEnemy.collisionRadius,
    );
    const { source } = createControlledRandomSource(stationaryBounds.width / 2);

    const candidate = createEnemySpawnCandidate(
      VISIBLE_ARENA_BOUNDS,
      stationaryEnemy,
      ENTRY_LEAD_SECONDS,
      source,
    );

    expect(candidate).toEqual({
      edge: "top",
      position: {
        x: VISIBLE_ARENA_BOUNDS.width / 2,
        y: -stationaryEnemy.collisionRadius,
      },
    });
    expect(candidate.position.y + stationaryEnemy.collisionRadius).toBe(
      VISIBLE_ARENA_BOUNDS.y,
    );
  });

  it("samples deterministically through a controlled RandomSource", () => {
    const distance = spawnBounds.width / 2;
    const first = createControlledRandomSource(distance);
    const second = createControlledRandomSource(distance);

    const firstCandidate = createEnemySpawnCandidate(
      VISIBLE_ARENA_BOUNDS,
      BASIC_ENEMY_DEFINITION,
      ENTRY_LEAD_SECONDS,
      first.source,
    );
    const secondCandidate = createEnemySpawnCandidate(
      VISIBLE_ARENA_BOUNDS,
      BASIC_ENEMY_DEFINITION,
      ENTRY_LEAD_SECONDS,
      second.source,
    );

    expect(firstCandidate).toEqual(secondCandidate);
    expect(first.nextFloat).toHaveBeenCalledWith(
      0,
      2 * (spawnBounds.width + spawnBounds.height),
    );
    expect(first.nextFloat).toHaveBeenCalledOnce();
  });
});
