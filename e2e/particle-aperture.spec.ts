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
  await page.goto(route);
  await expect(page.locator(cover)).toHaveAttribute("data-aperture", "web");
  await page.getByRole("button", { name: "Off", exact: true }).click();
  await page.getByRole("button", { name: "Toggle short frame" }).click();
  await expectCompleteStaticField(page);
  await expect(page.locator(canvas)).toHaveCount(0);
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  await expectCompleteStaticField(page);
  await expect(page.locator(canvas)).toHaveCount(0);
  await page
    .getByRole("button", { name: "Destroy scene", exact: true })
    .click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Resize fixture" }).click();
    await page.getByRole("button", { name: "Toggle short frame" }).click();
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
  await page.getByRole("button", { name: "Toggle short frame" }).click();
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
  for (const theme of ["Default", "Dark", "Muted", "High Contrast", "System"]) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 720 });
      await expect(page.locator(cover)).toHaveCSS("pointer-events", "none");
      const frame = await page.locator("[data-particle-fixture]").boundingBox();
      expect(await page.locator(cover).boundingBox()).toEqual(frame);
    }
  }
  await page.getByRole("button", { name: "Replace aperture" }).click();
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
    await page.getByRole("button", { name: "Replace aperture" }).click();
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
    await page.getByRole("button", { name: "Replace aperture" }).click();
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
  test(failure + " export keeps the valid circle", async ({ page }) => {
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
    await page.getByRole("button", { name: "Replace aperture" }).click();
    await expect(page.locator(cover)).toHaveAttribute(
      "data-aperture",
      "circle",
    );
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
  await page.getByRole("button", { name: "Replace aperture" }).click();
  await expect(page.locator(cover)).toHaveAttribute("data-aperture", "circle");
  await page.getByRole("button", { name: "Replace aperture" }).click();
  release();
  await expect(
    page.locator("[data-aperture-gallery] [data-aperture='technical-diamond']"),
  ).toHaveCount(1);
  await expect(page.locator(cover)).toHaveAttribute("data-aperture", "web");
  await expect(page.locator(`${cover} image`)).toHaveCount(2);
});

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
