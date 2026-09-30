import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  DEFAULT_PARTICLE_CONFIG,
  PARTICLE_SETTINGS,
} from "../frontend/domain/particles/ParticleSettings";

const available = process.env.FS35_AVAILABLE === "true";
const route = "/animations/aperture";
const custom = (p: Page) =>
  p.getByRole("button", { name: "Customize animation", exact: true });
const modal = (p: Page) =>
  p.getByRole("dialog", { name: "Customize animation", exact: true });
const canvas = (p: Page) =>
  p.locator("[data-start-scene] canvas[data-particle-canvas]");
const frameCount = (p: Page) =>
  p.evaluate(
    () => (window as typeof window & { fs46: { frames: number } }).fs46.frames,
  );
async function setup(p: Page, choice = "on") {
  await p.emulateMedia({ reducedMotion: "no-preference" });
  await p.addInitScript((choice) => {
    localStorage.setItem("funkspace.motion.preference.v1", choice);
    const stats = {
      frames: 0,
      writes: [] as string[],
      dialogs: [] as string[],
      maxModal: 0,
      focuses: [] as string[],
    };
    Object.assign(window, { fs46: stats });
    const fill = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      if (this.canvas.hasAttribute("data-particle-canvas")) stats.frames++;
      return fill.apply(this, args);
    };
    const store = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      stats.writes.push(key);
      return store.call(this, key, value);
    };
    const open = HTMLDialogElement.prototype.showModal;
    HTMLDialogElement.prototype.showModal = function () {
      open.call(this);
      stats.dialogs.push("open:" + this.getAttribute("aria-labelledby"));
      stats.maxModal = Math.max(
        stats.maxModal,
        document.querySelectorAll("dialog:modal").length,
      );
    };
    const close = HTMLDialogElement.prototype.close;
    HTMLDialogElement.prototype.close = function (...args) {
      stats.dialogs.push("close:" + this.getAttribute("aria-labelledby"));
      return close.apply(this, args);
    };
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (...args) {
      stats.focuses.push(this.textContent?.trim() ?? "");
      return focus.apply(this, args);
    };
  }, choice);
}
async function stopped(p: Page) {
  await p.waitForTimeout(100);
  const before = await frameCount(p);
  await p.waitForTimeout(250);
  expect(await frameCount(p)).toBe(before);
}
async function openCustomization(p: Page) {
  await expect(custom(p)).toBeEnabled();
  await custom(p).click();
  await expect(modal(p)).toBeVisible();
}
async function chooseTheme(p: Page, name: string) {
  await p
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await p.getByRole("button", { name: "Accessibility", exact: true }).click();
  await p.getByRole("button", { name, exact: true }).click();
  await p
    .getByRole("button", {
      name: "Menu: close navigation and settings",
      exact: true,
    })
    .click();
}

test("customization starts with Reset and overlay, retaining the frozen scene behind it", async ({
  page,
}, info) => {
  if (!available) return;
  await setup(page);
  await page.goto(route);
  await expect(canvas(page)).toBeVisible();
  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click();
  await stopped(page);
  const original = await canvas(page).elementHandle();
  const pixels = await canvas(page).evaluate((node) =>
    (node as HTMLCanvasElement).toDataURL(),
  );
  await openCustomization(page);
  const content = modal(page).locator(":scope > div:last-child");
  await expect(content.locator("button").nth(0)).toHaveText("Reset animation");
  await expect(content.locator("button").nth(1)).toHaveAttribute(
    "role",
    "switch",
  );
  await expect(modal(page).locator("figure, [data-aperture]")).toHaveCount(0);
  await expect(canvas(page)).toBeVisible();
  await expect(
    page.locator("[data-start-scene] [data-aperture-fallback]"),
  ).toHaveCount(0);
  expect(
    await canvas(page).evaluate((node, before) => node === before, original),
  ).toBe(true);
  expect(
    await canvas(page).evaluate((node) =>
      (node as HTMLCanvasElement).toDataURL(),
    ),
  ).toBe(pixels);
  await stopped(page);
  await page.screenshot({
    path: info.outputPath("customization-frozen-scene.png"),
  });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Resume animation", exact: true }),
  ).toBeEnabled();
  await stopped(page);
});

test("Aperture - 1 is the first animation destination and labels keep stored identities", async ({
  page,
}) => {
  await setup(page, "off");
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Aperture - 1", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Accessibility", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Appearance", exact: true })
    .getByRole("button", { name: "Light", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Motion", exact: true })
    .getByRole("button", { name: "System", exact: true })
    .click();
  expect(
    await page.evaluate(() => [
      localStorage.getItem("theme"),
      localStorage.getItem("funkspace.motion.preference.v1"),
    ]),
  ).toEqual(["default", "system"]);
  await page.getByRole("button", { name: "Navigation", exact: true }).click();
  const animations = page
    .locator("dialog details")
    .filter({ has: page.locator("summary", { hasText: "Animations" }) });
  await animations.locator("summary").click();
  const link = animations.getByRole("link").first();
  await expect(link).toHaveText("Aperture - 1");
  await expect(link).toHaveAttribute("href", route);
  await link.click();
  await expect(page).toHaveURL(new RegExp(route + "$"));
  await expect(page.locator("#main-content")).toBeFocused();
});

for (const preference of ["on", "reduced", "off"]) {
  test(`${preference}: details never paints solid WEB before the first Canvas frame`, async ({
    page,
  }) => {
    if (!available) return;
    await setup(page, preference);
    await page.addInitScript(() => {
      const evidence = { visibleFallbackFrames: 0 };
      Object.assign(window, { startupEvidence: evidence });
      const inspect = () => {
        const scene = document.querySelector<HTMLElement>("[data-start-scene]");
        if (
          scene?.querySelector("[data-aperture-fallback] path") &&
          Number(getComputedStyle(scene).opacity) > 0
        )
          evidence.visibleFallbackFrames++;
        requestAnimationFrame(inspect);
      };
      requestAnimationFrame(inspect);
    });
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let intercepted = false;
    await page.route("**/_next/static/chunks/*.js", async (request) => {
      const response = await request.fetch();
      const body = await response.text();
      if (body.includes("particleCanvas")) {
        intercepted = true;
        await gate;
      }
      await request.fulfill({ response, body });
    });
    try {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const scene = page.locator("[data-start-scene]");
      await expect.poll(() => intercepted).toBe(true);
      await expect(scene).toHaveAttribute("data-scene-reveal", "waiting");
      await expect(scene).toHaveCSS("opacity", "0");
      await page.waitForTimeout(300);
      expect(await frameCount(page)).toBe(0);
      release();
      await expect(canvas(page)).toBeVisible();
      await expect(scene).toHaveCSS("opacity", "1");
      expect(
        await page.evaluate(
          () =>
            (
              window as typeof window & {
                startupEvidence: { visibleFallbackFrames: number };
              }
            ).startupEvidence.visibleFallbackFrames,
        ),
      ).toBe(0);
      await page.reload();
      await expect(canvas(page)).toBeVisible();
      await expect(scene).toHaveCSS("opacity", "1");
      expect(
        await page.evaluate(
          () =>
            (
              window as typeof window & {
                startupEvidence: { visibleFallbackFrames: number };
              }
            ).startupEvidence.visibleFallbackFrames,
        ),
      ).toBe(0);
    } finally {
      release();
      await page.unrouteAll({ behavior: "wait" });
    }
  });
}

test("details pre-hydration concealment fails open and late hydration never hides it again", async ({
  page,
}) => {
  if (!available) return;
  await setup(page);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/_next/static/chunks/*.js", async (request) => {
    await gate;
    await request.continue();
  });
  try {
    await page.goto(route, { waitUntil: "commit" });
    const scene = page.locator("[data-start-scene]");
    await expect(scene).toHaveAttribute("data-scene-reveal", "pending");
    await expect(scene).toHaveAttribute("data-scene-startup", "waiting");
    await expect(scene).toHaveCSS("opacity", "0");
    await expect(scene).toHaveAttribute("data-scene-startup", "expired", {
      timeout: 7000,
    });
    await expect(scene).toHaveCSS("opacity", "1");
    await expect(page.locator("[data-aperture-fallback] path")).toBeVisible();
    release();
    await expect(canvas(page)).toBeVisible();
    await expect(scene).toHaveAttribute("data-scene-startup", "expired");
    await expect(scene).toHaveCSS("animation-name", "none");
    await expect(scene).toHaveCSS("opacity", "1");
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
  }
});

test("homepage More is a native details link and has no customization controls", async ({
  page,
}) => {
  await setup(page, "off");
  await page.goto("/");
  await expect(page.getByRole("slider")).toHaveCount(0);
  await expect(custom(page)).toHaveCount(0);
  const more = page.getByRole("link", { name: "More about Aperture - 1" });
  await expect(more).toHaveAttribute("href", route);
  await expect(more).toHaveText("More");
  await more.click();
  await expect(page).toHaveURL(route);
  await expect(
    page.getByRole("heading", { level: 1, name: "Aperture - 1" }),
  ).toBeVisible();
  await expect(custom(page)).toBeEnabled();
});

test("native ranges show effective values, retain edits, reset and reload without scene storage or a new runtime", async ({
  page,
}) => {
  await setup(page);
  await page.goto(route);
  await expect(custom(page)).toBeEnabled();
  const startupWrites = await page.evaluate(() => [
    ...(window as typeof window & { fs46: { writes: string[] } }).fs46.writes,
  ]);
  if (available) {
    await expect(canvas(page)).toBeVisible();
    await page.getByRole("button", { name: "Pause animation" }).click();
    await stopped(page);
  }
  const owner = available ? await canvas(page).elementHandle() : null;
  await openCustomization(page);
  for (const [label, key, expected] of [
    ["Density", "count", "999"],
    ["Speed", "speed", "1.9"],
    ["Size", "size", "3.9"],
    ["Connections per particle", "connectionsPerParticle", "99"],
    ["Connection distance", "connectionDistance", "9.9"],
  ] as const) {
    const range = modal(page).getByRole("slider", { name: label });
    const settings = PARTICLE_SETTINGS.controls[key];
    await range.focus();
    await range.press("Home");
    await expect(range).toHaveValue(String(settings.min));
    await range.press("End");
    await expect(range).toHaveValue(String(settings.max));
    await range.press("ArrowLeft");
    await expect(range).toHaveValue(expected);
  }
  await stopped(page);
  await page.keyboard.press("Escape");
  await expect(custom(page)).toBeFocused();
  await openCustomization(page);
  await expect(
    modal(page).getByRole("slider", { name: "Density" }),
  ).toHaveValue("999");
  await expect(modal(page).getByRole("slider", { name: "Speed" })).toHaveValue(
    "1.9",
  );
  await expect(modal(page).getByRole("slider", { name: "Size" })).toHaveValue(
    "3.9",
  );
  await modal(page).getByRole("button", { name: "Reset animation" }).click();
  await expect(
    modal(page).getByRole("slider", { name: "Density" }),
  ).toHaveValue(String(DEFAULT_PARTICLE_CONFIG.count));
  await modal(page).getByRole("button", { name: "Close", exact: true }).click();
  if (owner) {
    expect(
      await owner.evaluate(
        (node) =>
          node === document.querySelector("canvas[data-particle-canvas]"),
      ),
    ).toBe(true);
    await expect(
      page.getByRole("button", { name: "Resume animation" }),
    ).toBeEnabled();
    await stopped(page);
  }
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { fs46: { writes: string[] } }).fs46.writes,
    ),
  ).toEqual(startupWrites);
  await openCustomization(page);
  await modal(page).getByRole("slider", { name: "Density" }).fill("100");
  await page.reload();
  await openCustomization(page);
  await expect(
    modal(page).getByRole("slider", { name: "Density" }),
  ).toHaveValue(String(DEFAULT_PARTICLE_CONFIG.count));
  await expect(
    page.locator(
      "[data-particle-static], [data-start-scene] line, [data-start-scene] circle",
    ),
  ).toHaveCount(0);
  await expect(modal(page).locator("canvas, line, circle")).toHaveCount(0);
});

test("overlay transparency retains the paused Canvas, local settings and complete Off fallback", async ({
  page,
}) => {
  await setup(page);
  await page.goto(route);
  if (available) {
    await expect(canvas(page)).toBeVisible();
    await page
      .getByRole("button", { name: "Pause animation", exact: true })
      .click();
  }
  const original = available ? await canvas(page).elementHandle() : null;
  const cover = page.locator("[data-start-scene] > [data-scene-aperture]");
  const image = available
    ? await canvas(page).evaluate((node) =>
        (node as HTMLCanvasElement).toDataURL(),
      )
    : null;
  await openCustomization(page);
  const toggle = modal(page).getByRole("switch", {
    name: "Transparent WEB overlay",
  });
  await expect(toggle).not.toBeChecked();
  await toggle.click();
  await expect(toggle).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(cover).toHaveCSS("opacity", available ? "0" : "1");
  if (original) {
    expect(
      await canvas(page).evaluate(
        (node, previous) => node === previous,
        original,
      ),
    ).toBe(true);
    expect(
      await canvas(page).evaluate((node) =>
        (node as HTMLCanvasElement).toDataURL(),
      ),
    ).toBe(image);
    await stopped(page);
  }
  await openCustomization(page);
  await expect(toggle).toBeChecked();
  await modal(page).getByRole("button", { name: "Reset animation" }).click();
  await expect(toggle).not.toBeChecked();
  await toggle.click();
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Accessibility", exact: true })
    .click();
  await page.getByRole("button", { name: "Off", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Menu: close navigation and settings",
      exact: true,
    })
    .click();
  await expect(cover).toHaveCSS("opacity", available ? "0" : "1");
  if (available) {
    await expect(canvas(page)).toBeVisible();
    expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
  } else {
    await expect(canvas(page)).toHaveCount(0);
    await expect(cover.locator("[data-aperture-fallback] path")).toBeVisible();
  }
  await expect(cover.locator("[data-aperture-fallback] path")).toHaveCount(
    available ? 0 : 1,
  );
  await stopped(page);
  await page.reload();
  await openCustomization(page);
  await expect(toggle).not.toBeChecked();
});

test("maximum settings keep a bounded graph and responsive navigation", async ({
  page,
}, testInfo) => {
  if (!available) return;
  await setup(page);
  await page.addInitScript(() => {
    const metrics = {
      lines: 0,
      maxLines: 0,
      particles: 0,
      started: 0,
      durations: [] as number[],
    };
    Object.assign(window, { expandedMetrics: metrics });
    const clear = CanvasRenderingContext2D.prototype.fillRect;
    const stroke = CanvasRenderingContext2D.prototype.stroke;
    const fill = CanvasRenderingContext2D.prototype.fill;
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      if (this.canvas.hasAttribute("data-particle-canvas")) {
        metrics.lines = metrics.particles = 0;
        metrics.started = performance.now();
      }
      return clear.apply(this, args);
    };
    CanvasRenderingContext2D.prototype.stroke = function (path?: Path2D) {
      if (this.canvas.hasAttribute("data-particle-canvas")) {
        metrics.lines++;
        metrics.maxLines = Math.max(metrics.lines, metrics.maxLines);
      }
      return Reflect.apply(stroke, this, path ? [path] : []);
    };
    CanvasRenderingContext2D.prototype.fill = function (
      pathOrRule?: Path2D | CanvasFillRule,
      rule?: CanvasFillRule,
    ) {
      if (
        this.canvas.hasAttribute("data-particle-canvas") &&
        ++metrics.particles === 1000 &&
        metrics.durations.length < 60
      )
        metrics.durations.push(performance.now() - metrics.started);
      return Reflect.apply(
        fill,
        this,
        pathOrRule === undefined
          ? []
          : typeof pathOrRule === "string"
            ? [pathOrRule]
            : [pathOrRule, rule],
      );
    };
  });
  await page.goto(route);
  await expect(canvas(page)).toBeVisible();
  await openCustomization(page);
  for (const [name, value] of [
    ["Density", "1000"],
    ["Speed", "2"],
    ["Size", "4"],
    ["Connections per particle", "100"],
    ["Connection distance", "10"],
  ])
    await modal(page).getByRole("slider", { name, exact: true }).fill(value);
  await page.keyboard.press("Escape");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & {
              expandedMetrics: { durations: number[] };
            }
          ).expandedMetrics.durations.length,
      ),
    )
    .toBeGreaterThanOrEqual(30);
  const metrics = await page.evaluate(
    () =>
      (
        window as typeof window & {
          expandedMetrics: { maxLines: number; durations: number[] };
        }
      ).expandedMetrics,
  );
  expect(metrics.maxLines).toBeGreaterThan(0);
  expect(metrics.maxLines).toBeLessThanOrEqual(4800);
  await testInfo.attach("maximum-settings-draw-sample", {
    body: JSON.stringify(metrics),
    contentType: "application/json",
  });
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Menu: close navigation and settings",
      exact: true,
    }),
  ).toBeVisible();
  await stopped(page);
});

for (const state of ["playing", "paused", "reduced", "off", "failed"]) {
  test(`Reset keeps ${state} intent and never runs behind customization`, async ({
    page,
  }) => {
    await setup(page, state === "off" || state === "reduced" ? state : "on");
    if (state === "failed")
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          this: HTMLCanvasElement,
          ...args: Parameters<typeof original>
        ) {
          if (this.hasAttribute("data-particle-canvas")) return null;
          return original.apply(this, args);
        } as typeof original;
      });
    await page.goto(route);
    await expect(custom(page)).toBeEnabled();
    if (available && state !== "failed")
      await expect(canvas(page)).toBeVisible();
    if (available && state === "paused")
      await page.getByRole("button", { name: "Pause animation" }).click();
    await openCustomization(page);
    await stopped(page);
    const before = await frameCount(page);
    for (const [label, value] of [
      ["Density", "100"],
      ["Speed", "0.6"],
      ["Size", "2"],
    ])
      await modal(page).getByRole("slider", { name: label }).fill(value);
    await modal(page).getByRole("button", { name: "Reset animation" }).click();
    for (const [label, value] of [
      ["Density", "200"],
      ["Speed", "0.4"],
      ["Size", "1"],
    ])
      await expect(
        modal(page).getByRole("slider", { name: label }),
      ).toHaveValue(value);
    await stopped(page);
    // Visible paused Canvas may coalesce event-driven redraws for edited settings.
    if (available && state !== "failed")
      expect(await frameCount(page)).toBeGreaterThanOrEqual(before);
    else expect(await frameCount(page)).toBe(before);
    await modal(page)
      .getByRole("button", { name: "Close", exact: true })
      .click();
    if (available && state === "playing")
      await expect.poll(() => frameCount(page)).toBeGreaterThan(before);
    else {
      await stopped(page);
      if (!available || state === "failed")
        await expect(canvas(page)).toHaveCount(0);
    }
  });
}

test("two modal consumers release before switching; dismiss restores each invoker and scroll", async ({
  page,
}) => {
  await setup(page, "off");
  await page.goto(route);
  await custom(page).scrollIntoViewIfNeeded();
  const y = await page.evaluate(() => scrollY);
  await openCustomization(page);
  // Exercise the same triggers programmatically while inert to stress queued transitions.
  await page
    .getByRole("button", {
      name: "Menu: navigation and settings",
      includeHidden: true,
      exact: true,
    })
    .evaluate((node) => (node as HTMLButtonElement).click());
  await expect(
    page.getByRole("dialog", { name: "Navigation and settings" }),
  ).toBeVisible();
  await expect(page.locator("dialog[open]")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Customize animation",
      exact: true,
      includeHidden: true,
    })
    .evaluate((node) => (node as HTMLButtonElement).click());
  await expect(modal(page)).toBeVisible();
  await expect(page.locator("dialog[open]")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(custom(page)).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(y);
  const stats = await page.evaluate(
    () =>
      (
        window as typeof window & {
          fs46: { dialogs: string[]; maxModal: number };
        }
      ).fs46,
  );
  expect(stats.maxModal).toBe(1);
  expect(stats.dialogs.map((value) => value.split(":")[0])).toEqual([
    "open",
    "close",
    "open",
    "close",
    "open",
    "close",
  ]);
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).toBe("");
});

test("failed customization opening gives inline feedback and leaves navigation and scroll usable", async ({
  page,
}) => {
  await setup(page, "off");
  await page.addInitScript(() => {
    const original = HTMLDialogElement.prototype.showModal;
    HTMLDialogElement.prototype.showModal = function () {
      if (this.textContent?.includes("Customize animation"))
        throw Error("Review unavailable");
      return original.call(this);
    };
  });
  await page.goto(route);
  await custom(page).click();
  await expect(
    page.getByText(
      "Customization is unavailable. The animation page and navigation remain usable.",
    ),
  ).toBeVisible();
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).toBe("");
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Navigation and settings" }),
  ).toBeVisible();
});

test("native navigation leaves the details scene, restores destination focus and returns with defaults", async ({
  page,
}) => {
  await setup(page, "off");
  await page.goto(route);
  await openCustomization(page);
  await modal(page).getByRole("slider", { name: "Density" }).fill("100");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  const navigation = page.getByRole("dialog", {
    name: "Navigation and settings",
  });
  const home = navigation.getByRole("link", { name: "Home", exact: true });
  await expect(home).toHaveAttribute("href", "/");
  await home.click();
  await expect(page).toHaveURL("/");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(route);
  await openCustomization(page);
  await expect(
    modal(page).getByRole("slider", { name: "Density" }),
  ).toHaveValue(String(DEFAULT_PARTICLE_CONFIG.count));
});

test("failed navigation opening restores native links and prevents competing customization", async ({
  page,
}) => {
  await setup(page, "off");
  await page.addInitScript(() => {
    const open = HTMLDialogElement.prototype.showModal;
    HTMLDialogElement.prototype.showModal = function () {
      if (this.textContent?.includes("Navigation and settings"))
        throw Error("Review navigation unavailable");
      return open.call(this);
    };
  });
  await page.goto(route);
  await expect(custom(page)).toBeEnabled();
  if (available) await expect(canvas(page)).toBeVisible();
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await expect(
    page.locator('footer details[class*="fallback"]'),
  ).toHaveAttribute("open");
  await expect(custom(page)).toBeDisabled();
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  if (available) {
    await expect(canvas(page)).toBeVisible();
    await stopped(page);
  } else {
    await expect(
      page.locator("[data-start-scene] [data-aperture-fallback] path"),
    ).toBeVisible();
  }
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).toBe("");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL("/about");
});

test("navigation failure during Canvas loading leaves complete static artwork after native dismissal", async ({
  page,
}) => {
  if (!available) return;
  await setup(page);
  await page.addInitScript(() => {
    const open = HTMLDialogElement.prototype.showModal;
    HTMLDialogElement.prototype.showModal = function () {
      if (this.textContent?.includes("Navigation and settings"))
        throw Error("Review navigation unavailable");
      return open.call(this);
    };
  });
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let intercepted = false;
  await page.route("**/_next/static/chunks/*.js", async (request) => {
    const response = await request.fetch();
    const body = await response.text();
    if (body.includes("particleCanvas")) {
      intercepted = true;
      await held;
    }
    await request.fulfill({ response, body });
  });
  try {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect.poll(() => intercepted).toBe(true);
    await page
      .getByRole("button", {
        name: "Menu: navigation and settings",
        exact: true,
      })
      .click();
    const fallback = page.locator('footer details[class*="fallback"]');
    await expect(fallback).toHaveAttribute("open");
    release();
    await fallback.locator(":scope > summary").click();
    await expect(fallback).not.toHaveAttribute("open");
    await expect(page.locator("[data-start-scene]")).toHaveCSS("opacity", "1");
    await expect(
      page.locator("[data-start-scene] [data-aperture-fallback] path"),
    ).toBeVisible();
    await expect(canvas(page)).toHaveCount(0);
    await stopped(page);
    expect(await frameCount(page)).toBe(0);
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
  }
});

test("history departure cancels customization restoration and permits a later fresh opening", async ({
  page,
}) => {
  await setup(page, "off");
  await page.goto(route);
  await page.evaluate(() => history.pushState(null, "", "?review=1"));
  await openCustomization(page);
  await page.evaluate(() => {
    (window as typeof window & { fs46: { focuses: string[] } }).fs46.focuses =
      [];
  });
  await page.goBack();
  await expect(page).toHaveURL(route);
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  const focusCalls = await page.evaluate(
    () =>
      (window as typeof window & { fs46: { focuses: string[] } }).fs46.focuses,
  );
  expect(focusCalls).not.toContain("Customize animation");
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).toBe("");
  await openCustomization(page);
  await page.keyboard.press("Escape");
});

test("delayed hydration preserves active native navigation before enabling customization", async ({
  page,
}) => {
  await setup(page);
  let release!: () => void;
  const scripts = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/_next/static/**/*.js", async (request) => {
    await scripts;
    await request.continue();
  });
  try {
    await page.goto(route, { waitUntil: "commit" });
    const fallback = page.locator('footer details[class*="fallback"]');
    const summary = fallback.locator(":scope > summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(summary).toBeFocused();
    release();
    await page.waitForLoadState("load");
    await expect(custom(page)).toBeVisible();
    await expect(custom(page)).toBeDisabled();
    await expect(summary).toBeFocused();
    await expect(fallback).toHaveAttribute("open");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(canvas(page)).toHaveCount(0);
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(custom(page)).toBeEnabled();
    await expect(fallback).toHaveCount(0);
    await openCustomization(page);
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
  }
});

for (const [width, height, scale, theme] of [
  [320, 568, 1, "Light"],
  [812, 375, 1, "Dark"],
  [375, 320, 2, "Muted"],
  [1280, 800, 2, "High Contrast"],
] as const) {
  test(`unfiltered accessibility and layout ${width}x${height} text ${scale * 100}% ${theme}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height });
    await setup(page, "off");
    await page.goto(route);
    await chooseTheme(page, theme);
    if (scale === 2)
      await page.addStyleTag({ content: "html { font-size: 200%; }" });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await openCustomization(page);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await expect(modal(page).getByRole("slider")).toHaveCount(5);
    const overflow = await modal(page).evaluate((node) => ({
      width: node.clientWidth,
      scrollWidth: node.scrollWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.width + 1);
    await modal(page)
      .getByRole("button", { name: "Reset animation" })
      .scrollIntoViewIfNeeded();
    await expect(
      modal(page).getByRole("button", { name: "Reset animation" }),
    ).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: info.outputPath("customization.png") });
    await page.keyboard.press("Escape");
    await expect(custom(page)).toBeFocused();
  });
}

test("details work without JavaScript: complete solid WEB and native navigation, no dead controls", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(new URL(route, baseURL).href);
  await expect(
    page.getByRole("heading", { level: 1, name: "Aperture - 1" }),
  ).toBeVisible();
  await expect(page.locator("[data-aperture-fallback] path")).toBeVisible();
  await expect(page.getByRole("button")).toHaveCount(0);
  await expect(canvas(page)).toHaveCount(0);
  await page.locator('footer details[class*="fallback"] > summary').click();
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(page.locator("#start")).toBeVisible();
  await context.close();
});
