import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { openSettings } from "./helpers/foundation";

for (const width of [320, 1280]) {
  for (const activation of ["pointer", "keyboard"]) {
    test(`keeps the complete overlay during delayed navigation: ${width}px ${activation}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 720 });
      await page.goto("/");
      await openSettings(page);
      const frames: Array<{ path: string; modal: boolean; covered: boolean }> =
        [];
      await page.exposeFunction(
        "recordNavigationFrame",
        (frame: { path: string; modal: boolean; covered: boolean }) =>
          frames.push(frame),
      );
      await page.evaluate(() => {
        document.addEventListener(
          "click",
          () => {
            const sample = () => {
              const bounds = document
                .querySelector("dialog:modal")
                ?.getBoundingClientRect();
              const frame = {
                path: location.pathname,
                modal: Boolean(document.querySelector("dialog:modal")),
                covered: Boolean(
                  bounds &&
                    bounds.x === 0 &&
                    bounds.y === 0 &&
                    bounds.width === innerWidth &&
                    bounds.height === innerHeight,
                ),
              };
              (
                window as typeof window & {
                  recordNavigationFrame(value: typeof frame): Promise<void>;
                }
              ).recordNavigationFrame(frame);
              if (location.pathname === "/") requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
          },
          { once: true, capture: true },
        );
      });
      await page.route(
        (url) => url.pathname === "/about",
        async (route) => {
          await new Promise((resolve) => setTimeout(resolve, 750));
          await route.continue();
        },
      );
      const about = page
        .getByRole("dialog")
        .getByRole("link", { name: "About", exact: true });
      if (activation === "keyboard") await about.press("Enter");
      else await about.click();
      await expect(page).toHaveURL("/about");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "About FunkSpace",
      );
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
      const sourceFrames = frames.filter((frame) => frame.path === "/");
      const framesPath = info.outputPath("transition-frames.json");
      await writeFile(framesPath, JSON.stringify(frames, null, 2));
      await info.attach("transition-frames", {
        path: framesPath,
        contentType: "application/json",
      });
      expect(sourceFrames.length).toBeGreaterThan(0);
      expect(sourceFrames.every((frame) => frame.modal && frame.covered)).toBe(
        true,
      );
      await page.screenshot({ path: info.outputPath("about-arrival.png") });
      await page.goBack();
      await expect(page).toHaveURL("/");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
      await openSettings(page);
      await page
        .getByRole("dialog")
        .getByRole("link", { name: "Contact", exact: true })
        .click();
      await expect(page).toHaveURL("/#contact");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("#contact")).toBeInViewport();
      await expect(page.locator("#contact")).toBeFocused();
      await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
    });
  }
}

test("modified link activation opens a new tab without dismissing the current overlay", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await openSettings(page);
  const popupPromise = context.waitForEvent("page");
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "About", exact: true })
    .click({ modifiers: ["ControlOrMeta"] });
  const popup = await popupPromise;
  try {
    await expect(popup).toHaveURL("/about");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("position", "fixed");
  } finally {
    await popup.close();
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
});
