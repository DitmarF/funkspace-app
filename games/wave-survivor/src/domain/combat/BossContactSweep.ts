import type { BossMovementSegment } from "../enemies/ChargerBoss.js";
import type { LogicalPosition } from "../geometry/index.js";

/** Swept circles in relative space. The player traverses its bounded fixed-step
 * displacement linearly; boss segments preserve action deadlines and wall stops.
 * This reports geometry only: shared contact handling still owns eligibility,
 * immunity, damage, and lowest-ID selection after projectile defeats.
 */
export function doesBossSweepContactPlayer(
  segments: readonly BossMovementSegment[],
  playerFrom: Readonly<LogicalPosition>,
  playerTo: Readonly<LogicalPosition>,
  combinedRadius: number,
): boolean {
  return segments.some((segment) => {
    const playerDx = playerTo.x - playerFrom.x;
    const playerDy = playerTo.y - playerFrom.y;
    const x = segment.from.x - playerFrom.x - playerDx * segment.startFraction;
    const y = segment.from.y - playerFrom.y - playerDy * segment.startFraction;
    const dx =
      segment.to.x -
      segment.from.x -
      playerDx * (segment.endFraction - segment.startFraction);
    const dy =
      segment.to.y -
      segment.from.y -
      playerDy * (segment.endFraction - segment.startFraction);
    const lengthSquared = dx * dx + dy * dy;
    const fraction =
      lengthSquared === 0
        ? 0
        : Math.max(0, Math.min(1, -(x * dx + y * dy) / lengthSquared));
    return Math.hypot(x + dx * fraction, y + dy * fraction) <= combinedRadius;
  });
}
