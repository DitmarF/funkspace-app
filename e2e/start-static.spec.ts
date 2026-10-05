import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const viewport of [
  { width: 320, height: 480 },
  { width: 1440, height: 900 },
]) {
  for (const javaScriptEnabled of [true, false]) {
    test.describe(`Start ${viewport.width}px JS=${javaScriptEnabled}`, () => {
      test.use({
        viewport,
        javaScriptEnabled,
        contextOptions: { reducedMotion: "reduce" },
      });
      test("complete static artwork, stable IDs, reserved geometry and native navigation", async ({
        page,
      }, testInfo) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        const response = await page.goto("/");
        expect(response?.status()).toBe(200);
        const html = await response!.text();
        expect(html).toContain("data-aperture-fallback");
        expect(html).not.toContain("Pause animation");
        expect(html).not.toContain("data-particle-static");
        const serverId = await page.evaluate(
          (html) =>
            new DOMParser()
              .parseFromString(html, "text/html")
              .querySelector("#start mask")!.id,
          html,
        );
        await expect(
          page.locator("#start [data-scene-aperture]"),
        ).toBeVisible();
        await expect(page.locator("#start mask")).toHaveAttribute(
          "id",
          serverId,
        );
        await expect(page.locator("#start canvas")).toHaveCount(0);
        await expect(page.locator("#start line, #start circle")).toHaveCount(0);
        await expect(
          page.locator("#start [data-aperture-fallback] path"),
        ).toBeVisible();
        await expect(page.locator("#start")).not.toContainText(
          "FunkSpace is a design-system-first web experience built as a PNPM workspace.",
        );
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          "Aperture - 1",
        );
        await expect(
          page.locator("header [data-funkspace-logo]"),
        ).toBeVisible();
        if (!javaScriptEnabled) {
          await expect(page.locator("#start button")).toHaveCount(0);
          await expect(
            page.locator("[data-aperture-fallback] path"),
          ).toBeVisible();
        } else
          await expect(
            page.getByRole("button", { name: "Pause animation" }),
          ).toBeDisabled();
        const layout = await page.locator("#start").evaluate((section) => {
          const frame = section
            .querySelector("[data-start-scene]")!
            .getBoundingClientRect();
          return {
            bottom: frame.bottom,
            actions: section
              .querySelector("[data-scene-actions]")!
              .getBoundingClientRect().top,
            border: getComputedStyle(
              section.querySelector("[data-start-scene]")!,
            ).borderTopWidth,
            height: frame.height,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        expect(layout.bottom).toBeLessThanOrEqual(layout.actions);
        expect(layout.height).toBeCloseTo(
          Math.max(200, Math.min(400, viewport.width * 0.4)),
          2,
        );
        expect(layout.border).toBe("0px");
        expect(layout.overflow).toBe(false);
        const ids = await page
          .locator("[id]")
          .evaluateAll((nodes) => nodes.map((node) => node.id));
        expect(new Set(ids).size).toBe(ids.length);
        await page.keyboard.press("Tab");
        await expect(
          page.getByRole("link", { name: "Skip to main content" }),
        ).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("main")).toBeFocused();
        // Axe injects JavaScript; no-JS semantics/navigation are asserted above.
        if (javaScriptEnabled) {
          const result = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
            .analyze();
          expect(result.violations).toEqual([]);
        }
        await page.screenshot({
          path: testInfo.outputPath("start-static.png"),
          fullPage: true,
        });
        expect(errors).toEqual([]);
      });
    });
  }
}
