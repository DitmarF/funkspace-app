/**
 * Animation Adapter
 * Infrastructure implementation of AnimationPort
 */

import type { AnimationPort } from "@/domain/ports/AnimationPort";
import { getPathLength, getDistanceAlongPath } from "./svg";

export class AnimationAdapter implements AnimationPort {
  getTokenDurationMs(propertyName: string, fallback: number): number {
    if (typeof window === "undefined") return fallback;

    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(propertyName)
      .trim();

    if (!value) return fallback;

    // Parse "800ms" or "800" to milliseconds
    const match = value.match(/^(\d+(?:\.\d+)?)/);
    if (match) {
      const num = parseFloat(match[1]);
      // If value ends with "s", convert to ms
      if (value.endsWith("s") && !value.endsWith("ms")) {
        return num * 1000;
      }
      return num;
    }

    return fallback;
  }

  getPathLength(element: SVGElement): number {
    return getPathLength(element as SVGPathElement | SVGPolygonElement);
  }

  getDistanceAlongPath(path: SVGElement, x: number, y: number): number {
    return getDistanceAlongPath(
      path as SVGPathElement | SVGPolygonElement,
      x,
      y,
    );
  }
}
