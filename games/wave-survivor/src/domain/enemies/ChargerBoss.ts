import { ARENA } from "../arena/index.js";
import type { LogicalPosition } from "../geometry/index.js";
import type { EnemyDefinition } from "./EnemyDefinition.js";
import { calculateNextEnemyPosition } from "./EnemyMovement.js";
import {
  isEnemyStateValid,
  type BossActionState,
  type ChargerBossState,
} from "./EnemyState.js";

/** Provisional charger tuning; human fairness and final tuning remain pending. */
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

/** Creates the shared enemy body; BossEntry owns production entry. */
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

/** One actual linear part of a boss update, including stationary action time. */
export interface BossMovementSegment {
  readonly from: Readonly<LogicalPosition>;
  readonly to: Readonly<LogicalPosition>;
  readonly startFraction: number;
  readonly endFraction: number;
}

export interface BossChargePath {
  readonly from: Readonly<LogicalPosition>;
  readonly to: Readonly<LogicalPosition>;
  readonly direction: Readonly<LogicalPosition>;
  /** Physical swept body radius. Player centers need their own radius beyond it. */
  readonly radius: number;
}

export interface BossActionTelegraph {
  readonly phase: BossActionState["phase"];
  readonly secondsRemaining: number;
  readonly chargePath?: BossChargePath;
}

/** Shared by actual charge movement and its warning; stops at the first wall. */
function chargeTravel(
  position: Readonly<LogicalPosition>,
  direction: Readonly<LogicalPosition>,
  radius: number,
  maximumDistance: number,
): {
  readonly distance: number;
  readonly reachesWall: boolean;
  readonly to: LogicalPosition;
} {
  const { x, y } = direction;
  const wallDistance = Math.max(
    0,
    Math.min(
      x > 0
        ? (ARENA.width - radius - position.x) / x
        : x < 0
          ? (radius - position.x) / x
          : Infinity,
      y > 0
        ? (ARENA.height - radius - position.y) / y
        : y < 0
          ? (radius - position.y) / y
          : Infinity,
    ),
  );
  const distance = Math.min(maximumDistance, wallDistance);
  return {
    distance,
    reachesWall: wallDistance <= maximumDistance,
    to: clampPosition(
      { x: position.x + x * distance, y: position.y + y * distance },
      radius,
    ),
  };
}

/** Copy only presentation data; no references to mutable enemy state escape. */
export function getBossActionTelegraph(
  boss: Readonly<ChargerBossState>,
  simulationTimeSeconds: number,
): BossActionTelegraph | undefined {
  if (
    boss.phase !== "active" ||
    boss.currentHealth <= 0 ||
    !Number.isFinite(simulationTimeSeconds) ||
    simulationTimeSeconds < 0 ||
    !isEnemyStateValid(boss)
  )
    return undefined;
  const action = boss.action;
  if (!action)
    return Object.freeze({
      phase: "approach",
      secondsRemaining: CHARGER_BOSS_DEFINITION.approachSeconds,
    });
  const secondsRemaining = Math.max(
    0,
    action.endsAtSeconds - simulationTimeSeconds,
  );
  if (action.phase !== "wind-up" && action.phase !== "charge")
    return Object.freeze({ phase: action.phase, secondsRemaining });
  const duration =
    action.phase === "wind-up"
      ? CHARGER_BOSS_DEFINITION.chargeSeconds
      : secondsRemaining;
  const travel = chargeTravel(
    boss.position,
    action.direction,
    boss.collisionRadius,
    duration * CHARGER_BOSS_DEFINITION.chargeSpeedUnitsPerSecond,
  );
  return Object.freeze({
    phase: action.phase,
    secondsRemaining,
    chargePath: Object.freeze({
      from: Object.freeze({ ...boss.position }),
      to: Object.freeze(travel.to),
      direction: Object.freeze({ ...action.direction }),
      radius: boss.collisionRadius,
    }),
  });
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
): readonly BossMovementSegment[] {
  if (boss.phase !== "active" || boss.currentHealth <= 0) return [];
  if (
    !isEnemyStateValid(boss) ||
    !Number.isFinite(target.x) ||
    !Number.isFinite(target.y) ||
    !Number.isFinite(simulationTimeSeconds) ||
    simulationTimeSeconds < 0 ||
    !Number.isFinite(deltaSeconds) ||
    deltaSeconds <= 0
  )
    return [];
  const end = simulationTimeSeconds + deltaSeconds;
  if (!Number.isFinite(end) || end <= simulationTimeSeconds) return [];
  const segments: BossMovementSegment[] = [];
  const recordMovement = (
    from: LogicalPosition,
    start: number,
    finish: number,
  ): void => {
    if (finish <= start) return;
    segments.push({
      from,
      to: { ...boss.position },
      startFraction: (start - simulationTimeSeconds) / deltaSeconds,
      endFraction: (finish - simulationTimeSeconds) / deltaSeconds,
    });
  };
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
    const from = { ...boss.position };
    if (action.phase === "approach") {
      boss.position = clampPosition(
        calculateNextEnemyPosition(boss, target, step),
        boss.collisionRadius,
      );
    } else if (action.phase === "charge") {
      const speed = CHARGER_BOSS_DEFINITION.chargeSpeedUnitsPerSecond;
      const travel = chargeTravel(
        boss.position,
        action.direction,
        boss.collisionRadius,
        speed * step,
      );
      boss.position = travel.to;
      if (travel.reachesWall) {
        const wallTime = time + travel.distance / speed;
        recordMovement(from, time, wallTime);
        time = wallTime;
        action = nextAction(boss, action, target, time);
        continue;
      }
    }
    recordMovement(from, time, stepEnd);
    time = stepEnd;
    if (time >= action.endsAtSeconds)
      action = nextAction(boss, action, target, time);
  }
  boss.action = action;
  return segments;
}
