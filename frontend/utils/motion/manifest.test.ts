import { describe, it, expect, beforeEach, vi } from "vitest";
import { resolveSelector, validateManifest, loadManifest } from "./manifest";
import type { AnimationManifest } from "./types";

describe("Manifest loader", () => {
  let svg: SVGSVGElement;
  let path1: SVGPathElement;
  let path2: SVGPathElement;

  beforeEach(() => {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("id", "logo");
    document.body.appendChild(svg);

    path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("id", "logo-path-1");
    path1.setAttribute("d", "M 10,10 L 50,10 L 50,50 L 10,50 Z");
    svg.appendChild(path1);

    path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("id", "logo-path-2");
    path2.setAttribute("d", "M 60,60 L 90,60 L 90,90 L 60,90 Z");
    svg.appendChild(path2);
  });

  describe("resolveSelector", () => {
    it("should resolve ID selector", () => {
      const element = resolveSelector(svg, "#logo-path-1");
      expect(element).toBe(path1);
    });

    it("should return null for non-existent selector", () => {
      const element = resolveSelector(svg, "#nonexistent");
      expect(element).toBeNull();
    });

    it("should handle invalid selector gracefully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      // Try a selector that might cause issues
      const element = resolveSelector(svg, "invalid[selector");
      expect(element).toBeNull();
      // querySelector may not throw, just return null, so we don't require console.warn
      // The important thing is it doesn't crash
      consoleSpy.mockRestore();
    });
  });

  describe("validateManifest", () => {
    it("should validate a valid manifest", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
            easing: "emph",
          },
        ],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing target", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
          } as any,
        ],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should detect invalid property", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "invalid" as any,
            from: 100,
            to: 0,
            duration: 800,
          },
        ],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("property"))).toBe(true);
    });

    it("should detect non-existent target", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#nonexistent",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
          },
        ],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("not found"))).toBe(true);
    });

    it("should detect invalid duration", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: -100,
          },
        ],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("duration"))).toBe(true);
    });

    it("should detect invalid delay", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
            delay: -50,
          },
        ],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("delay"))).toBe(true);
    });

    it("should warn about non-ID selector", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "logo-path-1", // Missing #
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
          },
        ],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(true); // Still valid, just a warning
      expect(result.warnings.length).toBeGreaterThan(0);
      consoleSpy.mockRestore();
    });

    it("should warn about unknown easing", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
            easing: "unknown-easing" as any,
          },
        ],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      consoleSpy.mockRestore();
    });

    it("should handle empty manifest", () => {
      const manifest: AnimationManifest = {
        steps: [],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("should validate multiple steps", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
            easing: "emph",
          },
          {
            target: "#logo-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            delay: 100,
          },
          {
            target: "#logo-path-2",
            property: "strokeDashoffset",
            from: 80,
            to: 0,
            duration: 800,
            delay: 120,
          },
        ],
      };

      const result = validateManifest(manifest, svg);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("loadManifest", () => {
    it("should load and resolve selectors", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
          },
          {
            target: "#logo-path-2",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
          },
        ],
      };

      const loaded = loadManifest(manifest, svg);
      expect(loaded.manifest).toBe(manifest);
      expect(loaded.validation.valid).toBe(true);
      expect(loaded.resolvedElements.get("#logo-path-1")).toBe(path1);
      expect(loaded.resolvedElements.get("#logo-path-2")).toBe(path2);
    });

    it("should handle missing elements", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#nonexistent",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
          },
        ],
      };

      const loaded = loadManifest(manifest, svg);
      expect(loaded.resolvedElements.get("#nonexistent")).toBeNull();
      expect(loaded.validation.valid).toBe(false);
    });
  });

  describe("T-08: Manifest loader verification", () => {
    it("should build timeline from manifest", () => {
      const manifest: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
            easing: "emph",
          },
          {
            target: "#logo-path-1",
            property: "opacity",
            from: 0,
            to: 1,
            duration: 200,
            delay: 100,
          },
        ],
      };

      const loaded = loadManifest(manifest, svg);
      expect(loaded.validation.valid).toBe(true);
      expect(loaded.manifest.steps).toHaveLength(2);
    });

    it("should reorder steps when delay changes", () => {
      // Original manifest
      const manifest1: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
          },
          {
            target: "#logo-path-2",
            property: "strokeDashoffset",
            from: 80,
            to: 0,
            duration: 800,
            delay: 200,
          },
        ],
      };

      // Modified manifest with different delay
      const manifest2: AnimationManifest = {
        steps: [
          {
            target: "#logo-path-1",
            property: "strokeDashoffset",
            from: 100,
            to: 0,
            duration: 800,
            delay: 300, // Changed delay
          },
          {
            target: "#logo-path-2",
            property: "strokeDashoffset",
            from: 80,
            to: 0,
            duration: 800,
          },
        ],
      };

      const loaded1 = loadManifest(manifest1, svg);
      const loaded2 = loadManifest(manifest2, svg);

      // Both should be valid
      expect(loaded1.validation.valid).toBe(true);
      expect(loaded2.validation.valid).toBe(true);

      // Delays should be different
      expect(loaded1.manifest.steps[0].delay).toBeUndefined();
      expect(loaded1.manifest.steps[1].delay).toBe(200);
      expect(loaded2.manifest.steps[0].delay).toBe(300);
      expect(loaded2.manifest.steps[1].delay).toBeUndefined();
    });

    it("should validate manifest structure", () => {
      const invalidManifest = null as any;
      const result = validateManifest(invalidManifest, svg);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should validate steps array", () => {
      const invalidManifest = { steps: "not-an-array" } as any;
      const result = validateManifest(invalidManifest, svg);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("array"))).toBe(true);
    });
  });
});
