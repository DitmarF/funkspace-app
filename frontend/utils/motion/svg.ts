/**
 * SVG animation utilities
 */

/**
 * Get the total length of an SVG path or polygon element
 * @param element SVG path or polygon element
 * @returns Total length in pixels, or 0 if not available
 */
export function getPathLength(
  element: SVGPathElement | SVGPolygonElement,
): number {
  // Check tagName instead of instanceof for better compatibility
  const tagName = element.tagName?.toLowerCase();

  if (tagName === "path") {
    return (element as SVGPathElement).getTotalLength();
  }
  if (tagName === "polygon" || tagName === "polyline") {
    // For polygons/polylines, convert to path to get length
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const polygon = element as SVGPolygonElement;
    const points = polygon.points;
    if (!points || points.length === 0) return 0;

    const firstPoint = points.getItem ? points.getItem(0) : points[0];
    if (!firstPoint) return 0;

    let d = `M ${firstPoint.x},${firstPoint.y}`;
    for (let i = 1; i < points.length; i++) {
      const point = points.getItem ? points.getItem(i) : points[i];
      if (point) {
        d += ` L ${point.x},${point.y}`;
      }
    }
    if (tagName === "polygon") {
      d += " Z";
    }
    path.setAttribute("d", d);
    return path.getTotalLength();
  }
  return 0;
}

/**
 * Initialize stroke draw animation for an SVG path/polygon element
 * Sets stroke-dasharray and stroke-dashoffset to total length (hides the stroke)
 * @param element SVG path or polygon element
 * @returns The total length that was set
 */
export function applyStrokeDrawInit(
  element: SVGPathElement | SVGPolygonElement,
): number {
  const totalLength = getPathLength(element);

  if (totalLength > 0) {
    // Set dasharray to total length (one dash covering the entire path)
    element.style.strokeDasharray = `${totalLength}`;
    // Set offset to total length (hides the stroke completely)
    element.style.strokeDashoffset = `${totalLength}`;
  }

  return totalLength;
}

/**
 * Apply stroke dashoffset value (for animation)
 * @param element SVG path or polygon element
 * @param offset Stroke dashoffset value (0 = fully visible, totalLength = hidden)
 */
export function setStrokeDashoffset(
  element: SVGPathElement | SVGPolygonElement,
  offset: number,
): void {
  element.style.strokeDashoffset = `${offset}`;
}

/**
 * Get current stroke dashoffset value
 * @param element SVG path or polygon element
 * @returns Current stroke dashoffset value
 */
export function getStrokeDashoffset(
  element: SVGPathElement | SVGPolygonElement,
): number {
  const offset = element.style.strokeDashoffset;
  if (!offset || offset === "none") {
    return 0;
  }
  return parseFloat(offset) || 0;
}
