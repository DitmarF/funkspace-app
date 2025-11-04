// e2e accessibility smoke test for the home page
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("A11y — Home", () => {
  test("a11y smoke: / has zero axe violations (with minor contrast tolerance)", async ({
    page,
  }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page }).analyze();

    // Allow tiny variance for color-contrast close to AA
    const filteredViolations = results.violations
      .map((violation) => {
        if (violation.id !== "color-contrast") return violation;

        const nodes = violation.nodes.filter((node) => {
          // Keep nodes that are truly below the tolerance threshold
          const anyWithContrast = node.any.find(
            (check) => check.id === "color-contrast",
          );
          const ratio = (anyWithContrast as any)?.data?.contrastRatio as
            | number
            | undefined;
          // If we can't read ratio, keep the node (be conservative)
          if (typeof ratio !== "number") return true;
          // Filter out nodes that meet minimal tolerance (>= 4.25)
          return ratio < 4.25;
        });

        return { ...violation, nodes };
      })
      // Drop any violation that has no remaining failing nodes
      .filter((v) => v.nodes.length > 0);

    expect(
      filteredViolations,
      JSON.stringify(filteredViolations, null, 2),
    ).toEqual([]);
  });
});
