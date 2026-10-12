import { expect, test } from "@playwright/test";

for (const width of [320, 1280]) {
  for (const theme of ["light", "dark", "muted", "highContrast"]) {
    test(`section variants preserve geometry and keyboard access: ${theme} ${width}px`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 720 });
      const layouts: unknown[] = [];
      for (const variant of ["plain", "cornered"]) {
        await page.goto(
          `/iframe.html?id=layouts-portfoliosection--${variant}&viewMode=story&globals=theme:${theme}`,
        );
        const section = page.getByRole("region", { name: "Section content" });
        await expect(section).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await expect(section.locator(":scope > svg")).toHaveCount(
          variant === "cornered" ? 4 : 0,
        );
        const link = section.getByRole("link", {
          name: "More about FunkSpace",
        });
        await link.focus();
        await expect(link).toBeFocused();
        await link.click({ trial: true });
        layouts.push(
          await section.evaluate((node) => {
            const bounds = node.getBoundingClientRect();
            const css = getComputedStyle(node);
            return {
              width: bounds.width,
              height: bounds.height,
              padding: css.padding,
            };
          }),
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({ path: info.outputPath(`${variant}.png`) });
      }
      expect(layouts[0]).toEqual(layouts[1]);
    });
  }
}
