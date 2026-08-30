import { describe, expect, expectTypeOf, it } from "vitest";
import { VISIBLE_ARENA_BOUNDS, createBounds } from "../arena/index.js";
import { BASIC_ENEMY_DEFINITION } from "./EnemyDefinition.js";
import {
  canEnemyDealContactDamage,
  canEnemyPursue,
  createBasicEnemyState,
  getEnemyPhaseAfterBoundsIntersection,
  isEnemyStateValid,
  isEnemyTargetable,
  shouldRetainEnemyWithinBounds,
  type EnemyState,
  type EnemyPhase,
} from "./EnemyState.js";

describe("createBasicEnemyState", () => {
  it("creates an entering enemy with its ID and definition values", () => {
    const enemy = createBasicEnemyState(7, { x: -12, y: 320 });

    expect(enemy).toEqual({
      id: 7,
      kind: BASIC_ENEMY_DEFINITION.kind,
      phase: "entering",
      position: { x: -12, y: 320 },
      collisionRadius: BASIC_ENEMY_DEFINITION.collisionRadius,
      movementSpeedUnitsPerSecond:
        BASIC_ENEMY_DEFINITION.movementSpeedUnitsPerSecond,
      currentHealth: BASIC_ENEMY_DEFINITION.maximumHealth,
      contactDamage: BASIC_ENEMY_DEFINITION.contactDamage,
      removeAtSimulationSeconds: null,
    });
  });

  it("owns a copy of the supplied logical position", () => {
    const position = { x: 24, y: -36 };
    const enemy = createBasicEnemyState(1, position);

    expect(enemy.position).not.toBe(position);

    position.x = 999;

    expect(enemy.position).toEqual({ x: 24, y: -36 });
  });
});

describe("enemy phase eligibility", () => {
  it("defines exactly entering, active, and dying phases", () => {
    expectTypeOf<EnemyPhase>().toEqualTypeOf<"entering" | "active" | "dying">();
  });

  it.each([
    ["entering", true, false, false],
    ["active", true, true, true],
    ["dying", false, false, false],
  ] as const)(
    "applies %s eligibility rules",
    (phase, canPursue, isTargetable, canDealContactDamage) => {
      const enemy = createBasicEnemyState(1, { x: 0, y: 0 });
      enemy.phase = phase;

      expect(canEnemyPursue(enemy)).toBe(canPursue);
      expect(isEnemyTargetable(enemy)).toBe(isTargetable);
      expect(canEnemyDealContactDamage(enemy)).toBe(canDealContactDamage);
    },
  );

  it("keeps a fully invisible entering enemy entering", () => {
    const enemy = createBasicEnemyState(1, { x: -13, y: 320 });

    expect(
      getEnemyPhaseAfterBoundsIntersection(enemy, VISIBLE_ARENA_BOUNDS),
    ).toBe("entering");
  });

  it("activates an entering enemy on partial entry", () => {
    const enemy = createBasicEnemyState(1, { x: -11, y: 320 });

    expect(
      getEnemyPhaseAfterBoundsIntersection(enemy, VISIBLE_ARENA_BOUNDS),
    ).toBe("active");
  });

  it("activates an entering enemy at exact tangency", () => {
    const enemy = createBasicEnemyState(1, { x: -12, y: 320 });

    expect(
      getEnemyPhaseAfterBoundsIntersection(enemy, VISIBLE_ARENA_BOUNDS),
    ).toBe("active");
  });

  it("does not return an active enemy to entering when outside", () => {
    const enemy = createBasicEnemyState(1, { x: -100, y: 320 });
    enemy.phase = "active";

    expect(
      getEnemyPhaseAfterBoundsIntersection(enemy, VISIBLE_ARENA_BOUNDS),
    ).toBe("active");
  });

  it("preserves a dying enemy phase", () => {
    const enemy = createBasicEnemyState(1, { x: 180, y: 320 });
    enemy.phase = "dying";

    expect(
      getEnemyPhaseAfterBoundsIntersection(enemy, VISIBLE_ARENA_BOUNDS),
    ).toBe("dying");
  });

  it("becomes combat-eligible only after activation", () => {
    const enemy = createBasicEnemyState(1, { x: -13, y: 320 });
    enemy.phase = getEnemyPhaseAfterBoundsIntersection(
      enemy,
      VISIBLE_ARENA_BOUNDS,
    );

    expect(isEnemyTargetable(enemy)).toBe(false);
    expect(canEnemyDealContactDamage(enemy)).toBe(false);

    enemy.position = { x: -12, y: 320 };
    enemy.phase = getEnemyPhaseAfterBoundsIntersection(
      enemy,
      VISIBLE_ARENA_BOUNDS,
    );

    expect(isEnemyTargetable(enemy)).toBe(true);
    expect(canEnemyDealContactDamage(enemy)).toBe(true);
  });
});

describe("enemy cleanup eligibility", () => {
  const despawnBounds = createBounds(-100, -100, 560, 840);

  it("retains a circle crossing the visible border", () => {
    const enemy = createBasicEnemyState(1, { x: -5, y: 320 });
    enemy.phase = "active";

    expect(shouldRetainEnemyWithinBounds(enemy, VISIBLE_ARENA_BOUNDS)).toBe(
      true,
    );
    expect(shouldRetainEnemyWithinBounds(enemy, despawnBounds)).toBe(true);
  });

  it("retains an active enemy fully outside visible bounds within safety bounds", () => {
    const enemy = createBasicEnemyState(1, { x: -20, y: 320 });
    enemy.phase = "active";

    expect(shouldRetainEnemyWithinBounds(enemy, VISIBLE_ARENA_BOUNDS)).toBe(
      false,
    );
    expect(shouldRetainEnemyWithinBounds(enemy, despawnBounds)).toBe(true);
  });

  it("retains exact despawn-boundary tangency", () => {
    const enemy = createBasicEnemyState(1, { x: -112, y: 320 });

    expect(shouldRetainEnemyWithinBounds(enemy, despawnBounds)).toBe(true);
  });

  it("removes a circle fully outside the despawn bounds", () => {
    const enemy = createBasicEnemyState(1, { x: -112.01, y: 320 });

    expect(shouldRetainEnemyWithinBounds(enemy, despawnBounds)).toBe(false);
  });

  it.each([
    { ...createBasicEnemyState(0, { x: 0, y: 0 }) },
    createBasicEnemyState(1, { x: Number.NaN, y: 0 }),
    createBasicEnemyState(1, { x: 0, y: Number.POSITIVE_INFINITY }),
    {
      ...createBasicEnemyState(1, { x: 0, y: 0 }),
      collisionRadius: -1,
    },
    {
      ...createBasicEnemyState(1, { x: 0, y: 0 }),
      movementSpeedUnitsPerSecond: Number.NaN,
    },
    {
      ...createBasicEnemyState(1, { x: 0, y: 0 }),
      currentHealth: Number.POSITIVE_INFINITY,
    },
    {
      ...createBasicEnemyState(1, { x: 0, y: 0 }),
      contactDamage: -1,
    },
    {
      ...createBasicEnemyState(1, { x: 0, y: 0 }),
      removeAtSimulationSeconds: Number.NaN,
    },
    {
      ...createBasicEnemyState(1, { x: 0, y: 0 }),
      phase: "dying",
    },
    {
      ...createBasicEnemyState(1, { x: 0, y: 0 }),
      removeAtSimulationSeconds: 1,
    },
  ] satisfies EnemyState[])(
    "rejects invalid enemy numeric state %#",
    (enemy) => {
      expect(isEnemyStateValid(enemy)).toBe(false);
      expect(shouldRetainEnemyWithinBounds(enemy, despawnBounds)).toBe(false);
    },
  );

  it("does not treat a dying enemy or non-positive health as invalid", () => {
    const enemy = createBasicEnemyState(1, { x: 180, y: 320 });
    enemy.phase = "dying";
    enemy.currentHealth = 0;
    enemy.removeAtSimulationSeconds = 1;

    expect(isEnemyStateValid(enemy)).toBe(true);
    expect(shouldRetainEnemyWithinBounds(enemy, despawnBounds)).toBe(true);
  });
});
