import {
  DEFAULT_PARTICLE_CONFIG,
  MAX_PARTICLE_COUNT,
  PARTICLE_SETTINGS,
} from "../frontend/domain/particles/ParticleSettings";
import { expect, test, type Page } from "@playwright/test";

const alternateCount =
  DEFAULT_PARTICLE_CONFIG.count === MAX_PARTICLE_COUNT
    ? Math.max(
        PARTICLE_SETTINGS.controls.count.min,
        Math.floor(
          MAX_PARTICLE_COUNT / 2 / PARTICLE_SETTINGS.controls.count.step,
        ) * PARTICLE_SETTINGS.controls.count.step,
      )
    : MAX_PARTICLE_COUNT;
const available = process.env.FS35_AVAILABLE === "true";
const route = "/sandbox/particles/lifecycle";
const canvas = "canvas[data-particle-canvas]";
const still = "[data-particle-static]";
const host = "[data-particle-fixture]";

async function setup(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem("funkspace.motion.preference.v1", "on");
    const target = window as unknown as { particleDraws: number };
    target.particleDraws = 0;
    const original = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      if (
        this.canvas instanceof HTMLCanvasElement &&
        this.canvas.hasAttribute("data-particle-canvas")
      )
        target.particleDraws++;
      return original.apply(this, args);
    };
  });
  await page.goto(route);
  await expect(
    page.getByRole("button", { name: "On", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
}
const draws = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { particleDraws: number }).particleDraws,
  );

for (const width of [320, 1280]) {
  test(`${width}px: proximity lines appear in static and permitted Canvas output`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 720 });
    await page.addInitScript(() => {
      const probe = window as unknown as {
        connectionStrokes: number;
        opaqueParticles: boolean;
      };
      probe.connectionStrokes = 0;
      probe.opaqueParticles = true;
      const stroke = CanvasRenderingContext2D.prototype.stroke;
      const arc = CanvasRenderingContext2D.prototype.arc;
      CanvasRenderingContext2D.prototype.stroke = function (path?: Path2D) {
        if (
          this.canvas instanceof HTMLCanvasElement &&
          this.canvas.hasAttribute("data-particle-canvas")
        )
          probe.connectionStrokes++;
        return Reflect.apply(stroke, this, path === undefined ? [] : [path]);
      };
      CanvasRenderingContext2D.prototype.arc = function (...args) {
        if (
          this.canvas instanceof HTMLCanvasElement &&
          this.canvas.hasAttribute("data-particle-canvas")
        )
          probe.opaqueParticles &&= this.globalAlpha === 1;
        return arc.apply(this, args);
      };
    });
    await setup(page);
    expect(await page.locator(`${still} line`).count()).toBeGreaterThan(0);
    await page
      .getByRole("button", { name: "Start scene", exact: true })
      .click();
    await page.locator(host).scrollIntoViewIfNeeded();
    if (available) {
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              (window as unknown as { connectionStrokes: number })
                .connectionStrokes,
          ),
        )
        .toBeGreaterThan(0);
      expect(
        await page.evaluate(
          () =>
            (window as unknown as { opaqueParticles: boolean }).opaqueParticles,
        ),
      ).toBe(true);
    } else {
      await expect(page.locator(still)).toBeVisible();
      expect(
        await page.evaluate(
          () =>
            (window as unknown as { connectionStrokes: number })
              .connectionStrokes,
        ),
      ).toBe(0);
    }
  });
}

test("explicit start, local Pause, one still redraw, resize and remount", async ({
  page,
}) => {
  await setup(page);
  await expect(page.locator(still)).toBeVisible();
  await expect(page.locator(canvas)).toHaveCount(0);
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  if (!available) {
    await expect(page.getByRole("status")).toContainText("unprepared");
    await expect(page.locator(canvas)).toHaveCount(0);
    await expect(page.locator(still)).toBeVisible();
    return;
  }
  await expect(page.locator(canvas)).toBeVisible();
  await expect.poll(() => draws(page)).toBeGreaterThan(2);
  await page.getByRole("button", { name: "Pause scene", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    `${DEFAULT_PARTICLE_CONFIG.count} particles`,
  );
  const held = await draws(page);
  await page.waitForTimeout(150);
  expect(await draws(page)).toBe(held);
  await page
    .getByRole("button", { name: "Toggle particle count", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    `${alternateCount} particles`,
  );
  await expect(page.locator(`${still} circle`)).toHaveCount(alternateCount);
  await expect.poll(() => draws(page)).toBe(held + 1);
  await page.waitForTimeout(100);
  expect(await draws(page)).toBe(held + 1);
  await page
    .getByRole("button", { name: "Toggle particle count", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    `${DEFAULT_PARTICLE_CONFIG.count} particles`,
  );
  await expect(page.locator(`${still} circle`)).toHaveCount(
    DEFAULT_PARTICLE_CONFIG.count,
  );
  await expect.poll(() => draws(page)).toBe(held + 2);
  await page
    .getByRole("button", { name: "Resize fixture", exact: true })
    .click();
  await expect(page.locator(canvas)).toBeVisible();
  expect(
    await page
      .locator(canvas)
      .evaluate((element) => (element as HTMLCanvasElement).width),
  ).toBeLessThanOrEqual(640);
  await page
    .getByRole("button", { name: "Reset seeded state", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Resume scene", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Destroy scene", exact: true })
    .click();
  await expect(page.locator(canvas)).toHaveCount(0);
  await expect(page.locator(still)).toBeVisible();
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  await expect(page.locator(canvas)).toHaveCount(1);
  await expect(page.locator(canvas)).toBeVisible();
});

test("all denied motion choices retain an independent static representation", async ({
  page,
}) => {
  await setup(page);
  for (const choice of ["Off", "Reduced", "Follow system"]) {
    await page.getByRole("button", { name: choice, exact: true }).click();
    await page
      .getByRole("button", { name: "Start scene", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("unprepared");
    await expect(page.locator(still)).toBeVisible();
    await expect(page.locator(canvas)).toHaveCount(0);
    await page
      .getByRole("button", { name: "Destroy scene", exact: true })
      .click();
  }
});

test("null Canvas context fails once with complete fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await setup(page);
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    available ? "failed" : "unprepared",
  );
  await expect(page.locator(still)).toBeVisible();
  await expect(page.locator(canvas)).toHaveCount(0);
  await page.getByRole("button", { name: "Off", exact: true }).click();
  await page.getByRole("button", { name: "On", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    available ? "failed" : "unprepared",
  );
});

test("zero geometry recovers, offscreen suspends, context loss is terminal", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  if (!available) {
    await expect(page.locator(canvas)).toHaveCount(0);
    return;
  }
  await expect(page.locator(canvas)).toBeVisible();
  await page.locator(host).evaluate((element) => {
    (element as HTMLElement).style.width = "0px";
  });
  await expect(page.locator(canvas)).not.toBeVisible();
  await page.waitForTimeout(50);
  await expect(page.getByRole("status")).toContainText(
    `${DEFAULT_PARTICLE_CONFIG.count} particles`,
  );
  const held = await draws(page);
  await page.waitForTimeout(100);
  expect(await draws(page)).toBe(held);
  await page.locator(host).evaluate((element) => {
    (element as HTMLElement).style.width = "";
  });
  await expect(page.locator(canvas)).toBeVisible();
  await page.locator(host).evaluate((element) => {
    (element as HTMLElement).style.marginTop = "200vh";
  });
  await page.waitForTimeout(100);
  const offscreen = await draws(page);
  await page.waitForTimeout(100);
  expect(await draws(page)).toBe(offscreen);
  await page.locator(host).evaluate((element) => {
    (element as HTMLElement).style.marginTop = "";
  });
  await expect(page.locator(canvas)).toBeVisible();
  await page.locator(canvas).dispatchEvent("contextlost");
  await expect(page.getByRole("status")).toContainText("failed");
  await expect(page.locator(canvas)).toHaveCount(0);
  await expect(page.locator(still)).toBeVisible();
});

test("static fixture remains visible without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}${route}`);
    await expect(page.locator(still)).toBeVisible();
    await expect(page.locator(`${still} circle`)).toHaveCount(
      DEFAULT_PARTICLE_CONFIG.count,
    );
    await expect(page.locator(canvas)).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test("resize cycles compact, large and standard without replacing the paused runtime", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await setup(page);
  await page.getByRole("button", { name: "Start scene", exact: true }).click();
  if (available) {
    await expect(page.locator(canvas)).toBeVisible();
    await page
      .getByRole("button", { name: "Pause scene", exact: true })
      .click();
  }
  const original = available
    ? await page.locator(canvas).elementHandle()
    : null;
  for (const [size, width] of [
    ["compact", 320],
    ["large", 1280],
    ["standard", 640],
  ] as const) {
    await page
      .getByRole("button", { name: "Resize fixture", exact: true })
      .click();
    await expect(page.locator(host)).toHaveAttribute("data-fixture-size", size);
    await expect
      .poll(async () => (await page.locator(host).boundingBox())?.width)
      .toBe(width);
    await expect(page.getByRole("status")).toContainText(
      `${DEFAULT_PARTICLE_CONFIG.count} particles`,
    );
    if (original) {
      expect(
        await original.evaluate(
          (node) =>
            node === document.querySelector("canvas[data-particle-canvas]"),
        ),
      ).toBe(true);
      await expect(
        page.getByRole("button", { name: "Resume scene", exact: true }),
      ).toBeVisible();
      const pixels = await page
        .locator(canvas)
        .evaluate(
          (node) =>
            (node as HTMLCanvasElement).width *
            (node as HTMLCanvasElement).height,
        );
      expect(pixels).toBeLessThanOrEqual(4_000_000);
    }
  }
});
