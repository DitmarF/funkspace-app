import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Must match the actual build-time flag, like the existing motion suites.
const available = process.env.FS35_AVAILABLE === "true";

async function scroll(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(y);
}
async function ready(page: Page) {
  await page.goto("/about");
  await expect(page.locator("[data-sticky-header]")).toHaveCount(1);
  await expect(
    page.getByRole("button", {
      name: "Menu: navigation and settings",
      exact: true,
    }),
  ).toBeVisible();
}

for (const width of [768, 1280]) {
  for (const preference of ["on", "off"]) {
    test(`direct Start fragment clears the header at ${width} with motion ${preference}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) =>
          localStorage.setItem("funkspace.motion.preference.v1", value),
        preference,
      );
      await page.goto("/#start");
      for (const reload of [false, true]) {
        if (reload) await page.reload();
        await expect(page.locator("[data-sticky-header]")).toHaveCount(1);
        await expect(
          page.getByRole("button", {
            name: "Menu: navigation and settings",
            exact: true,
          }),
        ).toBeVisible();
        await expect
          .poll(() =>
            page.evaluate(() => {
              const heading = document
                .querySelector("#start h1")!
                .getBoundingClientRect();
              const header = document
                .querySelector("header")!
                .getBoundingClientRect();
              return heading.top - header.bottom;
            }),
          )
          .toBeGreaterThanOrEqual(0);
        await expect(page).toHaveURL(/\/#start$/);
      }
    });
  }
}

for (const width of [768, 1280]) {
  test(`header visibility, stable flow, focus and modal alignment at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await ready(page);
    const shell = page.locator("[data-sticky-header]");
    const header = page.getByRole("banner");
    const mainTop = await page
      .getByRole("main")
      .evaluate((node) => node.getBoundingClientRect().top + scrollY);
    await scroll(page, 500);
    await expect(shell).toHaveAttribute(
      "data-header-hidden",
      String(available),
    );
    if (available) {
      await expect
        .poll(async () => {
          const bounds = (await header.boundingBox())!;
          return bounds.y + bounds.height;
        })
        .toBeLessThanOrEqual(1);
    } else
      await expect.poll(async () => (await header.boundingBox())!.y).toBe(0);
    await scroll(page, 496);
    await expect(shell).toHaveAttribute(
      "data-header-hidden",
      String(available),
    );
    await scroll(page, 480);
    await expect(shell).toHaveAttribute("data-header-hidden", "false");
    await expect.poll(async () => (await header.boundingBox())!.y).toBe(0);
    expect(
      await page
        .getByRole("main")
        .evaluate((node) => node.getBoundingClientRect().top + scrollY),
    ).toBe(mainTop);
    const trigger = page.getByRole("button", {
      name: "Menu: navigation and settings",
      exact: true,
    });
    const triggerBox = await trigger.boundingBox();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Close", exact: true }),
    ).toHaveCSS("scroll-margin-top", "16px");
    await expect
      .poll(() =>
        dialog
          .getByRole("button", {
            name: "Menu: close navigation and settings",
            exact: true,
          })
          .boundingBox(),
      )
      .toEqual(triggerBox);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => scrollY)).toBe(480);
    // Keyboard focus must reveal a hidden header immediately, without scrolling to the top.
    await trigger.evaluate((node) => node.blur());
    await scroll(page, 600);
    await expect(shell).toHaveAttribute(
      "data-header-hidden",
      String(available),
    );
    const home = page
      .getByRole("navigation", { name: "Main", exact: true })
      .getByRole("link", { name: "Home", exact: true });
    await home.evaluate((node) => node.focus({ preventScroll: true }));
    await expect(home).toBeFocused();
    expect((await header.boundingBox())!.y).toBe(0);
    expect(await page.evaluate(() => scrollY)).toBe(600);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}

for (const preference of ["off", "reduced", "system", "on"]) {
  test(`motion preference ${preference} with device reduction`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(
      (value) => localStorage.setItem("funkspace.motion.preference.v1", value),
      preference,
    );
    await ready(page);
    await scroll(page, 500);
    await expect(page.locator("[data-sticky-header]")).toHaveAttribute(
      "data-header-hidden",
      String(available && preference === "on"),
    );
    await expect(page.getByRole("banner")).toHaveCSS(
      "transition-duration",
      available && preference === "on" ? "0.4s" : "0s",
    );
  });
}

for (const width of [768, 1280]) {
  test(`resumes scrolling after changing motion Off then On at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await ready(page);
    const shell = page.locator("[data-sticky-header]");
    const trigger = page.getByRole("button", {
      name: "Menu: navigation and settings",
      exact: true,
    });
    for (const preference of ["Off", "On"]) {
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await dialog
        .getByRole("button", { name: "Accessibility", exact: true })
        .click();
      await dialog
        .getByRole("group", { name: "Motion", exact: true })
        .getByRole("button", { name: preference, exact: true })
        .click();
      await dialog
        .getByRole("button", {
          name: "Menu: close navigation and settings",
          exact: true,
        })
        .click();
      await expect(trigger).toBeFocused();
      await expect(shell).toHaveAttribute(
        "data-header-motion",
        String(available && preference === "On"),
      );
      const start = await page.evaluate(() => scrollY);
      await page.mouse.move(400, 500);
      await page.mouse.wheel(0, 250);
      await expect
        .poll(() => page.evaluate(() => scrollY))
        .toBeGreaterThan(start);
      await expect(shell).toHaveAttribute(
        "data-header-hidden",
        String(available && preference === "On"),
      );
    }
    // Focus was retained during pointer scrolling; keyboard use reveals it immediately.
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Shift");
    await expect(shell).toHaveAttribute("data-header-focused", "true");
    expect((await page.getByRole("banner").boundingBox())!.y).toBe(0);
    await page.mouse.wheel(0, 100);
    await expect(shell).toHaveAttribute(
      "data-header-hidden",
      String(available),
    );
    await page.mouse.wheel(0, -100);
    await expect(shell).toHaveAttribute("data-header-hidden", "false");
  });
}

test("mobile and short enlarged-text layouts remain native across resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await ready(page);
  await scroll(page, 500);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("[data-sticky-header]")).toHaveCount(0);
  await expect(page.getByRole("banner")).toHaveCSS("position", "static");
  const trigger = page.getByRole("button", {
    name: "Menu: navigation and settings",
    exact: true,
  });
  expect((await trigger.boundingBox())!.y).toBeGreaterThan(700);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.locator("html").evaluate((node) => {
    node.style.fontSize = "200%";
  });
  await expect(page.locator("[data-sticky-header]")).toHaveCount(0);
  await expect(page.getByRole("banner")).toHaveCSS("position", "static");
});

test("no-JavaScript retains native navigation disclosure", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/about");
  await expect(page.locator("[data-sticky-header]")).toHaveCount(0);
  await page.locator("details[data-home-menu] > summary").click();
  await expect(
    page.getByRole("navigation", { name: "Primary", exact: true }),
  ).toBeVisible();
  await context.close();
});
