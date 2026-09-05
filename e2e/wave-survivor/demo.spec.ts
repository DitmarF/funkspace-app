import { expect, test, type Locator, type Page } from "@playwright/test";
import { INITIAL_UPGRADE_DEFINITIONS } from "../../games/wave-survivor/src/domain/upgrades/index.js";
import { colors } from "../../common/generated/colors.js";
import type { RunResult } from "../../games/wave-survivor/src/index.js";

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
  boss = false,
  startImmediately = true,
): Promise<void> {
  await page.route(/\/dist\/index\.js(?:\?|$)/, (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `
        export function createGame({ canvas, onStatusChange, onEvent }) {
          canvas.tabIndex = 0;
          let phase = "idle";
          let waveNumber = ${exhausted || boss ? 4 : 1};
          const options = ${JSON.stringify(options)};
          const status = () => onStatusChange({ phase, waveNumber,
            currentHealth: 3, maximumHealth: 3, killCount: 4 });
          status();
          canvas.addEventListener("test-result", ({ detail }) => {
            phase = detail.outcome;
            waveNumber = detail.waveReached;
            onEvent(Object.freeze({ type: "run-finished", result: Object.freeze({ ...detail }) }));
            status();
          });
          return {
            start() {
              if (phase !== "idle") return;
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
              onEvent({ type: "wave-started", waveNumber, ${boss ? 'encounterKind: "boss"' : ""} });
              return true;
            },
            restart() {
              phase = "playing";
              waveNumber = 1;
              status();
              onEvent({ type: "wave-started", waveNumber });
            },
            pause() { if (phase === "playing") { phase = "paused"; status(); } },
            resume() { if (phase === "paused") { phase = "playing"; status(); } },
            setTheme() {}, destroy() {}
          };
        }
      `,
    }),
  );
  await page.goto("/");
  if (startImmediately)
    await page.getByRole("button", { name: "Start game" }).click();
  if (clearImmediately) await clearWave(page);
}

test("announces the boss after the final upgrade and restores movement focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await openDemo(page, false, true, true);
  await page.getByRole("button", { name: /Rapid Fire/ }).click();
  await expect(page.locator("#game-announcement")).toHaveText(
    "Boss entering from the top. Move clear of the entry point.",
  );
  await expect(page.locator("#game-canvas")).toBeFocused();
  await expect(page.locator("#game-upgrades")).toBeHidden();
});

async function clearWave(page: Page): Promise<void> {
  await page.locator("#game-canvas").dispatchEvent("test-clear-wave");
}

/** UI-only delivery fixture, deliberately separate from runtime completion tests. */
async function deliverMockResult(page: Page, result: RunResult): Promise<void> {
  await page.locator("#game-canvas").evaluate((canvas, result) => {
    canvas.dispatchEvent(new CustomEvent("test-result", { detail: result }));
  }, result);
}

async function setVisibility(page: Page, hidden: boolean): Promise<void> {
  await page.evaluate((hidden) => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => hidden,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}

test("real runtime stays idle until keyboard Start and only resumes paused gameplay", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#game-canvas")).toHaveAttribute(
    "data-game-state",
    "idle",
  );
  await expect(page.getByText(/You fire automatically/)).toBeVisible();
  await expect(page.getByText(/WASD or arrow keys/)).toBeVisible();
  await setVisibility(page, true);
  await setVisibility(page, false);
  await expect(page.locator("#game-canvas")).toHaveAttribute(
    "data-game-state",
    "idle",
  );
  await page.getByRole("button", { name: "Start game" }).focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#game-canvas")).toBeFocused();
  await expect(page.locator("#game-canvas")).toHaveAttribute(
    "data-game-state",
    "playing",
  );
  await page.keyboard.press("ArrowRight");
  await setVisibility(page, true);
  await expect(page.locator("#game-canvas")).toHaveAttribute(
    "data-game-state",
    "paused",
  );
  await setVisibility(page, false);
  await expect(page.locator("#game-canvas")).toHaveAttribute(
    "data-game-state",
    "playing",
  );
});

test.describe("native touch controls with mocked result delivery", () => {
  test.use({ hasTouch: true });
  test("Start and Replay respond to taps and terminal visibility never restarts", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openDemo(page, false, false, false, false);
    await page.getByRole("button", { name: "Start game" }).tap();
    await deliverMockResult(page, {
      outcome: "lost",
      score: 0,
      waveReached: 1,
      elapsedSeconds: 9.9,
    });
    await setVisibility(page, true);
    await setVisibility(page, false);
    await expect(page.locator("#game-canvas")).toHaveAttribute(
      "data-game-state",
      "lost",
    );
    await expect(page.locator("#game-result-time")).toHaveText("0:09");
    await page.getByRole("button", { name: "Replay", exact: true }).tap();
    await expect(page.locator("#game-canvas")).toHaveAttribute(
      "data-game-state",
      "playing",
    );
    await expect(page.locator("#game-result")).toBeHidden();
  });
});

for (const outcome of ["won", "lost"] as const)
  test(`mocked ${outcome} result displays supplied fields and keyboard Replay`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openDemo(page, false, false);
    await clearWave(page);
    await expect(page.locator("#game-upgrades")).toBeVisible();
    await deliverMockResult(page, {
      outcome,
      score: 1234,
      waveReached: 5,
      elapsedSeconds: 125.9,
    });
    await expect(page.getByRole("status")).toContainText(
      "Replay is available.",
    );
    await expect(page.locator("#game-canvas")).toHaveAttribute(
      "data-game-state",
      outcome,
    );
    await expect(page.locator("#game-result-outcome")).toHaveText(
      outcome === "won" ? "You won!" : "You lost",
    );
    await expect(page.locator("#game-result-score")).toHaveText("1234");
    await expect(page.locator("#game-result-wave")).toHaveText("5");
    await expect(page.locator("#game-result-time")).toHaveText("2:05");
    await expect(page.locator("#game-result-outcome")).toBeFocused();
    const restart = page.getByRole("button", { name: "Replay", exact: true });
    await expect(restart).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(restart).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(restart).toBeHidden();
    await expect(page.locator("#game-canvas")).toBeFocused();
    await expect(page.locator("#game-wave")).toHaveText("Wave: 1");
    await expect(page.locator("#game-result")).toBeHidden();
    await expect(page.locator("#game-upgrades")).toBeHidden();
    await expect(page.locator("#game-intro")).toBeHidden();
  });

test("renders the actual boss entry warning in monochrome reduced motion", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await openDemo(page, false, false);
  // The host fixture owns no loop. Render one real Canvas frame for visual QA.
  await page.evaluate(async (moduleUrl) => {
    const { CanvasGameRenderer } = await import(moduleUrl);
    const canvas = document.querySelector("#game-canvas");
    const viewport = document.querySelector("#game-viewport");
    const renderer = new CanvasGameRenderer(
      {
        canvas,
        viewport,
        theme: {
          colors: {
            background: "#111111",
            player: "#ffffff",
            enemy: "#ffffff",
            projectile: "#ffffff",
            effect: "#ffffff",
          },
        },
      },
      1,
    );
    renderer.render({
      phase: "playing",
      simulationTimeSeconds: 40,
      playerX: 180,
      playerY: 12,
      playerCollisionRadius: 12,
      playerCurrentHealth: 3,
      playerMaximumHealth: 3,
      isPlayerInvulnerable: false,
      killCount: 28,
      projectiles: [],
      joystick: {
        active: false,
        centerX: 72,
        centerY: 568,
        baseRadius: 52,
        knobX: 72,
        knobY: 568,
        knobRadius: 22,
      },
      enemies: [
        {
          id: 29,
          phase: "entering",
          x: 180,
          y: -96,
          collisionRadius: 24,
          entryWarning: "boss",
        },
      ],
    });
    renderer.destroy();
  }, `/@fs${process.cwd()}/games/wave-survivor/dist/renderer/CanvasGameRenderer.js`);
  await page
    .locator("#game-canvas")
    .screenshot({ path: testInfo.outputPath("boss-entry.png") });
});

for (const themeName of [
  "default",
  "dark",
  "muted",
  "dark-high-contrast",
  "monochrome",
] as const) {
  test(`renders four static boss actions in ${themeName} with reduced motion`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openDemo(page, false, false);
    const gameColors =
      themeName === "monochrome"
        ? {
            background: "#111111",
            player: "#ffffff",
            enemy: "#ffffff",
            projectile: "#ffffff",
            effect: "#ffffff",
          }
        : colors[themeName].game;
    const frames: string[] = [];
    for (const phase of [
      "approach",
      "wind-up",
      "charge",
      "recovery",
    ] as const) {
      frames.push(
        await page.evaluate(
          async ({ base, phase, gameColors }) => {
            const { CanvasGameRenderer } = await import(
              `${base}/renderer/CanvasGameRenderer.js`
            );
            const { createChargerBossState, getBossActionTelegraph } =
              await import(`${base}/domain/enemies/ChargerBoss.js`);
            const canvas =
              document.querySelector<HTMLCanvasElement>("#game-canvas")!;
            const viewport = document.querySelector("#game-viewport");
            const renderer = new CanvasGameRenderer(
              { canvas, viewport, theme: { colors: gameColors } },
              1,
            );
            const boss = createChargerBossState(29, { x: 180, y: 160 });
            boss.phase = "active";
            boss.action =
              phase === "wind-up" || phase === "charge"
                ? { phase, endsAtSeconds: 40.8, direction: { x: 0.6, y: 0.8 } }
                : { phase, endsAtSeconds: 40.8 };
            renderer.render({
              phase: "playing",
              simulationTimeSeconds: 40,
              playerX: 245,
              playerY: 380,
              playerCollisionRadius: 12,
              playerCurrentHealth: 3,
              playerMaximumHealth: 3,
              isPlayerInvulnerable: false,
              killCount: 28,
              projectiles: [],
              joystick: {
                active: false,
                centerX: 72,
                centerY: 568,
                baseRadius: 52,
                knobX: 72,
                knobY: 568,
                knobRadius: 22,
              },
              enemies: [
                {
                  id: boss.id,
                  phase: boss.phase,
                  x: boss.position.x,
                  y: boss.position.y,
                  collisionRadius: boss.collisionRadius,
                  bossAction: getBossActionTelegraph(boss, 40),
                },
              ],
            });
            const frame = canvas.toDataURL();
            renderer.destroy();
            return frame;
          },
          {
            base: `/@fs${process.cwd()}/games/wave-survivor/dist`,
            phase,
            gameColors,
          },
        ),
      );
      await page
        .locator("#game-canvas")
        .screenshot({ path: testInfo.outputPath(`boss-${phase}.png`) });
    }
    expect(new Set(frames).size).toBe(4);
  });
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

async function expectFullyReachable(
  item: Locator,
  panelSelector = "#game-upgrades",
): Promise<void> {
  await item.scrollIntoViewIfNeeded();
  const bounds = await item.evaluate((element, panelSelector) => {
    const rect = element.getBoundingClientRect();
    const panel = document.querySelector(panelSelector)!;
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
  }, panelSelector);
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
  test(`upgrade and result panels stay reachable in ${name}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height });
    await openDemo(page, false, false, false, false);
    await page.addStyleTag({
      content: `:root { font-size: ${textScale * 100}%; }`,
    });
    const intro = page.getByRole("region", { name: "Ready to survive?" });
    await expectFullyReachable(intro.getByRole("heading"), "#game-intro");
    await page.screenshot({ path: testInfo.outputPath("start.png") });
    await expectFullyReachable(
      intro.getByRole("button", { name: "Start game" }),
      "#game-intro",
    );
    await intro.getByRole("button", { name: "Start game" }).click();
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
    await deliverMockResult(page, {
      outcome: "won",
      score: 1290,
      waveReached: 5,
      elapsedSeconds: 65.75,
    });
    await expect(panel).toBeHidden();
    await expect(buttons).toHaveCount(0);
    const result = page.getByRole("region", { name: "You won!" });
    await expect(result).toBeVisible();
    await expectFullyReachable(result.getByRole("heading"), "#game-result");
    await expectFullyReachable(
      result.getByRole("button", { name: "Replay" }),
      "#game-result",
    );
    await page.screenshot({ path: testInfo.outputPath("result.png") });
    await result.getByRole("button", { name: "Replay" }).click();
    await expect(result).toBeHidden();
    await expect(page.locator("#game-canvas")).toBeFocused();
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
