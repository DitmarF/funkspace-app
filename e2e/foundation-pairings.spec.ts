import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  renderedPair,
  selectTheme,
  settleStyles,
  themes,
} from "./helpers/foundation";

for (const theme of themes) {
  test(`${theme}: rendered foundation pairings and local font bindings`, async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    await selectTheme(page, theme);
    await page.mouse.move(0, 0);
    const heading = await renderedPair(page.locator("h1"));
    const body = await renderedPair(page.locator("body"));
    expect(heading.fontFamily.toLowerCase()).toContain("worksans");
    expect(body.fontFamily.toLowerCase()).toContain("spacegrotesk");

    // A browser-only contract fixture, not a new production control family.
    // Its CSS variables come from the actual app stylesheet under the selected theme.
    await page.evaluate(() => {
      const fixture = document.createElement("section");
      fixture.id = "foundation-fixture";
      fixture.setAttribute("aria-label", "Foundation pairing fixture");
      fixture.innerHTML = `
        <style>
          #foundation-fixture { padding:var(--fs-space-md); display:grid; gap:var(--fs-space-lg); }
          #foundation-fixture .surface { padding:var(--fs-space-md); color:var(--fs-color-content-primary); }
          #foundation-fixture .pair { font-size:var(--fs-font-size-md); font-weight:var(--fs-font-weight-regular); }
          #foundation-fixture button, #foundation-fixture input { padding:var(--fs-space-xs) var(--fs-space-md); border:2px solid var(--fs-color-border-strong); }
          #foundation-fixture button:focus-visible, #foundation-fixture input:focus-visible { outline:2px solid var(--fs-color-border-focus); outline-offset:2px; }
          #foundation-fixture .accent { background:var(--fs-color-action-primary); color:var(--fs-color-content-inverse); }
          #foundation-fixture .accent:hover, #foundation-fixture .accent:active { background:var(--fs-color-action-hover); }
          #foundation-fixture .neutral { background:var(--fs-color-surface-elevation-1); color:var(--fs-color-content-primary); }
          #foundation-fixture .neutral:hover { background:var(--fs-color-surface-elevation-2); color:var(--fs-color-content-inverse); }
          #foundation-fixture input { background:var(--fs-color-surface-background); color:var(--fs-color-content-primary); }
          #foundation-fixture .outline { background:transparent; color:var(--fs-color-content-primary); }
          #foundation-fixture .outline:hover { background:var(--fs-color-action-hover); color:var(--fs-color-content-inverse); }
          #foundation-fixture .display { font-family:var(--font-work-sans, var(--fs-font-family-display)); font-size:var(--fs-font-size-xl); font-weight:var(--fs-font-weight-medium); }
          #foundation-fixture .menu-label { font-family:var(--font-work-sans, var(--fs-font-family-display)); font-size:var(--fs-font-size-md); font-weight:var(--fs-font-weight-semibold); }
        </style>
        ${["surface-background", "surface-elevation-1"]
          .map(
            (surface, index) => `
          <div class="surface" data-surface="${surface}" style="background:var(--fs-color-${surface})">
            <button class="pair accent">Primary sample</button>
            <button class="pair neutral">Secondary sample</button>
            <button class="pair outline">Outlined sample</button>
            <label class="pair" for="foundation-field-${index}">Field label</label>
            <input class="pair" id="foundation-field-${index}" value="Field value" aria-describedby="foundation-help-${index} foundation-error-${index}" aria-invalid="true">
            <p class="pair" id="foundation-help-${index}">Help: provide a value.</p>
            <p class="pair" id="foundation-error-${index}">Error: this is a fixture, not a submitted form.</p>
            <p class="pair" role="status">Pending: fixture operation.</p>
            <p class="pair">Success / warning / error: explicit status wording.</p>
            <a class="pair" href="#foundation-fixture" style="text-decoration:underline">Readable link</a>
            <button class="pair neutral" disabled>Unavailable</button>
            <p class="pair display">Standard typography</p>
            <p class="pair menu-label">Menu label typography</p>
          </div>`,
          )
          .join("")}`;
      document.querySelector("main")?.append(fixture);
    });
    await settleStyles(page);
    const evidence = [];
    for (const surface of ["surface-background", "surface-elevation-1"]) {
      const panel = page.locator(`[data-surface="${surface}"]`);
      for (const item of await panel.locator(".pair").all()) {
        const pair = await renderedPair(item);
        evidence.push({
          theme,
          surface,
          state: "default",
          text: await item.textContent(),
          ...pair,
        });
        // Project target remains 4.5 even for the large typography sample and
        // disabled sample (the latter has an explicit WCAG exception).
        expect(pair.ratio, JSON.stringify(pair)).toBeGreaterThanOrEqual(4.5);
      }
      for (const selector of [
        ".accent",
        ".neutral:not(:disabled)",
        ".outline",
      ]) {
        const control = panel.locator(selector);
        await control.hover();
        await settleStyles(page);
        const hover = await renderedPair(control);
        evidence.push({ theme, surface, state: "hover", selector, ...hover });
        expect(hover.ratio).toBeGreaterThanOrEqual(4.5);
        await page.mouse.down();
        const pressed = await renderedPair(control);
        evidence.push({
          theme,
          surface,
          state: "pressed",
          selector,
          ...pressed,
        });
        expect(pressed.ratio).toBeGreaterThanOrEqual(4.5);
        await page.mouse.move(0, 0);
        await page.mouse.up();
      }
      for (const selector of [".accent", ".outline", "input"]) {
        const control = panel.locator(selector);
        await page.keyboard.press("Tab");
        await control.focus();
        await expect(control).toBeFocused();
        const ring = await renderedPair(control, "outlineColor", true);
        evidence.push({
          theme,
          surface,
          state: "keyboard focus",
          selector,
          ...ring,
        });
        expect(ring.outlineStyle).toBe("solid");
        expect(ring.outlineWidth).toBe("2px");
        expect(ring.outlineOffset).toBe("2px");
        // The offset separates the ring from the fill. Both sides immediately
        // adjacent to the ring have the panel color, including the 2px gap.
        expect(ring.ratio, JSON.stringify(ring)).toBeGreaterThanOrEqual(3);
      }
      const boundary = await renderedPair(
        panel.locator("input"),
        "borderTopColor",
        true,
      );
      expect(boundary.ratio).toBeGreaterThanOrEqual(3);
      evidence.push({ theme, surface, state: "field boundary", ...boundary });
    }
    const results = await new AxeBuilder({ page })
      .include("#foundation-fixture")
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
    await testInfo.attach("rendered-pairings", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
  });
}
