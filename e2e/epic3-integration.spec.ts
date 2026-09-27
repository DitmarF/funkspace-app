import { expect, test } from "@playwright/test";
import {
  closeSettings,
  openAppearance,
  openSettings,
} from "./helpers/foundation";

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
  { width: 1280, height: 720 },
];

for (const viewport of viewports) {
  for (const deniedWrites of [false, true]) {
    test(`FS-3.6 ${viewport.width}×${viewport.height}, writes ${deniedWrites ? "denied" : "allowed"}: shared settings survive navigation and retain honest reload semantics`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({
        colorScheme: "light",
        reducedMotion: "no-preference",
      });
      await page.addInitScript((deny) => {
        if (!sessionStorage.getItem("fs36-seeded")) {
          localStorage.setItem("theme", "dark");
          localStorage.setItem("funkspace.motion.preference.v1", "off");
          sessionStorage.setItem("fs36-seeded", "yes");
        }
        if (deny) {
          const set = Storage.prototype.setItem;
          Storage.prototype.setItem = function (key, value) {
            if (key === "theme" || key === "funkspace.motion.preference.v1")
              throw new DOMException("Fixture: write denied", "SecurityError");
            return set.call(this, key, value);
          };
        }
      }, deniedWrites);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/");
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });
      await openAppearance(page);
      await page.getByRole("button", { name: "Muted", exact: true }).click();
      await page.getByRole("button", { name: "Reduced", exact: true }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "muted");
      await closeSettings(page);
      await openSettings(page);
      await page
        .getByRole("dialog")
        .getByRole("link", { name: "About", exact: true })
        .click();
      await expect(page).toHaveURL("/about");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("main")).toBeFocused();
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
      await openAppearance(page);
      await expect(
        page.getByRole("button", { name: "Muted", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByRole("button", { name: "Reduced", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", "muted");
      await expect(
        page.getByRole("button", { name: "Reduced", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await closeSettings(page);
      await openSettings(page);
      await page
        .getByRole("dialog")
        .getByRole("link", { name: "Contact", exact: true })
        .click();
      await expect(page).toHaveURL("/#contact");
      await expect(page.locator("#contact")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(page.locator('a[href^="mailto:"]').first()).toBeFocused();
      // Inspect the fallback; never activate an external mail application.
      await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute(
        "href",
        /^mailto:.+@/,
      );
      await openAppearance(page);
      await expect(
        page.getByRole("button", { name: "Muted", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByRole("button", { name: "Reduced", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await closeSettings(page);
      await page.reload();
      await openAppearance(page);
      await expect(
        page.getByRole("button", {
          name: deniedWrites ? "Dark" : "Muted",
          exact: true,
        }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByRole("button", {
          name: deniedWrites ? "Off" : "Reduced",
          exact: true,
        }),
      ).toHaveAttribute("aria-pressed", "true");
      await closeSettings(page);
      expect(errors).toEqual([]);
    });
  }
}
