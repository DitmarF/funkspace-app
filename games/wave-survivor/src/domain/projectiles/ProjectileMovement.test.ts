import { describe, expect, it } from "vitest";
import { createBasicProjectileState } from "./ProjectileState.js";
import { moveProjectile } from "./ProjectileMovement.js";

describe("moveProjectile", () => {
  it("moves deterministically from fixed delta and immutable velocity", () => {
    const projectile = createBasicProjectileState(
      1,
      { x: 10, y: 20 },
      { x: 30, y: 20 },
      0,
    );
    const velocity = projectile.velocity;

    moveProjectile(projectile, 0.25);

    expect(projectile.position).toEqual({ x: 90, y: 20 });
    expect(projectile.velocity).toBe(velocity);
  });

  it("does not home when the original target position changes", () => {
    const target = { x: 30, y: 20 };
    const projectile = createBasicProjectileState(
      1,
      { x: 10, y: 20 },
      target,
      0,
    );
    target.y = 1_000;

    moveProjectile(projectile, 0.25);

    expect(projectile.position).toEqual({ x: 90, y: 20 });
  });

  it("produces equal movement for equal delta sequences", () => {
    const first = createBasicProjectileState(
      1,
      { x: 10, y: 20 },
      { x: 13, y: 24 },
      0,
    );
    const second = createBasicProjectileState(
      1,
      { x: 10, y: 20 },
      { x: 13, y: 24 },
      0,
    );

    for (const deltaSeconds of [0.1, 0.2, 0.3, 0.4]) {
      moveProjectile(first, deltaSeconds);
      moveProjectile(second, deltaSeconds);
    }

    expect(first.position).toEqual(second.position);
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "does not move for invalid delta %s",
    (deltaSeconds) => {
      const projectile = createBasicProjectileState(
        1,
        { x: 10, y: 20 },
        { x: 30, y: 20 },
        0,
      );

      moveProjectile(projectile, deltaSeconds);

      expect(projectile.position).toEqual({ x: 10, y: 20 });
    },
  );

  it("does not move invalid projectile state", () => {
    const projectile = createBasicProjectileState(
      1,
      { x: 10, y: 20 },
      { x: 30, y: 20 },
      0,
    );
    Object.defineProperty(projectile, "damage", { value: 0 });

    moveProjectile(projectile, 0.25);

    expect(projectile.position).toEqual({ x: 10, y: 20 });
  });
});
