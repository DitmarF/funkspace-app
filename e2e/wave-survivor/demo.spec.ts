import { expect, test, type Locator, type Page } from "@playwright/test";
import { INITIAL_UPGRADE_DEFINITIONS } from "../../games/wave-survivor/src/domain/upgrades/index.js";

const options = INITIAL_UPGRADE_DEFINITIONS.map(
  ({ id, title, description }) => ({
    id,
    title,
    description,
  }),
);

/** Exercise the real demo DOM with a deterministic public-contract host fixture. */
async function openDemo(
  page: Page,
  exhausted = false,
  clearImmediately = true,
): Promise<void> {
  await page.route(/\/dist\/index\.js(?:\?|$)/, (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `
        export function createGame({ canvas, onStatusChange, onEvent }) {
          canvas.tabIndex = 0;
          let phase = "idle";
          let waveNumber = ${exhausted ? 16 : 1};
          const options = ${JSON.stringify(options)};
          const status = () => onStatusChange({ phase, waveNumber,
            currentHealth: 3, maximumHealth: 3, killCount: 4 });
          return {
            start() {
              phase = "playing";
              status();
              onEvent({ type: "wave-started", waveNumber });
              canvas.addEventListener("test-clear-wave", () => {
                phase = ${JSON.stringify(exhausted ? "wave-cleared" : "choosing-upgrade")};
                onEvent({ type: "wave-cleared", waveNumber });
                status();
                if (phase === "choosing-upgrade") {
                  onEvent({ type: "upgrade-choice-requested", clearedWaveNumber: waveNumber, options });
                }
              }, { once: true });
            },
            chooseUpgrade(id) {
              if (phase !== "choosing-upgrade" || !options.some(option => option.id === id)) return false;
              phase = "playing";
              waveNumber += 1;
              status();
              onEvent({ type: "wave-started", waveNumber });
              return true;
            },
            restart() {
              phase = "playing";
              waveNumber = 1;
              status();
              onEvent({ type: "wave-started", waveNumber });
            },
            pause() {}, resume() {}, setTheme() {}, destroy() {}
          };
        }
      `,
    }),
  );
  await page.goto("/");
  if (clearImmediately) await clearWave(page);
}

async function clearWave(page: Page): Promise<void> {
  await page.locator("#game-canvas").dispatchEvent("test-clear-wave");
}

async function readPageLayout(page: Page) {
  return page.evaluate(() => ({
    scrollY: window.scrollY,
    pageHeight: document.documentElement.scrollHeight,
    canvas: document
      .querySelector("#game-canvas")!
      .getBoundingClientRect()
      .toJSON(),
    status: document
      .querySelector(".game-status-panel")!
      .getBoundingClientRect()
      .toJSON(),
  }));
}

async function expectFullyReachable(item: Locator): Promise<void> {
  await item.scrollIntoViewIfNeeded();
  const bounds = await item.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const panel = document.querySelector("#game-upgrades")!;
    const clip = panel.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      clipTop: Math.max(0, clip.top),
      clipBottom: Math.min(window.innerHeight, clip.bottom),
      clipLeft: Math.max(0, clip.left),
      clipRight: Math.min(window.innerWidth, clip.left + panel.clientWidth),
    };
  });
  expect(bounds.top).toBeGreaterThanOrEqual(bounds.clipTop - 1);
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.clipBottom + 1);
  expect(bounds.left).toBeGreaterThanOrEqual(bounds.clipLeft - 1);
  expect(bounds.right).toBeLessThanOrEqual(bounds.clipRight + 1);
}

for (const { name, width, height, textScale } of [
  { name: "mobile portrait", width: 390, height: 844, textScale: 1 },
  { name: "short portrait", width: 320, height: 480, textScale: 1 },
  { name: "landscape", width: 640, height: 360, textScale: 1 },
  { name: "enlarged text", width: 390, height: 600, textScale: 2 },
]) {
  test(`overlay stays reachable without shifting the page in ${name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await openDemo(page, false, false);
    await page.addStyleTag({
      content: `:root { font-size: ${textScale * 100}%; }`,
    });
    const playingLayout = await readPageLayout(page);
    await clearWave(page);
    const panel = page.getByRole("region", { name: "Choose an upgrade" });
    const buttons = panel.getByRole("button");
    await expect(buttons).toHaveCount(3);
    await expect(buttons.first()).toBeFocused();
    expect(await readPageLayout(page)).toEqual(playingLayout);
    const panelBounds = await panel.boundingBox();
    const canvasBounds = await page.locator("#game-canvas").boundingBox();
    expect(panelBounds!.y).toBeLessThan(canvasBounds!.y + canvasBounds!.height);
    expect(panelBounds!.y + panelBounds!.height).toBeGreaterThan(
      canvasBounds!.y,
    );
    await expectFullyReachable(panel.getByRole("heading"));
    expect(await readPageLayout(page)).toEqual(playingLayout);
    for (const button of await buttons.all()) {
      await expectFullyReachable(button);
      const rect = await button.boundingBox();
      expect(rect!.height).toBeGreaterThanOrEqual(44);
      expect(rect!.width).toBeGreaterThanOrEqual(200);
    }
    // Returning to the start must reveal the heading, not negative overflow.
    await expectFullyReachable(panel.getByRole("heading"));
    await buttons.first().focus();
    await page.keyboard.press("Enter");
    await expect(panel).toBeHidden();
    await expect(page.locator("#game-canvas")).toBeFocused();
    await expect(page.locator("#game-wave")).toHaveText("Wave: 2");
    expect(await readPageLayout(page)).toEqual(playingLayout);
  });
}

test("exhausted upgrades announce a reachable restart and restore canvas focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 360 });
  await openDemo(page, true);
  await expect(page.getByRole("status")).toContainText("All upgrades maxed");
  await expect(page.locator("#game-upgrades")).toBeHidden();
  const restart = page.getByRole("button", { name: "Restart game" });
  await expect(restart).toBeVisible();
  await expect(restart).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#game-wave")).toHaveText("Wave: 1");
  await expect(page.getByRole("status")).toContainText("New run started");
  await expect(restart).toBeHidden();
  await expect(page.locator("#game-canvas")).toBeFocused();
});
