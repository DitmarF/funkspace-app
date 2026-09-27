import { expect, test, type Page } from "@playwright/test";

const available = process.env.FS35_AVAILABLE === "true";
const shell = "[data-home-intro]";

for (const preference of ["on", "reduced", "system"] as const) {
  for (const fallback of ["deadline", "interaction"] as const) {
    test(`${preference}: ${fallback} permanently retires automatic playback before late hydration`, async ({
      page,
    }) => {
      await page.clock.install();
      await page.clock.pauseAt(new Date(Date.now() + 100));
      await page.emulateMedia({
        reducedMotion: preference === "system" ? "no-preference" : "reduce",
      });
      await page.addInitScript(
        (value) =>
          localStorage.setItem("funkspace.motion.preference.v1", value),
        preference,
      );
      let release!: () => void;
      const held = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route("**/_next/static/**/*.js", async (route) => {
        await held;
        await route.continue();
      });
      try {
        await page.goto("/", { waitUntil: "commit" });
        await expect(page.locator(shell)).toHaveAttribute(
          "data-home-intro",
          available ? "preparing" : "visible",
        );
        if (fallback === "deadline") await page.clock.runFor(5100);
        else await page.keyboard.press("Escape");
        await expect(page.locator(shell)).toHaveAttribute(
          "data-home-intro",
          "visible",
        );
        const artwork = () =>
          page.locator("header [data-funkspace-logo]").evaluate((svg) => ({
            opacity: Number(getComputedStyle(svg).opacity),
            parts: svg.querySelectorAll("[data-logo-part]").length,
            partial: [...svg.querySelectorAll("[data-logo-part]")].some(
              (part) => {
                const style = getComputedStyle(part);
                return (
                  Number(style.opacity) < 1 ||
                  Number(style.fillOpacity) < 1 ||
                  parseFloat(style.strokeDashoffset) > 0
                );
              },
            ),
          }));
        await expect(page.locator('header a[href="/"]')).toHaveCSS(
          "opacity",
          "1",
        );
        expect(await artwork()).toEqual({
          opacity: 1,
          parts: 19,
          partial: false,
        });
        release();
        await page.waitForLoadState();
        await expect(
          page.getByRole("button", {
            name: "Menu: navigation and settings",
            exact: true,
          }),
        ).toBeVisible();
        // Inspect the initial prepared frame, mid-introduction and queued completion.
        for (const elapsed of [0, 100, 500, 2000, 5000]) {
          await page.clock.runFor(elapsed);
          expect(await artwork()).toEqual({
            opacity: 1,
            parts: 19,
            partial: false,
          });
          await expect(page.locator(shell)).toHaveAttribute(
            "data-home-intro",
            "visible",
          );
          await expect(page.locator("main")).toHaveCSS("opacity", "1");
          await expect(page.locator("[data-home-menu]")).toHaveCSS(
            "opacity",
            "1",
          );
        }
      } finally {
        release();
      }
    });
  }
}

async function finishMenuFade(page: Page, screenshot?: string) {
  await expect(page.locator(shell)).toHaveAttribute("data-home-intro", "menu");
  await expect(page.locator("main")).toHaveCSS("opacity", "0");
  await expect(page.locator('nav[aria-label="Footer"]')).toHaveCSS(
    "visibility",
    "hidden",
  );
  const menu = page.locator("[data-home-menu]");
  await expect(menu).toHaveCSS("visibility", "visible");
  const { duration, opacity } = await menu.evaluate((node) => {
    const animation = node.getAnimations()[0];
    animation.pause();
    animation.currentTime = 200;
    return {
      duration: animation.effect!.getTiming().duration,
      opacity: Number(getComputedStyle(node).opacity),
    };
  });
  expect(duration).toBe(400);
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  // Its footer ancestor must not hide the independent menu step.
  await expect(page.locator("footer")).toHaveCSS("opacity", "1");
  if (screenshot) await page.screenshot({ path: screenshot });
  await menu.evaluate((node) =>
    node.getAnimations().forEach((animation) => animation.finish()),
  );
  await page.clock.runFor(20);
  await expect(page.locator(shell)).toHaveAttribute(
    "data-home-intro",
    "fading",
  );
  await expect(menu).toHaveCSS("opacity", "1");
}

for (const preference of ["on", "reduced"] as const) {
  for (const background of [false, true]) {
    test(`${preference}: a second ${background ? "background" : "foreground"} tab keeps the logo/content sequence`, async ({
      page,
      context,
    }) => {
      await page.goto("/");
      await page.keyboard.press("Escape");
      await page.evaluate(
        (value) =>
          localStorage.setItem("funkspace.motion.preference.v1", value),
        preference,
      );
      const second = await context.newPage();
      try {
        await second.clock.install();
        await second.clock.pauseAt(new Date(Date.now() + 100));
        await second.emulateMedia({ reducedMotion: "reduce" });
        // Headless tabs do not expose desktop tab activation. Exercise that
        // environment input explicitly while keeping real routes/shared storage.
        if (background)
          await second.addInitScript(() => {
            Object.defineProperty(document, "visibilityState", {
              configurable: true,
              get: () => "hidden",
            });
          });
        await second.goto("/");
        if (background) {
          await second.clock.runFor(6000);
          if (available)
            await expect(second.locator(shell)).toHaveAttribute(
              "data-home-intro",
              "preparing",
            );
          await second.evaluate(() => {
            Object.defineProperty(document, "visibilityState", {
              configurable: true,
              get: () => "visible",
            });
            document.dispatchEvent(new Event("visibilitychange"));
          });
        }
        if (available) {
          await expect(second.locator(shell)).toHaveAttribute(
            "data-home-intro",
            "waiting",
          );
          await expect(second.locator("main")).toHaveCSS("opacity", "0");
          await second.clock.runFor(1700);
          await finishMenuFade(second);
          await expect(second.locator(shell)).toHaveAttribute(
            "data-home-intro",
            "fading",
          );
          const opacity = await second.locator("main").evaluate((node) => {
            const animation = node.getAnimations()[0];
            animation.pause();
            animation.currentTime = 200;
            return Number(getComputedStyle(node).opacity);
          });
          expect(opacity).toBeGreaterThan(0);
          expect(opacity).toBeLessThan(1);
          await second
            .locator("main")
            .evaluate((node) =>
              node.getAnimations().forEach((animation) => animation.finish()),
            );
          await second.clock.runFor(500);
        }
        await expect(second.locator(shell)).toHaveAttribute(
          "data-home-intro",
          "visible",
        );
        await expect(second.locator("main")).toHaveCSS("opacity", "1");
        await expect(page.locator(shell)).toHaveAttribute(
          "data-home-intro",
          "visible",
        );
      } finally {
        await second.close();
      }
    });
  }
}

for (const preference of ["on", "reduced", "system"] as const) {
  test(`${preference}: delayed hydration never paints the finished logo before playback`, async ({
    page,
  }) => {
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 100));
    await page.emulateMedia({
      reducedMotion: preference === "system" ? "no-preference" : "reduce",
    });
    await page.addInitScript(
      (value) => localStorage.setItem("funkspace.motion.preference.v1", value),
      preference,
    );
    let release!: () => void;
    const hydration = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/_next/static/**/*.js", async (route) => {
      await hydration;
      await route.continue();
    });
    await page.goto("/", { waitUntil: "commit" });
    const identity = page.locator('header a[href="/"]');
    try {
      await expect(identity).toHaveCSS("opacity", available ? "0" : "1");
      await page.clock.runFor(500);
      await expect(identity).toHaveCSS("opacity", available ? "0" : "1");
    } finally {
      release();
    }
    await page.waitForLoadState();
    if (available) {
      await expect(page.locator(shell)).toHaveAttribute(
        "data-home-intro",
        "waiting",
      );
      await expect(identity).toHaveCSS("opacity", "1");
      const svg = identity.locator("svg");
      // The mask must lift onto a prepared frame, never the complete SSR logo.
      expect(
        await svg.evaluate(
          (node) =>
            Number(getComputedStyle(node).opacity) < 1 ||
            [...node.querySelectorAll("[data-logo-part]")].some((part) => {
              const style = getComputedStyle(part);
              return (
                Number(style.opacity) < 1 ||
                Number(style.fillOpacity) < 1 ||
                parseFloat(style.strokeDashoffset) > 0
              );
            }),
        ),
      ).toBe(true);
      await page.clock.runFor(800);
      if (preference === "reduced") {
        const opacity = Number(
          await svg.evaluate((node) => getComputedStyle(node).opacity),
        );
        expect(opacity).toBeGreaterThan(0);
        expect(opacity).toBeLessThan(1);
      }
      await page.clock.runFor(1000);
    }
    await expect(identity).toHaveCSS("opacity", "1");
    await expect(identity.locator("svg")).toHaveCSS("opacity", "1");
  });
}

for (const width of [320, 1280]) {
  test.describe(`homepage sequence ${width}px`, () => {
    test.use({ viewport: { width, height: 720 } });
    for (const preference of ["on", "reduced", "system"] as const) {
      test(`${preference}: logo then menu then content fades`, async ({
        page,
      }, info) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.clock.install();
        await page.clock.pauseAt(new Date(Date.now() + 100));
        await page.emulateMedia({
          reducedMotion: preference === "system" ? "no-preference" : "reduce",
        });
        await page.addInitScript(
          (preference) =>
            localStorage.setItem("funkspace.motion.preference.v1", preference),
          preference,
        );
        await page.goto("/");
        const main = page.locator("main");
        const before = await main.boundingBox();
        if (available) {
          await expect(page.locator(shell)).toHaveAttribute(
            "data-home-intro",
            "waiting",
          );
          await expect(main).toHaveCSS("visibility", "hidden");
          await expect(page.locator('nav[aria-label="Footer"]')).toHaveCSS(
            "visibility",
            "hidden",
          );
          await expect(page.locator("[data-home-menu]")).toHaveCSS(
            "visibility",
            "hidden",
          );
          await page.clock.runFor(800);
          await expect(page.locator(shell)).toHaveAttribute(
            "data-home-intro",
            "waiting",
          );
          await page.screenshot({ path: info.outputPath("logo-first.png") });
          await page.clock.runFor(900);
          await finishMenuFade(page, info.outputPath("menu-fade.png"));
          await expect(page.locator(shell)).toHaveAttribute(
            "data-home-intro",
            "fading",
          );
          const duration = await main.evaluate((node) => {
            const animation = node.getAnimations()[0];
            animation.pause();
            animation.currentTime = 200;
            return animation.effect!.getTiming().duration;
          });
          expect(duration).toBe(800);
          const opacity = Number(
            await main.evaluate((node) => getComputedStyle(node).opacity),
          );
          expect(opacity).toBeGreaterThan(0);
          expect(opacity).toBeLessThan(1);
          await page.screenshot({ path: info.outputPath("content-fade.png") });
          await main.evaluate((node) =>
            node.getAnimations().forEach((animation) => animation.finish()),
          );
          await page.clock.runFor(500);
        }
        await expect(page.locator(shell)).toHaveAttribute(
          "data-home-intro",
          "visible",
        );
        await expect(main).toHaveCSS("opacity", "1");
        await expect(main).toBeVisible();
        expect(await main.boundingBox()).toEqual(before);
        await page
          .getByRole("button", {
            name: "Menu: navigation and settings",
            exact: true,
          })
          .click();
        await page.getByRole("button", { name: "Close", exact: true }).click();
        await expect(page.locator(shell)).toHaveAttribute(
          "data-home-intro",
          "visible",
        );
        expect(errors).toEqual([]);
      });
    }
    test("menu is usable during its fade and interaction completes the reveal", async ({
      page,
    }) => {
      await page.clock.install();
      await page.clock.pauseAt(new Date(Date.now() + 100));
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto("/");
      if (available) {
        await expect(page.locator(shell)).toHaveAttribute(
          "data-home-intro",
          "waiting",
        );
        await page.clock.runFor(1700);
        await expect(page.locator(shell)).toHaveAttribute(
          "data-home-intro",
          "menu",
        );
        await expect(page.locator("main")).toHaveCSS("visibility", "hidden");
      }
      await page
        .getByRole("button", {
          name: "Menu: navigation and settings",
          exact: true,
        })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.locator(shell)).toHaveAttribute(
        "data-home-intro",
        "visible",
      );
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page.clock.runFor(1000);
      await expect(page.locator("main")).toHaveCSS("opacity", "1");
      await expect(page.locator("[data-home-menu]")).toHaveCSS("opacity", "1");
    });
  });
}

for (const scenario of [
  "off",
  "system-reduce",
  "hash",
  "denied-storage",
  "runtime-failure",
  "missing-observer",
] as const) {
  test(`${scenario} keeps content immediately usable`, async ({ page }) => {
    await page.emulateMedia({
      reducedMotion: scenario === "system-reduce" ? "reduce" : "no-preference",
    });
    await page.addInitScript((scenario) => {
      localStorage.setItem(
        "funkspace.motion.preference.v1",
        scenario === "off" ? "off" : "system",
      );
      if (scenario === "denied-storage")
        Storage.prototype.getItem = () => {
          throw Error("blocked");
        };
      if (scenario === "runtime-failure")
        SVGPathElement.prototype.getTotalLength = () => {
          throw Error("blocked");
        };
      if (scenario === "missing-observer")
        Object.defineProperty(window, "IntersectionObserver", {
          value: undefined,
        });
    }, scenario);
    await page.goto(scenario === "hash" ? "/#contact" : "/");
    await expect(page.locator(shell)).toHaveAttribute(
      "data-home-intro",
      "visible",
    );
    await expect(page.locator("main")).toHaveCSS("opacity", "1");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator('header a[href="/"]')).toHaveCSS("opacity", "1");
  });
}

test("keyboard interaction exits a waiting introduction before focus advances", async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 100));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(shell)).toHaveAttribute(
    "data-home-intro",
    "visible",
  );
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("failed hydration opens content after a bounded deadline", async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 100));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  if (available)
    await expect(page.locator(shell)).toHaveAttribute(
      "data-home-intro",
      "preparing",
    );
  await expect(page.locator('header a[href="/"]')).toHaveCSS(
    "opacity",
    available ? "0" : "1",
  );
  await page.clock.runFor(5100);
  await expect(page.locator('header a[href="/"]')).toHaveCSS("opacity", "1");
  await expect(page.locator("main")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
});

test("no JavaScript retains static content and ordinary navigation", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(page.locator("main")).toHaveCSS("opacity", "1");
    await expect(page.locator('header a[href="/"]')).toHaveCSS("opacity", "1");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "About", exact: true })
      .click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("main")).toBeVisible();
  } finally {
    await context.close();
  }
});

test("history restoration and secondary pages never replay the content reveal", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "More about FunkSpace" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator(shell)).toHaveCount(0);
  await page.goBack();
  await expect(page.locator(shell)).toHaveAttribute(
    "data-home-intro",
    "visible",
  );
  await expect(page.locator("main")).toBeVisible();
});
