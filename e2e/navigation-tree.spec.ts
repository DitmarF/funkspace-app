import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openSettings, openAppearance } from "./helpers/foundation";

for (const width of [320, 1280]) {
  test(`branch lines center under down arrows at ${width}px and enlarged text`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 720 });
    await page.goto("/");
    await openSettings(page);
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const label of ["Animations", "Games", "Privacy"])
      await nav.locator("summary").filter({ hasText: label }).click();
    await expect(nav.locator("a, summary")).toHaveText([
      "Home",
      "About",
      "Animations",
      "Games",
      "Privacy",
      "Privacy policy",
      "Legal notice",
      "Contact",
    ]);
    await page.screenshot({
      path: testInfo.outputPath(`navigation-${width}.png`),
    });
    await nav
      .getByRole("link", { name: "Contact", exact: true })
      .scrollIntoViewIfNeeded();
    await expect(
      nav.getByRole("link", { name: "Contact", exact: true }),
    ).toBeInViewport();
    await page.screenshot({
      path: testInfo.outputPath(`navigation-${width}-contact-last.png`),
    });
    for (const fontSize of ["100%", "200%"]) {
      await page.evaluate((size) => {
        document.documentElement.style.fontSize = size;
      }, fontSize);
      for (const branch of await nav.locator("details[open]").all()) {
        const arrow = branch.locator(":scope > summary svg").nth(1);
        const children = branch.locator(":scope > ul");
        await expect(children).toHaveCSS("border-inline-start-width", "2px");
        const arrowBox = (await arrow.boundingBox())!;
        const listBox = (await children.boundingBox())!;
        expect(
          Math.abs(listBox.x + 1 - (arrowBox.x + arrowBox.width / 2)),
        ).toBeLessThan(0.5);
      }
      expect(
        await nav.evaluate((node) => node.scrollWidth <= node.clientWidth),
      ).toBe(true);
    }
  });
}

test("disclosures support keyboard use, independent branches, themes and ready destinations", async ({
  page,
}) => {
  await page.goto("/");
  await openSettings(page);
  const nav = page.getByRole("navigation", { name: "Primary" });
  const animations = nav.locator("summary").filter({ hasText: "Animations" });
  const games = nav.locator("summary").filter({ hasText: "Games" });
  const rightArrow = animations.locator("svg").nth(0);
  const downArrow = animations.locator("svg").nth(1);
  await expect(rightArrow).toBeVisible();
  await expect(downArrow).toBeHidden();
  await expect(rightArrow).toHaveCSS("width", "16px");
  await expect(animations.locator("svg").nth(2)).toHaveCSS("width", "24px");
  for (const link of await nav.getByRole("link").all())
    await expect(link.locator("svg")).toHaveCount(1);
  await animations.focus();
  await page.keyboard.press("Enter");
  await expect(animations.locator("..")).toHaveAttribute("open", "");
  await expect(rightArrow).toBeHidden();
  await expect(downArrow).toBeVisible();
  await expect(downArrow).toHaveCSS("width", "16px");
  await games.focus();
  await page.keyboard.press("Space");
  await expect(games.locator("..")).toHaveAttribute("open", "");
  await expect(animations.locator("..")).toHaveAttribute("open", "");
  await expect(nav.locator('[aria-disabled="true"]')).toHaveCount(4);
  await expect(nav.locator('[aria-disabled="true"] a')).toHaveCount(0);
  for (const row of await nav.locator('[aria-disabled="true"]').all())
    await expect(row.locator("svg")).toHaveCount(1);
  await games.press("Space");
  await expect(games.locator("..")).not.toHaveAttribute("open");
  await expect(games.locator("svg").nth(0)).toBeVisible();
  await expect(games.locator("svg").nth(1)).toBeHidden();

  for (const label of ["Default", "Dark", "Muted", "High Contrast", "System"]) {
    await openAppearance(page);
    await page.getByRole("button", { name: label, exact: true }).click();
    await page.getByRole("button", { name: "Navigation", exact: true }).click();
    for (const summary of await nav.locator("summary").all())
      await summary.click();
    const about = nav.getByRole("link", { name: "About", exact: true });
    await about.hover();
    const hoverColor = await about.evaluate((node) => {
      const reference = document.createElement("span");
      reference.style.color = "var(--fs-color-action-hover)";
      node.append(reference);
      const color = getComputedStyle(reference).color;
      reference.remove();
      return color;
    });
    await expect(about).toHaveCSS("color", hoverColor);
    await expect(about).toHaveCSS("border-width", "0px");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "About FunkSpace",
  );
});

test("native groups and legal destinations work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 320, height: 568 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const privacy = nav.locator("summary").filter({ hasText: "Privacy" });
    await expect(privacy.locator("svg").nth(0)).toBeVisible();
    await expect(privacy.locator("svg").nth(1)).toBeHidden();
    await nav.getByText("Privacy", { exact: true }).click();
    await expect(privacy.locator("svg").nth(0)).toBeHidden();
    await expect(privacy.locator("svg").nth(1)).toBeVisible();
    await nav.getByRole("link", { name: "Privacy policy" }).click();
    await expect(page).toHaveURL("/privacy");
    await nav.getByText("Privacy", { exact: true }).click();
    await nav.getByRole("link", { name: "Legal notice" }).click();
    await expect(page).toHaveURL("/impressum");
  } finally {
    await context.close();
  }
});
