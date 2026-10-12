import { expect, test } from "@playwright/test";
import { selectTheme, themes } from "./helpers/foundation";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`section variants, JavaScript ${javaScriptEnabled ? "on" : "off"}`, () => {
    test.use({ javaScriptEnabled });
    for (const viewport of [
      { width: 320, height: 568 },
      { width: 1280, height: 720 },
    ]) {
      test(`cornered WEB, plain About and no Contact at ${viewport.width}px`, async ({
        page,
      }, info) => {
        await page.setViewportSize(viewport);
        await page.goto("/");
        await expect(page.locator("main > div > section")).toHaveCount(2);
        const corners = page.locator("#start > svg");
        await expect(corners).toHaveCount(4);
        await expect(page.locator("#about > svg")).toHaveCount(0);
        await expect(page.locator('#contact, a[href="/#contact"]')).toHaveCount(
          0,
        );
        for (const theme of javaScriptEnabled
          ? themes
          : (["default"] as const)) {
          if (javaScriptEnabled) await selectTheme(page, theme);
          for (const corner of await corners.all()) {
            await expect(corner).toHaveAttribute("aria-hidden", "true");
            await expect(corner).toHaveAttribute("focusable", "false");
            await expect(corner).toHaveCSS("pointer-events", "none");
            expect(
              await corner.evaluate((node) => getComputedStyle(node).color),
            ).toBe(
              await page
                .locator("#start")
                .evaluate((node) => getComputedStyle(node).color),
            );
          }
          for (const textSize of ["100%", "200%"]) {
            await page.evaluate((size) => {
              document.documentElement.style.fontSize = size;
            }, textSize);
            expect(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
              ),
            ).toBe(true);
            const more = page.locator('#about a[href="/about"]');
            await more.focus();
            await expect(more).toBeFocused();
            await more.click({ trial: true });
            await page.screenshot({
              path: info.outputPath(`${theme}-${textSize}.png`),
              fullPage: true,
            });
          }
        }
      });
    }
  });
}
