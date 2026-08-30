import { describe, expect, it, vi } from "vitest";
import type { RandomSource } from "../RandomSource.js";
import { VISIBLE_ARENA_BOUNDS } from "../arena/index.js";
import { BASIC_ENEMY_DEFINITION } from "../enemies/index.js";
import type { LogicalPosition } from "../geometry/index.js";
import {
  calculateEnemySpawnOffset,
  ENTRY_LEAD_SECONDS,
  expandBoundsByOffset,
} from "./SpawnGeometry.js";
import {
  calculateEnemyContactTimeSeconds,
  MAX_LIVE_ENEMIES,
  MINIMUM_CONTACT_TIME_SECONDS,
  SPAWN_INTERVAL_SECONDS,
  tryCreateFairEnemySpawnCandidate,
} from "./SpawnFairness.js";

const SPAWN_BOUNDS = expandBoundsByOffset(
  VISIBLE_ARENA_BOUNDS,
  calculateEnemySpawnOffset(
    BASIC_ENEMY_DEFINITION.collisionRadius,
    BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
    ENTRY_LEAD_SECONDS,
  ),
);
const TOP_CENTER_DISTANCE = SPAWN_BOUNDS.width / 2;
const RIGHT_CENTER_DISTANCE = SPAWN_BOUNDS.width + SPAWN_BOUNDS.height / 2;
const BOTTOM_CENTER_DISTANCE =
  SPAWN_BOUNDS.width + SPAWN_BOUNDS.height + SPAWN_BOUNDS.width / 2;
const LEFT_CENTER_DISTANCE =
  2 * SPAWN_BOUNDS.width + SPAWN_BOUNDS.height + SPAWN_BOUNDS.height / 2;

function createSequenceRandomSource(distances: readonly number[]) {
  let index = 0;
  const nextFloat = vi.fn((minInclusive: number, maxExclusive: number) => {
    const distance = distances[Math.min(index, distances.length - 1)];
    index += 1;

    if (
      distance === undefined ||
      distance < minInclusive ||
      distance >= maxExclusive
    ) {
      throw new RangeError(
        "Controlled distance is outside the requested range.",
      );
    }

    return distance;
  });
  const source: RandomSource = {
    nextFloat,
    reset: vi.fn(() => {
      index = 0;
    }),
  };

  return { nextFloat, source };
}

function tryCandidate(
  playerPosition: Readonly<LogicalPosition>,
  distances: readonly number[],
  maxSpawnAttempts = distances.length,
) {
  const random = createSequenceRandomSource(distances);
  const candidate = tryCreateFairEnemySpawnCandidate(
    VISIBLE_ARENA_BOUNDS,
    BASIC_ENEMY_DEFINITION,
    ENTRY_LEAD_SECONDS,
    playerPosition,
    12,
    MINIMUM_CONTACT_TIME_SECONDS,
    maxSpawnAttempts,
    random.source,
  );

  return { candidate, nextFloat: random.nextFloat };
}

describe("Gate 1 spawn tuning", () => {
  it("uses a spawn interval faster than the basic attack cooldown", () => {
    expect(SPAWN_INTERVAL_SECONDS).toBe(0.75);
    expect(MAX_LIVE_ENEMIES).toBe(4);
  });
});

describe("calculateEnemyContactTimeSeconds", () => {
  it("subtracts both collision radii from center distance", () => {
    expect(
      calculateEnemyContactTimeSeconds(
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        10,
        20,
        10,
      ),
    ).toBe(7);
  });

  it("returns zero for tangent or overlapping collision circles", () => {
    expect(
      calculateEnemyContactTimeSeconds(
        { x: 0, y: 0 },
        { x: 30, y: 0 },
        10,
        20,
        10,
      ),
    ).toBe(0);
    expect(
      calculateEnemyContactTimeSeconds(
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        10,
        20,
        10,
      ),
    ).toBe(0);
  });

  it("treats a separated stationary enemy as having unlimited contact time", () => {
    expect(
      calculateEnemyContactTimeSeconds(
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        10,
        20,
        0,
      ),
    ).toBe(Number.POSITIVE_INFINITY);
  });

  it.each([
    [{ x: Number.NaN, y: 0 }, { x: 0, y: 0 }, 1, 1, 1],
    [{ x: 0, y: 0 }, { x: Number.POSITIVE_INFINITY, y: 0 }, 1, 1, 1],
    [{ x: 0, y: 0 }, { x: 10, y: 0 }, -1, 1, 1],
    [{ x: 0, y: 0 }, { x: 10, y: 0 }, 1, -1, 1],
    [{ x: 0, y: 0 }, { x: 10, y: 0 }, 1, 1, -1],
    [{ x: 0, y: 0 }, { x: 10, y: 0 }, 1, 1, Number.NaN],
  ])(
    "rejects invalid contact geometry %#",
    (enemyPosition, playerPosition, enemyRadius, playerRadius, speed) => {
      expect(() =>
        calculateEnemyContactTimeSeconds(
          enemyPosition,
          playerPosition,
          enemyRadius,
          playerRadius,
          speed,
        ),
      ).toThrow(RangeError);
    },
  );
});

describe("tryCreateFairEnemySpawnCandidate", () => {
  it("rejects a candidate below the minimum contact time", () => {
    const { candidate, nextFloat } = tryCandidate({ x: 180, y: 12 }, [
      TOP_CENTER_DISTANCE,
    ]);

    expect(candidate).toBeNull();
    expect(nextFloat).toHaveBeenCalledOnce();
  });

  it("accepts a candidate exactly at the inclusive minimum", () => {
    const playerY =
      SPAWN_BOUNDS.y +
      BASIC_ENEMY_DEFINITION.collisionRadius +
      12 +
      BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond *
        MINIMUM_CONTACT_TIME_SECONDS;
    const { candidate, nextFloat } = tryCandidate({ x: 180, y: playerY }, [
      TOP_CENTER_DISTANCE,
    ]);

    expect(candidate).toEqual({
      edge: "top",
      position: { x: 180, y: SPAWN_BOUNDS.y },
    });
    expect(nextFloat).toHaveBeenCalledOnce();
  });

  it("accepts the first fair candidate after an unfair candidate", () => {
    const { candidate, nextFloat } = tryCandidate({ x: 180, y: 12 }, [
      TOP_CENTER_DISTANCE,
      BOTTOM_CENTER_DISTANCE,
    ]);

    expect(candidate?.edge).toBe("bottom");
    expect(nextFloat).toHaveBeenCalledTimes(2);
  });

  it("returns no unfair fallback after the bounded attempts are exhausted", () => {
    const { candidate, nextFloat } = tryCandidate(
      { x: 180, y: 12 },
      [TOP_CENTER_DISTANCE],
      3,
    );

    expect(candidate).toBeNull();
    expect(nextFloat).toHaveBeenCalledTimes(3);
  });

  it.each([
    ["top", { x: 180, y: 12 }, TOP_CENTER_DISTANCE],
    ["right", { x: 348, y: 320 }, RIGHT_CENTER_DISTANCE],
    ["bottom", { x: 180, y: 628 }, BOTTOM_CENTER_DISTANCE],
    ["left", { x: 12, y: 320 }, LEFT_CENTER_DISTANCE],
  ] as const)(
    "rejects the immediately approaching %s candidate for a near-edge player",
    (_edge, playerPosition, distance) => {
      expect(tryCandidate(playerPosition, [distance]).candidate).toBeNull();
    },
  );

  it("rejects invalid fairness configuration before sampling", () => {
    const random = createSequenceRandomSource([TOP_CENTER_DISTANCE]);

    expect(() =>
      tryCreateFairEnemySpawnCandidate(
        VISIBLE_ARENA_BOUNDS,
        BASIC_ENEMY_DEFINITION,
        ENTRY_LEAD_SECONDS,
        { x: 180, y: 320 },
        12,
        Number.NaN,
        1,
        random.source,
      ),
    ).toThrow(RangeError);
    expect(() =>
      tryCreateFairEnemySpawnCandidate(
        VISIBLE_ARENA_BOUNDS,
        BASIC_ENEMY_DEFINITION,
        ENTRY_LEAD_SECONDS,
        { x: 180, y: 320 },
        12,
        MINIMUM_CONTACT_TIME_SECONDS,
        0,
        random.source,
      ),
    ).toThrow(RangeError);
    expect(random.nextFloat).not.toHaveBeenCalled();
  });
});
