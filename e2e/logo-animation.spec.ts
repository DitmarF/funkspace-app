import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openSettings } from "./helpers/foundation";

const available = process.env.FS35_AVAILABLE === "true";
const logo = "header [data-funkspace-logo]";
async function isComplete(page: Page, selector = logo) {
  return page.locator(selector).evaluate(
    (svg) =>
      Number(getComputedStyle(svg).opacity) === 1 &&
      [...svg.querySelectorAll<SVGElement>("[data-logo-part]")].every(
        (part) => {
          const style = getComputedStyle(part);
          return (
            Number(style.opacity) === 1 &&
            Number(style.fillOpacity) === 1 &&
            (parseFloat(style.strokeDashoffset) || 0) === 0
          );
        },
      ),
  );
}
async function observe(page: Page) {
  await page.addInitScript(() => {
    const record = { partial: 0, last: "" };
    Object.assign(window, { fs35Observation: record });
    new MutationObserver(() => {
      const svg = document.querySelector("header [data-funkspace-logo]");
      if (!svg) return;
      const parts = [...svg.querySelectorAll<SVGElement>("[data-logo-part]")];
      const signature =
        (svg as SVGElement).style.cssText +
        parts.map((part) => part.style.cssText).join("|");
      if (signature === record.last) return;
      record.last = signature;
      if (
        Number(getComputedStyle(svg).opacity) < 1 ||
        parts.some(
          (part) =>
            part.style.opacity === "0" ||
            part.style.fillOpacity === "0" ||
            parseFloat(part.style.strokeDashoffset) > 0,
        )
      )
        record.partial++;
    }).observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  });
}
const partialCount = (page: Page) =>
  page.evaluate(
    () =>
      (window as typeof window & { fs35Observation: { partial: number } })
        .fs35Observation.partial,
  );
async function appearance(page: Page) {
  await openSettings(page);
  await page
    .getByRole("button", { name: "Accessibility", exact: true })
    .click();
}

for (const width of [320, 1280]) {
  test.describe(`FS-3.5 ${width}px flag=${available}`, () => {
    test.use({ viewport: { width, height: 720 } });
    test("Reduced uses a uniform whole-logo fade and Off immediately restores it", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(() => {
        localStorage.setItem("funkspace.motion.preference.v1", "reduced");
        const samples: { opacity: number; partsComplete: boolean }[] = [];
        Object.assign(window, { fs35FadeSamples: samples });
        new MutationObserver(() => {
          const svg = document.querySelector("header [data-funkspace-logo]");
          if (!svg) return;
          samples.push({
            opacity: Number(getComputedStyle(svg).opacity),
            partsComplete: [
              ...svg.querySelectorAll<SVGElement>("[data-logo-part]"),
            ].every((part) => {
              const style = getComputedStyle(part);
              return (
                Number(style.opacity) === 1 &&
                Number(style.fillOpacity) === 1 &&
                (parseFloat(style.strokeDashoffset) || 0) === 0
              );
            }),
          });
        }).observe(document, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ["style"],
        });
      });
      const samples = () =>
        page.evaluate(
          () =>
            (
              window as typeof window & {
                fs35FadeSamples: { opacity: number; partsComplete: boolean }[];
              }
            ).fs35FadeSamples,
        );
      await page.goto("/");
      if (available) {
        await expect
          .poll(async () =>
            (await samples()).some((s) => s.opacity > 0 && s.opacity < 1),
          )
          .toBe(true);
      }
      await expect.poll(() => isComplete(page)).toBe(true);
      expect((await samples()).every((s) => s.partsComplete)).toBe(true);
      if (!available)
        expect((await samples()).every((s) => s.opacity === 1)).toBe(true);
      expect(
        await isComplete(page, "[data-start-scene] [data-funkspace-logo]"),
      ).toBe(true);
      await appearance(page);
      await expect(
        page.getByRole("button", { name: "Reduced", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("status")).toHaveText(
        available
          ? "The logo uses a gentle fade-in. Decorative scenes stay still."
          : "Animation is currently unavailable.",
      );
      // A fresh mount permits a new introduction; mode toggles alone do not replay.
      await page.reload();
      await appearance(page);
      await page.getByRole("button", { name: "Off", exact: true }).click();
      expect(await isComplete(page)).toBe(true);
      await page.getByRole("button", { name: "Reduced", exact: true }).click();
      expect(await isComplete(page)).toBe(true);
      const count = (await samples()).filter((s) => s.opacity < 1).length;
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      expect((await samples()).filter((s) => s.opacity < 1)).toHaveLength(
        count,
      );
    });
    test("explicit On overrides device reduction, persists and retains the feature gate", async ({
      page,
    }) => {
      await observe(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await appearance(page);
      expect(await partialCount(page)).toBe(0);
      await page.getByRole("button", { name: "On", exact: true }).click();
      await expect(
        page.getByRole("button", { name: "On", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("status")).toHaveText(
        available
          ? "Animation is on, regardless of your device’s reduced-motion setting."
          : "Animation is currently unavailable.",
      );
      if (available)
        await expect.poll(() => partialCount(page)).toBeGreaterThan(0);
      await expect.poll(() => isComplete(page)).toBe(true);
      if (!available) expect(await partialCount(page)).toBe(0);
      const prior = await partialCount(page);
      await page.screenshot({
        path: test.info().outputPath("on-settings.png"),
      });
      await page.getByRole("button", { name: "Off", exact: true }).click();
      await page.getByRole("button", { name: "On", exact: true }).click();
      expect(await partialCount(page)).toBe(prior);
      expect(await isComplete(page)).toBe(true);
      await page.reload();
      await appearance(page);
      await expect(
        page.getByRole("button", { name: "On", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      if (available)
        await expect.poll(() => partialCount(page)).toBeGreaterThan(0);
      else expect(await partialCount(page)).toBe(0);
      await expect.poll(() => isComplete(page)).toBe(true);
    });
    for (const preference of ["off", "os-reduce"] as const) {
      test(`first load ${preference} never hides any logo part`, async ({
        page,
      }) => {
        await observe(page);
        await page.emulateMedia({
          reducedMotion:
            preference === "os-reduce" ? "reduce" : "no-preference",
        });
        await page.addInitScript(
          (preference) =>
            localStorage.setItem(
              "funkspace.motion.preference.v1",
              preference === "os-reduce" ? "system" : preference,
            ),
          preference,
        );
        await page.goto("/");
        await appearance(page);
        await expect(
          page.getByRole("button", {
            name: preference === "os-reduce" ? "Follow system" : "Off",
            exact: true,
          }),
        ).toHaveAttribute("aria-pressed", "true");
        expect(await isComplete(page)).toBe(true);
        expect(
          await isComplete(page, "[data-start-scene] [data-funkspace-logo]"),
        ).toBe(true);
        expect(await partialCount(page)).toBe(0);
      });
    }

    test("only nominated identity draws; completion survives theme/menu/visibility changes", async ({
      page,
    }) => {
      await observe(page);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto("/");
      if (available)
        await expect.poll(() => partialCount(page)).toBeGreaterThan(0);
      await expect.poll(() => isComplete(page)).toBe(true);
      expect(
        await isComplete(page, "[data-start-scene] [data-funkspace-logo]"),
      ).toBe(true);
      if (!available) expect(await partialCount(page)).toBe(0);
      const prior = await partialCount(page);
      await appearance(page);
      for (const name of ["Dark", "Muted", "High Contrast", "Default"])
        await page.getByRole("button", { name, exact: true }).click();
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await appearance(page);
      await page.getByRole("button", { name: "Close", exact: true }).click();
      expect(await isComplete(page)).toBe(true);
      expect(await partialCount(page)).toBe(prior);
      const ids = await page
        .locator("[data-funkspace-logo] [id]")
        .evaluateAll((nodes) => nodes.map((node) => node.id));
      expect(new Set(ids).size).toBe(ids.length);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test("live Off during drawing stops it, persists, and never replays on returning to System", async ({
      page,
    }, info) => {
      await observe(page);
      await page.clock.install();
      await page.clock.pauseAt(new Date(Date.now() + 100));
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto("/");
      if (available)
        await expect(page.locator("[data-home-intro]")).toHaveAttribute(
          "data-home-intro",
          "waiting",
        );
      await page.keyboard.press("Escape"); // Interaction exits the homepage introduction.
      await appearance(page);
      if (available)
        await expect.poll(() => partialCount(page)).toBeGreaterThan(0);
      await page.getByRole("button", { name: "Off", exact: true }).click();
      expect(await isComplete(page)).toBe(true);
      expect(
        await page.evaluate(() =>
          localStorage.getItem("funkspace.motion.preference.v1"),
        ),
      ).toBe("off");
      await page.screenshot({ path: info.outputPath("motion-settings.png") });
      const prior = await partialCount(page);
      await page
        .getByRole("button", { name: "Follow system", exact: true })
        .click();
      await page.clock.runFor(5000);
      expect(await isComplete(page)).toBe(true);
      expect(await partialCount(page)).toBe(prior);
      await page.getByRole("button", { name: "Reduced", exact: true }).click();
      await page.reload();
      if (available)
        await expect(page.locator("[data-home-intro]")).toHaveAttribute(
          "data-home-intro",
          "waiting",
        );
      await page.keyboard.press("Escape"); // The paused test clock cannot finish the reloaded introduction.
      await appearance(page);
      await expect(
        page.getByRole("button", { name: "Reduced", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      if (available) {
        await expect.poll(() => partialCount(page)).toBeGreaterThan(0);
        await page.clock.runFor(5000);
        expect(await isComplete(page)).toBe(true);
      } else expect(await partialCount(page)).toBe(0);
    });
  });
}

test("delayed framework startup retains complete server artwork", async ({
  page,
}) => {
  await observe(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
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
    await expect(page.locator(logo)).toBeAttached();
    expect(await isComplete(page)).toBe(true);
    expect(await partialCount(page)).toBe(0);
  } finally {
    release();
  }
  await appearance(page);
  expect(await isComplete(page)).toBe(true);
  expect(await partialCount(page)).toBe(0);
});

test("actual manifest measurement failure leaves complete static artwork", async ({
  page,
}) => {
  await observe(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    SVGPathElement.prototype.getTotalLength = () => {
      throw Error("fixture measurement denied");
    };
  });
  await page.goto("/");
  await appearance(page);
  expect(await isComplete(page)).toBe(true);
  expect(await partialCount(page)).toBe(0);
  await page.goto("/about");
  expect(await isComplete(page)).toBe(true);
});

test("live Motion controls and explanation remain reachable on a short screen with enlarged text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 320 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await appearance(page);
  const off = page.getByRole("button", { name: "Off", exact: true });
  await off.click();
  await expect(off).toBeInViewport();
  const status = page
    .getByRole("status")
    .filter({ hasText: "Decorative animation is off." });
  await status.scrollIntoViewIfNeeded();
  await expect(status).toBeInViewport();
  expect(
    await page
      .getByRole("dialog")
      .evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("unavailable visibility leaves complete static artwork", async ({
  page,
}) => {
  await observe(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    Object.defineProperty(window, "IntersectionObserver", { value: undefined });
  });
  await page.goto("/");
  await appearance(page);
  expect(await isComplete(page)).toBe(true);
  expect(await partialCount(page)).toBe(0);
});
