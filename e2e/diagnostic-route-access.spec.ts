import { expect, test } from "@playwright/test";

const diagnosticRoutes = [
  "/typography",
  "/sandbox/logo-animation",
  "/sandbox/particles",
  "/sandbox/particles/aperture",
  "/sandbox/particles/lifecycle",
];

for (const javaScriptEnabled of [true, false]) {
  test.describe(`production diagnostics, JavaScript ${javaScriptEnabled ? "on" : "off"}`, () => {
    test.use({ javaScriptEnabled });
    for (const route of diagnosticRoutes) {
      test(`${route} returns a real 404 on direct load and refresh`, async ({
        page,
      }) => {
        const response = await page.goto(route);
        expect(response?.status()).toBe(404);
        await expect(
          page.getByRole("heading", { name: "Page not found" }),
        ).toBeVisible();
        const refresh = await page.reload();
        expect(refresh?.status()).toBe(404);
        await expect(
          page.getByRole("heading", { name: "Page not found" }),
        ).toBeVisible();
      });
    }
  });
}

test("production routing denies normalized, encoded and RSC diagnostic requests", async ({
  request,
}) => {
  for (const path of [
    "/sandbox",
    "/sandbox/particles/",
    "/%73andbox/particles",
    "/sandbox/%70articles/aperture",
    "/typography/",
    "/%74ypography",
    "/sandbox/particles/lifecycle?_rsc=probe",
  ]) {
    const response = await request.get(path, { headers: { RSC: "1" } });
    expect(response.status(), path).toBe(404);
  }
});
