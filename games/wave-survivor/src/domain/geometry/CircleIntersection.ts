import type { LogicalPosition } from "./LogicalPosition.js";

function assertValidCircle(
  center: Readonly<LogicalPosition>,
  radius: number,
  name: string,
): void {
  if (!Number.isFinite(center.x) || !Number.isFinite(center.y)) {
    throw new RangeError(
      `${name} center must contain only finite coordinates.`,
    );
  }
  if (!Number.isFinite(radius) || radius < 0) {
    throw new RangeError(`${name} radius must be finite and non-negative.`);
  }
}

/** Determine whether two logical circles touch or overlap. */
export function doCirclesIntersect(
  firstCenter: Readonly<LogicalPosition>,
  firstRadius: number,
  secondCenter: Readonly<LogicalPosition>,
  secondRadius: number,
): boolean {
  assertValidCircle(firstCenter, firstRadius, "First circle");
  assertValidCircle(secondCenter, secondRadius, "Second circle");

  const distanceX = firstCenter.x - secondCenter.x;
  const distanceY = firstCenter.y - secondCenter.y;
  const combinedRadius = firstRadius + secondRadius;
  const squaredDistance = distanceX * distanceX + distanceY * distanceY;
  const squaredCombinedRadius = combinedRadius * combinedRadius;

  if (
    !Number.isFinite(squaredDistance) ||
    !Number.isFinite(squaredCombinedRadius)
  ) {
    throw new RangeError("Circle intersection geometry must remain finite.");
  }

  return squaredDistance <= squaredCombinedRadius;
}
