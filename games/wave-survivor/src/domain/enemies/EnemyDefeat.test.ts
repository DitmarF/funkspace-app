import { describe, expect, it } from "vitest";
import {
  hasEnemyDyingExpired,
  PROVISIONAL_ENEMY_DYING_DURATION_SECONDS,
  transitionEnemyToDying,
} from "./EnemyDefeat.js";
import { calculateNextEnemyPosition } from "./EnemyMovement.js";
import {
  canEnemyDealContactDamage,
  canEnemyPursue,
  createBasicEnemyState,
  isEnemyTargetable,
} from "./EnemyState.js";

function createActiveEnemy() {
  const enemy = createBasicEnemyState(1, { x: 100, y: 100 });
  enemy.phase = "active";
  return enemy;
}

describe("enemy defeat", () => {
  it("centralizes the provisional Gate 1 dying duration", () => {
    expect(PROVISIONAL_ENEMY_DYING_DURATION_SECONDS).toBe(0.125);
  });

  it("leaves an active enemy above zero health active", () => {
    const enemy = createActiveEnemy();

    expect(transitionEnemyToDying(enemy, 2)).toBe(false);
    expect(enemy.phase).toBe("active");
    expect(enemy.removeAtSimulationSeconds).toBeNull();
  });

  it("transitions an active enemy at zero health", () => {
    const enemy = createActiveEnemy();
    enemy.currentHealth = 0;

    expect(transitionEnemyToDying(enemy, 2)).toBe(true);
    expect(enemy.phase).toBe("dying");
    expect(enemy.removeAtSimulationSeconds).toBe(
      2 + PROVISIONAL_ENEMY_DYING_DURATION_SECONDS,
    );
  });

  it("transitions an active enemy with negative health", () => {
    const enemy = createActiveEnemy();
    enemy.currentHealth = -1;

    expect(transitionEnemyToDying(enemy, 2)).toBe(true);
    expect(enemy.phase).toBe("dying");
  });

  it("does not transition or schedule the same enemy twice", () => {
    const enemy = createActiveEnemy();
    enemy.currentHealth = 0;
    expect(transitionEnemyToDying(enemy, 2)).toBe(true);
    const firstDeadline = enemy.removeAtSimulationSeconds;

    expect(transitionEnemyToDying(enemy, 3)).toBe(false);
    expect(enemy.removeAtSimulationSeconds).toBe(firstDeadline);
  });

  it("removes all combat eligibility and pursuit on transition", () => {
    const enemy = createActiveEnemy();
    enemy.currentHealth = 0;
    const positionBeforeDefeat = { ...enemy.position };

    transitionEnemyToDying(enemy, 2);

    expect(isEnemyTargetable(enemy)).toBe(false);
    expect(canEnemyPursue(enemy)).toBe(false);
    expect(canEnemyDealContactDamage(enemy)).toBe(false);
    expect(calculateNextEnemyPosition(enemy, { x: 200, y: 200 }, 1)).toEqual(
      positionBeforeDefeat,
    );
  });

  it("expires at the exact deterministic removal deadline", () => {
    const enemy = createActiveEnemy();
    enemy.currentHealth = 0;
    transitionEnemyToDying(enemy, 2);

    expect(
      hasEnemyDyingExpired(
        enemy,
        2 + PROVISIONAL_ENEMY_DYING_DURATION_SECONDS - 0.001,
      ),
    ).toBe(false);
    expect(
      hasEnemyDyingExpired(enemy, 2 + PROVISIONAL_ENEMY_DYING_DURATION_SECONDS),
    ).toBe(true);
  });
});
