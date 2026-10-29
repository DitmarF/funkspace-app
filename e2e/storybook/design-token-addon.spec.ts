import { expect, test } from "@playwright/test";

test("the static manager loads design-token data and the token catalogue", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const tokenData = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/design-tokens.source.json",
  );

  await page.goto("/?path=/story/foundations-tokens--overview");
  const response = await tokenData;
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual(
    expect.objectContaining({
      cssTokens: expect.any(Object),
      svgTokens: expect.any(Object),
    }),
  );
  await expect(
    page
      .frameLocator("#storybook-preview-iframe")
      .getByRole("heading", { name: "Color palettes", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Design Tokens", exact: true }).click();
  const panel = page.getByRole("tabpanel", { name: "Design Tokens" }).first();
  await expect(panel.getByText("SVG Icons", { exact: true })).toBeVisible();
  await expect(panel.getByText("window", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
