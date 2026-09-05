import { ARENA } from "../arena/index.js";
import type { LogicalPosition } from "../geometry/index.js";
import type { EnemyDefinition } from "./EnemyDefinition.js";
import { calculateNextEnemyPosition } from "./EnemyMovement.js";
import {
  isEnemyStateValid,
  type BossActionState,
  type ChargerBossState,
} from "./EnemyState.js";

/** WS-6.2 candidate only; production entry/telegraphs and human tuning are pending. */
export const CHARGER_BOSS_DEFINITION = Object.freeze({
  kind: "charger",
  collisionRadius: 24,
  movementSpeedUnitsPerSecond: 48,
  maximumHealth: 24,
  contactDamage: 1,
  approachSeconds: 1.25,
  windUpSeconds: 0.8,
  chargeSpeedUnitsPerSecond: 280,
  chargeSeconds: 0.8,
  recoverySeconds: 1,
} satisfies EnemyDefinition & {
  approachSeconds: number;
  windUpSeconds: number;
  chargeSpeedUnitsPerSecond: number;
  chargeSeconds: number;
  recoverySeconds: number;
});

/** Creates the shared enemy body; activating/positioning the entry is WS-6.3. */
export function createChargerBossState(
  id: number,
  position: Readonly<LogicalPosition>,
): ChargerBossState {
  const definition = CHARGER_BOSS_DEFINITION;
  const boss: ChargerBossState = {
    id,
    kind: definition.kind,
    phase: "entering",
    position: { ...position },
    collisionRadius: definition.collisionRadius,
    movementSpeedUnitsPerSecond: definition.movementSpeedUnitsPerSecond,
    currentHealth: definition.maximumHealth,
    contactDamage: definition.contactDamage,
    removeAtSimulationSeconds: null,
    action: null,
    entryStartedAtSeconds: null,
  };
  if (!isEnemyStateValid(boss))
    throw new RangeError("Boss body must be finite and valid.");
  return boss;
}

function deadline(time: number, duration: number): number {
  const end = time + duration;
  if (!Number.isFinite(end) || end <= time)
    throw new RangeError(
      "Boss action deadline must advance finite simulation time.",
    );
  return end;
}

function clampPosition(
  position: Readonly<LogicalPosition>,
  radius: number,
): LogicalPosition {
  return {
    x: Math.max(radius, Math.min(ARENA.width - radius, position.x)),
    y: Math.max(radius, Math.min(ARENA.height - radius, position.y)),
  };
}

function lockDirection(
  boss: ChargerBossState,
  target: Readonly<LogicalPosition>,
): Readonly<LogicalPosition> {
  // Aim at the reachable player position. At overlap, aim inward rather than
  // normalize zero or repeatedly charge outward from a wall.
  const aim = clampPosition(target, boss.collisionRadius);
  let x = aim.x - boss.position.x;
  let y = aim.y - boss.position.y;
  if (x === 0 && y === 0) {
    x = ARENA.width / 2 - boss.position.x;
    y = ARENA.height / 2 - boss.position.y;
  }
  const distance = Math.hypot(x, y);
  return Object.freeze(
    distance === 0 ? { x: 0, y: 1 } : { x: x / distance, y: y / distance },
  );
}

function nextAction(
  boss: ChargerBossState,
  action: BossActionState,
  target: Readonly<LogicalPosition>,
  time: number,
): BossActionState {
  const definition = CHARGER_BOSS_DEFINITION;
  switch (action.phase) {
    case "approach":
      return {
        phase: "wind-up",
        endsAtSeconds: deadline(time, definition.windUpSeconds),
        direction: lockDirection(boss, target),
      };
    case "wind-up":
      return {
        phase: "charge",
        endsAtSeconds: deadline(time, definition.chargeSeconds),
        direction: action.direction,
      };
    case "charge":
      return {
        phase: "recovery",
        endsAtSeconds: deadline(time, definition.recoverySeconds),
      };
    case "recovery":
      return {
        phase: "approach",
        endsAtSeconds: deadline(time, definition.approachSeconds),
      };
  }
}

/** Advance the existing enemy body deterministically using gameplay time.
 * Splits movement at action deadlines and first wall contact; never slides along
 * walls or spends leftover charge time moving after recovery begins.
 */
export function advanceChargerBoss(
  boss: ChargerBossState,
  target: Readonly<LogicalPosition>,
  simulationTimeSeconds: number,
  deltaSeconds: number,
): void {
  if (boss.phase !== "active" || boss.currentHealth <= 0) return;
  if (
    !isEnemyStateValid(boss) ||
    !Number.isFinite(target.x) ||
    !Number.isFinite(target.y) ||
    !Number.isFinite(simulationTimeSeconds) ||
    simulationTimeSeconds < 0 ||
    !Number.isFinite(deltaSeconds) ||
    deltaSeconds <= 0
  )
    return;
  const end = simulationTimeSeconds + deltaSeconds;
  if (!Number.isFinite(end) || end <= simulationTimeSeconds) return;
  boss.position = clampPosition(boss.position, boss.collisionRadius);
  let time = simulationTimeSeconds;
  let action = boss.action ?? {
    phase: "approach" as const,
    endsAtSeconds: deadline(time, CHARGER_BOSS_DEFINITION.approachSeconds),
  };
  while (time < end) {
    // A resumed/imported fixture cannot replay unobserved actions retroactively.
    if (action.endsAtSeconds <= time) {
      action = nextAction(boss, action, target, time);
      continue;
    }
    const stepEnd = Math.min(end, action.endsAtSeconds);
    const step = stepEnd - time;
    if (action.phase === "approach") {
      boss.position = clampPosition(
        calculateNextEnemyPosition(boss, target, step),
        boss.collisionRadius,
      );
    } else if (action.phase === "charge") {
      const { x, y } = action.direction;
      const radius = boss.collisionRadius;
      const wallDistance = Math.min(
        x > 0
          ? (ARENA.width - radius - boss.position.x) / x
          : x < 0
            ? (radius - boss.position.x) / x
            : Infinity,
        y > 0
          ? (ARENA.height - radius - boss.position.y) / y
          : y < 0
            ? (radius - boss.position.y) / y
            : Infinity,
      );
      const speed = CHARGER_BOSS_DEFINITION.chargeSpeedUnitsPerSecond;
      const travel = Math.min(speed * step, wallDistance);
      boss.position = clampPosition(
        { x: boss.position.x + x * travel, y: boss.position.y + y * travel },
        radius,
      );
      if (wallDistance <= speed * step) {
        time += travel / speed;
        action = nextAction(boss, action, target, time);
        continue;
      }
    }
    time = stepEnd;
    if (time >= action.endsAtSeconds)
      action = nextAction(boss, action, target, time);
  }
  boss.action = action;
}
