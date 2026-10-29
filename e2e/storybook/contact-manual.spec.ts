import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const manualUrl =
  "/iframe.html?id=contact-manual-preview--manual&viewMode=story";
const form = (page: Page) =>
  page.getByRole("form", { name: "Contact inquiry" });
const controls = (page: Page) =>
  page.getByRole("complementary", { name: "Manual test controls" });
const count = (page: Page) => page.getByTestId("manual-request-count");
const lastId = (page: Page) => page.getByTestId("manual-last-id");
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const sample = {
  name: "Sample visitor",
  email: "visitor@example.test",
  message: "Sample manual contact inquiry.",
};

async function open(page: Page) {
  await page.goto(manualUrl);
  await expect(
    page.getByRole("heading", {
      name: "Simulated contact test — no email is sent",
    }),
  ).toBeVisible();
  await expect(
    form(page).getByRole("button", { name: "Send message", exact: true }),
  ).toBeEnabled();
  await controls(page)
    .getByText("Test request and retry evidence", { exact: true })
    .click();
  await expect(count(page)).toHaveText("0");
}
async function select(page: Page, scenario: string) {
  await controls(page)
    .getByLabel("Next response", { exact: true })
    .selectOption(scenario);
}
async function theme(page: Page, value: string) {
  await controls(page).getByLabel("Preview theme").selectOption(value);
  if (value === "light")
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  else
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      value === "highContrast" ? "dark-high-contrast" : value,
    );
}
async function fill(page: Page) {
  await form(page).getByLabel("Name", { exact: true }).fill(sample.name);
  await form(page).getByLabel(/Email/).fill(sample.email);
  await form(page)
    .getByLabel(/Message/)
    .fill(sample.message);
}
async function send(page: Page) {
  await form(page)
    .getByRole("button", { name: /^(Send message|Retry same message)$/ })
    .click();
}
async function preserved(page: Page) {
  await expect(form(page).getByLabel("Name", { exact: true })).toHaveValue(
    sample.name,
  );
  await expect(form(page).getByLabel(/Email/)).toHaveValue(sample.email);
  await expect(form(page).getByLabel(/Message/)).toHaveValue(sample.message);
}

test.beforeEach(async ({ context, baseURL }) => {
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === "/api/contact" && request.method() === "POST") {
      await route.abort();
      throw new Error("The manual fixture attempted a real /api/contact POST.");
    }
    if (url.origin !== new URL(baseURL!).origin) {
      await route.abort();
      throw new Error(
        "The manual fixture attempted unexpected external traffic.",
      );
    }
    await route.continue();
  });
});

test("static index discovers all eight form stories and the phone manual fixture", async ({
  request,
}) => {
  const response = await request.get("/index.json");
  expect(response.ok()).toBe(true);
  const index: unknown = await response.json();
  expect(
    typeof index === "object" && index !== null && "entries" in index,
  ).toBe(true);
  const entries = Object.values(
    (index as { entries: Record<string, unknown> }).entries,
  )
    .filter(
      (entry): entry is { id: string; type: string } =>
        typeof entry === "object" &&
        entry !== null &&
        "id" in entry &&
        typeof entry.id === "string" &&
        "type" in entry &&
        typeof entry.type === "string",
    )
    .filter(
      (entry) => entry.type === "story" && entry.id.startsWith("contact-"),
    );
  expect(entries.map((entry) => entry.id)).toHaveLength(9);
  expect(entries.map((entry) => entry.id)).toContain(
    "contact-manual-preview--manual",
  );
  expect(
    entries.filter((entry) => entry.id.startsWith("contact-contactform--")),
  ).toHaveLength(8);
});

test("idle, validation focus and disabled presentation use the actual form without transport", async ({
  page,
}) => {
  await open(page);
  await expect(page.locator('[id="storybook-root"] iframe')).toHaveCount(0);
  await expect(controls(page).locator("form")).toHaveCount(0);
  await expect(controls(page).getByLabel("Next response")).toBeVisible();
  await send(page);
  await expect(form(page).getByLabel(/Email/)).toBeFocused();
  await expect(form(page).getByLabel(/Email/)).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(form(page).getByLabel(/Message/)).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(count(page)).toHaveText("0");
  await expect(form(page).getByRole("status")).toHaveCount(0);
  await expect(form(page).getByRole("alert")).toHaveCount(0);
  await controls(page)
    .getByLabel("Show delivery-disabled presentation")
    .check();
  for (const label of [/Name/, /Email/, /Message/]) {
    await expect(form(page).getByLabel(label)).toBeVisible();
    await expect(form(page).getByLabel(label)).toBeDisabled();
  }
  await expect(
    form(page).getByText(/Sending is currently disabled/),
  ).toBeVisible();
  await expect(
    form(page).getByRole("button", { name: "Send message" }),
  ).toBeDisabled();
  await page.evaluate(() =>
    document
      .querySelector<HTMLFormElement>('form[aria-label="Contact inquiry"]')
      ?.requestSubmit(),
  );
  await expect(count(page)).toHaveText("0");
  await expect(
    page.getByRole("link", { name: "info@funkspace.de" }),
  ).toHaveAttribute("href", "mailto:info@funkspace.de");
});

test("matching acceptance shows confirmation without another send action", async ({
  page,
}) => {
  await open(page);
  await fill(page);
  await send(page);
  await expect(form(page).getByText(/accepted for delivery/)).toBeFocused();
  await expect(
    form(page).getByText(/does not confirm mailbox receipt/),
  ).toBeVisible();
  await expect(count(page)).toHaveText("1");
  await expect(lastId(page)).toHaveText(uuidV4);
  for (const label of [/Name/, /Email/, /Message/])
    await expect(form(page).getByLabel(label)).toHaveCount(0);
  await expect(form(page).getByRole("button", { name: /send/i })).toHaveCount(
    0,
  );
  await page.evaluate(() =>
    document
      .querySelector<HTMLFormElement>('form[aria-label="Contact inquiry"]')
      ?.requestSubmit(),
  );
  await expect(count(page)).toHaveText("1");
});

test("held submission keeps inputs read-only, prevents duplicate Enter and releases once", async ({
  page,
}) => {
  await open(page);
  await select(page, "held");
  await fill(page);
  await send(page);
  await expect(count(page)).toHaveText("1");
  await expect(controls(page).getByLabel("Next response")).toBeDisabled();
  for (const label of [/Name/, /Email/, /Message/])
    await expect(form(page).getByLabel(label)).toHaveAttribute("readonly", "");
  await expect(
    form(page).getByRole("button", { name: "Retry same message" }),
  ).toBeDisabled();
  await expect(form(page).getByRole("status")).toHaveCount(0);
  await expect(form(page).getByText(/Sending|Working/)).toHaveCount(0);
  await form(page).getByLabel("Name", { exact: true }).press("Enter");
  await page.evaluate(() => {
    const contact = document.querySelector<HTMLFormElement>(
      'form[aria-label="Contact inquiry"]',
    );
    contact?.requestSubmit();
    contact?.requestSubmit();
  });
  await expect(count(page)).toHaveText("1");
  await theme(page, "dark");
  await preserved(page);
  await expect(count(page)).toHaveText("1");
  await controls(page)
    .getByRole("button", { name: "Release accepted response" })
    .click();
  await expect(form(page).getByText(/accepted for delivery/)).toBeFocused();
  await expect(count(page)).toHaveText("1");
  await expect(
    controls(page).getByRole("button", { name: "Release accepted response" }),
  ).toBeDisabled();
});

test("configuration guidance survives each edit while submission remains blocked", async ({
  page,
}) => {
  await open(page);
  await select(page, "configuration");
  await fill(page);
  await send(page);
  await expect(
    form(page).getByText(/form is currently unavailable/),
  ).toBeFocused();
  for (const [label, value] of [
    [/Name/, "Edited sample"],
    [/Email/, "edited@example.test"],
    [/Message/, "Edited sample inquiry."],
  ] as const) {
    const field = form(page).getByLabel(label);
    await field.fill(value);
    await expect(field).toBeFocused();
    await expect(field).toHaveValue(value);
    await expect(
      form(page).getByText(/form is currently unavailable/),
    ).toBeVisible();
    await expect(
      form(page).getByRole("button", { name: "Send message" }),
    ).toBeDisabled();
    await page.evaluate(() =>
      document
        .querySelector<HTMLFormElement>('form[aria-label="Contact inquiry"]')
        ?.requestSubmit(),
    );
    await expect(count(page)).toHaveText("1");
  }
  await select(page, "accepted");
  await expect(
    form(page).getByText(/form is currently unavailable/),
  ).toBeVisible();
  await expect(count(page)).toHaveText("1");
  await expect(
    form(page).getByRole("button", { name: "Send message" }),
  ).toBeDisabled();
});

test("HTML429 keeps edit guidance and waits for an explicit new-identity submission", async ({
  page,
}) => {
  await open(page);
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 100));
  await select(page, "rate_html");
  await fill(page);
  await send(page);
  await expect(form(page).getByText(/Too many attempts/)).toBeFocused();
  const originalId = await lastId(page).innerText();
  for (const [label, value] of [
    [/Name/, "Edited sample"],
    [/Email/, "edited@example.test"],
    [/Message/, "Edited sample inquiry."],
  ] as const) {
    const field = form(page).getByLabel(label);
    await field.fill(value);
    await expect(field).toBeFocused();
    await expect(field).toHaveValue(value);
    await expect(form(page).getByText(/Too many attempts/)).toBeVisible();
    await expect(
      form(page).getByRole("button", { name: "Send message" }),
    ).toBeDisabled();
    await page.evaluate(() =>
      document
        .querySelector<HTMLFormElement>('form[aria-label="Contact inquiry"]')
        ?.requestSubmit(),
    );
    await expect(count(page)).toHaveText("1");
  }
  await select(page, "accepted");
  // Global theme changes use Storybook timers; test them in the separate real-
  // clock retry case. Here keep only the form's cooldown clock paused.
  await expect(count(page)).toHaveText("1");
  await page.clock.runFor(5_000);
  await expect(
    form(page).getByRole("button", { name: "Send message" }),
  ).toBeEnabled();
  await expect(count(page)).toHaveText("1");
  await expect(form(page).getByLabel(/Message/)).toHaveValue(
    "Edited sample inquiry.",
  );
  await send(page);
  await expect(form(page).getByText(/accepted for delivery/)).toBeFocused();
  await expect(count(page)).toHaveText("2");
  await expect(lastId(page)).not.toHaveText(originalId);
  await expect(form(page).getByLabel(/Message/)).toHaveCount(0);
});

test("response and theme changes retain an unchanged draft and retry identity", async ({
  page,
}) => {
  await open(page);
  await select(page, "network_error");
  await fill(page);
  await send(page);
  await expect(form(page).getByText(/couldn’t confirm delivery/)).toBeFocused();
  const originalId = await lastId(page).innerText();
  await select(page, "uncertain");
  await theme(page, "dark");
  await preserved(page);
  await expect(count(page)).toHaveText("1");
  await expect(lastId(page)).toHaveText(originalId);
  await send(page);
  await expect(form(page).getByText(/couldn’t confirm delivery/)).toBeFocused();
  await expect(count(page)).toHaveText("2");
  await expect(lastId(page)).toHaveText(originalId);
  await select(page, "accepted");
  await theme(page, "highContrast");
  await preserved(page);
  await expect(count(page)).toHaveText("2");
  await send(page);
  await expect(form(page).getByText(/accepted for delivery/)).toBeFocused();
  await expect(count(page)).toHaveText("3");
  await expect(lastId(page)).toHaveText(originalId);
  const stored = await page.evaluate(() =>
    JSON.stringify({
      local: { ...localStorage },
      session: { ...sessionStorage },
    }),
  );
  for (const value of [sample.email, sample.message, originalId])
    expect(stored).not.toContain(value);
});

test("23-hour test clock ends same-key retry without clearing text or sending", async ({
  page,
}) => {
  await open(page);
  await select(page, "network_error");
  await fill(page);
  await send(page);
  await expect(form(page).getByText(/couldn’t confirm delivery/)).toBeFocused();
  const originalId = await lastId(page).innerText();
  await controls(page)
    .getByRole("button", { name: "Advance retry clock by 23 hours" })
    .click();
  await expect(form(page).getByText(/retry window has ended/)).toBeVisible();
  await preserved(page);
  await expect(
    form(page).getByRole("button", { name: "Retry same message" }),
  ).toBeDisabled();
  await page.evaluate(() =>
    document
      .querySelector<HTMLFormElement>('form[aria-label="Contact inquiry"]')
      ?.requestSubmit(),
  );
  await expect(count(page)).toHaveText("1");
  await expect(lastId(page)).toHaveText(originalId);
  await controls(page)
    .getByRole("button", { name: "Reset test and clear draft" })
    .click();
  await controls(page)
    .getByText("Test request and retry evidence", { exact: true })
    .click();
  await expect(count(page)).toHaveText("0");
  for (const label of [/Name/, /Email/, /Message/])
    await expect(form(page).getByLabel(label)).toHaveValue("");
});

for (const scenario of ["fetch_timeout", "body_timeout"] as const)
  test(`${scenario} uses the real 15-second browser deadline and preserves text`, async ({
    page,
  }) => {
    await open(page);
    await select(page, scenario);
    await fill(page);
    const started = Date.now();
    await send(page);
    await expect(count(page)).toHaveText("1");
    await expect(form(page).getByLabel(/Message/)).toHaveAttribute(
      "readonly",
      "",
    );
    await expect(form(page).getByText(/couldn’t confirm delivery/)).toBeFocused(
      { timeout: 20_000 },
    );
    expect(Date.now() - started).toBeGreaterThanOrEqual(14_500);
    await preserved(page);
    await expect(count(page)).toHaveText("1");
    await expect(
      form(page).getByRole("button", { name: "Retry same message" }),
    ).toBeEnabled();
    await expect(controls(page)).toContainText(
      scenario === "fetch_timeout"
        ? "Fetch aborts: 1"
        : "Body cancellations: 1",
    );
  });

test("narrow, short and landscape fixture stays accessible at 200% in every theme", async ({
  page,
}, info) => {
  test.setTimeout(60_000);
  await open(page);
  const controlsAreSeparate = await controls(page).evaluate(
    (node) => node.closest("form") === null,
  );
  expect(controlsAreSeparate).toBe(true);
  await fill(page);
  for (const size of [
    { width: 320, height: 360 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(size);
    for (const value of ["light", "dark", "muted", "highContrast"]) {
      await theme(page, value);
      await page.evaluate(() =>
        document.documentElement.style.setProperty(
          "font-size",
          "200%",
          "important",
        ),
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await preserved(page);
      await expect(count(page)).toHaveText("0");
      const accessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(accessibility.violations).toEqual([]);
    }
    await page.screenshot({
      path: info.outputPath(`manual-${size.width}-200percent.png`),
      fullPage: true,
    });
  }
  await expect(page.locator('input[name="website"]')).toBeHidden();
  await expect(page.locator('input[name="website"]')).toHaveAttribute(
    "tabindex",
    "-1",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
});
