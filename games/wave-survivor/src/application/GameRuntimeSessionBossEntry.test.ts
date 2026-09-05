import { describe, expect, it } from "vitest";
import type { GameEvent } from "../GameEvent.js";
import type { GameRenderSnapshot } from "../domain/GamePresentationPort.js";
import {
  BOSS_ENTRY_DURATION_SECONDS,
  BOSS_ENTRY_LEAD_SECONDS,
} from "../domain/enemies/BossEntry.js";
import {
  createBasicEnemyState,
  isEnemyTargetable,
  canEnemyDealContactDamage,
} from "../domain/enemies/EnemyState.js";
import { createInitialRuntimeState } from "../domain/state/RuntimeState.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
} from "../domain/movement/index.js";
import { createRunUpgradeState } from "../domain/upgrades/index.js";
import {
  createWaveScheduleProgress,
  PROVISIONAL_RUN_DEFINITION,
} from "../domain/waves/index.js";
import { createBasicProjectileState } from "../domain/projectiles/index.js";
import { SeededRandomSource } from "../infrastructure/random/SeededRandomSource.js";
import { GameRuntimeSession } from "./GameRuntimeSession.js";

function fixture(position = { x: 180, y: 320 }) {
  const state = createInitialRuntimeState();
  state.phase = "choosing-upgrade";
  state.simulationTimeSeconds = 40;
  state.player.position = { ...position };
  state.upgrades = createRunUpgradeState({ "rapid-fire": 3 });
  state.pendingUpgradeOptionIds = ["vitality"];
  state.waveSchedule = createWaveScheduleProgress(
    4,
    PROVISIONAL_RUN_DEFINITION.normalWaves[3]!,
  );
  state.killCount = 28;
  let movement = ZERO_MOVEMENT_INTENT;
  const events: GameEvent[] = [];
  const snapshots: GameRenderSnapshot[] = [];
  const session = new GameRuntimeSession(
    state,
    {
      readMovementIntent: () => movement,
      reset: () => {
        movement = ZERO_MOVEMENT_INTENT;
      },
      destroy: () => {},
    },
    {
      render: (snapshot) => snapshots.push(snapshot),
      setTheme: () => {},
      destroy: () => {},
    },
    new SeededRandomSource(1),
    new SeededRandomSource(2),
    null,
    null,
    (event) => events.push(event),
  );
  return {
    state,
    session,
    events,
    snapshots,
    move: (x: number, y: number) => {
      movement = createMovementIntent(x, y);
    },
  };
}

describe("finite boss entry", () => {
  it("hands off once, clears old entities, and preserves earned progress", () => {
    const { state, session, events, snapshots } = fixture({ x: 99, y: 201 });
    state.player.currentHealth = 2;
    state.enemies = [createBasicEnemyState(10, state.player.position)];
    state.projectiles = [
      createBasicProjectileState(
        1,
        state.player.position,
        { x: 100, y: 200 },
        40,
      ),
    ];
    state.nextEnemyId = 11;
    expect(session.chooseUpgrade("vitality")).toBe(true);
    expect(state.waveSchedule).toBeNull();
    expect(state.enemies).toMatchObject([
      {
        id: 11,
        kind: "charger",
        phase: "entering",
        position: { x: 180, y: -96 },
        entryStartedAtSeconds: 40,
      },
    ]);
    expect(state.projectiles).toEqual([]);
    expect(state.nextEnemyId).toBe(12);
    expect(state.upgrades.levels).toEqual({
      "rapid-fire": 3,
      "swift-movement": 0,
      vitality: 1,
    });
    expect(state.player.currentHealth).toBe(3);
    expect(state.player.position).toEqual({ x: 99, y: 201 });
    expect(state.killCount).toBe(28);
    expect(state.simulationTimeSeconds).toBe(40);
    expect(events).toEqual([
      { type: "wave-started", waveNumber: 5, encounterKind: "boss" },
    ]);
    expect(session.chooseUpgrade("vitality")).toBe(false);
    session.render();
    expect(snapshots.at(-1)?.enemies[0]).toEqual({
      id: 11,
      phase: "entering",
      x: 180,
      y: -96,
      collisionRadius: 24,
      entryWarning: "boss",
    });
    expect(Object.isFrozen(snapshots.at(-1)?.enemies[0])).toBe(true);
    session.fixedUpdate(1);
    expect(state.enemies).toHaveLength(1);
    expect(events).toHaveLength(1);
    session.destroy();
  });

  it.each([
    { x: 12, y: 12 },
    { x: 180, y: 12 },
    { x: 348, y: 12 },
    { x: 12, y: 320 },
    { x: 180, y: 320 },
    { x: 348, y: 320 },
    { x: 12, y: 628 },
    { x: 180, y: 628 },
    { x: 348, y: 628 },
  ])(
    "allows escape from %j even after 1.5 seconds of reaction delay",
    (position) => {
      const { state, session, move } = fixture(position);
      session.chooseUpgrade("vitality");
      const health = state.player.currentHealth;
      for (let step = 0; step < 90; step += 1) session.fixedUpdate(1 / 60);
      expect(state.player.currentHealth).toBe(health);
      expect(state.enemies[0]?.phase).toBe("entering");
      move(position.x >= 180 ? -1 : 1, position.y <= 320 ? 1 : -1);
      for (let step = 0; step < 100; step += 1) {
        session.fixedUpdate(1 / 60);
        expect(state.enemies).toHaveLength(1);
        expect(state.player.currentHealth).toBe(health);
      }
      expect(state.enemies[0]?.phase).toBe("active");
      expect(state.player.position).not.toEqual(position);
      expect(state.waveSchedule).toBeNull();
      session.destroy();
    },
  );

  it("keeps offscreen and partially visible entry harmless, then activates the full body", () => {
    const { state, session, snapshots } = fixture({ x: 180, y: 12 });
    session.chooseUpgrade("vitality");
    const boss = state.enemies[0]!;
    expect(BOSS_ENTRY_LEAD_SECONDS).toBeGreaterThan(0.75);
    session.fixedUpdate(2);
    expect(boss.position.y).toBe(0);
    expect(isEnemyTargetable(boss)).toBe(false);
    expect(canEnemyDealContactDamage(boss)).toBe(false);
    expect(state.projectiles).toEqual([]);
    expect(state.player.currentHealth).toBe(4);
    session.render();
    expect(snapshots.at(-1)?.enemies[0]?.entryWarning).toBe("boss");
    session.fixedUpdate(BOSS_ENTRY_DURATION_SECONDS - 2);
    expect(boss.position).toEqual({ x: 180, y: 24 });
    expect(boss.phase).toBe("active");
    expect(isEnemyTargetable(boss)).toBe(true);
    expect(canEnemyDealContactDamage(boss)).toBe(true);
    expect(state.player.currentHealth).toBe(3); // Staying on the entry point is dangerous after warning.
    session.render();
    expect(snapshots.at(-1)?.enemies[0]).not.toHaveProperty("entryWarning");
    session.destroy();
  });

  it("freezes entry on pause and restarts into a fresh normal run", () => {
    const { state, session, snapshots, events } = fixture();
    session.chooseUpgrade("vitality");
    session.fixedUpdate(1);
    session.pause();
    const paused = structuredClone(state);
    session.fixedUpdate(100);
    expect(state).toEqual(paused);
    session.resume();
    session.fixedUpdate(0.5);
    expect(state.enemies[0]?.position.y).toBe(-24);
    session.restart();
    session.render();
    expect(snapshots.at(-1)).toMatchObject({
      simulationTimeSeconds: 0,
      enemies: [],
      projectiles: [],
      playerCurrentHealth: 3,
      killCount: 0,
    });
    expect(events.at(-1)).toEqual({ type: "wave-started", waveNumber: 1 });
    session.fixedUpdate(0.6);
    session.render();
    expect(
      snapshots
        .at(-1)
        ?.enemies.every((enemy) => enemy.entryWarning === undefined),
    ).toBe(true);
    session.destroy();
  });

  it("destroy during entry prevents further simulation, rendering, or announcements", () => {
    const { state, session, snapshots, events } = fixture();
    session.chooseUpgrade("vitality");
    session.fixedUpdate(1);
    session.destroy();
    const destroyed = structuredClone(state);
    session.fixedUpdate(10);
    session.render();
    expect(state).toEqual(destroyed);
    expect(state.enemies).toEqual([]);
    expect(snapshots).toEqual([]);
    expect(events).toHaveLength(1);
  });

  it("never spawns a successor, offers upgrades, or infers victory from an empty boss arena", () => {
    const { state, session, events } = fixture();
    session.chooseUpgrade("vitality");
    state.enemies = [];
    for (let step = 0; step < 120; step += 1) session.fixedUpdate(1 / 60);
    expect(state.waveSchedule).toBeNull();
    expect(state.enemies).toEqual([]);
    expect(state.pendingUpgradeOptionIds).toEqual([]);
    expect(session.phase).toBe("playing");
    expect(events).toHaveLength(1);
    state.phase = "wave-cleared";
    state.pendingUpgradeOptionIds = ["vitality"];
    expect(session.beginUpgradeSelection()).toBe(false);
    session.destroy();
  });
});
