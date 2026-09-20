import { openSettings } from "../helpers/foundation";
import { expect, test, type Page } from "@playwright/test";

type Early = {
  theme: string | null;
  reads: number;
  queries: number;
  pressed: number;
  at: number;
};
type Probe = { early: Early[]; paints: { name: string; at: number }[] };
declare global {
  interface Window {
    themeProbe: Probe;
  }
}

async function instrument(
  page: Page,
  stored: string | null,
  fault = "",
  disabled = false,
) {
  await page.addInitScript(
    ({ stored, fault, disabled }) => {
      if (!sessionStorage.getItem("theme-test-seeded")) {
        if (stored === null) localStorage.removeItem("theme");
        else localStorage.setItem("theme", stored);
        sessionStorage.setItem("theme-test-seeded", "yes");
      }
      const probe: Probe = { early: [], paints: [] };
      window.themeProbe = probe;
      new PerformanceObserver((list) => {
        for (const paint of list.getEntries())
          probe.paints.push({ name: paint.name, at: paint.startTime });
      }).observe({ type: "paint", buffered: true });
      let reads = 0;
      let queries = 0;
      const get = Storage.prototype.getItem;
      Storage.prototype.getItem = function (key) {
        if (key === "theme") {
          reads++;
          if (fault === "read") throw new Error("blocked read");
        }
        return get.call(this, key);
      };
      if (fault === "access")
        Object.defineProperty(window, "localStorage", {
          get: () => {
            reads++;
            throw new Error("blocked storage access");
          },
        });
      if (fault === "write") {
        const set = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          if (key === "theme") throw new Error("blocked write");
          return set.call(this, key, value);
        };
      }
      const match = window.matchMedia.bind(window);
      window.matchMedia = (query) => {
        if (query === "(prefers-color-scheme: dark)") queries++;
        if (fault === "media-call") throw new Error("blocked media call");
        return match(query);
      };
      if (fault === "media-access")
        Object.defineProperty(window, "matchMedia", {
          get: () => {
            throw new Error("blocked media access");
          },
        });
      if (fault === "media-absent")
        Object.defineProperty(window, "matchMedia", { value: undefined });

      // Observe the real Next beforeInteractive insertion. No Next chunks are
      // blocked. Native append executes inline code synchronously, before the
      // Next script-queue promise resolves and hydrates ServiceProvider.
      const append = Node.prototype.appendChild;
      Node.prototype.appendChild = function <T extends Node>(child: T): T {
        const bootstrap =
          child instanceof HTMLScriptElement && child.id === "theme-script";
        if (bootstrap && disabled) child.textContent = "";
        const result = append.call(this, child) as T;
        if (bootstrap)
          probe.early.push({
            theme: document.documentElement.getAttribute("data-theme"),
            reads,
            queries,
            pressed: document.querySelectorAll('[aria-pressed="true"]').length,
            at: performance.now(),
          });
        return result;
      };
    },
    { stored, fault, disabled },
  );
}

function assertEarly(early: Early, theme: string | null, storageAccesses = 1) {
  expect(
    early.theme,
    "theme at synchronous bootstrap completion, before provider",
  ).toBe(theme);
  expect(early.reads).toBe(storageAccesses);
  expect(early.pressed).toBe(0);
}

const pageErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ colorScheme: "dark" });
});
test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

for (const [stored, expected] of [
  ["default", null],
  ["dark", "dark"],
  ["muted", "muted"],
  ["dark-high-contrast", "dark-high-contrast"],
  ["system", "dark"],
  [null, "dark"],
  ["invalid", "dark"],
] as const) {
  test(`early ${stored ?? "missing"} then runtime handoff`, async ({
    page,
  }) => {
    await instrument(page, stored);
    const response = await page.goto("/");
    expect(response?.ok()).toBe(true);
    await expect
      .poll(() => page.evaluate(() => window.themeProbe.early.length))
      .toBe(1);
    const early = await page.evaluate(() => window.themeProbe.early[0]);
    assertEarly(early, expected);
    expect(early.queries).toBe(
      stored && !["system", "invalid"].includes(stored) ? 0 : 1,
    );
    const label =
      stored === "default"
        ? "Default"
        : stored === "dark"
          ? "Dark"
          : stored === "muted"
            ? "Muted"
            : stored === "dark-high-contrast"
              ? "High Contrast"
              : "System";
    await openSettings(page);
    await expect(
      page.getByRole("button", { name: label, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await test.info().attach("pre-provider.json", {
      body: JSON.stringify(early),
      contentType: "application/json",
    });
  });
}

for (const fault of [
  "access",
  "read",
  "write",
  "media-call",
  "media-access",
  "media-absent",
]) {
  test(`failure ${fault} retains usable initialization and subscriptions`, async ({
    page,
  }) => {
    await instrument(page, null, fault);
    await page.goto("/");
    await expect
      .poll(() => page.evaluate(() => window.themeProbe.early.length))
      .toBe(1);
    assertEarly(
      await page.evaluate(() => window.themeProbe.early[0]),
      fault.startsWith("media") ? null : "dark",
      fault === "access" ? 2 : 1, // getter is also accessed by best-effort normalization
    );
    await openSettings(page);
    await expect(
      page.getByRole("button", { name: "System", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Muted", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "muted");
    await openSettings(page);
    await expect(
      page.getByRole("button", { name: "Muted", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  });
}

test("negative control fails the early check although hydrated ThemeService fixes appearance", async ({
  page,
}) => {
  await instrument(page, "dark", "", true);
  await page.goto("/");
  await openSettings(page);
  await expect(
    page.getByRole("button", { name: "Dark", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const early = await page.evaluate(() => window.themeProbe.early[0]);
  expect(early).toMatchObject({ theme: null, reads: 0, pressed: 0 });
  expect(() => assertEarly(early, "dark")).toThrow();
  await test.info().attach("negative-control.json", {
    body: JSON.stringify(early),
    contentType: "application/json",
  });
});

test("reload, OS changes, controls and same-layout history navigation preserve authority", async ({
  page,
}) => {
  await instrument(page, "system");
  await page.goto("/");
  await openSettings(page);
  await expect(
    page.getByRole("button", { name: "System", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  await page.getByRole("button", { name: "Muted", exact: true }).click();
  await page.evaluate(() => history.pushState(null, "", "/?appearance=check"));
  await expect(page).toHaveURL(/appearance=check/);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "muted");
  expect(await page.evaluate(() => window.themeProbe.early.length)).toBe(1);
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => window.themeProbe.early.length))
    .toBe(1);
  assertEarly(await page.evaluate(() => window.themeProbe.early[0]), "muted");
  await openSettings(page);
  await expect(
    page.getByRole("button", { name: "Muted", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("cold throttled load records paint timing separately from pre-provider evidence", async ({
  page,
  context,
}) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 200_000,
    uploadThroughput: 100_000,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await instrument(page, "dark");
  await page.goto("/");
  await openSettings(page);
  await expect(
    page.getByRole("button", { name: "Dark", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => page.evaluate(() => window.themeProbe.paints.length))
    .toBeGreaterThan(0);
  const probe = await page.evaluate(() => window.themeProbe);
  assertEarly(probe.early[0], "dark");
  await test.info().attach("cold-load-timing.json", {
    body: JSON.stringify(probe),
    contentType: "application/json",
  });
  // Playwright trace includes screenshots; these observations do not guarantee
  // theme before first paint on every network/device with this Next strategy.
  await cdp.detach();
});

test("no JavaScript retains default static content", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://localhost:3100/");
    await expect(
      page.getByRole("heading", { name: "FunkSpace" }),
    ).toBeVisible();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  } finally {
    await context.close();
  }
});
