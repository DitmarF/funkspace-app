import { expect, test } from "@playwright/test";

for (const width of [320, 768, 1280]) {
  test(`navigation tree grows with wrapping labels and native disclosures at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 568 });
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
}

test("tree sizes change without replacing open or focused native disclosures", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(
    "/iframe.html?id=layouts-portfolionavigationtree--default&viewMode=story",
  );
  const nav = page.getByRole("navigation", { name: "Primary" });
  const summary = nav.locator("summary").filter({ hasText: "Animations" });
  await summary.focus();
  await summary.press("Enter");
  const original = await summary.elementHandle();
  for (const width of [767, 768, 1280, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(summary).toBeFocused();
    await expect(summary.locator("..")).toHaveAttribute("open", "");
    expect(
      await summary.evaluate((node, previous) => node === previous, original),
    ).toBe(true);
    await expect(summary).toHaveCSS("font-size", width < 768 ? "16px" : "24px");
    await expect(summary).toHaveCSS(
      "min-height",
      width < 768 ? "48px" : "72px",
    );
    const icon = summary.locator(":scope > svg:visible");
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute("width", width < 768 ? "24" : "36");
    await expect(icon).toHaveCSS("width", width < 768 ? "24px" : "36px");
    await expect(summary.locator("span[aria-hidden] > svg:visible")).toHaveCSS(
      "width",
      width < 768 ? "16px" : "24px",
    );
    await expect(summary).toHaveAccessibleName("Animations");
  }
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
  await expect(motion.getByRole("button", { name: "System" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
