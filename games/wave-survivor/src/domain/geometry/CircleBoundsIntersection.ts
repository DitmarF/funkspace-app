import type { Bounds } from "../arena/index.js";
import type { LogicalPosition } from "./LogicalPosition.js";

/**
 * Determine whether a logical circle touches or overlaps axis-aligned bounds.
 *
 * The circle center is compared with its nearest point on the rectangle.
 * Tangency counts as intersection.
 */
export function doesCircleIntersectBounds(
  center: Readonly<LogicalPosition>,
  radius: number,
  bounds: Bounds,
): boolean {
  if (!Number.isFinite(center.x) || !Number.isFinite(center.y)) {
    throw new RangeError("Circle center must contain only finite coordinates.");
  }
  if (!Number.isFinite(radius) || radius < 0) {
    throw new RangeError("Circle radius must be finite and non-negative.");
  }
  if (
    !Number.isFinite(bounds.x) ||
    !Number.isFinite(bounds.y) ||
    !Number.isFinite(bounds.width) ||
    !Number.isFinite(bounds.height)
  ) {
    throw new RangeError("Bounds must contain only finite values.");
  }
  if (bounds.width <= 0 || bounds.height <= 0) {
    throw new RangeError("Bounds must have positive dimensions.");
  }

  const right = bounds.x + bounds.width;
  const bottom = bounds.y + bounds.height;
  if (!Number.isFinite(right) || !Number.isFinite(bottom)) {
    throw new RangeError("Bounds edges must remain finite.");
  }

  const nearestX = Math.max(bounds.x, Math.min(center.x, right));
  const nearestY = Math.max(bounds.y, Math.min(center.y, bottom));
  const distanceX = center.x - nearestX;
  const distanceY = center.y - nearestY;
  const squaredDistance = distanceX * distanceX + distanceY * distanceY;
  const squaredRadius = radius * radius;

  if (!Number.isFinite(squaredDistance) || !Number.isFinite(squaredRadius)) {
    throw new RangeError("Circle intersection geometry must remain finite.");
  }

  return squaredDistance <= squaredRadius;
}
