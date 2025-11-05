import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getPathLength,
  applyStrokeDrawInit,
  setStrokeDashoffset,
  getStrokeDashoffset,
} from "./svg";

describe("SVG stroke draw utilities", () => {
  let svg: SVGSVGElement;
  let path: SVGPathElement;

  beforeEach(() => {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    document.body.appendChild(svg);

    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 10,10 L 50,10 L 50,50 L 10,50 Z");
    // Mock getTotalLength for jsdom
    (path as any).getTotalLength = () => 120;
    svg.appendChild(path);
  });

  describe("getPathLength", () => {
    it("should get length of SVG path", () => {
      const length = getPathLength(path);
      expect(length).toBeGreaterThan(0);
    });

    it("should handle polygon elements", () => {
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      polygon.setAttribute("points", "10,10 50,10 50,50 10,50");
      // Mock SVGPointList for jsdom
      const mockPoints = {
        length: 4,
        getItem: (i: number) => {
          const coords = [
            { x: 10, y: 10 },
            { x: 50, y: 10 },
            { x: 50, y: 50 },
            { x: 10, y: 50 },
          ];
          return coords[i];
        },
      };
      (polygon as any).points = mockPoints;
      svg.appendChild(polygon);

      // Create a mock path element for getTotalLength
      const mockPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      (mockPath as any).getTotalLength = () => 140;
      // Mock document.createElementNS to return our mock path
      const originalCreateElementNS = document.createElementNS;
      document.createElementNS = vi.fn().mockImplementation((ns, tag) => {
        if (tag === "path") {
          return mockPath;
        }
        return originalCreateElementNS.call(document, ns, tag);
      });

      const length = getPathLength(polygon);
      expect(length).toBeGreaterThan(0);

      // Restore
      document.createElementNS = originalCreateElementNS;
    });

    it("should return 0 for empty polygon", () => {
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      // Mock empty points
      (polygon as any).points = { length: 0 };
      svg.appendChild(polygon);

      const length = getPathLength(polygon);
      expect(length).toBe(0);
    });
  });

  describe("applyStrokeDrawInit", () => {
    it("should set stroke-dasharray to total length", () => {
      const length = applyStrokeDrawInit(path);
      const dasharray = path.style.strokeDasharray;

      expect(length).toBeGreaterThan(0);
      expect(parseFloat(dasharray)).toBeCloseTo(length, 2);
    });

    it("should set stroke-dashoffset to total length (hides path)", () => {
      const length = applyStrokeDrawInit(path);
      const offset = path.style.strokeDashoffset;

      expect(parseFloat(offset)).toBeCloseTo(length, 2);
    });

    it("should return the total length", () => {
      const length = applyStrokeDrawInit(path);
      expect(length).toBeGreaterThan(0);
    });
  });

  describe("setStrokeDashoffset", () => {
    it("should set stroke-dashoffset value", () => {
      const testOffset = 50;
      setStrokeDashoffset(path, testOffset);
      expect(parseFloat(path.style.strokeDashoffset)).toBe(testOffset);
    });

    it("should set to 0 to show full path", () => {
      applyStrokeDrawInit(path);
      setStrokeDashoffset(path, 0);
      expect(parseFloat(path.style.strokeDashoffset)).toBe(0);
    });

    it("should work with polygon elements", () => {
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      polygon.setAttribute("points", "10,10 50,10 50,50 10,50");
      svg.appendChild(polygon);

      setStrokeDashoffset(polygon, 100);
      expect(parseFloat(polygon.style.strokeDashoffset)).toBe(100);
    });
  });

  describe("getStrokeDashoffset", () => {
    it("should get current stroke-dashoffset value", () => {
      setStrokeDashoffset(path, 75);
      expect(getStrokeDashoffset(path)).toBe(75);
    });

    it("should return 0 if offset is not set", () => {
      // Clear any previous offset
      path.style.strokeDashoffset = "";
      expect(getStrokeDashoffset(path)).toBe(0);
    });

    it("should handle 'none' value", () => {
      path.style.strokeDashoffset = "none";
      expect(getStrokeDashoffset(path)).toBe(0);
    });
  });

  describe("T-06: Stroke draw animation flow", () => {
    it("should initialize path as hidden (offset = total length)", () => {
      const length = applyStrokeDrawInit(path);
      const offset = getStrokeDashoffset(path);

      expect(offset).toBeCloseTo(length, 2);
    });

    it("should animate from hidden to visible (offset: total → 0)", () => {
      const length = applyStrokeDrawInit(path);
      expect(getStrokeDashoffset(path)).toBeCloseTo(length, 2);

      setStrokeDashoffset(path, 0);
      expect(getStrokeDashoffset(path)).toBe(0);
    });

    it("should work with multiple paths", () => {
      const path2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path2.setAttribute("d", "M 60,60 L 90,60 L 90,90 L 60,90 Z");
      // Mock getTotalLength for second path
      (path2 as any).getTotalLength = () => 100;
      svg.appendChild(path2);

      const length1 = applyStrokeDrawInit(path);
      const length2 = applyStrokeDrawInit(path2);

      expect(length1).toBeGreaterThan(0);
      expect(length2).toBeGreaterThan(0);
      expect(getStrokeDashoffset(path)).toBeCloseTo(length1, 2);
      expect(getStrokeDashoffset(path2)).toBeCloseTo(length2, 2);
    });
  });
});
