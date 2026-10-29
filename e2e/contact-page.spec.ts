import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  openSettings,
  openFallbackNavigation,
  selectTheme,
  themes,
} from "./helpers/foundation";
const email = "info@funkspace.de";

// Mock only the serialized safe availability boolean in an otherwise real page.
// The fresh server is explicitly disabled, has no mail key, and denies provider egress.
// No test switch/fake adapter is shipped in the application.
async function controlledPage(page: Page) {
  await page.route(
    (url) => url.pathname === "/contact",
    async (route) => {
      if (route.request().resourceType() !== "document") {
        await route.continue();
        return;
      }
      const response = await route.fetch();
      const html = await response.text();
      const marker = JSON.stringify({ available: false })
        .slice(1, -1)
        .replaceAll('"', String.fromCharCode(92, 34));
      expect(html.split(marker)).toHaveLength(2);
      await route.fulfill({
        response,
        body: html.replace(marker, marker.replace("false", "true")),
      });
    },
  );
  await page.goto("/contact");
  await expect(
    page.getByRole("form", { name: "Contact inquiry" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeEnabled();
}
async function fill(page: Page) {
  await page.getByLabel(/Name/).fill("Visitor");
  await page.getByLabel(/Email/).fill("visitor@example.test");
  await page.getByLabel(/Message/).fill("Controlled browser inquiry.");
}

test("draft and retry identity stay out of storage and are discarded on reload", async ({
  page,
}) => {
  const identities: string[] = [];
  await page.route("**/api/contact", async (route) => {
    const body = route.request().postDataJSON();
    identities.push(body.submissionId);
    await route.abort();
  });
  await controlledPage(page);
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/couldn’t confirm delivery/)).toBeFocused();
  const stored = await page.evaluate(() =>
    JSON.stringify({
      local: { ...localStorage },
      session: { ...sessionStorage },
    }),
  );
  for (const value of [
    "visitor@example.test",
    "Controlled browser inquiry.",
    identities[0],
  ])
    expect(stored).not.toContain(value);
  await page.reload();
  await expect(
    page.getByRole("form", { name: "Contact inquiry" }),
  ).toBeVisible();
  for (const label of [/Name/, /Email/, /Message/])
    await expect(page.getByLabel(label)).toHaveValue("");
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/couldn’t confirm delivery/)).toBeFocused();
  expect(identities).toHaveLength(2);
  expect(identities[1]).not.toBe(identities[0]);
});

test.beforeEach(async ({ context, page, baseURL }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await context.route("**/*", async (route) => {
    if (new URL(route.request().url()).origin !== new URL(baseURL!).origin)
      await route.abort();
    else await route.continue();
  });
});

test("fresh server cannot deliver even a valid approved-origin request", async ({
  request,
  baseURL,
}) => {
  const response = await request.post("/api/contact", {
    headers: { Origin: baseURL! },
    data: {
      name: "",
      email: "visitor@example.test",
      message: "Controlled disabled test.",
      website: "",
      submissionId: "50a1a2b3-4567-4abc-8def-123456789abc",
    },
  });
  expect(response.status()).toBe(503);
  expect(await response.json()).toMatchObject({
    code: "configuration_unavailable",
  });
});

for (const kind of ["configuration", "rate_limit"] as const)
  test(`editing after ${kind} retains blocking guidance and input`, async ({
    page,
  }) => {
    let calls = 0;
    await page.route("**/api/contact", async (route) => {
      calls++;
      const submissionId = route.request().postDataJSON().submissionId;
      await route.fulfill({
        status: kind === "configuration" ? 503 : 429,
        contentType: "application/json",
        ...(kind === "rate_limit" ? { headers: { "Retry-After": "600" } } : {}),
        body: JSON.stringify(
          kind === "configuration"
            ? {
                status: "unavailable",
                code: "configuration_unavailable",
                submissionId,
              }
            : {
                status: "rate_limited",
                code: "rate_limited",
                submissionId,
                retryAfterSeconds: 600,
              },
        ),
      });
    });
    await controlledPage(page);
    await fill(page);
    await page.getByRole("button", { name: "Send message" }).click();
    const copy =
      kind === "configuration"
        ? /form is currently unavailable/
        : /Too many attempts/;
    await expect(page.getByText(copy)).toBeFocused();
    for (const [label, value] of [
      [/Name/, "Edited visitor"],
      [/Email/, "edited@example.test"],
      [/Message/, "Edited inquiry"],
    ] as const) {
      const field = page.getByLabel(label);
      await field.fill(value);
      await expect(field).toBeFocused();
      await expect(field).toHaveValue(value);
      await expect(page.getByText(copy)).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Send message" }),
      ).toBeDisabled();
      await page.evaluate(() =>
        document.querySelector("form")?.requestSubmit(),
      );
      await expect(page.getByText(copy)).toBeVisible();
      expect(calls).toBe(1);
    }
    expect(calls).toBe(1);
  });

test("disabled form stays readable on a short screen and never submits", async ({
  page,
}, info) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/contact")
      requests.push(request.method());
  });
  await page.setViewportSize({ width: 320, height: 360 });
  await page.goto("/contact");
  for (const theme of themes) {
    await selectTheme(page, theme);
    for (const scale of ["100%", "200%"]) {
      await page.evaluate(
        (size) =>
          document.documentElement.style.setProperty(
            "font-size",
            size,
            "important",
          ),
        scale,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  }
  for (const label of [/Name/, /Email/, /Message/])
    await expect(page.getByLabel(label)).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeDisabled();
  await page.evaluate(() => document.querySelector("form")?.requestSubmit());
  await expect(page).toHaveURL("/contact");
  expect(requests).toEqual([]);
  await page.screenshot({
    path: info.outputPath("contact-disabled-320-200percent.png"),
    fullPage: true,
  });
});

for (const javaScriptEnabled of [true, false])
  test.describe(`contact route JS ${javaScriptEnabled}`, () => {
    test.use({
      javaScriptEnabled,
      contextOptions: { reducedMotion: "reduce" },
    });
    test("SSR visible disabled fields, email fallback, refresh, current-page navigation and Back", async ({
      page,
    }) => {
      const response = await page.goto("/contact");
      expect(response?.status()).toBe(200);
      expect(await response!.text()).toContain(email);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Contact",
      );
      await expect(
        page.getByRole("form", { name: "Contact inquiry" }),
      ).toBeVisible();
      await expect(
        page.getByText(
          "Sending is currently disabled. Please contact me by email.",
        ),
      ).toBeVisible();
      for (const label of [/Name/, /Email/, /Message/]) {
        await expect(page.getByLabel(label)).toBeVisible();
        await expect(page.getByLabel(label)).toBeDisabled();
      }
      await expect(
        page.getByRole("button", { name: "Send message" }),
      ).toBeDisabled();
      await expect(
        page.getByRole("button", { name: "Send message" }),
      ).toHaveAttribute("type", "button");
      await expect(
        page.getByRole("main").getByRole("link", { name: email }),
      ).toHaveAttribute("href", `mailto:${email}`);
      await page
        .getByRole("main")
        .getByRole("link", { name: email })
        .click({ trial: true });
      await expect(
        page
          .getByRole("navigation", { name: "Main", exact: true })
          .getByRole("button", { name: "Contact" }),
      ).toHaveAttribute("aria-current", "page");
      if (javaScriptEnabled) await openSettings(page);
      else await openFallbackNavigation(page);
      await expect(
        page
          .getByRole("navigation", { name: "Primary" })
          .getByRole("button", { name: "Contact" }),
      ).toBeDisabled();
      if (javaScriptEnabled) await page.keyboard.press("Escape");
      else
        await page
          .locator("footer details")
          .first()
          .locator(":scope > summary")
          .click();
      await page.reload();
      await expect(
        page.getByRole("form", { name: "Contact inquiry" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Send message" }),
      ).toBeDisabled();
      await page
        .getByRole("navigation", { name: "Main", exact: true })
        .getByRole("link", { name: "Home", exact: true })
        .click();
      await expect(page).toHaveURL("/");
      await expect(page.locator("main section")).toHaveCount(2);
      await expect(page.locator('#contact, a[href="/#contact"]')).toHaveCount(
        0,
      );
      await page
        .getByRole("navigation", { name: "Main", exact: true })
        .getByRole("link", { name: "Contact" })
        .press("Enter");
      await expect(page).toHaveURL("/contact");
      if (javaScriptEnabled) await expect(page.getByRole("main")).toBeFocused();
      await page.goBack();
      await expect(page).toHaveURL("/");
    });
  });

test("controlled acceptance, duplicate guard, preserved snapshot and explicit reset", async ({
  page,
}) => {
  const bodies: Record<string, string>[] = [];
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/contact", async (route) => {
    const body = route.request().postDataJSON() as Record<string, string>;
    bodies.push(body);
    await gate;
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({
        status: "accepted",
        submissionId: body.submissionId,
      }),
    });
  });
  await controlledPage(page);
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByLabel(/Message/)).toHaveAttribute("readonly", "");
  await page.getByLabel(/Email/).press("Enter");
  await expect.poll(() => bodies.length).toBe(1);
  await expect(page.getByRole("status")).toHaveCount(0);
  release();
  await expect(page.getByText(/accepted for delivery/)).toBeFocused();
  await expect(page.getByLabel(/Message/)).toHaveValue(
    "Controlled browser inquiry.",
  );
  await page.getByRole("button", { name: "Send another message" }).click();
  await expect(page.getByLabel(/Name/)).toBeFocused();
  await expect(page.getByLabel(/Message/)).toHaveValue("");
});

test("non-JSON 429, uncertain identity, edits and malformed acceptance preserve input", async ({
  page,
}) => {
  const bodies: Record<string, string>[] = [];
  await page.route("**/api/contact", async (route) => {
    const body = route.request().postDataJSON() as Record<string, string>;
    bodies.push(body);
    if (bodies.length === 1)
      await route.fulfill({
        status: 429,
        headers: { "Retry-After": "1" },
        contentType: "text/html",
        body: "<p>Platform limit</p>",
      });
    else if (bodies.length === 2) await route.abort();
    else
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({
          status: "accepted",
          submissionId: "mismatched",
        }),
      });
  });
  await controlledPage(page);
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/Too many attempts/)).toBeFocused();
  const retry = page.getByRole("button", { name: "Retry same message" });
  await expect(retry).toBeEnabled();
  await retry.click();
  await expect(page.getByText(/couldn’t confirm delivery/)).toBeFocused();
  expect(bodies[1]).toEqual(bodies[0]);
  await retry.click();
  await expect(page.getByText(/couldn’t confirm delivery/)).toBeFocused();
  expect(bodies[2]).toEqual(bodies[0]);
  await page.getByLabel(/Name/).fill("Changed");
  await expect(page.getByText(/Editing creates a new message/)).toBeVisible();
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/couldn’t confirm delivery/)).toBeFocused();
  expect(bodies[3].submissionId).not.toBe(bodies[0].submissionId);
  await expect(page.getByLabel(/Message/)).toHaveValue(
    "Controlled browser inquiry.",
  );
});

test("required associations, keyboard, narrow/short/landscape/200% themes and static rendering", async ({
  page,
}, info) => {
  await page.route("**/api/contact", async (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        status: "unavailable",
        code: "configuration_unavailable",
        submissionId: route.request().postDataJSON().submissionId,
      }),
    }),
  );
  for (const viewport of [
    { width: 320, height: 360 },
    { width: 844, height: 390 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await controlledPage(page);
    await page.getByRole("button", { name: "Send message" }).press("Enter");
    await expect(page.getByLabel(/Email/)).toBeFocused();
    await expect(page.getByLabel(/Email/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    const described = await page
      .getByLabel(/Email/)
      .getAttribute("aria-describedby");
    expect(described).toBeTruthy();
    for (const key of described!.split(" "))
      await expect(page.locator(`[id="${key}"]`)).toBeAttached();
    for (const theme of themes) {
      await selectTheme(page, theme);
      await page.mouse.move(0, 0);
      const send = page.getByRole("button", { name: "Send message" });
      const paint = await send.evaluate((button) => {
        const sample = document.createElement("span");
        sample.style.backgroundColor = "var(--fs-color-content-primary)";
        button.append(sample);
        const expected = getComputedStyle(sample).backgroundColor;
        sample.remove();
        return { actual: getComputedStyle(button).backgroundColor, expected };
      });
      expect(paint.actual).toBe(paint.expected);
      for (const scale of ["100%", "200%"]) {
        await page.evaluate(
          (size) =>
            document.documentElement.style.setProperty(
              "font-size",
              size,
              "important",
            ),
          scale,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await expect(page.locator("canvas,[data-aperture-scene]")).toHaveCount(
          0,
        );
        await expect(page.locator('input[name="website"]')).toBeHidden();
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        );
      }
    }
    await fill(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/text is still here/)).toBeFocused();
    await page.screenshot({
      path: info.outputPath(`contact-${viewport.width}-200percent.png`),
      fullPage: true,
    });
  }
});
