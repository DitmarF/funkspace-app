import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  openSettings,
  openFallbackNavigation,
  selectTheme,
  themes,
} from "./helpers/foundation";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`header navigation with JavaScript ${javaScriptEnabled}`, () => {
    test.use({
      javaScriptEnabled,
      contextOptions: { reducedMotion: "reduce" },
    });
    for (const width of [320, 768, 1280]) {
      test(`layout, native destinations and Contact link at ${width}px`, async ({
        page,
      }, info) => {
        await page.setViewportSize({ width, height: 720 });
        await page.goto("/");
        const nav = page.getByRole("navigation", { name: "Main", exact: true });
        const contact = nav.getByRole("link", {
          name: "Contact",
          exact: true,
        });
        await expect(contact).toHaveAttribute("href", "/contact");
        await expect(nav.getByRole("link")).toHaveCount(2);
        await expect(
          nav.getByRole("button", { name: "Home", exact: true }),
        ).toBeDisabled();
        await expect(
          nav.getByRole("button", { name: "Home", exact: true }),
        ).toHaveAttribute("aria-current", "page");
        await expect(page.locator('#contact, a[href="/#contact"]')).toHaveCount(
          0,
        );
        await expect(nav).toBeInViewport();
        const bounds = await nav.boundingBox();
        const launcher = await page.locator("[data-home-menu]").boundingBox();
        expect(bounds).not.toBeNull();
        expect(launcher).not.toBeNull();
        if (width >= 768) {
          expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(launcher!.x);
          expect(Math.abs(bounds!.y - launcher!.y)).toBeLessThan(2);
          await expect(nav.locator("ul")).toHaveCSS("column-gap", "32px");
        } else {
          expect(bounds!.y + bounds!.height).toBeLessThan(launcher!.y);
          const logo = await page
            .getByRole("link", { name: "FunkSpace", exact: true })
            .boundingBox();
          expect(logo!.x + logo!.width).toBeLessThanOrEqual(bounds!.x);
          expect(
            Math.abs(
              logo!.y + logo!.height / 2 - bounds!.y - bounds!.height / 2,
            ),
          ).toBeLessThan(2);
          const rows = await nav.locator("li").evaluateAll((nodes) =>
            nodes.map((node) => {
              const r = node.getBoundingClientRect();
              return { top: r.top, bottom: r.bottom, right: r.right };
            }),
          );
          expect(rows[1].top).toBeGreaterThanOrEqual(rows[0].bottom);
          expect(rows[2].top).toBeGreaterThanOrEqual(rows[1].bottom);
          expect(rows[0].right).toBeCloseTo(rows[2].right, 0);
        }
        for (const row of await nav.locator("li").all()) {
          const icon = row.locator("svg:visible");
          await expect(icon).toHaveCount(1);
          await expect(icon).toHaveAttribute("width", "24");
          await expect(icon).toHaveCSS("width", "24px");
        }
        await nav
          .getByRole("link", { name: "About", exact: true })
          .press("Enter");
        await expect(page).toHaveURL("/about");
        if (javaScriptEnabled)
          await expect(page.locator("#main-content")).toBeFocused();
        await expect(
          nav.getByRole("button", { name: "About", exact: true }),
        ).toBeDisabled();
        await expect(
          nav.getByRole("button", { name: "About", exact: true }),
        ).toHaveAttribute("aria-current", "page");
        await nav.getByRole("link", { name: "Home", exact: true }).click();
        await expect(page).toHaveURL("/");
        if (javaScriptEnabled)
          await expect(page.locator("#main-content")).toBeFocused();
        await page.goBack();
        await expect(page).toHaveURL("/about");
        if (javaScriptEnabled) await openSettings(page);
        else await openFallbackNavigation(page);
        await expect(
          page
            .getByRole("navigation", { name: "Primary" })
            .getByRole("link", { name: "Contact", exact: true }),
        ).toHaveAttribute("href", "/contact");
        if (javaScriptEnabled) await page.keyboard.press("Escape");
        else
          await page
            .locator("footer details")
            .first()
            .locator(":scope > summary")
            .click();
        for (const size of ["100%", "200%"]) {
          await page.evaluate(
            (size) => (document.documentElement.style.fontSize = size),
            size,
          );
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
          for (const link of await nav.getByRole("link").all())
            await link.click({ trial: true });
          await page.screenshot({
            path: info.outputPath(`header-${size}.png`),
            fullPage: true,
          });
        }
      });
    }
  });
}

test("header and tree share borderless icon styling across themes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/about");
  const header = page.getByRole("navigation", { name: "Main", exact: true });
  for (const theme of themes) {
    await selectTheme(page, theme);
    const style = await header
      .getByRole("link", { name: "Home" })
      .evaluate((node) => {
        const css = getComputedStyle(node);
        return [
          css.color,
          css.fontSize,
          css.fontWeight,
          css.fontFamily,
          css.borderWidth,
          css.backgroundColor,
        ];
      });
    expect(style[4]).toBe("0px");
    await openSettings(page);
    const treeStyle = await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Home" })
      .evaluate((node) => {
        const css = getComputedStyle(node);
        return [
          css.color,
          css.fontSize,
          css.fontWeight,
          css.fontFamily,
          css.borderWidth,
          css.backgroundColor,
        ];
      });
    expect(style).toEqual(treeStyle);
    await page.keyboard.press("Escape");
    const scan = await new AxeBuilder({ page })
      .include('nav[aria-label="Main"]')
      .analyze();
    expect(scan.violations).toEqual([]);
  }
});
