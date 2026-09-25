import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openSettings, openAppearance } from "./helpers/foundation";

async function expectArtworkAlignment(page: Page) {
  const visibleRight = await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .locator("svg")
    .first()
    .locator("path")
    .evaluate((element) => {
      const path = element as SVGPathElement;
      const box = path.getBBox();
      const matrix = path.getScreenCTM()!;
      const stroke = parseFloat(getComputedStyle(path).strokeWidth);
      return new DOMPoint(
        box.x + box.width + stroke / 2,
        box.y,
      ).matrixTransform(matrix).x;
    });
  const sectionRight = await page
    .locator("#start")
    .evaluate((section) => section.getBoundingClientRect().right);
  expect(Math.abs(visibleRight - sectionRight)).toBeLessThan(0.5);
}

for (const viewport of [
  { width: 320, height: 480 },
  { width: 425, height: 930 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
  { width: 1440, height: 900 },
]) {
  test.describe(`portfolio settings at ${viewport.width}×${viewport.height}`, () => {
    test.use({ viewport });
    test("responsive trigger, modal keyboard lifecycle, theme and native section navigation", async ({
      page,
    }, testInfo) => {
      await page.goto("/");
      const trigger = page.getByRole("button", {
        name: "Menu: navigation and settings",
        exact: true,
      });
      const triggerBox = await trigger.boundingBox();
      expect(triggerBox!.x).toBeGreaterThan(viewport.width / 2);
      if (viewport.width >= 768) {
        const logoBox = await page
          .locator("header [data-funkspace-logo]")
          .boundingBox();
        expect(triggerBox!.y).toBeLessThan(viewport.height / 2);
        expect(Math.abs(triggerBox!.y - logoBox!.y)).toBeLessThan(1);
        expect(logoBox!.x + logoBox!.width).toBeLessThan(triggerBox!.x);
      } else {
        expect(triggerBox!.y).toBeGreaterThan(viewport.height / 2);
      }
      expect(triggerBox!.x + triggerBox!.width).toBeLessThan(viewport.width);
      expect(triggerBox!.y + triggerBox!.height).toBeLessThan(viewport.height);
      await expectArtworkAlignment(page);
      await expect(page.locator("header nav")).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Dark", exact: true }),
      ).toHaveCount(0);
      await page.screenshot({
        path: testInfo.outputPath("start-viewport.png"),
      });

      await openSettings(page);
      const dialog = page.getByRole("dialog", {
        name: "Navigation and settings",
      });
      await expect(
        dialog.getByRole("button", { name: "Close", exact: true }),
      ).toBeFocused();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(await dialog.evaluate((node) => node.matches(":modal"))).toBe(
        true,
      );
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press("Tab");
        // Native dialogs may traverse browser chrome at the tab boundary.
        // Match the accepted Dialog contract: no outside page control is reached.
        if (
          await page.evaluate(() => document.activeElement === document.body)
        ) {
          await page.keyboard.press("Tab");
        }
        expect(
          await dialog.evaluate((node) =>
            node.contains(document.activeElement),
          ),
        ).toBe(true);
      }
      await openAppearance(page);
      await dialog.getByRole("button", { name: "Dark", exact: true }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      const axe = await new AxeBuilder({ page }).analyze();
      expect(axe.violations, JSON.stringify(axe.violations)).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath("settings-overlay.png"),
      });
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("body")).not.toHaveCSS("position", "fixed");

      await openSettings(page);
      await dialog.getByRole("button", { name: "Close", exact: true }).click();
      await expect(trigger).toBeFocused();
      await openSettings(page);
      const contact = dialog.getByRole("link", {
        name: "Contact",
        exact: true,
      });
      await expect(contact).toHaveAttribute("href", "/#contact");
      await contact.click();
      await expect(page).toHaveURL("/#contact");
      await expect(dialog).toHaveCount(0);
      await expect(page.locator("#contact")).toBeInViewport();
      await expect(page.locator("#contact")).toBeFocused();
      await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
      const legal = page
        .getByRole("contentinfo")
        .getByRole("link", { name: "Privacy", exact: true });
      await legal.scrollIntoViewIfNeeded();
      await legal.click();
      await expect(page).toHaveURL("/privacy");
      await openAppearance(page);
      await expect(
        page
          .getByRole("dialog")
          .getByRole("button", { name: "Dark", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
    });

    test("enlarged text keeps overlay controls reachable", async ({ page }) => {
      await page.goto("/");
      await page.addStyleTag({ content: "html { font-size: 200%; }" });
      await expectArtworkAlignment(page);
      await openAppearance(page);
      const dialog = page.getByRole("dialog");
      await expect(
        dialog.getByRole("button", { name: "High Contrast" }),
      ).toBeVisible();
      await dialog.getByRole("button", { name: "High Contrast" }).click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        "dark-high-contrast",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await dialog.getByRole("button", { name: "Close", exact: true }).click();
      await expect(dialog).toHaveCount(0);
    });
  });
}
