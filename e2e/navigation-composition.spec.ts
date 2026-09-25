import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openSettings, openAppearance, themes } from "./helpers/foundation";

async function expectCloseAlignment(page: Page) {
  const dialog = page.getByRole("dialog");
  const close = (await dialog
    .getByRole("button", { name: "Close", exact: true })
    .boundingBox())!;
  const menu = (await dialog
    .getByRole("button", {
      name: "Menu: close navigation and settings",
      exact: true,
    })
    .boundingBox())!;
  const mobile = page.viewportSize()!.width < 768;
  const closeCenter = mobile
    ? close.x + close.width / 2
    : close.y + close.height / 2;
  const menuCenter = mobile
    ? menu.x + menu.width / 2
    : menu.y + menu.height / 2;
  expect(Math.abs(closeCenter - menuCenter)).toBeLessThan(0.5);
}

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 668 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
]) {
  test.describe(`FS-3.1 ${viewport.width}`, () => {
    test.use({ viewport });
    test("full screen categories, real links, appearance and preview", async ({
      page,
    }, info) => {
      await page.goto("/");
      const trigger = page.getByRole("button", {
        name: "Menu: navigation and settings",
        exact: true,
      });
      await expect(trigger).toBeVisible();
      const triggerBox = await trigger.boundingBox();
      await expect(trigger).toHaveText("");
      await expect(trigger).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await openSettings(page);
      const dialog = page.getByRole("dialog");
      await expect(dialog).toHaveAccessibleName("Navigation and settings");
      const title = dialog.getByRole("heading", {
        name: "Navigation and settings",
      });
      await expect(title).toHaveCSS("clip-path", "inset(50%)");
      const closeButton = dialog.getByRole("button", {
        name: "Close",
        exact: true,
      });
      await expect(closeButton).toBeFocused();
      const closeBox = (await closeButton.boundingBox())!;
      if (viewport.width < 768) {
        expect(closeBox.y).toBeLessThan(24);
        expect(closeBox.x).toBeGreaterThan(viewport.width / 2);
      } else expect(closeBox.x).toBeLessThan(24);
      await expectCloseAlignment(page);
      if (viewport.width < 768) {
        const rightGap = viewport.width - closeBox.x - closeBox.width;
        expect(Math.abs(closeBox.y - rightGap)).toBeLessThan(0.5);
      }
      const heading = (await dialog
        .getByRole("heading", { name: "Navigation", exact: true })
        .boundingBox())!;
      expect(
        Math.abs(
          heading.y + heading.height / 2 - (closeBox.y + closeBox.height / 2),
        ),
      ).toBeLessThan(0.5);
      const overlayTrigger = dialog.getByRole("button", {
        name: "Menu: close navigation and settings",
        exact: true,
      });
      expect(await overlayTrigger.boundingBox()).toEqual(triggerBox);
      const artworkRight = await overlayTrigger
        .locator("svg")
        .first()
        .locator("path")
        .evaluate((path: SVGPathElement) => {
          const bounds = path.getBBox();
          const matrix = path.getScreenCTM()!;
          const stroke = Number(
            getComputedStyle(path).strokeWidth.replace("px", ""),
          );
          return (bounds.x + bounds.width + stroke / 2) * matrix.a + matrix.e;
        });
      const tree = (await dialog
        .getByRole("navigation", { name: "Primary" })
        .boundingBox())!;
      expect(Math.abs(tree.x - (viewport.width - artworkRight))).toBeLessThan(
        0.5,
      );
      await page.mouse.move(0, 0);
      await page.screenshot({
        path: info.outputPath("navigation-initial.png"),
      });
      await expect(overlayTrigger).toHaveText("");
      const railPositions = await Promise.all(
        [
          "Menu: close navigation and settings",
          "Navigation",
          "Languages",
          "Accessibility",
          "Chat-bot",
        ].map(async (name) => ({
          name,
          y: (await dialog
            .getByRole("button", { name, exact: true })
            .boundingBox())!.y,
        })),
      );
      expect(railPositions.sort((a, b) => a.y - b.y)[2].name).toBe("Languages");
      for (const button of await dialog
        .getByRole("group", { name: "Settings categories" })
        .getByRole("button")
        .all()) {
        const box = await button.boundingBox();
        expect(box!.width).toBe(triggerBox!.width);
        expect(box!.height).toBe(triggerBox!.height);
        expect(box!.x).toBe(triggerBox!.x);
      }
      await expect(
        dialog.getByRole("link", { name: "Home", exact: true }),
      ).toHaveCSS("font-size", "16px");
      expect(
        (await dialog
          .getByRole("link", { name: "Home", exact: true })
          .boundingBox())!.height,
      ).toBeGreaterThanOrEqual(48);
      expect(await dialog.boundingBox()).toEqual({ x: 0, y: 0, ...viewport });
      await expect(
        dialog.getByRole("button", { name: "Navigation", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      const navigationIcon = dialog
        .getByRole("button", { name: "Navigation", exact: true })
        .locator("svg")
        .last();
      await expect(navigationIcon).toHaveAttribute("viewBox", "0 0 48 48");
      await expect(navigationIcon).toHaveCSS("width", "48px");
      await expect(navigationIcon).toHaveCSS("height", "48px");
      for (const name of ["Chat-bot", "Languages"])
        await expect(
          dialog.getByRole("button", { name, exact: true }),
        ).toBeDisabled();
      await expect(dialog.getByRole("link")).toHaveCount(3);
      await expect(
        dialog.getByRole("link", { name: "About", exact: true }),
      ).toHaveAttribute("href", "/about");
      await dialog.getByText("Privacy", { exact: true }).click();
      await expect(
        dialog.getByRole("link", { name: "Privacy policy" }),
      ).toHaveAttribute("href", "/privacy");
      await expect(
        dialog.getByRole("link", { name: "Legal notice" }),
      ).toHaveAttribute("href", "/impressum");
      for (const group of ["Animations", "Games"])
        await dialog.getByText(group, { exact: true }).click();
      await expect(
        dialog.getByText("Coming soon", { exact: true }),
      ).toHaveCount(4);
      await expect(dialog.getByRole("link")).toHaveCount(5);
      await expect(dialog.getByRole("menu")).toHaveCount(0);
      await page.mouse.move(0, 0);
      await page.screenshot({ path: info.outputPath("navigation.png") });
      await openAppearance(page);
      await expect(
        dialog.getByRole("group", { name: "Appearance" }),
      ).toBeVisible();
      await expect(
        dialog.getByRole("group", { name: "Motion", exact: true }),
      ).toHaveCount(0);
      await page.mouse.move(0, 0);
      await page.screenshot({ path: info.outputPath("accessibility.png") });
      for (const [theme, label] of [
        ["default", "Default"],
        ["dark", "Dark"],
        ["muted", "Muted"],
        ["dark-high-contrast", "High Contrast"],
        ["system", "System"],
      ]) {
        await dialog.getByRole("button", { name: label, exact: true }).click();
        await expect(
          dialog.getByRole("button", { name: label, exact: true }),
        ).toHaveAttribute("aria-pressed", "true");
        if (
          themes.includes(theme as (typeof themes)[number]) &&
          theme !== "default"
        )
          await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            theme,
          );
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        );
      }
      await dialog.getByRole("button", { name: "Close", exact: true }).click();
      await openSettings(page);
      await expect(
        dialog.getByRole("button", { name: "Navigation", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
    });

    test("long labels and 200% text keep legal links, settings and Close reachable", async ({
      page,
    }) => {
      await page.goto("/");
      await page.addStyleTag({ content: "html { font-size: 200%; }" });
      await openSettings(page);
      const dialog = page.getByRole("dialog");
      await expectCloseAlignment(page);
      // Browser stress fixture, not publication copy or production destinations.
      await dialog
        .getByRole("link", { name: "About", exact: true })
        .evaluate((node) => {
          node.querySelector("span")!.textContent =
            "More about FunkSpace and the ideas behind this collection of creative experiments";
        });
      await dialog.getByText("Privacy", { exact: true }).click();
      const privacy = dialog.getByRole("link", {
        name: "Privacy policy",
        exact: true,
      });
      await privacy.focus();
      await expect(privacy).toBeInViewport();
      await expectCloseAlignment(page);
      await openAppearance(page);
      await dialog.getByRole("button", { name: "High Contrast" }).click();
      expect(
        await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth),
      ).toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await dialog.getByRole("button", { name: "Close", exact: true }).click();
      await expect(dialog).toHaveCount(0);
    });
  });
}

test("trigger alignment survives a scrolled header and a resize across breakpoints", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Menu: navigation and settings",
    exact: true,
  });
  await expect(trigger).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 20));
  const before = await trigger.boundingBox();
  await trigger.click();
  const close = page.getByRole("button", {
    name: "Menu: close navigation and settings",
    exact: true,
  });
  expect(await close.boundingBox()).toEqual(before);
  await expectCloseAlignment(page);
  await page.setViewportSize({ width: 320, height: 568 });
  expect(await close.boundingBox()).toEqual(await trigger.boundingBox());
  await expectCloseAlignment(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  expect(await close.boundingBox()).toEqual(await trigger.boundingBox());
  await expectCloseAlignment(page);
  await close.click();
  await expect(trigger).toBeFocused();
});

test("short mobile screen with enlarged text keeps both categories and dismissal usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 320 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await openSettings(page);
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Accessibility", exact: true })
    .click();
  await dialog.getByRole("button", { name: "Dark", exact: true }).click();
  await dialog.getByRole("button", { name: "Navigation", exact: true }).click();
  await dialog.getByText("Privacy", { exact: true }).click();
  const privacy = dialog.getByRole("link", {
    name: "Privacy policy",
    exact: true,
  });
  await privacy.focus();
  await expect(privacy).toBeInViewport();
  const cornerClose = dialog.getByRole("button", {
    name: "Close",
    exact: true,
  });
  await expect(cornerClose).toBeInViewport();
  await cornerClose.click();
  await expect(dialog).toHaveCount(0);
  await openSettings(page);
  const close = dialog.getByRole("button", {
    name: "Menu: close navigation and settings",
    exact: true,
  });
  await expect(close).toBeInViewport();
  await close.click();
  await expect(dialog).toHaveCount(0);
});

for (const viewport of [
  { width: 320, height: 320 },
  { width: 320, height: 481 },
  { width: 320, height: 568 },
  { width: 1280, height: 320 },
  { width: 320, height: 577 },
]) {
  test(`short enlarged-text rail exposes the complete keyboard-focused category at ${viewport.width}x${viewport.height}`, async ({
    page,
  }, info) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    await openSettings(page);
    const dialog = page.getByRole("dialog");
    for (const name of ["Navigation", "Accessibility"]) {
      const category = dialog.getByRole("button", { name, exact: true });
      for (let tab = 0; tab < 15; tab++) {
        if (await category.evaluate((node) => node === document.activeElement))
          break;
        await page.keyboard.press("Tab");
      }
      await expect(category).toBeFocused();
      const geometry = await category.evaluate((node) => {
        const box = node.getBoundingClientRect();
        const clip = node.parentElement!.getBoundingClientRect();
        const style = getComputedStyle(node);
        const ring =
          parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
        return {
          height: box.height,
          topClearance: box.top - Math.max(0, clip.top),
          bottomClearance: Math.min(innerHeight, clip.bottom) - box.bottom,
          ring,
          uncovered: [0.05, 0.5, 0.95].every((fraction) =>
            node.contains(
              document.elementFromPoint(
                box.x + box.width / 2,
                box.y + box.height * fraction,
              ),
            ),
          ),
        };
      });
      expect(geometry.height).toBeGreaterThanOrEqual(76);
      expect(geometry.topClearance).toBeGreaterThanOrEqual(geometry.ring);
      expect(geometry.bottomClearance).toBeGreaterThanOrEqual(geometry.ring);
      expect(geometry.uncovered).toBe(true);
      await page.screenshot({
        path: info.outputPath(`short-focused-${name}.png`),
      });
    }
  });
}

test("keyboard scrolling keeps the full navigation row below fixed Close", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await openSettings(page);
  const dialog = page.getByRole("dialog");
  const navigation = dialog.getByRole("navigation", { name: "Primary" });
  for (const name of ["Animations", "Games", "Privacy"])
    await navigation.locator("summary").filter({ hasText: name }).click();
  await navigation.getByRole("link", { name: "Contact", exact: true }).focus();
  const home = navigation.getByRole("link", { name: "Home", exact: true });
  for (let tab = 0; tab < 10; tab++) {
    if (await home.evaluate((node) => node === document.activeElement)) break;
    await page.keyboard.press("Shift+Tab");
  }
  await expect(home).toBeFocused();
  const geometry = await home.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const cover = node
      .closest("dialog")!
      .firstElementChild!.getBoundingClientRect();
    const style = getComputedStyle(node);
    const ring =
      parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
    const label = node.querySelector("span")!.getBoundingClientRect();
    return {
      clearance: box.top - cover.bottom,
      ring,
      uncovered: node.contains(
        document.elementFromPoint(label.x + 4, label.y + label.height / 2),
      ),
    };
  });
  expect(geometry.clearance).toBeGreaterThanOrEqual(geometry.ring);
  expect(geometry.uncovered).toBe(true);
  await page.screenshot({ path: info.outputPath("desktop-focused-Home.png") });
});
