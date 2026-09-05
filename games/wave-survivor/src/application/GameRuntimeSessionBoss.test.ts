import { describe, expect, it } from "vitest";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import { createChargerBossState } from "../domain/enemies/ChargerBoss.js";
import {
  createBasicEnemyState,
  canEnemyDealContactDamage,
  isEnemyTargetable,
} from "../domain/enemies/EnemyState.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
} from "../domain/movement/index.js";
import { createInitialRuntimeState } from "../domain/state/RuntimeState.js";
import { createBasicProjectileState } from "../domain/projectiles/index.js";
import {
  createRunUpgradeState,
  getEffectiveMaximumHealth,
  type UpgradeId,
} from "../domain/upgrades/index.js";
import {
  createSpawnGroup,
  createWaveDefinition,
  createWaveScheduleProgress,
} from "../domain/waves/index.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

function fixture(upgrade?: UpgradeId) {
  const state = createInitialRuntimeState();
  state.player.position = { x: 180, y: 480 };
  state.upgrades = createRunUpgradeState(upgrade ? { [upgrade]: 4 } : {});
  state.player.currentHealth = getEffectiveMaximumHealth(
    state.player.maximumHealth,
    state.upgrades,
  );
  // Isolate an active boss in the real session. A far-future normal request
  // prevents normal completion; this is not production boss entry or victory.
  state.waveSchedule = createWaveScheduleProgress(
    1,
    createWaveDefinition({
      groups: [
        createSpawnGroup({
          startOffsetSeconds: 3600,
          enemyId: "basic",
          count: 1,
          intervalSeconds: 0,
          pattern: "random-perimeter",
        }),
      ],
      maxActiveEnemies: 1,
    }),
  );
  const boss = createChargerBossState(1, { x: 180, y: 160 });
  boss.phase = "active";
  state.enemies = [boss];
  state.nextEnemyId = 2;
  const input: MovementInputPort = {
    readMovementIntent: () => ZERO_MOVEMENT_INTENT,
    reset: () => {},
    destroy: () => {},
  };
  const session = new GameRuntimeSession(
    state,
    input,
    null,
    new SeededRandomSource(1),
    new SeededRandomSource(2),
  );
  session.start();
  return { state, boss, input, session };
}

describe("active charger session fixtures", () => {
  it("uses automatic targeting and existing projectiles to damage the boss", () => {
    const { state, boss, session } = fixture();
    session.fixedUpdate(1 / 60);
    expect(state.projectiles).toHaveLength(1);
    for (let step = 0; step < 90; step += 1) session.fixedUpdate(1 / 60);
    expect(boss.currentHealth).toBeLessThan(24);
    expect(boss.action?.phase).toBe("wind-up");
    expect(state.killCount).toBe(0);
    session.destroy();
  });

  it.each(["approach", "wind-up", "charge", "recovery"] as const)(
    "pause freezes %s along with the gameplay clock",
    (phase) => {
      const { state, boss, session } = fixture();
      boss.action =
        phase === "charge" || phase === "wind-up"
          ? { phase, endsAtSeconds: 1, direction: { x: 0, y: 1 } }
          : { phase, endsAtSeconds: 1 };
      const before = structuredClone(boss);
      expect(session.pause()).toBe(true);
      session.fixedUpdate(30);
      expect(boss).toEqual(before);
      expect(state.simulationTimeSeconds).toBe(0);
      session.resume();
      session.fixedUpdate(1 / 60);
      expect(state.simulationTimeSeconds).toBeCloseTo(1 / 60);
      expect(boss.action?.phase).toBe(phase);
      session.destroy();
    },
  );

  it.each(["approach", "wind-up", "charge", "recovery"] as const)(
    "uses shared contact damage and immunity during %s",
    (phase) => {
      const { state, boss, session } = fixture();
      state.nextAttackAtSeconds = 100;
      boss.position = { ...state.player.position };
      boss.action =
        phase === "charge" || phase === "wind-up"
          ? { phase, endsAtSeconds: 2, direction: { x: 0, y: 1 } }
          : { phase, endsAtSeconds: 2 };
      expect(canEnemyDealContactDamage(boss)).toBe(true);
      expect(isEnemyTargetable(boss)).toBe(true);
      session.fixedUpdate(1 / 60);
      expect(state.player.currentHealth).toBe(2);
      boss.position = { ...state.player.position };
      session.fixedUpdate(1 / 60);
      expect(state.player.currentHealth).toBe(2);
      expect(state.player.invulnerableUntilSeconds).toBeCloseTo(1 / 60 + 0.65);
      session.destroy();
    },
  );

  it.each(["entering", "dying"] as const)(
    "keeps %s bosses out of all combat eligibility",
    (phase) => {
      const { state, boss, session } = fixture();
      boss.phase = phase;
      boss.removeAtSimulationSeconds = phase === "dying" ? 100 : null;
      boss.position = { ...state.player.position };
      expect(isEnemyTargetable(boss)).toBe(false);
      expect(canEnemyDealContactDamage(boss)).toBe(false);
      // Eligibility is checked before entry activation in domain combat tests;
      // do not place an entering boss onscreen and mistake activation for damage.
      if (phase === "entering") boss.position = { x: 180, y: -48 };
      session.fixedUpdate(1 / 60);
      expect(state.player.currentHealth).toBe(3);
      expect(state.projectiles).toEqual([]);
      expect(boss.currentHealth).toBe(24);
      expect(boss.action).toBeNull();
      session.destroy();
    },
  );

  it("counts a projectile defeat exactly once before contact, then cleans up", () => {
    const { state, boss, session } = fixture();
    state.nextAttackAtSeconds = 100;
    boss.position = { ...state.player.position };
    boss.action = { phase: "recovery", endsAtSeconds: 2 };
    boss.currentHealth = 1;
    state.projectiles = [1, 2].map((id) =>
      createBasicProjectileState(
        id,
        state.player.position,
        { x: 180, y: 400 },
        0,
      ),
    );
    session.fixedUpdate(1 / 60);
    expect(boss.phase).toBe("dying");
    expect(boss.currentHealth).toBe(0);
    expect(state.killCount).toBe(1);
    expect(state.player.currentHealth).toBe(3);
    for (let step = 0; step < 30; step += 1) session.fixedUpdate(1 / 60);
    expect(state.killCount).toBe(1);
    expect(state.enemies).toEqual([]);
    expect(session.phase).toBe("playing");
    session.destroy();
  });

  it("preserves basic pursuit alongside boss action dispatch", () => {
    const { state, boss, session } = fixture();
    const basic = createBasicEnemyState(2, { x: 100, y: 480 });
    basic.phase = "active";
    state.enemies.push(basic);
    boss.action = {
      phase: "wind-up",
      endsAtSeconds: 2,
      direction: { x: 0, y: 1 },
    };
    session.fixedUpdate(1 / 60);
    expect(basic.position.x).toBeCloseTo(101.2);
    expect(boss.position).toEqual({ x: 180, y: 160 });
    session.destroy();
  });

  it.each(["rapid-fire", "swift-movement", "vitality"] as const)(
    "records a deterministic rectangular-route fight with four %s upgrades",
    (upgrade) => {
      const { state, boss, input, session } = fixture(upgrade);
      const route = [
        { x: 60, y: 480 },
        { x: 60, y: 160 },
        { x: 300, y: 160 },
        { x: 300, y: 480 },
      ];
      let waypoint = 0;
      input.readMovementIntent = () => {
        const target = route[waypoint]!;
        const x = target.x - state.player.position.x;
        const y = target.y - state.player.position.y;
        if (Math.hypot(x, y) < 4) waypoint = (waypoint + 1) % route.length;
        return createMovementIntent(x, y);
      };
      for (
        let step = 0;
        step < 120 * 60 && session.phase === "playing" && state.killCount === 0;
        step += 1
      ) {
        session.fixedUpdate(1 / 60);
        expect(boss.position.x).toBeGreaterThanOrEqual(24);
        expect(boss.position.x).toBeLessThanOrEqual(336);
        expect(boss.position.y).toBeGreaterThanOrEqual(24);
        expect(boss.position.y).toBeLessThanOrEqual(616);
      }
      const expected = {
        "rapid-fire": { seconds: 30.82, health: 3 },
        "swift-movement": { seconds: 43.13, health: 3 },
        vitality: { seconds: 46, health: 7 },
      }[upgrade];
      expect(state.simulationTimeSeconds).toBeCloseTo(expected.seconds, 2);
      expect(state.player.currentHealth).toBe(expected.health);
      expect(boss.currentHealth).toBe(0);
      expect(state.killCount).toBe(1);
      expect(session.phase).toBe("playing"); // No terminal integration in this task.
      session.destroy();
    },
  );
});
