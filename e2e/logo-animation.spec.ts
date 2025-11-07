// E2E test for logo animation with accessibility scan
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Logo Animation", () => {
  test("animation completes and reaches final state with no serious a11y violations", async ({
    page,
  }) => {
    // Navigate to logo animation test page and wait for network to be idle
    await page.goto("/sandbox/logo-animation", { waitUntil: "networkidle" });

    // Wait for SVG to be rendered and have a computed size (indicating it's visible)
    // SVGs without explicit width/height might be considered "hidden" by Playwright
    // So we wait for the SVG to have a computed width > 0
    await page.waitForFunction(
      () => {
        const svg = document.querySelector("svg#logo") as SVGSVGElement | null;
        if (!svg) return false;
        const rect = svg.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      },
      { timeout: 10000 },
    );

    // Also wait for at least one path element to exist, indicating the SVG is fully rendered
    await page.waitForSelector("svg#logo #logo-path-1", {
      state: "attached",
      timeout: 10000,
    });

    // Wait for animation to complete
    // For 10 paths: stroke delay (1080ms) + stroke (800ms) = 1880ms total
    // Wait for paths to reach final state by checking for opacity ≈ 1
    // Use a more reliable approach: wait for the last path to complete
    await page.waitForFunction(
      () => {
        const path10 = document.querySelector("#logo-path-10");
        if (!path10) return false;
        const computed = window.getComputedStyle(path10);
        const opacity = parseFloat(computed.opacity) || 0;
        const offset = parseFloat(computed.strokeDashoffset) || Infinity;
        return opacity > 0.9 && offset < 1;
      },
      { timeout: 2500 },
    );

    // Assert final state: strokeDashoffset should be ≈ 0 (fully drawn)
    // Check first, middle, and last paths
    const path1 = page.locator("#logo-path-1");
    const path5 = page.locator("#logo-path-5");
    const path10 = page.locator("#logo-path-10");

    // Check strokeDashoffset is approximately 0 (fully drawn)
    const strokeDashoffset1 = await path1.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const offset = computed.strokeDashoffset;
      return parseFloat(offset) || 0;
    });

    const strokeDashoffset5 = await path5.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const offset = computed.strokeDashoffset;
      return parseFloat(offset) || 0;
    });

    const strokeDashoffset10 = await path10.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const offset = computed.strokeDashoffset;
      return parseFloat(offset) || 0;
    });

    // Stroke should be fully drawn (offset ≈ 0, allow small tolerance)
    expect(strokeDashoffset1).toBeLessThan(1);
    expect(strokeDashoffset5).toBeLessThan(1);
    expect(strokeDashoffset10).toBeLessThan(1);

    // Check opacity is approximately 1 (fully visible)
    const opacity1 = await path1.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return parseFloat(computed.opacity) || 0;
    });

    const opacity5 = await path5.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return parseFloat(computed.opacity) || 0;
    });

    const opacity10 = await path10.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return parseFloat(computed.opacity) || 0;
    });

    // Opacity should be approximately 1 (fully visible)
    expect(opacity1).toBeGreaterThan(0.95);
    expect(opacity5).toBeGreaterThan(0.95);
    expect(opacity10).toBeGreaterThan(0.95);

    // Run axe accessibility scan
    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
      .analyze();

    // Filter out minor violations (similar to home.a11y.spec.ts pattern)
    const seriousViolations = axeResults.violations.filter((violation) => {
      // Filter out minor color-contrast issues that are close to AA
      if (violation.id === "color-contrast") {
        const hasSeriousContrast = violation.nodes.some((node) => {
          const anyWithContrast = node.any.find(
            (check) => check.id === "color-contrast",
          );
          const ratio = (anyWithContrast as any)?.data?.contrastRatio as
            | number
            | undefined;
          // Keep only nodes with contrast ratio < 4.25 (serious violations)
          return typeof ratio === "number" && ratio < 4.25;
        });
        return hasSeriousContrast;
      }
      // Keep all other violations
      return true;
    });

    // Fail if there are any serious violations
    expect(
      seriousViolations,
      `Found ${seriousViolations.length} serious accessibility violations:\n${JSON.stringify(seriousViolations, null, 2)}`,
    ).toEqual([]);
  });

  test("reduced motion shows static final state", async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/sandbox/logo-animation");

    // Wait for page to load
    await page.waitForTimeout(500);

    // With reduced motion, animation should be skipped
    // Check that paths are immediately in final state
    const path1 = page.locator("#logo-path-1");
    const strokeDashoffset1 = await path1.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return parseFloat(computed.strokeDashoffset) || 0;
    });

    const opacity1 = await path1.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return parseFloat(computed.opacity) || 0;
    });

    // Should be in final state immediately (no animation)
    expect(strokeDashoffset1).toBeLessThan(1);
    expect(opacity1).toBeGreaterThan(0.95);
  });
});
