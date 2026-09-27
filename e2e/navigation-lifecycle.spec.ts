import { expect, test, type Page } from "@playwright/test";
import { openSettings } from "./helpers/foundation";
const menu = (page: Page) =>
  page.getByRole("button", {
    name: "Menu: navigation and settings",
    exact: true,
  });
const modal = (page: Page) =>
  page.getByRole("dialog", { name: "Navigation and settings" });
async function frames(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}
async function unlocked(page: Page) {
  await expect(modal(page)).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
}
async function contactArrival(page: Page) {
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.locator("#contact")).toBeFocused();
  await unlocked(page);
  await frames(page);
  const y = await page.evaluate(() => scrollY);
  await expect(page.locator("#contact")).toBeFocused();
  const email = page.locator('#contact a[href^="mailto:"]');
  await expect(email).toBeInViewport();
  await page.keyboard.press("Tab");
  await expect(email).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(y);
}
for (const width of [320, 1280]) {
  test.describe(`FS-3.2 ${width}px`, () => {
    test.use({ viewport: { width, height: 720 } });
    test("N1/N7 nonzero overflow lock, ten dismissals and rapid native reopen", async ({
      page,
    }) => {
      await page.goto("/");
      for (let i = 0; i < 10; i++) {
        await menu(page).click();
        await expect(
          modal(page).getByRole("button", { name: "Close", exact: true }),
        ).toBeFocused();
        const y = await page.evaluate(() => scrollY);
        await page.mouse.wheel(0, 300);
        await frames(page);
        expect(await page.evaluate(() => scrollY)).toBe(y);
        if (i % 2) await page.keyboard.press("Escape");
        else
          await modal(page)
            .getByRole("button", { name: "Close", exact: true })
            .click();
        await unlocked(page);
        await expect(menu(page)).toBeFocused();
      }
      await openSettings(page);
      await page
        .locator("dialog")
        .evaluate((node: HTMLDialogElement) => node.close());
      await unlocked(page);
      await menu(page).click();
      await expect(modal(page)).toBeVisible();
      await frames(page);
      await expect(modal(page)).toBeVisible();
      await page.keyboard.press("Escape");
      await unlocked(page);
    });
    test("N3 repeated Contact reveals and focuses without late return", async ({
      page,
    }) => {
      await page.goto("/#contact");
      await menu(page).waitFor();
      await page.evaluate(() => scrollTo(0, 0));
      await openSettings(page);
      await modal(page)
        .getByRole("link", { name: "Contact", exact: true })
        .press("Enter");
      await contactArrival(page);
      await page.evaluate(() => scrollTo(0, 0));
      await openSettings(page);
      await modal(page)
        .getByRole("link", { name: "Contact", exact: true })
        .click();
      await contactArrival(page);
    });
    for (const route of ["/privacy", "/impressum"])
      for (const dismissal of ["Close", "Escape"]) {
        test(`N4 delayed Contact from ${route}, ${dismissal}, final focus and Tab`, async ({
          page,
        }) => {
          await page.goto(route);
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
            (url) => url.pathname === "/",
            async (request) => {
              entered();
              await gate;
              await request.continue();
            },
          );
          await modal(page)
            .getByRole("link", { name: "Contact", exact: true })
            .click();
          await requested;
          if (dismissal === "Close")
            await modal(page)
              .getByRole("button", { name: "Close", exact: true })
              .click();
          else await page.keyboard.press("Escape");
          await unlocked(page);
          release();
          await contactArrival(page);
        });
      }
    test("N2 legal/full About links arrive at main", async ({ page }) => {
      await page.goto("/");
      for (const [label, path] of [
        ["About", "/about"],
        ["Privacy policy", "/privacy"],
        ["Legal notice", "/impressum"],
      ]) {
        await openSettings(page);
        if (label !== "About")
          await modal(page).getByText("Privacy", { exact: true }).click();
        await modal(page)
          .getByRole("link", { name: label, exact: true })
          .press("Enter");
        await expect(page).toHaveURL(path);
        await unlocked(page);
        await expect(page.locator("#main-content")).toBeFocused();
      }
    });
    test("N5 native fragment history preserves nonzero position while open", async ({
      page,
    }) => {
      await page.goto("/#start");
      await menu(page).waitFor();
      await page.evaluate(() => {
        location.hash = "contact";
      });
      await expect(page).toHaveURL("/#contact");
      await frames(page);
      // Opening a desktop header invoker legitimately reveals that invoker first.
      await openSettings(page);
      const position = await page.evaluate(() => scrollY);
      await page.goBack();
      await unlocked(page);
      await page.goForward();
      await expect(page).toHaveURL("/#contact");
      await frames(page);
      expect(await page.evaluate(() => scrollY)).toBe(position);
      await unlocked(page);
      await page.reload();
      await unlocked(page);
    });
  });
}
test("N5 changed hash preserves the actual departing scroll position", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await menu(page).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await frames(page);
  await page.evaluate(() => scrollTo(0, 150));
  const before = await page.evaluate(() => scrollY);
  expect(before).toBe(150);
  await openSettings(page);
  await modal(page).getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL("/#contact");
  await frames(page);
  await page.goBack();
  await frames(page);
  expect(await page.evaluate(() => scrollY)).toBe(before);
});
test("N8 failed native opening restores ordinary navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLDialogElement.prototype.showModal = function () {
      throw new Error("Controlled opening failure");
    };
  });
  await page.goto("/");
  await menu(page).click();
  await expect(menu(page)).toHaveCount(0);
  await unlocked(page);
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL("/about");
});
test("N9 responsive change keeps one modal and restores the current visible invoker", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await openSettings(page);
  await page.setViewportSize({ width: 1280, height: 320 });
  await expect(modal(page)).toHaveCount(1);
  await page.keyboard.press("Escape");
  await unlocked(page);
  await expect(menu(page)).toBeFocused();
});
test("N5 full document departure and persisted pageshow leave no stale overlay", async ({
  page,
}) => {
  await page.goto("/");
  await openSettings(page);
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent("pagehide", { persisted: true }),
    ),
  );
  await unlocked(page);
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent("pageshow", { persisted: true }),
    ),
  );
  await unlocked(page);
  await openSettings(page);
  await page.evaluate(() => location.assign("/privacy"));
  await expect(page).toHaveURL("/privacy");
  await unlocked(page);
  await page.goBack();
  await unlocked(page);
});

for (const dismissal of [false, true]) {
  test(`N4 hard-navigation redirected Contact preserves focus and Tab (dismissed=${dismissal})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
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
        if (route.request().headers().rsc) {
          // Exercise Next's real hard-navigation fallback, then a document redirect.
          await route.fulfill({ contentType: "text/html", body: "" });
        } else {
          await route.fulfill({
            status: 307,
            headers: { location: "/#contact" },
          });
        }
      },
    );
    await modal(page).getByRole("link", { name: "About", exact: true }).click();
    await requested;
    if (dismissal) {
      await page.keyboard.press("Escape");
      await unlocked(page);
    }
    release();
    await contactArrival(page);
  });
}
test("N4 destination input supersedes scheduled Contact correction", async ({
  page,
}) => {
  await page.goto("/privacy");
  await openSettings(page);
  await page.evaluate(() => {
    const observer = new MutationObserver(() => {
      const email = document.querySelector<HTMLAnchorElement>(
        '#contact a[href^="mailto:"]',
      );
      if (!email) return;
      observer.disconnect();
      email.focus({ preventScroll: true });
      email.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
  await modal(page).getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL("/#contact");
  await frames(page);
  await expect(page.locator('#contact a[href^="mailto:"]')).toBeFocused();
});

test("N1 hidden invoker falls back to main; N7 immediate reopen ignores old close", async ({
  page,
}) => {
  await page.goto("/");
  await openSettings(page);
  await menu(page).evaluate((node) => {
    node.hidden = true;
  });
  await page.keyboard.press("Escape");
  await expect(page.locator("#main-content")).toBeFocused();
  await unlocked(page);
  await menu(page).evaluate((node) => {
    node.hidden = false;
  });
  await openSettings(page);
  await page.evaluate(() => {
    document
      .querySelector<HTMLButtonElement>('dialog button[aria-label="Close"]')!
      .click();
    queueMicrotask(() =>
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Menu: navigation and settings"]',
        )!
        .click(),
    );
  });
  await frames(page);
  await expect(modal(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await unlocked(page);
});
test("N6 download activation leaves the same-tab overlay intact", async ({
  page,
}) => {
  await page.goto("/");
  await openSettings(page);
  const link = modal(page).getByRole("link", { name: "About", exact: true });
  await link.evaluate((node) => node.setAttribute("download", "about.html"));
  const download = page.waitForEvent("download");
  await link.click();
  await download;
  await expect(page).toHaveURL("/");
  await expect(modal(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await unlocked(page);
});

test("N9 scrolled mobile invoker moved out of view on desktop uses main fallback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/privacy");
  await menu(page).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => scrollTo(0, 300));
  await openSettings(page);
  await page.setViewportSize({ width: 1280, height: 568 });
  await expect
    .poll(async () => {
      const b = await menu(page).boundingBox();
      return b!.y + b!.height;
    })
    .toBeLessThan(0);
  await expect(
    modal(page).getByRole("button", { name: "Close", exact: true }),
  ).toBeInViewport();
  await modal(page).getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator("#main-content")).toBeFocused();
  await unlocked(page);
});

test("N5 full-document Back/Forward matches unlocked nonzero history restoration", async ({
  browser,
  baseURL,
}) => {
  const positions: Array<{ back: number; forward: number }> = [];
  for (const overlay of [false, true]) {
    const context = await browser.newContext({
      viewport: { width: 320, height: 568 },
    });
    const page = await context.newPage();
    try {
      await page.goto(`${baseURL}/privacy`);
      await menu(page).waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => scrollTo(0, 300));
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(300);
      await page.evaluate(() => location.assign("/impressum"));
      await expect(page).toHaveURL(/\/impressum$/);
      await menu(page).waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => scrollTo(0, 160));
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(160);
      if (overlay) await openSettings(page);
      await page.goBack();
      await expect(page).toHaveURL(/\/privacy$/);
      await menu(page).waitFor();
      await page.evaluate(() => document.fonts.ready);
      await frames(page);
      const back = await page.evaluate(() => scrollY);
      expect(back).toBeGreaterThan(250);
      await unlocked(page);
      await page.goForward();
      await expect(page).toHaveURL(/\/impressum$/);
      await menu(page).waitFor();
      await page.evaluate(() => document.fonts.ready);
      await frames(page);
      const forward = await page.evaluate(() => scrollY);
      expect(forward).toBeGreaterThan(100);
      await unlocked(page);
      positions.push({ back, forward });
    } finally {
      await context.close();
    }
  }
  // Native layout restoration can adjust an entry's pixels on document reload.
  // An open overlay must produce exactly the same positions as the control.
  expect(positions[1]).toEqual(positions[0]);
});

test("N5 external fragment activation releases an open overlay without old scroll replay", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await openSettings(page);
  await page.evaluate(() => {
    location.hash = "contact";
  });
  await expect(page).toHaveURL("/#contact");
  await unlocked(page);
  await expect(page.locator("#contact")).toBeInViewport();
  await frames(page);
  await expect(page.locator("#contact")).toBeInViewport();
});

test("N4 failed route releases the departing document and Back restores usable navigation", async ({
  page,
}) => {
  await page.goto("/");
  await openSettings(page);
  await page.route(
    (url) => url.pathname === "/about",
    (route) => route.abort("failed"),
  );
  await modal(page).getByRole("link", { name: "About", exact: true }).click();
  // Next falls back from a failed client fetch to a full-document request.
  await expect.poll(() => page.url()).toBe("chrome-error://chromewebdata/");
  await page.unrouteAll();
  await page.goBack();
  await expect(page).toHaveURL("/");
  await unlocked(page);
  await openSettings(page);
  await modal(page).getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL("/#contact");
  await contactArrival(page);
});
