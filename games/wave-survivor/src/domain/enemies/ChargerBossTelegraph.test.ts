import { describe, expect, it } from "vitest";
import {
  advanceChargerBoss,
  createChargerBossState,
  getBossActionTelegraph,
} from "./ChargerBoss.js";

function windingBoss(x = 180, y = 160, direction = { x: 0, y: 1 }) {
  const boss = createChargerBossState(1, { x, y });
  boss.phase = "active";
  boss.action = { phase: "wind-up", endsAtSeconds: 0.8, direction };
  return boss;
}

describe("domain charge warnings", () => {
  it.each([
    [180, 160, 0, 1, 180, 384],
    [30, 30, -1, 0, 24, 30],
    [330, 610, 1, 0, 336, 610],
    [30, 30, 0, -1, 30, 24],
    [330, 610, 0, 1, 330, 616],
    [330, 610, Math.SQRT1_2, Math.SQRT1_2, 336, 616],
  ])(
    "matches actual charge endpoint at (%s, %s), including clipped corners",
    (x, y, dx, dy, endX, endY) => {
      const boss = windingBoss(x, y, { x: dx, y: dy });
      const warning = getBossActionTelegraph(boss, 0)!;
      expect(warning.chargePath?.to.x).toBeCloseTo(endX);
      expect(warning.chargePath?.to.y).toBeCloseTo(endY);
      expect(warning.chargePath?.radius).toBe(boss.collisionRadius);
      advanceChargerBoss(boss, { x: 180, y: 500 }, 0, 0.8);
      expect(boss.position).toEqual({ x, y });
      expect(boss.action?.phase).toBe("charge");
      advanceChargerBoss(boss, { x: 12, y: 12 }, 0.8, 0.8);
      expect(boss.position.x).toBeCloseTo(endX);
      expect(boss.position.y).toBeCloseTo(endY);
      expect(boss.action?.phase).toBe("recovery");
      expect(getBossActionTelegraph(boss, 1.6)?.chargePath).toBeUndefined();
    },
  );

  it("keeps the warning locked while the target moves, and shrinks the charge corridor to remaining travel", () => {
    const boss = windingBoss();
    const first = getBossActionTelegraph(boss, 0)!;
    advanceChargerBoss(boss, { x: 12, y: 12 }, 0, 0.799);
    const lastWindUp = getBossActionTelegraph(boss, 0.799)!;
    expect(lastWindUp.phase).toBe("wind-up");
    expect(lastWindUp.secondsRemaining).toBeCloseTo(0.001);
    expect(lastWindUp.chargePath).toEqual(first.chargePath);
    advanceChargerBoss(boss, { x: 348, y: 12 }, 0.799, 0.201);
    const charge = getBossActionTelegraph(boss, 1)!;
    expect(charge.phase).toBe("charge");
    expect(charge.chargePath?.from.y).toBeCloseTo(216);
    expect(charge.chargePath?.to).toEqual(first.chargePath?.to);
    expect(charge.chargePath?.direction).toEqual({ x: 0, y: 1 });
    expect(first.chargePath?.from).toEqual({ x: 180, y: 160 });
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.chargePath)).toBe(true);
    expect(Object.isFrozen(first.chargePath?.from)).toBe(true);
    expect(Object.isFrozen(first.chargePath?.to)).toBe(true);
    expect(Object.isFrozen(first.chargePath?.direction)).toBe(true);
  });

  it("has no action warning during entry or death", () => {
    const boss = windingBoss();
    boss.phase = "entering";
    expect(getBossActionTelegraph(boss, 0)).toBeUndefined();
    boss.phase = "active";
    boss.currentHealth = 0;
    expect(getBossActionTelegraph(boss, 0)).toBeUndefined();
    boss.phase = "dying";
    boss.removeAtSimulationSeconds = 1;
    expect(getBossActionTelegraph(boss, 0)).toBeUndefined();
  });
});
