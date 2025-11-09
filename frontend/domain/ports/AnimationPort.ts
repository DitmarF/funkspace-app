/**
 * Animation port interface
 * Abstraction for animation-related browser APIs
 */

export interface AnimationPort {
  /**
   * Get a CSS custom property value as a number (in milliseconds)
   */
  getTokenDurationMs(propertyName: string, fallback: number): number;

  /**
   * Get path length from SVG element
   */
  getPathLength(element: SVGElement): number;

  /**
   * Get distance along path
   */
  getDistanceAlongPath(path: SVGElement, x: number, y: number): number;
}
