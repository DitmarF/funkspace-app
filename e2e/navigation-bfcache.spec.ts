import { expect, test } from "@playwright/test";
import { openSettings } from "./helpers/foundation";
test.use({
  channel: "chromium",
  launchOptions: { ignoreDefaultArgs: ["--disable-back-forward-cache"] },
});
test("N5 real BFCache return keeps the overlay closed and usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = window as typeof window & { cacheReturns?: boolean[] };
    state.cacheReturns = [];
    window.addEventListener("pageshow", (event) =>
      state.cacheReturns!.push(event.persisted),
    );
  });
  await page.goto("/");
  await openSettings(page);
  await page.evaluate(() => location.assign("/privacy"));
  await expect(page).toHaveURL("/privacy");
  // A BFCache restore has no new load event; observe the native traversal itself.
  await page.evaluate(() => history.back());
  await expect(page).toHaveURL("/");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { cacheReturns?: boolean[] }).cacheReturns,
      ),
    )
    .toContain(true);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await openSettings(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
