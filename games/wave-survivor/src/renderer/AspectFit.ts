import { ARENA } from "../domain/arena/index.js";

const MAX_DISPLAY_SCALE = 1.5;

/** Centered display measurements for the fixed logical arena. */
export interface AspectFit {
  readonly scale: number;
  readonly displayWidth: number;
  readonly displayHeight: number;
  readonly horizontalOffset: number;
  readonly verticalOffset: number;
}

const EMPTY_ASPECT_FIT: Readonly<AspectFit> = Object.freeze({
  scale: 0,
  displayWidth: 0,
  displayHeight: 0,
  horizontalOffset: 0,
  verticalOffset: 0,
});

/**
 * Fit the logical arena inside an available display area without stretching.
 *
 * Invalid or empty display areas produce a zeroed result so callers can skip
 * rendering until valid measurements are available.
 */
export function calculateAspectFit(
  availableWidth: number,
  availableHeight: number,
): Readonly<AspectFit> {
  if (
    !Number.isFinite(availableWidth) ||
    !Number.isFinite(availableHeight) ||
    availableWidth <= 0 ||
    availableHeight <= 0
  ) {
    return EMPTY_ASPECT_FIT;
  }

  const scale = Math.min(
    availableWidth / ARENA.width,
    availableHeight / ARENA.height,
    MAX_DISPLAY_SCALE,
  );
  const displayWidth = ARENA.width * scale;
  const displayHeight = ARENA.height * scale;

  return Object.freeze({
    scale,
    displayWidth,
    displayHeight,
    horizontalOffset: (availableWidth - displayWidth) / 2,
    verticalOffset: (availableHeight - displayHeight) / 2,
  });
}
