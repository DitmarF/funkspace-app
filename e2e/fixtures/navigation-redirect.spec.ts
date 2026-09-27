import { expect, test } from "@playwright/test";
import { openSettings } from "../helpers/foundation";
// Run only against the isolated copy whose /about uses the redirect fixture.
for (const width of [320, 1280])
  for (const dismiss of [false, true]) {
    test(`client redirect into Contact: ${width}px dismissed=${dismiss}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 720 });
      await page.goto("/privacy");
      await openSettings(page);
      let release!: () => void;
      const gate = new Promise<void>((r) => {
        release = r;
      });
      let entered!: () => void;
      const requested = new Promise<void>((r) => {
        entered = r;
      });
      await page.route(
        (url) => url.pathname === "/about",
        async (route) => {
          entered();
          await gate;
          await route.continue();
        },
      );
      await page.evaluate(() => {
        (
          window as typeof window & { sourceDocument?: boolean }
        ).sourceDocument = true;
      });
      await page
        .getByRole("dialog")
        .getByRole("link", { name: "About", exact: true })
        .click();
      await requested;
      if (dismiss) await page.keyboard.press("Escape");
      release();
      await expect(page).toHaveURL("/#contact");
      expect(
        await page.evaluate(
          () =>
            (window as typeof window & { sourceDocument?: boolean })
              .sourceDocument,
        ),
      ).toBe(true);
      await expect(page.locator("#contact")).toBeFocused();
      const y = await page.evaluate(() => scrollY);
      await page.keyboard.press("Tab");
      await expect(page.locator('#contact a[href^="mailto:"]')).toBeFocused();
      expect(await page.evaluate(() => scrollY)).toBe(y);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    });
  }
