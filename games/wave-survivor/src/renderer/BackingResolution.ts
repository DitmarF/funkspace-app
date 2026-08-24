const DEFAULT_DEVICE_PIXEL_RATIO = 1;
const MAX_DEVICE_PIXEL_RATIO = 2;

/** Canvas backing dimensions derived from CSS display dimensions. */
export interface BackingResolution {
  readonly effectiveDpr: number;
  readonly backingWidth: number;
  readonly backingHeight: number;
}

/**
 * Calculate integer Canvas backing dimensions without reading browser state.
 *
 * Invalid DPR values fall back to 1. Invalid display dimensions produce an
 * empty backing buffer while preserving the normalized DPR for later reuse.
 */
export function calculateBackingResolution(
  displayWidth: number,
  displayHeight: number,
  devicePixelRatio: number,
): Readonly<BackingResolution> {
  const effectiveDpr =
    Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
      ? Math.min(devicePixelRatio, MAX_DEVICE_PIXEL_RATIO)
      : DEFAULT_DEVICE_PIXEL_RATIO;

  if (
    !Number.isFinite(displayWidth) ||
    !Number.isFinite(displayHeight) ||
    displayWidth <= 0 ||
    displayHeight <= 0
  ) {
    return Object.freeze({
      effectiveDpr,
      backingWidth: 0,
      backingHeight: 0,
    });
  }

  return Object.freeze({
    effectiveDpr,
    backingWidth: Math.round(displayWidth * effectiveDpr),
    backingHeight: Math.round(displayHeight * effectiveDpr),
  });
}
