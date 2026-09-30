import { expect, test, type Page } from "@playwright/test";
import { openSettings } from "./helpers/foundation";

const triggerSelector = 'button[aria-label="Menu: navigation and settings"]';
const cases = [
  {
    label: "Contact",
    source: "/?utm_source=review",
    destination: "/#contact",
    focusId: "contact",
    nextTab: '#contact a[href^="mailto:"]',
    legal: false,
  },
  {
    label: "About",
    source: "/about?ref=review",
    destination: "/about",
    focusId: "main-content",
    // About contains no interactive content; the launcher follows main.
    nextTab: triggerSelector,
    legal: false,
  },
  {
    label: "Privacy policy",
    source: "/privacy?ref=review",
    destination: "/privacy",
    focusId: "main-content",
    nextTab: '#main-content a[href^="mailto:"]',
    legal: true,
  },
  {
    label: "Legal notice",
    source: "/impressum?ref=review",
    destination: "/impressum",
    focusId: "main-content",
    nextTab: '#main-content a[href^="mailto:"]',
    legal: true,
  },
] as const;

async function afterCleanup(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Observe final state after the handoff frame and queued native close work.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

async function pageState(page: Page, focusId: string) {
  return page.evaluate((id) => {
    const target = document.getElementById(id);
    const rect = target?.getBoundingClientRect();
    return {
      url: location.pathname + location.search + location.hash,
      openDialogs: document.querySelectorAll("dialog[open]").length,
      modals: document.querySelectorAll("dialog:modal").length,
      focusInDialog: !!document.activeElement?.closest("dialog"),
      targetFocused: document.activeElement === target,
      targetInViewport: !!rect && rect.bottom > 0 && rect.top < innerHeight,
      scrollY,
      // Covers overflow, body displacement and the owned anchor-offset value.
      htmlStyle: document.documentElement.style.cssText,
      bodyStyle: document.body.style.cssText,
    };
  }, focusId);
}

for (const width of [320, 1280]) {
  test.describe(`FS-3.2 query removal ${width}px`, () => {
    test.use({ viewport: { width, height: 720 } });
    for (const scenario of cases) {
      test(`${scenario.label}: release, destination focus, Tab and native history`, async ({
        page,
      }, info) => {
        await page.goto(scenario.source);
        const trigger = page.locator(triggerSelector);
        await trigger.waitFor();
        await afterCleanup(page);
        const initial = await pageState(page, scenario.focusId);
        // Use nonzero scroll where content permits; the short wide legal page
        // can fit entirely. Keep the desktop header launcher visible.
        const sourceY = await page.evaluate(
          (desired) =>
            Math.min(
              desired,
              document.documentElement.scrollHeight - innerHeight,
            ),
          width === 320 ? 150 : 20,
        );
        if (scenario.focusId === "contact") expect(sourceY).toBeGreaterThan(0);
        await page.evaluate((y) => scrollTo(0, y), sourceY);
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(sourceY);
        const main = await page.locator("#main-content").elementHandle();

        await openSettings(page, { preserveScroll: true });
        expect(await page.evaluate(() => scrollY)).toBe(sourceY);
        const dialog = page.getByRole("dialog");
        if (scenario.legal)
          await dialog.getByText("Privacy", { exact: true }).click();
        const link = dialog.getByRole("link", {
          name: scenario.label,
          exact: true,
        });
        await expect(link).toHaveAttribute("href", scenario.destination);
        // Exercise both browser activation paths across the viewport matrix.
        if (width === 320) await link.click();
        else await link.press("Enter");
        await expect(page).toHaveURL(scenario.destination);
        await afterCleanup(page);
        const arrival = await pageState(page, scenario.focusId);

        // No remount is required for a Next same-route search-param change.
        // Keeping this guard prevents a forced reload from hiding the defect.
        expect(
          await main!.evaluate(
            (node) => node === document.getElementById("main-content"),
          ),
        ).toBe(true);
        const released = {
          openDialogs: 0,
          modals: 0,
          focusInDialog: false,
          htmlStyle: initial.htmlStyle,
          bodyStyle: initial.bodyStyle,
        };
        // Soft assertions preserve evidence for every phase of the known defect.
        // They still fail this test; there is no expected-failure or skip marker.
        expect.soft(arrival).toMatchObject({
          ...released,
          url: scenario.destination,
          targetFocused: true,
          targetInViewport: true,
        });
        if (scenario.focusId === "contact")
          expect.soft(arrival.scrollY).toBeGreaterThan(sourceY + 200);

        await afterCleanup(page);
        const settled = await pageState(page, scenario.focusId);
        expect.soft(settled).toMatchObject({
          ...released,
          targetFocused: true,
          scrollY: arrival.scrollY,
        });
        await page.keyboard.press("Tab");
        await afterCleanup(page);
        const nextFocused = await page
          .locator(scenario.nextTab)
          .evaluate((node) => document.activeElement === node);
        expect.soft(nextFocused, "next Tab follows the destination").toBe(true);
        const afterTab = await pageState(page, scenario.focusId);
        if (scenario.focusId === "contact")
          expect.soft(afterTab.scrollY).toBe(arrival.scrollY);
        // Other next-Tab targets may legitimately scroll into view. Preserve
        // that actual position on Forward rather than forcing a heading scroll.
        await afterCleanup(page);
        expect.soft(await page.evaluate(() => scrollY)).toBe(afterTab.scrollY);

        await page.goBack();
        await expect(page).toHaveURL(scenario.source);
        await afterCleanup(page);
        const back = await pageState(page, scenario.focusId);
        expect.soft(back).toMatchObject({ ...released, scrollY: sourceY });
        await afterCleanup(page);
        expect.soft(await pageState(page, scenario.focusId)).toEqual(back);

        await page.goForward();
        await expect(page).toHaveURL(scenario.destination);
        await afterCleanup(page);
        const forward = await pageState(page, scenario.focusId);
        expect.soft(forward).toMatchObject({
          ...released,
          scrollY: afterTab.scrollY,
        });
        await afterCleanup(page);
        expect.soft(await pageState(page, scenario.focusId)).toEqual(forward);

        await info.attach("query-removal-final-states", {
          body: JSON.stringify(
            { sourceY, arrival, settled, nextFocused, afterTab, back, forward },
            null,
            2,
          ),
          contentType: "application/json",
        });
      });
    }
  });
}
