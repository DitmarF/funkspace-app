import { describe, expect, it } from "vitest";
import {
  createBasicEnemyState,
  type EnemyPhase,
  type EnemyState,
} from "../enemies/index.js";
import type { LogicalPosition } from "../geometry/index.js";
import { createInitialRuntimeState, type PlayerState } from "../state/index.js";
import { resolvePlayerContactDamage } from "./PlayerContactDamage.js";

function createEnemy(
  id: number,
  position: Readonly<LogicalPosition>,
  phase: EnemyPhase = "active",
  contactDamage = 1,
): EnemyState {
  const enemy = {
    ...createBasicEnemyState(id, position),
    contactDamage,
  };
  enemy.phase = phase;
  if (phase === "dying") enemy.removeAtSimulationSeconds = 100;
  return enemy;
}

function createPlayer(): PlayerState {
  return createInitialRuntimeState().player;
}

describe("resolvePlayerContactDamage", () => {
  it("does not damage the player without overlap", () => {
    const player = createPlayer();
    const enemy = createEnemy(1, {
      x: player.position.x + player.collisionRadius * 3,
      y: player.position.y,
    });

    expect(resolvePlayerContactDamage(player, [enemy])).toBe(false);
    expect(player.currentHealth).toBe(player.maximumHealth);
  });

  it("applies active-enemy contact damage without moving the enemy", () => {
    const player = createPlayer();
    const enemy = createEnemy(1, player.position);
    const initialEnemyPosition = { ...enemy.position };

    expect(resolvePlayerContactDamage(player, [enemy])).toBe(true);
    expect(player.currentHealth).toBe(2);
    expect(enemy.position).toEqual(initialEnemyPosition);
    expect(enemy.phase).toBe("active");
  });

  it("counts exact circle tangency as contact", () => {
    const player = createPlayer();
    const enemy = createEnemy(1, player.position);
    enemy.position.x += player.collisionRadius + enemy.collisionRadius;

    expect(resolvePlayerContactDamage(player, [enemy])).toBe(true);
    expect(player.currentHealth).toBe(2);
  });

  it.each(["entering", "dying"] as const)(
    "ignores an overlapping %s enemy",
    (phase) => {
      const player = createPlayer();
      const enemy = createEnemy(1, player.position, phase);

      expect(resolvePlayerContactDamage(player, [enemy])).toBe(false);
      expect(player.currentHealth).toBe(player.maximumHealth);
    },
  );

  it("ignores invalid enemy state", () => {
    const player = createPlayer();
    const enemy = createEnemy(1, player.position);
    enemy.position.x = Number.NaN;

    expect(resolvePlayerContactDamage(player, [enemy])).toBe(false);
    expect(player.currentHealth).toBe(player.maximumHealth);
  });

  it("uses the lowest overlapping enemy ID regardless of array order", () => {
    const player = createPlayer();
    const lowerIdEnemy = createEnemy(2, player.position, "active", 1);
    const higherIdEnemy = createEnemy(5, player.position, "active", 2);

    expect(
      resolvePlayerContactDamage(player, [higherIdEnemy, lowerIdEnemy]),
    ).toBe(true);
    expect(player.currentHealth).toBe(2);
  });

  it("clamps player health to zero", () => {
    const player = createPlayer();
    const enemy = createEnemy(1, player.position, "active", 5);

    expect(resolvePlayerContactDamage(player, [enemy])).toBe(true);
    expect(player.currentHealth).toBe(0);
  });

  it("bounds health to maximum before applying damage", () => {
    const player = createPlayer();
    player.currentHealth = player.maximumHealth + 10;
    const enemy = createEnemy(1, player.position);

    expect(resolvePlayerContactDamage(player, [enemy])).toBe(true);
    expect(player.currentHealth).toBe(player.maximumHealth - 1);
  });
});
