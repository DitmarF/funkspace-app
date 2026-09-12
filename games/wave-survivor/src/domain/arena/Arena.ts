/** Axis-aligned bounds expressed entirely in logical game units. */
export interface Bounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Named logical regions consumed by future arena-based gameplay systems. */
export interface ArenaRegions {
  readonly playerArea: Bounds;
  readonly spawnBounds: Bounds;
  readonly despawnBounds: Bounds;
}

/** Create immutable logical bounds without depending on a rendering surface. */
export function createBounds(
  x: number,
  y: number,
  width: number,
  height: number,
): Readonly<Bounds> {
  return Object.freeze({ x, y, width, height });
}

/** Fixed dimensions of the Wave Survivor world in logical game units. */
export const ARENA = Object.freeze({
  width: 360,
  height: 640,
} as const);

/** The full logical area visible to the player. */
export const VISIBLE_ARENA_BOUNDS = createBounds(
  0,
  0,
  ARENA.width,
  ARENA.height,
);
