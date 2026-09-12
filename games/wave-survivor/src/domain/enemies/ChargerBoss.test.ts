import { describe, expect, it } from "vitest";
import { ARENA } from "../arena/index.js";
import { createSpawnGroup } from "../waves/WaveDefinition.js";
import {
  advanceChargerBoss,
  CHARGER_BOSS_DEFINITION,
  createChargerBossState,
} from "./ChargerBoss.js";
import { isEnemyStateValid } from "./EnemyState.js";

function activeBoss() {
  const boss = createChargerBossState(1, { x: 180, y: 160 });
  boss.phase = "active";
  return boss;
}
const TARGET = { x: 180, y: 500 };

describe("charger boss action cycle", () => {
  it("creates one independent shared enemy body and no active action during entry", () => {
    const position = { x: 180, y: -48 };
    const boss = createChargerBossState(1, position);
    position.x = 0;
    expect(boss.position).toEqual({ x: 180, y: -48 });
    expect(boss.currentHealth).toBe(CHARGER_BOSS_DEFINITION.maximumHealth);
    expect(boss.phase).toBe("entering");
    advanceChargerBoss(boss, TARGET, 0, 10);
    expect(boss.action).toBeNull();
    expect(Object.isFrozen(CHARGER_BOSS_DEFINITION)).toBe(true);
  });

  it("transitions at exact gameplay deadlines with stationary wind-up and recovery", () => {
    const boss = activeBoss();
    advanceChargerBoss(boss, TARGET, 0, 1.24);
    expect(boss.action?.phase).toBe("approach");
    advanceChargerBoss(boss, TARGET, 1.24, 0.01);
    expect(boss.action).toMatchObject({
      phase: "wind-up",
      endsAtSeconds: 2.05,
    });
    expect(boss.position.y).toBeCloseTo(220);
    const position = { ...boss.position };
    advanceChargerBoss(boss, TARGET, 1.25, 0.79);
    expect(boss.position).toEqual(position);
    expect(boss.action?.phase).toBe("wind-up");
    advanceChargerBoss(boss, TARGET, 2.04, 0.01);
    expect(boss.action?.phase).toBe("charge");
    advanceChargerBoss(boss, TARGET, 2.05, 0.8);
    expect(boss.action?.phase).toBe("recovery");
    expect(boss.position.y).toBeCloseTo(444);
    const stopped = { ...boss.position };
    advanceChargerBoss(boss, TARGET, 2.85, 1);
    expect(boss.action?.phase).toBe("approach");
    expect(boss.position).toEqual(stopped);
  });

  it("locks aim at wind-up, preserving direction through a moving target and charge", () => {
    const boss = activeBoss();
    advanceChargerBoss(boss, TARGET, 0, 1.25);
    const locked = boss.action;
    advanceChargerBoss(boss, { x: 24, y: 24 }, 1.25, 0.8);
    expect(boss.action).toMatchObject({
      phase: "charge",
      direction: { x: 0, y: 1 },
    });
    if (locked?.phase === "wind-up" && boss.action?.phase === "charge") {
      expect(boss.action.direction).toBe(locked.direction);
      expect(Object.isFrozen(locked.direction)).toBe(true);
    }
    advanceChargerBoss(boss, { x: 24, y: 24 }, 2.05, 0.4);
    expect(boss.position.x).toBe(180);
    expect(boss.position.y).toBeCloseTo(332);
  });

  it("is repeatable and splits large updates at action boundaries", () => {
    const first = activeBoss();
    const second = activeBoss();
    advanceChargerBoss(first, TARGET, 0, 4);
    for (let step = 0; step < 400; step += 1)
      advanceChargerBoss(second, TARGET, step / 100, 0.01);
    expect(second.position.x).toBeCloseTo(first.position.x);
    expect(second.position.y).toBeCloseTo(first.position.y);
    expect(second.action?.phase).toBe(first.action?.phase);
    expect(second.action?.endsAtSeconds).toBeCloseTo(
      first.action!.endsAtSeconds,
    );
    const repeat = activeBoss();
    advanceChargerBoss(repeat, TARGET, 0, 4);
    expect(repeat).toEqual(first);
  });

  it.each([
    { x: 180, y: 320 },
    { x: 24, y: 24 },
    { x: 336, y: 616 },
  ])(
    "handles coincident aim at %j and eventually leaves the wall",
    (position) => {
      const boss = activeBoss();
      boss.position = { ...position };
      advanceChargerBoss(boss, position, 0, 2.45);
      expect(isEnemyStateValid(boss)).toBe(true);
      expect(boss.position).not.toEqual(position);
      expect(boss.position.x).toBeGreaterThanOrEqual(24);
      expect(boss.position.x).toBeLessThanOrEqual(336);
      expect(boss.position.y).toBeGreaterThanOrEqual(24);
      expect(boss.position.y).toBeLessThanOrEqual(616);
    },
  );

  it.each([
    [
      { x: 330, y: 320 },
      { x: 1, y: 0 },
    ],
    [
      { x: 30, y: 320 },
      { x: -1, y: 0 },
    ],
    [
      { x: 180, y: 30 },
      { x: 0, y: -1 },
    ],
    [
      { x: 180, y: 610 },
      { x: 0, y: 1 },
    ],
    [
      { x: 330, y: 610 },
      { x: Math.SQRT1_2, y: Math.SQRT1_2 },
    ],
  ])(
    "stops at first boundary contact and completes recovery (%j)",
    (position, direction) => {
      const boss = activeBoss();
      boss.position = { ...position };
      boss.action = { phase: "charge", endsAtSeconds: 0.8, direction };
      advanceChargerBoss(boss, TARGET, 0, 0.1);
      expect(boss.action?.phase).toBe("recovery");
      const stopped = { ...boss.position };
      expect(stopped.x).toBeGreaterThanOrEqual(boss.collisionRadius);
      expect(stopped.x).toBeLessThanOrEqual(ARENA.width - boss.collisionRadius);
      expect(stopped.y).toBeGreaterThanOrEqual(boss.collisionRadius);
      expect(stopped.y).toBeLessThanOrEqual(
        ARENA.height - boss.collisionRadius,
      );
      advanceChargerBoss(boss, TARGET, 0.1, 0.8);
      expect(boss.position).toEqual(stopped);
      advanceChargerBoss(boss, { x: 180, y: 320 }, 0.9, 1);
      expect(boss.action?.phase).toBe("approach");
      expect(boss.position).not.toEqual(stopped);
    },
  );

  it("never advances action or movement after defeat", () => {
    const boss = activeBoss();
    boss.currentHealth = 0;
    const before = structuredClone(boss);
    advanceChargerBoss(boss, TARGET, 0, 1);
    expect(boss).toEqual(before);
    boss.phase = "dying";
    boss.removeAtSimulationSeconds = 1;
    advanceChargerBoss(boss, TARGET, 0, 1);
    expect(boss.action).toBeNull();
    expect(boss.position).toEqual(before.position);
  });

  it.each([0, -1, NaN, Infinity])("ignores invalid delta %s", (delta) => {
    const boss = activeBoss();
    const before = structuredClone(boss);
    advanceChargerBoss(boss, TARGET, 0, delta);
    expect(boss).toEqual(before);
  });

  it("rejects corrupt action directions and keeps bosses out of normal wave data", () => {
    const boss = activeBoss();
    boss.action = {
      phase: "charge",
      endsAtSeconds: 1,
      direction: { x: 0, y: 0 },
    };
    expect(isEnemyStateValid(boss)).toBe(false);
    expect(() => createChargerBossState(0, TARGET)).toThrow(RangeError);
    expect(() =>
      createSpawnGroup({
        startOffsetSeconds: 0,
        enemyId: "charger",
        count: 1,
        intervalSeconds: 0,
        pattern: "random-perimeter",
      }),
    ).toThrow(TypeError);
  });
});
