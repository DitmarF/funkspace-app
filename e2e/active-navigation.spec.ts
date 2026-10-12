import { expect, test } from "@playwright/test";
import {
  openSettings,
  openFallbackNavigation,
  selectTheme,
  themes,
} from "./helpers/foundation";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`current page with JavaScript ${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [route, name] of [
      ["/", "Home"],
      ["/?ref=current#about", "Home"],
      ["/about", "About"],
      ["/about?ref=current", "About"],
      ["/animations/aperture", "Web Aperture"],
      ["/privacy", "Privacy policy"],
      ["/impressum", "Legal notice"],
    ]) {
      test(`${route} has one noninteractive current item in each applicable navigation`, async ({
        page,
      }) => {
        await page.goto(route);
        const header = page.getByRole("navigation", {
          name: "Main",
          exact: true,
        });
        const headerCurrent = name === "Home" || name === "About";
        await expect(header.locator('[aria-current="page"]')).toHaveCount(
          headerCurrent ? 1 : 0,
        );
        if (headerCurrent) {
          const current = header.getByRole("button", { name, exact: true });
          await expect(current).toBeDisabled();
          await expect(current).not.toHaveAttribute("href");
          await expect(
            header.getByRole("link", { name, exact: true }),
          ).toHaveCount(0);
          await current.scrollIntoViewIfNeeded();
          const before = await page.evaluate(() => scrollY);
          const box = (await current.boundingBox())!;
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
          await expect(page).toHaveURL(route);
          expect(await page.evaluate(() => scrollY)).toBe(before);
        }
        if (javaScriptEnabled) await openSettings(page);
        else await openFallbackNavigation(page);
        const tree = page.getByRole("navigation", { name: "Primary" });
        const current = tree.getByRole("button", { name, exact: true });
        await expect(current).toBeVisible();
        await expect(current).toBeDisabled();
        await expect(current).toHaveAttribute("aria-current", "page");
        await expect(current).not.toHaveAttribute("href");
        await expect(tree.locator('[aria-current="page"]')).toHaveCount(1);
        await current.scrollIntoViewIfNeeded();
        const box = (await current.boundingBox())!;
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await expect(page).toHaveURL(route);
        await expect(tree).toBeVisible();
        await expect(
          tree.getByRole("button", { name: "Contact" }),
        ).not.toHaveAttribute("aria-current");
      });
    }
  });
}

for (const width of [375, 1280]) {
  test(`${width}px: Home More reveals the selected animation when opening the tree`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("link", { name: "More about Web Aperture" }).click();
    await expect(page).toHaveURL("/animations/aperture");
    await expect(
      page.getByRole("heading", { level: 1, name: "Web Aperture" }),
    ).toBeVisible();
    await openSettings(page);
    const tree = page.getByRole("navigation", { name: "Primary" });
    const summary = tree.locator("summary").filter({ hasText: "Animations" });
    const current = tree.getByRole("button", { name: "Web Aperture" });
    await expect(summary.locator("..")).toHaveAttribute("open", "");
    await expect(current).toBeVisible();
    await expect(current).toBeDisabled();
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(tree.locator("details[open]")).toHaveCount(1);
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(current).toBeHidden();
    await page.keyboard.press("Enter");
    await expect(current).toBeVisible();
    await tree.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL("/about");
    await openSettings(page);
    await expect(tree.locator("details[open]")).toHaveCount(0);
    await page.keyboard.press("Escape");
    await page.goBack();
    await expect(page).toHaveURL("/animations/aperture");
    await openSettings(page);
    await expect(current).toBeVisible();
    await expect(summary.locator("..")).toHaveAttribute("open", "");
  });
}

test("active state follows client navigation and Back/Forward without stale disabled links", async ({
  page,
}) => {
  await page.goto("/");
  const header = page.getByRole("navigation", { name: "Main", exact: true });
  await header.getByRole("link", { name: "About" }).click();
  await expect(header.getByRole("button", { name: "About" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.locator("#main-content")).toBeFocused();
  await page.goBack();
  await expect(header.getByRole("button", { name: "Home" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(header.getByRole("link", { name: "About" })).toHaveAttribute(
    "href",
    "/about",
  );
  await page.goForward();
  await expect(header.getByRole("button", { name: "About" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(header.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
});

test("current icons use hover color while text remains primary in every theme", async ({
  page,
}) => {
  await page.goto("/about");
  for (const theme of themes) {
    await selectTheme(page, theme);
    const header = page.getByRole("navigation", { name: "Main", exact: true });
    const current = header.getByRole("button", { name: "About" });
    const colors = await current.evaluate((node) => {
      const ref = document.createElement("span");
      node.append(ref);
      ref.style.color = "var(--fs-color-action-hover)";
      const hover = getComputedStyle(ref).color;
      ref.style.color = "var(--fs-color-content-primary)";
      const primary = getComputedStyle(ref).color;
      ref.remove();
      return { hover, primary };
    });
    await expect(current.locator("svg:visible")).toHaveCSS(
      "color",
      colors.hover,
    );
    await expect(current).toHaveCSS("color", colors.primary);
    await openSettings(page);
    const treeCurrent = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("button", { name: "About", exact: true });
    await expect(treeCurrent.locator("svg:visible")).toHaveCSS(
      "color",
      colors.hover,
    );
    await expect(treeCurrent).toHaveCSS("color", colors.primary);
    await page.keyboard.press("Escape");
  }
});

test("server current state survives delayed hydration without warnings", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/_next/static/**/*.js", async (route) => {
    await held;
    await route.continue();
  });
  try {
    await page.goto("/about", { waitUntil: "commit" });
    const header = page.getByRole("navigation", { name: "Main", exact: true });
    await expect(header.getByRole("button", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await openFallbackNavigation(page);
    await expect(
      page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("button", { name: "About", exact: true }),
    ).toBeDisabled();
    release();
    await page.waitForLoadState();
    await expect(header.getByRole("button", { name: "About" })).toBeDisabled();
    await header.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
    await expect(header.getByRole("button", { name: "Home" })).toBeDisabled();
    expect(errors).toEqual([]);
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
  }
});

test("hydration preserves a manually closed current-page group", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("theme", "system"));
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/_next/static/**/*.js", async (route) => {
    await held;
    await route.continue();
  });
  try {
    await page.goto("/animations/aperture", { waitUntil: "commit" });
    await openFallbackNavigation(page);
    const tree = page.getByRole("navigation", { name: "Primary" });
    const current = tree.getByRole("button", { name: "Web Aperture" });
    const summary = tree.locator("summary").filter({ hasText: "Animations" });
    await expect(current).toBeVisible();
    await summary.click();
    await expect(current).toBeHidden();
    release();
    await page.waitForLoadState();
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(summary).toBeFocused();
    await expect(summary.locator("..")).not.toHaveAttribute("open");
    await page.keyboard.press("Enter");
    await expect(current).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
  }
});
