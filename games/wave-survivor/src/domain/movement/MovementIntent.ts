/** Device-independent player movement input with a maximum magnitude of one. */
export interface MovementIntent {
  readonly x: number;
  readonly y: number;
}

/** Shared immutable value for no requested movement. */
export const ZERO_MOVEMENT_INTENT: Readonly<MovementIntent> = Object.freeze({
  x: 0,
  y: 0,
});

/**
 * Create an immutable movement intent without amplifying partial analog input.
 *
 * Non-finite components produce zero movement. Finite vectors whose magnitude
 * exceeds one are constrained while preserving their direction.
 */
export function createMovementIntent(
  x: number,
  y: number,
): Readonly<MovementIntent> {
  if (!Number.isFinite(x) || !Number.isFinite(y) || (x === 0 && y === 0)) {
    return ZERO_MOVEMENT_INTENT;
  }

  if (Math.hypot(x, y) <= 1) {
    return Object.freeze({ x, y });
  }

  const largestComponent = Math.max(Math.abs(x), Math.abs(y));
  const scaledX = x / largestComponent;
  const scaledY = y / largestComponent;
  const scaledMagnitude = Math.hypot(scaledX, scaledY);

  return Object.freeze({
    x: scaledX / scaledMagnitude,
    y: scaledY / scaledMagnitude,
  });
}
