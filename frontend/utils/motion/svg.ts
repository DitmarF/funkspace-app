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

/**
 * Initialize fill opacity to 0 (hidden)
 * @param element SVG path or polygon element
 */
export function applyFillOpacityInit(
  element: SVGPathElement | SVGPolygonElement,
): void {
  element.style.fillOpacity = "0";
}

/**
 * Set fill opacity value (for animation)
 * @param element SVG path or polygon element
 * @param opacity Opacity value [0, 1]
 */
export function setFillOpacity(
  element: SVGPathElement | SVGPolygonElement,
  opacity: number,
): void {
  const clamped = Math.max(0, Math.min(1, opacity));
  element.style.fillOpacity = `${clamped}`;
}

/**
 * Get current fill opacity value
 * @param element SVG path or polygon element
 * @returns Current fill opacity value [0, 1]
 */
export function getFillOpacity(
  element: SVGPathElement | SVGPolygonElement,
): number {
  const opacity = element.style.fillOpacity;
  if (!opacity || opacity === "none" || opacity === "") {
    return 1; // Default is 1 if not set
  }
  const parsed = parseFloat(opacity);
  return isNaN(parsed) ? 1 : parsed;
}

/**
 * Apply a numeric style property to an SVG element
 * @param element SVG element
 * @param property CSS property name (e.g., 'opacity', 'fillOpacity', 'strokeDashoffset')
 * @param value Numeric value
 */
export function applyNumericStyle(
  element: SVGElement,
  property: string,
  value: number,
): void {
  (element.style as any)[property] = `${value}`;
}

/**
 * Get a numeric style property from an SVG element
 * @param element SVG element
 * @param property CSS property name
 * @returns Numeric value or 0 if not set
 */
export function getNumericStyle(element: SVGElement, property: string): number {
  const value = (element.style as any)[property];
  if (!value || value === "none") {
    return 0;
  }
  return parseFloat(value) || 0;
}

/**
 * Find the distance along a path to the closest point to a given coordinate
 * @param pathElement SVG path or polygon element
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Distance along the path in pixels, or 0 if not found
 */
export function getDistanceAlongPath(
  pathElement: SVGPathElement | SVGPolygonElement,
  x: number,
  y: number,
): number {
  const tagName = pathElement.tagName?.toLowerCase();

  if (tagName === "path") {
    const path = pathElement as SVGPathElement;
    const pathLength = path.getTotalLength();
    let closestDistance = Infinity;
    let closestPoint = 0;

    // Sample points along the path to find the closest one
    for (let i = 0; i <= pathLength; i += 1) {
      const point = path.getPointAtLength(i);
      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2),
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = i;
      }
    }
    return closestPoint;
  }

  if (tagName === "polygon" || tagName === "polyline") {
    // Convert polygon to path for getPointAtLength
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const polygon = pathElement as SVGPolygonElement;
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

    const pathLength = path.getTotalLength();
    let closestDistance = Infinity;
    let closestPoint = 0;

    // Sample points along the path to find the closest one
    for (let i = 0; i <= pathLength; i += 1) {
      const point = path.getPointAtLength(i);
      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2),
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = i;
      }
    }
    return closestPoint;
  }

  return 0;
}
