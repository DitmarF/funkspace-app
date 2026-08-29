import type { Bounds } from "../domain/arena/index.js";
import type { LogicalPosition } from "../domain/geometry/index.js";

const INTERSECTION_EPSILON = 1e-9;

export type EntryWarningEdge = "top" | "right" | "bottom" | "left";

/** Border point and inward normal for one entering-enemy warning. */
export interface EntryWarningGeometry {
  readonly edge: EntryWarningEdge;
  readonly x: number;
  readonly y: number;
  readonly inwardDirectionX: number;
  readonly inwardDirectionY: number;
}

interface IntersectionCandidate extends EntryWarningGeometry {
  readonly lineProgress: number;
}

function isInsideBounds(
  position: Readonly<LogicalPosition>,
  bounds: Bounds,
  right: number,
  bottom: number,
): boolean {
  return (
    position.x >= bounds.x &&
    position.x <= right &&
    position.y >= bounds.y &&
    position.y <= bottom
  );
}

/**
 * Find the first arena-border intersection on the line from enemy to player.
 *
 * Exact corner ties use clockwise precedence: top, right, bottom, then left.
 * Invalid, stationary, or non-intersecting lines return `null`.
 */
export function calculateEntryWarningGeometry(
  enemyPosition: Readonly<LogicalPosition>,
  playerPosition: Readonly<LogicalPosition>,
  bounds: Bounds,
): Readonly<EntryWarningGeometry> | null {
  if (
    !Number.isFinite(enemyPosition.x) ||
    !Number.isFinite(enemyPosition.y) ||
    !Number.isFinite(playerPosition.x) ||
    !Number.isFinite(playerPosition.y) ||
    !Number.isFinite(bounds.x) ||
    !Number.isFinite(bounds.y) ||
    !Number.isFinite(bounds.width) ||
    !Number.isFinite(bounds.height) ||
    bounds.width <= 0 ||
    bounds.height <= 0
  ) {
    return null;
  }

  const right = bounds.x + bounds.width;
  const bottom = bounds.y + bounds.height;
  if (!Number.isFinite(right) || !Number.isFinite(bottom)) return null;
  if (isInsideBounds(enemyPosition, bounds, right, bottom)) return null;

  const directionX = playerPosition.x - enemyPosition.x;
  const directionY = playerPosition.y - enemyPosition.y;
  if (
    !Number.isFinite(directionX) ||
    !Number.isFinite(directionY) ||
    (directionX === 0 && directionY === 0)
  ) {
    return null;
  }

  const candidates: IntersectionCandidate[] = [];
  const addHorizontalCandidate = (
    edge: "top" | "bottom",
    y: number,
    inwardDirectionY: -1 | 1,
  ) => {
    if (directionY === 0) return;
    const lineProgress = (y - enemyPosition.y) / directionY;
    const x = enemyPosition.x + directionX * lineProgress;
    if (
      lineProgress < -INTERSECTION_EPSILON ||
      lineProgress > 1 + INTERSECTION_EPSILON ||
      x < bounds.x - INTERSECTION_EPSILON ||
      x > right + INTERSECTION_EPSILON
    ) {
      return;
    }
    candidates.push({
      edge,
      x: Math.max(bounds.x, Math.min(x, right)),
      y,
      inwardDirectionX: 0,
      inwardDirectionY,
      lineProgress: Math.max(0, Math.min(lineProgress, 1)),
    });
  };
  const addVerticalCandidate = (
    edge: "right" | "left",
    x: number,
    inwardDirectionX: -1 | 1,
  ) => {
    if (directionX === 0) return;
    const lineProgress = (x - enemyPosition.x) / directionX;
    const y = enemyPosition.y + directionY * lineProgress;
    if (
      lineProgress < -INTERSECTION_EPSILON ||
      lineProgress > 1 + INTERSECTION_EPSILON ||
      y < bounds.y - INTERSECTION_EPSILON ||
      y > bottom + INTERSECTION_EPSILON
    ) {
      return;
    }
    candidates.push({
      edge,
      x,
      y: Math.max(bounds.y, Math.min(y, bottom)),
      inwardDirectionX,
      inwardDirectionY: 0,
      lineProgress: Math.max(0, Math.min(lineProgress, 1)),
    });
  };

  addHorizontalCandidate("top", bounds.y, 1);
  addVerticalCandidate("right", right, -1);
  addHorizontalCandidate("bottom", bottom, -1);
  addVerticalCandidate("left", bounds.x, 1);

  let firstIntersection: IntersectionCandidate | null = null;
  for (const candidate of candidates) {
    if (
      !firstIntersection ||
      candidate.lineProgress <
        firstIntersection.lineProgress - INTERSECTION_EPSILON
    ) {
      firstIntersection = candidate;
    }
  }
  if (!firstIntersection) return null;

  return Object.freeze({
    edge: firstIntersection.edge,
    x: firstIntersection.x,
    y: firstIntersection.y,
    inwardDirectionX: firstIntersection.inwardDirectionX,
    inwardDirectionY: firstIntersection.inwardDirectionY,
  });
}
