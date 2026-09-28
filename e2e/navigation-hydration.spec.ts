import { expect, test } from "@playwright/test";

for (const width of [375, 1280]) {
  for (const active of ["open summary", "About link", "closed summary"]) {
    test(`${width}px: hydration preserves ${active} and the next Tab`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 720 });
      await page.emulateMedia({ colorScheme: "light" });
      await page.addInitScript(() => localStorage.setItem("theme", "system"));
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      let release!: () => void;
      const scripts = new Promise<void>((resolve) => (release = resolve));
      await page.route("**/_next/static/**/*.js", async (route) => {
        await scripts;
        await route.continue();
      });
      try {
        await page.goto("/privacy", { waitUntil: "commit" });
        const fallback = page.locator('footer details[class*="fallback"]');
        const summary = fallback.locator(":scope > summary");
        const tree = fallback.getByRole("navigation", { name: "Primary" });
        await summary.focus();
        if (active !== "closed summary") {
          await page.keyboard.press("Enter");
          await expect(tree).toBeVisible();
        }
        if (active === "About link") {
          await page.keyboard.press("Tab");
          await page.keyboard.press("Tab");
        }
        const focused =
          active === "About link"
            ? tree.getByRole("link", { name: "About", exact: true })
            : summary;
        await expect(focused).toBeFocused();
        release();
        await page.waitForLoadState("load");
        // A live OS-theme change proves application effects have initialized;
        // merely waiting for script downloads would not establish hydration.
        await page.emulateMedia({ colorScheme: "dark" });
        await expect(page.locator("html")).toHaveAttribute(
          "data-theme",
          "dark",
        );
        await expect(focused).toBeFocused();
        await expect(page.locator("dialog")).toHaveCount(0);
        if (active !== "closed summary") await expect(tree).toBeVisible();
        await page.keyboard.press("Tab");
        if (active === "open summary") {
          await expect(
            tree.getByRole("link", { name: "Home", exact: true }),
          ).toBeFocused();
        } else if (active === "About link") {
          await expect(
            tree.locator("summary").filter({ hasText: "Animations" }),
          ).toBeFocused();
          await page.keyboard.press("Shift+Tab");
          await page.keyboard.press("Enter");
          await expect(page).toHaveURL("/about");
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        }
        if (active !== "About link") {
          if (active === "open summary") {
            await page.keyboard.press("Shift+Tab");
            await page.keyboard.press("Enter");
            await expect(fallback).not.toHaveAttribute("open");
            await expect(summary).toBeFocused();
            await page.keyboard.press("Tab");
          }
          const footerContact = page
            .getByRole("navigation", { name: "Footer" })
            .getByRole("link", { name: "Contact", exact: true });
          await expect(footerContact).toBeFocused();
          const menu = page.getByRole("button", {
            name: "Menu: navigation and settings",
            exact: true,
          });
          await expect(menu).toBeVisible();
          await expect(fallback).toHaveCount(0);
          await expect(footerContact).toBeFocused();
          await menu.click();
          await expect(page.getByRole("dialog")).toHaveCount(1);
          await page.keyboard.press("Escape");
          await expect(menu).toBeFocused();
        }
        expect(errors).toEqual([]);
      } finally {
        release();
        await page.unrouteAll({ behavior: "wait" });
      }
    });
  }
}
