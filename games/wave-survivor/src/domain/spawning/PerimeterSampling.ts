import type { RandomSource } from "../RandomSource.js";
import type { Bounds } from "../arena/index.js";
import type { LogicalPosition } from "../geometry/index.js";

/** Rectangle edges visited clockwise from the top-left corner. */
export type PerimeterEdge = "top" | "right" | "bottom" | "left";

/** A logical point on one explicitly owned rectangle edge. */
export interface PerimeterSample {
  readonly position: LogicalPosition;
  readonly edge: PerimeterEdge;
}

interface PerimeterGeometry {
  readonly right: number;
  readonly bottom: number;
  readonly totalLength: number;
}

function getPerimeterGeometry(bounds: Bounds): PerimeterGeometry {
  if (
    !Number.isFinite(bounds.x) ||
    !Number.isFinite(bounds.y) ||
    !Number.isFinite(bounds.width) ||
    !Number.isFinite(bounds.height)
  ) {
    throw new RangeError("Perimeter bounds must contain only finite values.");
  }

  if (bounds.width <= 0 || bounds.height <= 0) {
    throw new RangeError("Perimeter bounds must have positive dimensions.");
  }

  const right = bounds.x + bounds.width;
  const bottom = bounds.y + bounds.height;
  const totalLength = 2 * (bounds.width + bounds.height);

  if (
    !Number.isFinite(right) ||
    !Number.isFinite(bottom) ||
    !Number.isFinite(totalLength)
  ) {
    throw new RangeError("Perimeter geometry must remain finite.");
  }

  return { right, bottom, totalLength };
}

/**
 * Map a half-open perimeter distance clockwise to a rectangle edge and point.
 *
 * Distance zero is the top-left corner and belongs to `top`. Each following
 * corner belongs to the edge that starts there: top-right to `right`,
 * bottom-right to `bottom`, and bottom-left to `left`.
 */
export function mapPerimeterDistance(
  bounds: Bounds,
  distance: number,
): PerimeterSample {
  const { right, bottom, totalLength } = getPerimeterGeometry(bounds);

  if (!Number.isFinite(distance) || distance < 0 || distance >= totalLength) {
    throw new RangeError(
      "Perimeter distance must be finite and inside the perimeter range.",
    );
  }

  if (distance < bounds.width) {
    return {
      edge: "top",
      position: { x: bounds.x + distance, y: bounds.y },
    };
  }

  const distanceAfterTop = distance - bounds.width;
  if (distanceAfterTop < bounds.height) {
    return {
      edge: "right",
      position: { x: right, y: bounds.y + distanceAfterTop },
    };
  }

  const distanceAfterRight = distanceAfterTop - bounds.height;
  if (distanceAfterRight < bounds.width) {
    return {
      edge: "bottom",
      position: { x: right - distanceAfterRight, y: bottom },
    };
  }

  const distanceAfterBottom = distanceAfterRight - bounds.width;
  return {
    edge: "left",
    position: { x: bounds.x, y: bottom - distanceAfterBottom },
  };
}

/** Sample one perimeter point with probability proportional to edge length. */
export function samplePerimeterPoint(
  bounds: Bounds,
  randomSource: RandomSource,
): PerimeterSample {
  const { totalLength } = getPerimeterGeometry(bounds);
  const distance = randomSource.nextFloat(0, totalLength);

  return mapPerimeterDistance(bounds, distance);
}
