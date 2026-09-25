import { expect, test } from "@playwright/test";

test("navigation tree grows with wrapping labels and native disclosures", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(
    "/iframe.html?id=layouts-portfolionavigationtree--growing-content&viewMode=story",
  );
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  const nav = page.getByRole("navigation", { name: "Primary" });
  const branch = nav
    .locator("summary")
    .filter({ hasText: "A collection with a longer wrapping label" });
  await branch.focus();
  await page.keyboard.press("Enter");
  await expect(
    nav.getByText("A future experiment with a long descriptive title"),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: test.info().outputPath("growing-tree.png") });
});

test("controlled Motion story supports long, enlarged narrow content without production persistence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(
    "/iframe.html?id=layouts-portfolionavigation--controlled-motion-fixture&viewMode=story",
  );
  await expect(page.getByText(/Motion fixture only/)).toBeVisible();
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Accessibility", exact: true })
    .click();
  const motion = page.getByRole("group", { name: "Motion", exact: true });
  await motion.getByRole("button", { name: "Off", exact: true }).click();
  await expect(
    motion.getByRole("button", { name: "Off", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    motion.getByRole("button", { name: "Off", exact: true }),
  ).toBeInViewport();
  expect(
    await page
      .getByRole("dialog")
      .evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Menu: navigation and settings", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Accessibility", exact: true })
    .click();
  await expect(
    motion.getByRole("button", { name: "Follow system" }),
  ).toHaveAttribute("aria-pressed", "true");
});
