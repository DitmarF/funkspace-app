import { expect, test } from "@playwright/test";

test.describe("Theme switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem("theme-test-initialized") === null) {
        localStorage.clear();
        sessionStorage.setItem("theme-test-initialized", "true");
      }
    });
  });

  test("persists explicit themes across reloads", async ({ page }) => {
    await page.goto("/");

    const darkButton = page.getByRole("button", { name: "Dark" });
    await darkButton.click();

    await expect(darkButton).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBe("dark");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("tracks system color-scheme changes only in system mode", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");

    await page.getByRole("button", { name: "High Contrast" }).click();
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      "dark-high-contrast",
    );
  });
});
