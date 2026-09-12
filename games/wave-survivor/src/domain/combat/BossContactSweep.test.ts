import { describe, expect, it } from "vitest";
import {
  advanceChargerBoss,
  createChargerBossState,
} from "../enemies/ChargerBoss.js";
import { doesBossSweepContactPlayer } from "./BossContactSweep.js";

describe("focused boss contact sweep", () => {
  it.each([35.99, 36, 36.01])(
    "handles near-tangent clearance %s even at the production 1/60 step",
    (clearance) => {
      const boss = createChargerBossState(1, { x: 100, y: 200 });
      boss.phase = "active";
      boss.action = {
        phase: "charge",
        endsAtSeconds: 0.8,
        direction: { x: 1, y: 0 },
      };
      const segments = advanceChargerBoss(boss, { x: 180, y: 200 }, 0, 1 / 60);
      const player = { x: 100 + 280 / 120, y: 200 + clearance };
      expect(Math.hypot(player.x - 100, clearance)).toBeGreaterThan(36);
      expect(Math.hypot(player.x - boss.position.x, clearance)).toBeGreaterThan(
        36,
      );
      expect(doesBossSweepContactPlayer(segments, player, player, 36)).toBe(
        clearance <= 36,
      );
    },
  );

  it("uses relative movement, including a crossing with no endpoint overlap", () => {
    const segments = [
      {
        from: { x: 100, y: 100 },
        to: { x: 200, y: 100 },
        startFraction: 0,
        endFraction: 1,
      },
    ];
    expect(
      doesBossSweepContactPlayer(
        segments,
        { x: 200, y: 100 },
        { x: 100, y: 100 },
        36,
      ),
    ).toBe(true);
    expect(
      doesBossSweepContactPlayer(
        segments,
        { x: 200, y: 137 },
        { x: 100, y: 137 },
        36,
      ),
    ).toBe(false);
  });

  it("retains wind-up and wall recovery timing rather than sweeping one misleading chord", () => {
    const boss = createChargerBossState(1, { x: 300, y: 200 });
    boss.phase = "active";
    boss.action = {
      phase: "wind-up",
      endsAtSeconds: 0.2,
      direction: { x: 1, y: 0 },
    };
    const segments = advanceChargerBoss(boss, { x: 12, y: 12 }, 0, 0.5);
    expect(segments).toHaveLength(3);
    expect(segments[0]).toEqual({
      from: { x: 300, y: 200 },
      to: { x: 300, y: 200 },
      startFraction: 0,
      endFraction: 0.4,
    });
    expect(segments[1]?.to).toEqual({ x: 336, y: 200 });
    expect(segments[2]?.from).toEqual(segments[2]?.to);
    expect(segments[2]?.endFraction).toBe(1);
    // Player crosses the start during wind-up, then ends far from the wall.
    expect(
      doesBossSweepContactPlayer(
        segments,
        { x: 300, y: 160 },
        { x: 300, y: 360 },
        36,
      ),
    ).toBe(true);
    // No extension beyond the physical wall stop.
    expect(
      doesBossSweepContactPlayer(
        segments,
        { x: 400, y: 200 },
        { x: 400, y: 200 },
        36,
      ),
    ).toBe(false);
  });

  it("handles stationary overlap and an absent movement trace", () => {
    const segments = [
      {
        from: { x: 100, y: 100 },
        to: { x: 100, y: 100 },
        startFraction: 0,
        endFraction: 1,
      },
    ];
    expect(
      doesBossSweepContactPlayer(
        segments,
        { x: 100, y: 100 },
        { x: 100, y: 100 },
        36,
      ),
    ).toBe(true);
    expect(
      doesBossSweepContactPlayer(
        [],
        { x: 100, y: 100 },
        { x: 100, y: 100 },
        36,
      ),
    ).toBe(false);
  });
});
