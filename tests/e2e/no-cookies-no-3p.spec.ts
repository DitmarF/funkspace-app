import { test, expect } from "@playwright/test";

test("no third-party requests or cookies on first paint", async ({
  page,
  context,
}) => {
  const thirdParty: string[] = [];
  page.on("request", (req) => {
    const u = new URL(req.url());
    const isHttp = u.protocol === "http:" || u.protocol === "https:";
    const isLocal =
      u.hostname.endsWith("localhost") || u.hostname.endsWith("funkspace.de");
    if (isHttp && !isLocal) thirdParty.push(u.hostname);
  });

  await page.goto("/");
  expect(
    thirdParty,
    `3P calls detected: ${thirdParty.join(", ")}`,
  ).toHaveLength(0);

  const cookies = await context.cookies();
  expect(cookies.length).toBe(0);
});
