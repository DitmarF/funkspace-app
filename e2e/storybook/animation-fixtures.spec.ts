import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const logo =
  "/iframe.html?id=components-logo-logomotion--controls&viewMode=story";
const aperture = "/iframe.html?id=scene-aperture--replacement&viewMode=story";

test("logo timeline follows playback, pauses to scrub, restarts and obeys Off", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(logo);
  const slider = page.getByRole("slider", { name: "Animation timeline" });
  await page.getByRole("button", { name: "On", exact: true }).click();
  await expect(slider).toBeEnabled();
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await expect
    .poll(async () => Number(await slider.inputValue()))
    .toBeGreaterThan(20);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const held = await slider.inputValue();
  await page.waitForTimeout(120);
  await expect(slider).toHaveValue(held);
  await slider.focus();
  await slider.press("Home");
  await expect(slider).toHaveValue("0");
  await slider.press("ArrowRight");
  expect(Number(await slider.inputValue())).toBeGreaterThan(0);
  const scrubbed = Number(await slider.inputValue());
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect
    .poll(async () => Number(await slider.inputValue()))
    .toBeGreaterThan(scrubbed);
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeVisible();
  const total = Number(await slider.getAttribute("max"));
  expect(Number(await slider.inputValue())).toBe(total);
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  expect(Number(await slider.inputValue())).toBeLessThan(total);
  await page.getByRole("button", { name: "Off", exact: true }).click();
  await expect(slider).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeDisabled();
  expect(errors).toEqual([]);
});

test("WEB settings are explicit and edits preserve the mounted paused Canvas", async ({
  page,
}) => {
  await page.goto(aperture);
  const canvas = page.locator("canvas[data-particle-canvas]");
  await expect(
    page.locator("[data-particle-fixture] [data-scene-aperture]"),
  ).toHaveAttribute("data-aperture", "technical-diamond");
  await expect(canvas).toBeVisible();
  const original = await canvas.elementHandle();
  await page.getByRole("button", { name: "Pause scene" }).click();
  await page
    .getByRole("combobox", { name: "Aperture", exact: true })
    .selectOption("web");
  await page
    .getByRole("combobox", { name: "Frame width" })
    .selectOption("large");
  await page.getByRole("checkbox", { name: "Short frame (4:1)" }).check();
  const count = page.getByRole("slider", { name: "Particle count" });
  await count.fill("100");
  await count.press("ArrowRight");
  await expect(count).toHaveValue("101");
  await expect(page.getByRole("status")).toContainText("101 particles");
  await expect(
    page.getByRole("button", { name: "Resume scene" }),
  ).toBeVisible();
  expect(
    await canvas.evaluate((node, previous) => node === previous, original),
  ).toBe(true);
});

for (const [name, url] of [
  ["logo", logo],
  ["WEB", aperture],
]) {
  test(`${name}: compact layout, dark theme and unfiltered accessibility`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(url + "&globals=theme:dark");
    if (name === "logo") {
      await page.getByRole("button", { name: "Off", exact: true }).click();
    } else {
      await expect(
        page.getByRole("button", { name: "Pause scene" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Pause scene" }).click();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const size = await page
      .getByRole("button", {
        name: name === "logo" ? "Restart" : "Reset seeded state",
        exact: true,
      })
      .evaluate((element) => getComputedStyle(element).fontSize);
    expect(parseFloat(size)).toBeLessThanOrEqual(16);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations).toEqual([]);
  });
}
