import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  selectTheme,
  settleStyles,
  themes,
  transitionPairs,
  openAppearance,
  closeSettings,
} from "./helpers/foundation";

test.describe("A11y — Home", () => {
  for (const theme of themes) {
    test(`${theme}: unfiltered axe in default, hover and keyboard-focus states`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto("/");
      await openAppearance(page);
      // Storage normalization is best effort; the resolved UI establishes
      // readiness even when browser storage cannot be written.
      await expect(
        page.getByRole("button", { name: "System", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await selectTheme(page, theme);

      const assertAccessible = async () => {
        await settleStyles(page);
        const results = await new AxeBuilder({ page }).analyze();
        expect(
          results.violations,
          JSON.stringify(results.violations, null, 2),
        ).toEqual([]);
      };

      await page.mouse.move(0, 0);
      await assertAccessible();
      await openAppearance(page);
      const unselected = page
        .getByRole("group", { name: "Appearance" })
        .locator('button[aria-pressed="false"]')
        .first();
      await unselected.hover();
      for (const sample of await transitionPairs(unselected)) {
        expect(sample.ratio, JSON.stringify(sample)).toBeGreaterThanOrEqual(
          4.5,
        );
      }
      await assertAccessible();
      await page.mouse.down();
      await assertAccessible();
      await page.mouse.move(0, 0);
      await page.mouse.up();
      await page.keyboard.press("Tab");
      await page
        .getByRole("group", { name: "Appearance" })
        .locator('button[aria-pressed="true"]')
        .focus();
      await expect(
        page
          .getByRole("group", { name: "Appearance" })
          .locator('button[aria-pressed="true"]'),
      ).toBeFocused();
      await expect(
        page
          .getByRole("group", { name: "Appearance" })
          .locator('button[aria-pressed="true"]'),
      ).toHaveCSS("outline-style", "solid");
      await assertAccessible();
      await closeSettings(page);
    });
  }
});
