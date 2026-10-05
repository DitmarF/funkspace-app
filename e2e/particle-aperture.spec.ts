import { expect, test, type Page } from "@playwright/test";

const route = "/sandbox/particles/aperture";
const cover = "[data-particle-fixture] [data-scene-aperture]";
const canvas = "canvas[data-particle-canvas]";
const available = process.env.FS35_AVAILABLE === "true";

async function expectCompleteStaticField(page: Page) {
  await expect(page.locator("[data-particle-static]")).toBeVisible();
  const field = await page.locator("[data-particle-static]").evaluate((svg) => {
    const frame = svg.getBoundingClientRect();
    const circles = [...svg.querySelectorAll("circle")].map((circle) => {
      const rect = circle.getBoundingClientRect();
      const geometry = circle.getBBox();
      const transform = circle.getScreenCTM()!;
      return {
        x: (rect.x + rect.width / 2 - frame.x) / frame.width,
        y: (rect.y + rect.height / 2 - frame.y) / frame.height,
        // Firefox rounds DOM rectangles outward to layout units. SVG geometry
        // and its actual screen transform test scaling without that rounding.
        width: geometry.width * Math.hypot(transform.a, transform.b),
        height: geometry.height * Math.hypot(transform.c, transform.d),
        radius: Number(circle.getAttribute("r")),
      };
    });
    return circles;
  });
  // Detect letterboxing that removes particles from the outer W/B regions.
  expect(Math.min(...field.map((p) => p.x))).toBeLessThan(0.1);
  expect(Math.max(...field.map((p) => p.x))).toBeGreaterThan(0.9);
  expect(Math.min(...field.map((p) => p.y))).toBeLessThan(0.1);
  expect(Math.max(...field.map((p) => p.y))).toBeGreaterThan(0.9);
  for (const particle of field) {
    expect(particle.width).toBeCloseTo(2 * particle.radius, 3);
    expect(particle.height).toBeCloseTo(2 * particle.radius, 3);
  }
}

test("static WEB fills short frames before Start, while denied and after destroy/resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await expect(page.locator(cover)).toHaveAttribute("data-aperture", "web");
  await page
    .getByRole("group", { name: "Motion", exact: true })
    .getByRole("button", { name: "System", exact: true })
    .click();
  await page.getByRole("checkbox", { name: "Short frame (4:1)" }).check();
  await expectCompleteStaticField(page);
  await expect(page.locator(canvas)).toHaveCount(0);
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  await expectCompleteStaticField(page);
  await expect(page.locator(canvas)).toHaveCount(0);
  await page
    .getByRole("button", { name: "Destroy scene", exact: true })
    .click();
  for (const [i, size] of ["compact", "large", "standard"].entries()) {
    await page
      .getByRole("combobox", { name: "Frame width" })
      .selectOption(size);
    await page
      .getByRole("checkbox", { name: "Short frame (4:1)" })
      .setChecked(i % 2 !== 0);
    await expectCompleteStaticField(page);
    await expect(page.locator(canvas)).toHaveCount(0);
  }
});

test("failed runtime keeps the full static field across later aspect changes", async ({
  page,
}) => {
  await page.goto(route);
  await expect(page.locator(cover)).toHaveAttribute("data-aperture", "web");
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  if (available) {
    await expect(page.locator(canvas)).toBeVisible();
    await page.locator(canvas).dispatchEvent("contextlost");
    await expect(page.getByRole("status")).toContainText("failed");
  }
  await page.getByRole("checkbox", { name: "Short frame (4:1)" }).check();
  await expectCompleteStaticField(page);
  await expect(page.locator(canvas)).toHaveCount(0);
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("funkspace.motion.preference.v1", "on"),
  );
});

test("native embedding, stable IDs, theme/layout and non-intercepting decoration", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(route);
  await expect(page.locator(cover)).toHaveAttribute("data-mask-ready", "true");
  await expect(
    page.locator("[data-aperture-gallery] [data-aperture='technical-diamond']"),
  ).toHaveCount(1);
  const ids = await page
    .locator("[id]")
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(new Set(ids).size).toBe(ids.length);
  for (const theme of ["Light", "Dark", "Muted", "High Contrast", "System"]) {
    await page
      .getByRole("group", { name: "Theme", exact: true })
      .getByRole("button", { name: theme, exact: true })
      .click();
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 720 });
      await expect(page.locator(cover)).toHaveCSS("pointer-events", "none");
      const frame = await page.locator("[data-particle-fixture]").boundingBox();
      expect(await page.locator(cover).boundingBox()).toEqual(frame);
    }
  }
  await page
    .getByRole("combobox", { name: "Aperture" })
    .selectOption("technical-diamond");
  await expect(page.locator(cover)).toHaveAttribute(
    "data-aperture",
    "technical-diamond",
  );
  expect(errors).toEqual([]);
});

test("mounted replacement preserves the same Canvas and exact paused pixels", async ({
  page,
}) => {
  await page.goto(route);
  await expect(page.locator(cover)).toHaveAttribute("data-mask-ready", "true");
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  if (!available) {
    await expect(page.locator(canvas)).toHaveCount(0);
    await page
      .getByRole("combobox", { name: "Aperture" })
      .selectOption("technical-diamond");
    await expect(page.locator(cover)).toHaveAttribute(
      "data-aperture",
      "technical-diamond",
    );
    return;
  }
  await expect(page.locator(canvas)).toBeVisible();
  await page.getByRole("button", { name: "Pause scene", exact: true }).click();
  const element = await page.locator(canvas).elementHandle();
  const before = await page
    .locator(canvas)
    .evaluate((node) => (node as HTMLCanvasElement).toDataURL());
  for (let i = 0; i < 4; i++) {
    await page
      .getByRole("combobox", { name: "Aperture" })
      .selectOption(i % 2 === 0 ? "technical-diamond" : "web");
    await expect(page.locator(cover)).toHaveAttribute(
      "data-aperture",
      i % 2 === 0 ? "technical-diamond" : "web",
    );
    expect(
      await page
        .locator(canvas)
        .evaluate((node, previous) => node === previous, element),
    ).toBe(true);
    expect(
      await page
        .locator(canvas)
        .evaluate((node) => (node as HTMLCanvasElement).toDataURL()),
    ).toBe(before);
    await expect(
      page.getByRole("button", { name: "Resume scene", exact: true }),
    ).toBeVisible();
  }
  await page.getByRole("button", { name: "Resume scene", exact: true }).click();
  await expect
    .poll(() =>
      page
        .locator(canvas)
        .evaluate((node) => (node as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(before);
});

for (const failure of ["missing", "malformed", "forbidden", "empty"]) {
  test(failure + " export keeps the built-in WEB", async ({ page }) => {
    await page.route("**/scene-apertures/technical-diamond.svg", (request) =>
      request.fulfill({
        status: failure === "missing" ? 404 : 200,
        contentType: "image/svg+xml",
        body:
          failure === "malformed"
            ? "<svg"
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${failure === "forbidden" ? "<script>alert(1)</script>" : ""}</svg>`,
      }),
    );
    await page.goto(route);
    await expect(page.locator(cover)).toHaveAttribute(
      "data-mask-ready",
      "true",
    );
    await page
      .getByRole("combobox", { name: "Aperture" })
      .selectOption("technical-diamond");
    await expect(page.locator(cover)).toHaveAttribute("data-aperture", "web");
    await expect(page.locator(`${cover} image`)).toHaveCount(1);
  });
}

test("delayed and stale responses do not replace the newer WEB selection", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(
    "**/scene-apertures/technical-diamond.svg",
    async (request) => {
      await gate;
      try {
        await request.continue();
      } catch {
        /* Abort from replacement is expected. */
      }
    },
  );
  await page.goto(route);
  await expect(page.locator(cover)).toHaveAttribute("data-mask-ready", "true");
  await page
    .getByRole("combobox", { name: "Aperture" })
    .selectOption("technical-diamond");
  await expect(page.locator(cover)).toHaveAttribute("data-aperture", "web");
  await page.getByRole("combobox", { name: "Aperture" }).selectOption("web");
  release();
  await expect(
    page.locator("[data-aperture-gallery] [data-aperture='technical-diamond']"),
  ).toHaveCount(1);
  await expect(page.locator(cover)).toHaveAttribute("data-aperture", "web");
  await expect(page.locator(`${cover} image`)).toHaveCount(1);
});

for (const sceneRoute of ["/", "/animations/aperture"]) {
  test(`${sceneRoute}: WEB grows only on mobile, including without JavaScript`, async ({
    browser,
  }, info) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto(sceneRoute);
      for (const width of [320, 375, 639, 640, 768, 1280]) {
        await page.setViewportSize({ width, height: 850 });
        const aperture = page.locator(
          "[data-start-scene] [data-scene-aperture]",
        );
        const geometry = await aperture.evaluate((element) => {
          const cover = element.getBoundingClientRect();
          // The unused mask image has no rendered bounds in the no-JS solid
          // state. Compare its declared fitting with the visible fallback.
          const image = element.querySelector("image")!;
          const fallbackElement = element.querySelector(
            "[data-aperture-fallback]",
          )!;
          const fallback = fallbackElement.getBoundingClientRect();
          const path = element
            .querySelector("[data-aperture-fallback] path")!
            .getBoundingClientRect();
          return {
            width: fallback.width / cover.width,
            aspect: fallback.width / fallback.height,
            centeredY:
              fallback.y + fallback.height / 2 - (cover.y + cover.height / 2),
            inset: (fallback.x - cover.x) / cover.width,
            matchingFallback:
              ["x", "y", "width", "height", "preserveAspectRatio"].every(
                (attribute) =>
                  image.getAttribute(attribute) ===
                  fallbackElement.getAttribute(attribute),
              ) &&
              getComputedStyle(image.parentElement!).transform ===
                getComputedStyle(fallbackElement.parentElement!).transform,
            contained:
              path.left >= cover.left &&
              path.right <= cover.right &&
              path.top >= cover.top &&
              path.bottom <= cover.bottom,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        const fraction = width < 640 ? 0.96 : 0.8;
        expect(geometry.width).toBeCloseTo(fraction, 3);
        expect(geometry.aspect).toBeCloseTo(2347 / 660, 3);
        expect(geometry.centeredY).toBeCloseTo(0, 2);
        expect(geometry.inset).toBeCloseTo((1 - fraction) / 2, 3);
        expect(geometry.matchingFallback).toBe(true);
        expect(geometry.contained).toBe(true);
        expect(geometry.overflow).toBe(false);
        await expect(page.locator("[data-start-scene] canvas")).toHaveCount(0);
        if (width === 375 || width === 768)
          await page.screenshot({
            path: info.outputPath(`static-${width}.png`),
          });
      }
    } finally {
      await context.close();
    }
  });

  for (const assetState of ["missing", "delayed"] as const) {
    test(`${sceneRoute}: ${assetState} WEB export cannot replace the built-in WEB`, async ({
      page,
    }, info) => {
      await page.addInitScript(
        (theme) => localStorage.setItem("theme", theme),
        assetState === "missing" ? "dark" : "default",
      );
      await page.setViewportSize({
        width: assetState === "missing" ? 1280 : 375,
        height: 850,
      });
      let requests = 0;
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route(
        "**/scene-apertures/web-work-sans.svg",
        async (request) => {
          requests++;
          if (assetState === "delayed") await gate;
          await request.fulfill({ status: 404, body: "" });
        },
      );
      try {
        await page.goto(sceneRoute);
        const scene = page.locator("[data-start-scene]");
        const aperture = scene.locator("[data-scene-aperture]");
        await scene.scrollIntoViewIfNeeded();
        await expect(aperture).toHaveAttribute("data-aperture", "web");
        await expect(aperture).toHaveAttribute("data-mask-ready", "true");
        const opening = await aperture.locator("mask image").boundingBox();
        const coverBox = await aperture.boundingBox();
        expect(opening!.width / coverBox!.width).toBeCloseTo(
          assetState === "delayed" ? 0.96 : 0.8,
          3,
        );
        const href = await aperture.locator("mask image").getAttribute("href");
        expect(decodeURIComponent(href!)).toContain('<path d="M187 660');
        expect(decodeURIComponent(href!)).not.toContain("<circle");
        await expect(aperture.locator("circle")).toHaveCount(0);
        if (available) await expect(scene.locator(canvas)).toBeVisible();
        else {
          await expect(scene.locator(canvas)).toHaveCount(0);
          await expect(
            aperture.locator("[data-aperture-fallback] path"),
          ).toBeVisible();
        }
        expect(requests).toBe(0);
        await page.screenshot({ path: info.outputPath("built-in-web.png") });
      } finally {
        release();
        await page.unrouteAll({ behavior: "wait" });
      }
    });
  }
}

test("mask capability failure prevents Canvas preparation and leaves independent solid art", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto(route);
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  await expect(page.locator(cover)).toHaveAttribute("data-mask-ready", "false");
  await expect(page.locator(`${cover} [data-aperture-fallback]`)).toBeVisible();
  await expect(page.locator(canvas)).toHaveCount(0);
});

test("no-JS retains complete mask-independent art", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}${route}`);
    await expect(
      page.locator(`${cover} [data-aperture-fallback]`),
    ).toBeVisible();
    await expect(page.locator(canvas)).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test("a late built-in image failure hides an already mounted scene", async ({
  page,
}) => {
  await page.goto(route);
  await expect(page.locator(cover)).toHaveAttribute("data-mask-ready", "true");
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  if (available) await expect(page.locator(canvas)).toBeVisible();
  await page.locator(`${cover} image`).first().dispatchEvent("error");
  await expect(page.locator(cover)).toHaveAttribute("data-mask-ready", "false");
  await expect(page.locator(`${cover} [data-aperture-fallback]`)).toBeVisible();
  if (available) await expect(page.locator(canvas)).not.toBeVisible();
  else await expect(page.locator(canvas)).toHaveCount(0);
});
