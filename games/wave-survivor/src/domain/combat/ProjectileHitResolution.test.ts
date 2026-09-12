import { describe, expect, it } from "vitest";
import {
  createBasicEnemyState,
  type EnemyPhase,
  type EnemyState,
} from "../enemies/index.js";
import type { LogicalPosition } from "../geometry/index.js";
import {
  createBasicProjectileState,
  type ProjectileState,
} from "../projectiles/index.js";
import { resolveProjectileHit } from "./ProjectileHitResolution.js";

function createEnemy(
  id: number,
  position: Readonly<LogicalPosition>,
  phase: EnemyPhase = "active",
): EnemyState {
  const enemy = createBasicEnemyState(id, position);
  enemy.phase = phase;
  if (phase === "dying") enemy.removeAtSimulationSeconds = 100;
  return enemy;
}

function createProjectile(
  id = 1,
  position: Readonly<LogicalPosition> = { x: 0, y: 0 },
): ProjectileState {
  return createBasicProjectileState(
    id,
    position,
    { x: position.x + 1, y: position.y },
    0,
  );
}

describe("resolveProjectileHit", () => {
  it("leaves enemy health unchanged when a projectile misses", () => {
    const projectile = createProjectile();
    const enemy = createEnemy(1, { x: 17, y: 0 });

    expect(resolveProjectileHit(projectile, [enemy])).toBe(false);
    expect(enemy.currentHealth).toBe(1);
  });

  it("damages one overlapping active enemy", () => {
    const projectile = createProjectile();
    const enemy = createEnemy(1, { x: 10, y: 0 });

    expect(resolveProjectileHit(projectile, [enemy])).toBe(true);
    expect(enemy.currentHealth).toBe(0);
    expect(enemy.phase).toBe("active");
  });

  it("counts exact tangency as a hit", () => {
    const projectile = createProjectile();
    const enemy = createEnemy(1, { x: 16, y: 0 });

    expect(resolveProjectileHit(projectile, [enemy])).toBe(true);
    expect(enemy.currentHealth).toBe(0);
  });

  it.each(["entering", "dying"] as const)(
    "ignores an overlapping %s enemy",
    (phase) => {
      const projectile = createProjectile();
      const enemy = createEnemy(1, { x: 0, y: 0 }, phase);

      expect(resolveProjectileHit(projectile, [enemy])).toBe(false);
      expect(enemy.currentHealth).toBe(1);
    },
  );

  it("ignores invalid enemy state", () => {
    const projectile = createProjectile();
    const enemy = createEnemy(1, { x: 0, y: 0 });
    enemy.position.x = Number.NaN;

    expect(resolveProjectileHit(projectile, [enemy])).toBe(false);
    expect(enemy.currentHealth).toBe(1);
  });

  it("damages only the lowest-ID enemy when one projectile overlaps two", () => {
    const projectile = createProjectile();
    const lowerIdEnemy = createEnemy(2, { x: 0, y: 0 });
    const higherIdEnemy = createEnemy(5, { x: 0, y: 0 });

    expect(
      resolveProjectileHit(projectile, [lowerIdEnemy, higherIdEnemy]),
    ).toBe(true);
    expect(lowerIdEnemy.currentHealth).toBe(0);
    expect(higherIdEnemy.currentHealth).toBe(1);
  });

  it("chooses the lowest enemy ID when the enemy array is reversed", () => {
    const projectile = createProjectile();
    const lowerIdEnemy = createEnemy(2, { x: 0, y: 0 });
    const higherIdEnemy = createEnemy(5, { x: 0, y: 0 });

    expect(
      resolveProjectileHit(projectile, [higherIdEnemy, lowerIdEnemy]),
    ).toBe(true);
    expect(lowerIdEnemy.currentHealth).toBe(0);
    expect(higherIdEnemy.currentHealth).toBe(1);
  });

  it("allows two projectiles to damage the same active enemy", () => {
    const enemy = createEnemy(1, { x: 0, y: 0 });

    expect(resolveProjectileHit(createProjectile(1), [enemy])).toBe(true);
    expect(resolveProjectileHit(createProjectile(2), [enemy])).toBe(true);

    expect(enemy.currentHealth).toBe(-1);
    expect(enemy.phase).toBe("active");
  });

  it("reproduces the same result from recreated state", () => {
    const resolveRecreatedState = () => {
      const projectile = createProjectile();
      const enemy = createEnemy(1, { x: 0, y: 0 });

      return {
        didHit: resolveProjectileHit(projectile, [enemy]),
        health: enemy.currentHealth,
        phase: enemy.phase,
      };
    };

    expect(resolveRecreatedState()).toEqual(resolveRecreatedState());
  });
});
