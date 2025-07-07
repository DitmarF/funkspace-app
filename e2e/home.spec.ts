import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero heading", async ({ page }) => {
    await page.goto("/"); // baseURL libre
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText(/funkspace/i);
  });
});
