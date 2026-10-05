import { expect, test, type Page } from "@playwright/test";
import { MOTION_PREFERENCE_KEY } from "../frontend/domain/motion/MotionPolicy";

const available = process.env.FS35_AVAILABLE === "true";
const canvas = (page: Page) =>
  page.locator("#start canvas[data-particle-canvas]");
async function preference(page: Page, choice: string) {
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Accessibility", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Motion", exact: true })
    .getByRole("button", { name: choice, exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Menu: close navigation and settings",
      exact: true,
    })
    .click();
}
async function instrument(page: Page) {
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.fillRect;
    const stats = {
      frames: 0,
      early: 0,
      points: [] as number[][],
      canvases: new Set<HTMLCanvasElement>(),
    };
    Object.assign(window, { fs45: stats });
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      if (this.canvas.hasAttribute("data-particle-canvas")) {
        stats.frames++;
        stats.points = [];
        stats.canvases.add(this.canvas);
        if (
          document
            .querySelector("[data-home-intro]")
            ?.getAttribute("data-home-intro") !== "visible"
        )
          stats.early++;
      }
      return original.apply(this, args);
    };
    const arc = CanvasRenderingContext2D.prototype.arc;
    CanvasRenderingContext2D.prototype.arc = function (...args) {
      if (this.canvas.hasAttribute("data-particle-canvas"))
        stats.points.push(
          args.slice(0, 3).map((value) => Number(Number(value).toFixed(4))),
        );
      return arc.apply(this, args);
    };
  });
}
const frames = (page: Page) =>
  page.evaluate(
    () => (window as typeof window & { fs45: { frames: number } }).fs45.frames,
  );

for (const choice of ["on", "reduced"]) {
  test(`${choice}: rejected palette reveals solid WEB without preparing Canvas`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(
      ({ key, choice }) => localStorage.setItem(key, choice),
      { key: MOTION_PREFERENCE_KEY, choice },
    );
    await instrument(page);
    await page.route("**/", async (route) => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        body: (await response.text()).replace(
          "</head>",
          '<style id="rejected-scene-palette">[data-start-scene] > div { --fs-color-content-primary: currentColor; }</style></head>',
        ),
      });
    });
    await page.goto("/");
    const scene = page.locator("[data-start-scene]");
    await expect(page.locator("[data-home-intro]")).toHaveAttribute(
      "data-home-intro",
      "visible",
    );
    await expect(scene.locator("[data-scene-aperture]")).toHaveAttribute(
      "data-mask-ready",
      "true",
    );
    await expect(scene).toHaveAttribute("data-scene-reveal", "static");
    await expect(scene).toHaveCSS("opacity", "1");
    await expect(scene.locator("[data-aperture-fallback] path")).toBeVisible();
    await expect(canvas(page)).toHaveCount(0);
    await expect(page.locator("#start [role=status]")).toContainText(
      "Scene colors are unavailable",
    );
    await expect(page.locator("#start button")).toBeDisabled();
    expect(await frames(page)).toBe(0);
    await page.screenshot({
      path: info.outputPath("palette-failure-solid-web.png"),
    });
    // Recover through the existing geometry observation; no preparation override.
    await page
      .locator("#rejected-scene-palette")
      .evaluate((node) => node.remove());
    await page.setViewportSize({ width: 1000, height: 800 });
    if (available) {
      await expect(canvas(page)).toBeVisible();
      await expect(scene.locator("[data-aperture-fallback]")).toHaveCount(0);
      if (choice === "reduced") {
        await expect.poll(() => frames(page)).toBe(1);
        await stopped(page);
      } else await expect.poll(() => frames(page)).toBeGreaterThan(2);
    } else await expect(canvas(page)).toHaveCount(0);
    await expect(scene).toHaveAttribute("data-scene-reveal", "static");
    await expect(scene).toHaveCSS("animation-name", "none");
  });
}

test("menu cycles retain the same frozen Canvas without a particle fallback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await instrument(page);
  await page.goto("/");
  if (!available) {
    await expect(canvas(page)).toHaveCount(0);
    await expect(page.locator("[data-aperture-fallback] path")).toBeVisible();
    return;
  }
  await expect(canvas(page)).toBeVisible();
  await expect.poll(() => frames(page)).toBeGreaterThan(2);
  const owner = await canvas(page).elementHandle();
  for (let i = 0; i < 3; i++) {
    await page
      .getByRole("button", {
        name: "Menu: navigation and settings",
        exact: true,
      })
      .click();
    await expect(page.locator("dialog[open]")).toBeVisible();
    await stopped(page);
    await expect(
      page.locator("#start [data-aperture-fallback] path"),
    ).toHaveCount(0);
    await expect(canvas(page)).toBeVisible();
    await expect(
      page.locator("#start line, #start circle, #start [data-particle-static]"),
    ).toHaveCount(0);
    await page
      .getByRole("button", {
        name: "Menu: close navigation and settings",
        exact: true,
      })
      .click();
    await expect(canvas(page)).toBeVisible();
    await expect(page.locator("#start [data-aperture-fallback]")).toHaveCount(
      0,
    );
  }
  expect(
    await owner!.evaluate(
      (node) =>
        node === document.querySelector("#start canvas[data-particle-canvas]"),
    ),
  ).toBe(true);
});
async function stopped(page: Page) {
  await page.waitForTimeout(100);
  const before = await frames(page);
  await page.waitForTimeout(200);
  expect(await frames(page)).toBe(before);
}
for (const choice of ["system", "on", "reduced", "off"]) {
  for (const reducedMotion of ["reduce", "no-preference"] as const) {
    test(`${choice} / OS ${reducedMotion} with actual build flag`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion });
      await page.addInitScript(
        ({ key, choice }) => localStorage.setItem(key, choice),
        { key: MOTION_PREFERENCE_KEY, choice },
      );
      await instrument(page);
      await page.goto("/");
      await expect(page.locator("[data-home-intro]")).toHaveAttribute(
        "data-home-intro",
        "visible",
      );
      const runs =
        available &&
        (choice === "on" ||
          (choice === "system" && reducedMotion === "no-preference"));
      if (runs) {
        await expect(canvas(page)).toBeVisible();
        await expect.poll(() => frames(page)).toBeGreaterThan(2);
      } else if (available && (choice === "reduced" || choice === "off")) {
        await expect(canvas(page)).toBeVisible();
        await expect.poll(() => frames(page)).toBe(1);
        await stopped(page);
        await expect(page.locator("#start button")).toBeDisabled();
        await expect(page.locator("#start [role=status]")).toContainText(
          choice === "off"
            ? "Decorative animation is off"
            : "Reduced motion is selected",
        );
        await expect(page.locator("[data-aperture-fallback]")).toHaveCount(0);
        await expect(page.locator("[data-start-scene]")).toHaveAttribute(
          "data-scene-reveal",
          "static",
        );
      } else {
        await expect(page.locator("#start button")).toBeDisabled();
        await expect(canvas(page)).toHaveCount(0);
        expect(await frames(page)).toBe(0);
        await expect(
          page.locator("[data-aperture-fallback] path"),
        ).toBeVisible();
      }
      expect(
        await page.evaluate(
          () =>
            (window as typeof window & { fs45: { early: number } }).fs45.early,
        ),
      ).toBe(0);
    });
  }
}

for (const outcome of ["draw", "timeout"] as const) {
  test(`WEB stays concealed during a delayed Canvas import: ${outcome}`, async ({
    page,
  }) => {
    if (!available) return;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await instrument(page);
    // Hold the existing Canvas chunk, not the intro or shared policy. Find it from
    // its compiled module content instead of assuming a build-specific filename.
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    let intercepted = false;
    await page.route("**/_next/static/chunks/*.js", async (route) => {
      const response = await route.fetch();
      const body = await response.text();
      if (body.includes("particleCanvas")) {
        intercepted = true;
        await held;
      }
      await route.fulfill({ response, body });
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const scene = page.locator("[data-start-scene]");
    await expect(page.locator("[data-home-intro]")).toHaveAttribute(
      "data-home-intro",
      "visible",
    );
    await expect.poll(() => intercepted).toBe(true);
    await expect(scene).toHaveAttribute("data-scene-reveal", "waiting");
    await expect(scene).toHaveCSS("opacity", "0");
    expect(await frames(page)).toBe(0);
    await expect(
      page.getByRole("button", {
        name: "Menu: navigation and settings",
        exact: true,
      }),
    ).toBeVisible();
    if (outcome === "timeout") {
      await expect(page.locator("#start [role=status]")).toContainText(
        "unavailable",
        { timeout: 8000 },
      );
      await expect(scene).toHaveAttribute("data-scene-reveal", "static");
      await expect(scene).toHaveCSS("opacity", "1");
      await expect(page.locator("[data-aperture-fallback] path")).toBeVisible();
      release();
      await page.waitForLoadState("networkidle");
      await expect(canvas(page)).toHaveCount(0);
      expect(await frames(page)).toBe(0);
      return;
    }
    release();
    await expect(scene).toHaveAttribute("data-scene-reveal", "fade");
    await expect(scene).toHaveCSS("opacity", "1");
    await expect.poll(() => frames(page)).toBeGreaterThan(0);
    await expect(page.locator("[data-aperture-fallback]")).toHaveCount(0);
    await page.reload();
    await expect(scene).toHaveAttribute("data-scene-reveal", "fade");
    await expect(scene).toHaveCSS("opacity", "1");
  });
}

for (const stillPreference of ["reduced", "off"] as const) {
  test(`${stillPreference} keeps one still Canvas through recolor, resize, occlusion and On transitions`, async ({
    page,
  }, testInfo) => {
    if (!available) return;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(
      (value) => localStorage.setItem("funkspace.motion.preference.v1", value),
      stillPreference,
    );
    await instrument(page);
    await page.goto("/");
    await expect(canvas(page)).toBeVisible();
    await stopped(page);
    const owner = await canvas(page).elementHandle();
    await page.setViewportSize({ width: 900, height: 740 });
    await expect.poll(() => frames(page)).toBeGreaterThan(1);
    await stopped(page);
    await page
      .getByRole("button", {
        name: "Menu: navigation and settings",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "Accessibility", exact: true })
      .click();
    const before = await frames(page);
    await page.getByRole("button", { name: "Dark", exact: true }).click();
    await stopped(page);
    expect(await frames(page)).toBe(before + 1);
    await page
      .getByRole("button", {
        name: "Menu: close navigation and settings",
        exact: true,
      })
      .click();
    await expect.poll(() => frames(page)).toBe(before + 1);
    await stopped(page);
    await page.screenshot({
      path: testInfo.outputPath(`${stillPreference}-still-canvas.png`),
    });
    await preference(page, "On");
    await expect.poll(() => frames(page)).toBeGreaterThan(before + 3);
    await preference(page, stillPreference === "off" ? "Off" : "Reduced");
    await stopped(page);
    expect(
      await owner!.evaluate(
        (node) => node === document.querySelector("#start canvas"),
      ),
    ).toBe(true);
    await expect(page.locator("[data-start-scene]")).toHaveAttribute(
      "data-scene-reveal",
      "static",
    );
  });
}

test("Pause, all themes, settings occlusion and policy transitions preserve the mounted scene", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await instrument(page);
  await page.goto("/");
  if (!available) {
    await expect(canvas(page)).toHaveCount(0);
    return;
  }
  await expect(canvas(page)).toBeVisible();
  await page.getByRole("button", { name: "Pause animation" }).click();
  await stopped(page);
  const scene = await canvas(page).elementHandle();
  for (const choice of ["Off", "Reduced", "System", "On"]) {
    await preference(page, choice);
    await expect(
      page.getByRole("button", { name: "Resume animation" }),
    ).toBeVisible();
    await stopped(page);
  }
  for (const theme of ["Dark", "Muted", "High Contrast", "Light"]) {
    const points = await page.evaluate(
      () =>
        (window as typeof window & { fs45: { points: number[][] } }).fs45
          .points,
    );
    await page
      .getByRole("button", {
        name: "Menu: navigation and settings",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "Accessibility", exact: true })
      .click();
    await page.getByRole("button", { name: theme, exact: true }).click();
    await stopped(page);
    await page
      .getByRole("button", {
        name: "Menu: close navigation and settings",
        exact: true,
      })
      .click();
    await expect(
      page.getByRole("button", { name: "Resume animation" }),
    ).toBeEnabled();
    await expect
      .poll(() =>
        canvas(page).evaluate((node) => {
          const c = node as HTMLCanvasElement;
          const ctx = c.getContext("2d")!;
          return ctx.getImageData(0, 0, 1, 1).data[3];
        }),
      )
      .toBe(255);
    expect(
      await page.evaluate(
        () =>
          (window as typeof window & { fs45: { points: number[][] } }).fs45
            .points,
      ),
    ).toEqual(points);
    expect(
      await canvas(page).evaluate((node) => {
        const scene = node as HTMLCanvasElement;
        const expected = document.createElement("canvas").getContext("2d")!;
        expected.fillStyle = getComputedStyle(scene)
          .getPropertyValue("--fs-color-content-primary")
          .trim();
        return scene.getContext("2d")!.fillStyle === expected.fillStyle;
      }),
    ).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`scene-${theme}.png`) });
    await stopped(page);
  }
  expect(
    await scene!.evaluate(
      (node) => node === document.querySelector("#start canvas"),
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () =>
        (
          window as typeof window & {
            fs45: { canvases: Set<HTMLCanvasElement> };
          }
        ).fs45.canvases.size,
    ),
  ).toBe(1);
  await page.getByRole("button", { name: "Resume animation" }).click();
  const before = await frames(page);
  await expect.poll(() => frames(page)).toBeGreaterThan(before + 2);
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await stopped(page);
  await page
    .getByRole("button", {
      name: "Menu: close navigation and settings",
      exact: true,
    })
    .click();
  const closed = await frames(page);
  await expect.poll(() => frames(page)).toBeGreaterThan(closed + 2);
  await expect(page.locator("[data-home-intro]")).toHaveAttribute(
    "data-home-intro",
    "visible",
  );
});

test("failed Canvas retains static artwork without retry", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof original>
    ) {
      if (this.hasAttribute("data-particle-canvas")) return null;
      return original.apply(this, args);
    } as typeof original;
    localStorage.setItem("funkspace.motion.preference.v1", "on");
  });
  await page.goto("/");
  if (available)
    await expect(page.locator("#start [role=status]")).toContainText(
      "unavailable",
    );
  await expect(page.locator("[data-aperture-fallback] path")).toBeVisible();
  await expect(canvas(page)).toHaveCount(0);
  await expect(page.locator("#start button")).toBeDisabled();
});

test("blocked storage and unavailable OS signals retain static System artwork", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
    Object.defineProperty(window, "matchMedia", { value: undefined });
  });
  await page.goto("/");
  await expect(page.locator("#start button")).toBeDisabled();
  await expect(page.locator("[data-aperture-fallback] path")).toBeVisible();
  await expect(canvas(page)).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Aperture - 1", exact: true }),
  ).toBeVisible();
});

test("context loss replaces a drawn scene with solid WEB without a retry", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await instrument(page);
  await page.goto("/");
  if (available) {
    await expect(canvas(page)).toBeVisible();
    await expect.poll(() => frames(page)).toBeGreaterThan(2);
    await canvas(page).evaluate((node) =>
      node.dispatchEvent(new Event("contextlost", { cancelable: true })),
    );
    await expect(page.getByRole("status")).toContainText("unavailable");
  }
  await expect(canvas(page)).toHaveCount(0);
  await expect(
    page.locator("#start [data-aperture-fallback] path"),
  ).toBeVisible();
  await expect(page.locator("#start line, #start circle")).toHaveCount(0);
  await stopped(page);
});

test("actual On scene suspends for document/offscreen visibility and responds to live OS changes", async ({
  page,
}) => {
  // Without visible status copy, the shorter page can leave a sliver of WEB
  // onscreen at 720px height even after scrolling to Contact.
  await page.setViewportSize({ width: 1280, height: 600 });
  await instrument(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  if (!available) {
    await expect(canvas(page)).toHaveCount(0);
    return;
  }
  await expect(canvas(page)).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await stopped(page);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const restored = await frames(page);
  await expect.poll(() => frames(page)).toBeGreaterThan(restored + 2);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      canvas(page).evaluate((node) => node.getBoundingClientRect().bottom),
    )
    .toBeLessThan(0);
  await stopped(page);
  await page.locator("#start").scrollIntoViewIfNeeded();
  const returned = await frames(page);
  await expect.poll(() => frames(page)).toBeGreaterThan(returned + 2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Media emulation resolves before the browser necessarily delivers change.
  // Assert the policy transition itself before measuring its stopped frames.
  await expect(page.getByRole("status")).toContainText(
    "Your device requests reduced motion",
  );
  await stopped(page);
  await expect(page.locator("[data-aperture-fallback] path")).toBeVisible();
  await preference(page, "On");
  const overridden = await frames(page);
  await expect.poll(() => frames(page)).toBeGreaterThan(overridden + 2);
  await page.getByRole("button", { name: "Pause animation" }).click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await stopped(page);
  await expect(
    page.getByRole("button", { name: "Resume animation" }),
  ).toBeEnabled();
});
