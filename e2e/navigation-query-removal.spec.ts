import { expect, test, type Page } from "@playwright/test";
import { openSettings } from "./helpers/foundation";

// Current-page selection now deliberately preserves the query. Generic
// same-route handoff behavior remains covered by the adapter's unit tests.
const cases = [
  { label: "Home", source: "/?utm_source=review", legal: false },
  { label: "About", source: "/about?ref=review", legal: false },
  { label: "Privacy policy", source: "/privacy?ref=review", legal: true },
  { label: "Legal notice", source: "/impressum?ref=review", legal: true },
] as const;

async function settled(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

async function state(page: Page) {
  return page.evaluate(() => ({
    url: location.pathname + location.search + location.hash,
    scrollY,
    openDialogs: document.querySelectorAll("dialog[open]").length,
    modals: document.querySelectorAll("dialog:modal").length,
    htmlStyle: document.documentElement.style.cssText,
    bodyStyle: document.body.style.cssText,
  }));
}

for (const width of [320, 1280]) {
  test.describe("current-route queries at " + width + "px", () => {
    test.use({ viewport: { width, height: 720 } });
    for (const scenario of cases) {
      test(
        scenario.label +
          ": no reactivation, clean dismissal and native history",
        async ({ page }, info) => {
          await page.goto(scenario.source);
          const trigger = page.getByRole("button", {
            name: "Menu: navigation and settings",
            exact: true,
          });
          await trigger.waitFor();
          await settled(page);
          const sourceY = await page.evaluate(
            (desired) =>
              Math.min(
                desired,
                document.documentElement.scrollHeight - innerHeight,
              ),
            width === 320 ? 150 : 20,
          );
          if (scenario.label === "Home") expect(sourceY).toBeGreaterThan(0);
          await page.evaluate((y) => scrollTo(0, y), sourceY);
          const initial = await state(page);
          const main = await page.locator("#main-content").elementHandle();
          await openSettings(page, { preserveScroll: true });
          if (scenario.legal)
            await expect(
              page
                .getByRole("dialog")
                .locator("summary")
                .filter({ hasText: /^Privacy$/ })
                .locator(".."),
            ).toHaveAttribute("open", "");
          const current = page
            .getByRole("dialog")
            .getByRole("button", { name: scenario.label, exact: true });
          await expect(current).toBeVisible();
          await expect(current).toBeDisabled();
          await expect(current).toHaveAttribute("aria-current", "page");
          await expect(current).not.toHaveAttribute("href");
          const box = (await current.boundingBox())!;
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
          await settled(page);
          await expect(page).toHaveURL(scenario.source);
          await expect(page.getByRole("dialog")).toBeVisible();
          expect(
            await main!.evaluate(
              (node) => node === document.getElementById("main-content"),
            ),
          ).toBe(true);
          expect(await page.evaluate(() => scrollY)).toBe(sourceY);
          await page.keyboard.press("Escape");
          await settled(page);
          await expect(trigger).toBeFocused();
          expect(await state(page)).toEqual(initial);

          // Surviving cross-page navigation must still release the overlay,
          // focus the destination and preserve query/scroll on Back and Forward.
          const destination =
            scenario.label === "About"
              ? { label: "Home", href: "/" }
              : { label: "About", href: "/about" };
          await openSettings(page, { preserveScroll: true });
          const link = page
            .getByRole("dialog")
            .getByRole("link", { name: destination.label, exact: true });
          if (width === 320) await link.click();
          else await link.press("Enter");
          await expect(page).toHaveURL(destination.href);
          await expect(page.locator("#main-content")).toBeFocused();
          await expect(page.getByRole("dialog")).toHaveCount(0);
          await settled(page);
          const arrival = await state(page);
          expect(arrival).toMatchObject({
            openDialogs: 0,
            modals: 0,
            htmlStyle: initial.htmlStyle,
            bodyStyle: initial.bodyStyle,
          });
          await page.keyboard.press("Tab");
          const next =
            destination.href === "/about"
              ? trigger
              : page
                  .locator("#main-content :is(a, button):not([disabled])")
                  .first();
          await expect(next).toBeFocused();
          await settled(page);
          const afterTab = await state(page);
          await page.goBack();
          await expect(page).toHaveURL(scenario.source);
          await settled(page);
          expect(await state(page)).toEqual(initial);
          await page.goForward();
          await expect(page).toHaveURL(destination.href);
          await settled(page);
          expect(await state(page)).toEqual(afterTab);
          await info.attach("current-query-history", {
            body: JSON.stringify({ initial, arrival, afterTab }, null, 2),
            contentType: "application/json",
          });
        },
      );
    }
  });
}
