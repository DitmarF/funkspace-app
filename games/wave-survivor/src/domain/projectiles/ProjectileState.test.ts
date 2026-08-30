import { describe, expect, it } from "vitest";
import { VISIBLE_ARENA_BOUNDS } from "../arena/index.js";
import { BASIC_ATTACK_DEFINITION } from "../combat/index.js";
import { expandBoundsByOffset } from "../spawning/index.js";
import {
  createBasicProjectileState,
  hasProjectileExpired,
  isProjectileStateValid,
  shouldRetainProjectileWithinBounds,
  type ProjectileState,
} from "./ProjectileState.js";

const PROJECTILE_DESPAWN_BOUNDS = expandBoundsByOffset(
  VISIBLE_ARENA_BOUNDS,
  BASIC_ATTACK_DEFINITION.projectileDespawnMargin,
);

describe("createBasicProjectileState", () => {
  it.each([
    ["right", { x: 10, y: 20 }, { x: 30, y: 20 }, { x: 320, y: 0 }],
    ["up", { x: 10, y: 20 }, { x: 10, y: 0 }, { x: 0, y: -320 }],
  ] as const)(
    "creates a projectile toward a %s target",
    (_direction, origin, target, expectedVelocity) => {
      const projectile = createBasicProjectileState(1, origin, target, 4);

      expect(projectile.position).toEqual(origin);
      expect(projectile.position).not.toBe(origin);
      expect(projectile.velocity).toEqual(expectedVelocity);
      expect(projectile.collisionRadius).toBe(
        BASIC_ATTACK_DEFINITION.projectileCollisionRadius,
      );
      expect(projectile.damage).toBe(BASIC_ATTACK_DEFINITION.projectileDamage);
      expect(projectile.expiresAtSimulationSeconds).toBe(
        4 + BASIC_ATTACK_DEFINITION.projectileLifetimeSeconds,
      );
    },
  );

  it("normalizes a diagonal firing direction to configured speed", () => {
    const projectile = createBasicProjectileState(
      1,
      { x: 10, y: 20 },
      { x: 13, y: 24 },
      0,
    );

    expect(projectile.velocity).toEqual({ x: 192, y: 256 });
    expect(Math.hypot(projectile.velocity.x, projectile.velocity.y)).toBe(
      BASIC_ATTACK_DEFINITION.projectileSpeedUnitsPerSecond,
    );
  });

  it("uses a deterministic rightward fallback for an identical target", () => {
    const projectile = createBasicProjectileState(
      1,
      { x: 180, y: 320 },
      { x: 180, y: 320 },
      0,
    );

    expect(projectile.velocity).toEqual({ x: 320, y: 0 });
    expect(Object.isFrozen(projectile.velocity)).toBe(true);
  });

  it.each([
    [0, { x: 0, y: 0 }, { x: 1, y: 0 }, 0],
    [1, { x: Number.NaN, y: 0 }, { x: 1, y: 0 }, 0],
    [1, { x: 0, y: 0 }, { x: Number.POSITIVE_INFINITY, y: 0 }, 0],
    [1, { x: 0, y: 0 }, { x: 1, y: 0 }, -1],
  ] as const)(
    "rejects invalid creation input %#",
    (id, origin, target, createdAtSimulationSeconds) => {
      expect(() =>
        createBasicProjectileState(
          id,
          origin,
          target,
          createdAtSimulationSeconds,
        ),
      ).toThrow(RangeError);
    },
  );
});

describe("projectile validity and cleanup", () => {
  it("accepts a projectile created from the basic attack definition", () => {
    expect(
      isProjectileStateValid(
        createBasicProjectileState(
          1,
          { x: 180, y: 320 },
          { x: 200, y: 320 },
          0,
        ),
      ),
    ).toBe(true);
  });

  it.each([
    {
      ...createBasicProjectileState(1, { x: 0, y: 0 }, { x: 1, y: 0 }, 0),
      id: 0,
    },
    {
      ...createBasicProjectileState(1, { x: 0, y: 0 }, { x: 1, y: 0 }, 0),
      position: { x: Number.NaN, y: 0 },
    },
    {
      ...createBasicProjectileState(1, { x: 0, y: 0 }, { x: 1, y: 0 }, 0),
      velocity: { x: Number.POSITIVE_INFINITY, y: 0 },
    },
    {
      ...createBasicProjectileState(1, { x: 0, y: 0 }, { x: 1, y: 0 }, 0),
      collisionRadius: 0,
    },
    {
      ...createBasicProjectileState(1, { x: 0, y: 0 }, { x: 1, y: 0 }, 0),
      damage: 0,
    },
    {
      ...createBasicProjectileState(1, { x: 0, y: 0 }, { x: 1, y: 0 }, 0),
      expiresAtSimulationSeconds: Number.NaN,
    },
  ] satisfies ProjectileState[])(
    "rejects invalid projectile state %#",
    (projectile) => {
      expect(isProjectileStateValid(projectile)).toBe(false);
      expect(
        shouldRetainProjectileWithinBounds(
          projectile,
          PROJECTILE_DESPAWN_BOUNDS,
        ),
      ).toBe(false);
    },
  );

  it("expires at the exact configured simulation-time boundary", () => {
    const projectile = createBasicProjectileState(
      1,
      { x: 180, y: 320 },
      { x: 200, y: 320 },
      0,
    );

    expect(
      hasProjectileExpired(
        projectile,
        BASIC_ATTACK_DEFINITION.projectileLifetimeSeconds - 0.001,
      ),
    ).toBe(false);
    expect(
      hasProjectileExpired(
        projectile,
        BASIC_ATTACK_DEFINITION.projectileLifetimeSeconds,
      ),
    ).toBe(true);
  });

  it("retains exact despawn-boundary tangency", () => {
    const projectile = createBasicProjectileState(
      1,
      {
        x:
          PROJECTILE_DESPAWN_BOUNDS.x -
          BASIC_ATTACK_DEFINITION.projectileCollisionRadius,
        y: 320,
      },
      { x: 180, y: 320 },
      0,
    );

    expect(
      shouldRetainProjectileWithinBounds(projectile, PROJECTILE_DESPAWN_BOUNDS),
    ).toBe(true);
  });

  it("removes a projectile whose circle is fully outside despawn bounds", () => {
    const projectile = createBasicProjectileState(
      1,
      {
        x:
          PROJECTILE_DESPAWN_BOUNDS.x -
          BASIC_ATTACK_DEFINITION.projectileCollisionRadius -
          0.001,
        y: 320,
      },
      { x: 180, y: 320 },
      0,
    );

    expect(
      shouldRetainProjectileWithinBounds(projectile, PROJECTILE_DESPAWN_BOUNDS),
    ).toBe(false);
  });
});
