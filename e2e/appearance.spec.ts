import { expect, test, type Page } from "@playwright/test";
import { THEME_METADATA } from "../frontend/domain/theme/Theme";
import {
  closeSettings,
  openAppearance,
  settleStyles,
} from "./helpers/foundation";

async function appearance(page: Page) {
  return page.evaluate(() => {
    const logo = document.querySelector(
      'header [data-logo-part="logo-path-2"]',
    )!;
    const body = getComputedStyle(document.body);
    return {
      background: body.backgroundColor,
      content: body.color,
      logo: getComputedStyle(logo).fill,
    };
  });
}

for (const width of [320, 1280]) {
  test.describe(`FS-3.3 appearance ${width}px`, () => {
    test.use({ viewport: { width, height: 720 } });
    test("T1/T2/T4: all choices, live page/logo, OS policy and reload", async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto("/");
      const explicit = new Map<
        string,
        Awaited<ReturnType<typeof appearance>>
      >();
      for (const { value, label } of THEME_METADATA) {
        await openAppearance(page);
        const button = page.getByRole("button", { name: label, exact: true });
        await button.click();
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await expect(
          page
            .getByRole("group", { name: "Appearance" })
            .locator('[aria-pressed="true"]'),
        ).toHaveCount(1);
        const resolved =
          value === "system" || value === "default" ? null : value;
        await expect
          .poll(() => page.locator("html").getAttribute("data-theme"))
          .toBe(resolved);
        const light = await appearance(page);
        expect(light.logo).toBe(light.content);
        await page.emulateMedia({ colorScheme: "dark" });
        if (value === "system") {
          await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark",
          );
          expect(await appearance(page)).not.toEqual(light);
        } else {
          await settleStyles(page);
          expect(await appearance(page)).toEqual(light);
          explicit.set(value, light);
        }
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await closeSettings(page);
        await expect(
          page.locator("header [data-funkspace-logo]"),
        ).toBeVisible();
        const beforeReload = await appearance(page);
        await page.reload();
        await openAppearance(page);
        await expect(
          page.getByRole("button", { name: label, exact: true }),
        ).toHaveAttribute("aria-pressed", "true");
        expect(await appearance(page)).toEqual(beforeReload);
        await page.emulateMedia({ colorScheme: "light" });
      }
      expect(
        new Set([...explicit.values()].map((v) => v.background)).size,
      ).toBe(4);
    });

    for (const fault of [
      "write-system",
      "write-muted",
      "read-and-write",
    ] as const) {
      test(`T3/T4: ${fault}, reopen, OS changes and honest reload fallback`, async ({
        page,
      }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.emulateMedia({ colorScheme: "light" });
        await page.addInitScript((fault) => {
          if (!sessionStorage.getItem("appearance-seeded")) {
            localStorage.setItem(
              "theme",
              fault === "write-muted" ? "muted" : "system",
            );
            sessionStorage.setItem("appearance-seeded", "yes");
          }
          const get = Storage.prototype.getItem;
          const set = Storage.prototype.setItem;
          Storage.prototype.getItem = function (key) {
            if (key === "theme" && fault === "read-and-write")
              throw new Error("denied read");
            return get.call(this, key);
          };
          Storage.prototype.setItem = function (key, value) {
            if (key === "theme") throw new Error("denied write");
            return set.call(this, key, value);
          };
        }, fault);
        await page.goto("/");
        await openAppearance(page);
        await page.getByRole("button", { name: "Dark", exact: true }).click();
        const selected = await appearance(page);
        await closeSettings(page);
        await openAppearance(page);
        await expect(
          page.getByRole("button", { name: "Dark", exact: true }),
        ).toHaveAttribute("aria-pressed", "true");
        for (const colorScheme of ["dark", "light"] as const) {
          await page.emulateMedia({ colorScheme });
          await settleStyles(page);
          await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark",
          );
          expect(await appearance(page)).toEqual(selected);
        }
        // Switching back to System must work even while stored Muted is stale.
        await page.getByRole("button", { name: "System", exact: true }).click();
        await page.emulateMedia({ colorScheme: "dark" });
        await expect(page.locator("html")).toHaveAttribute(
          "data-theme",
          "dark",
        );
        await page.emulateMedia({ colorScheme: "light" });
        await expect(page.locator("html")).not.toHaveAttribute("data-theme");
        await page.getByRole("button", { name: "Dark", exact: true }).click();
        await page.reload();
        await openAppearance(page);
        const fallback = fault === "write-muted" ? "Muted" : "System";
        await expect(
          page.getByRole("button", { name: fallback, exact: true }),
        ).toHaveAttribute("aria-pressed", "true");
        await expect
          .poll(() => page.locator("html").getAttribute("data-theme"))
          .toBe(fault === "write-muted" ? "muted" : null);
        expect(errors).toEqual([]);
      });
    }
  });
}
