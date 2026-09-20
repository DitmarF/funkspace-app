import { expect, type Locator, type Page } from "@playwright/test";

export const themes = [
  "default",
  "dark",
  "muted",
  "dark-high-contrast",
] as const;
export type FoundationTheme = (typeof themes)[number];
const labels = {
  default: "Default",
  dark: "Dark",
  muted: "Muted",
  "dark-high-contrast": "High Contrast",
};

export async function settleStyles(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation instanceof CSSTransition)
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });
}

export async function transitionPairs(locator: Locator) {
  const samples = [];
  // Sample the real CSS transition, including intermediate frames. Controls
  // with immediate color changes still produce their actual rendered pair.
  for (const time of [0, 25, 50, 75, 100, 125, 150]) {
    await locator.evaluate((element, time) => {
      for (const animation of element.getAnimations()) {
        if (animation instanceof CSSTransition) {
          animation.pause();
          animation.currentTime = time;
        }
      }
    }, time);
    samples.push({ time, ...(await renderedPair(locator)) });
  }
  await locator.evaluate((element) => {
    for (const animation of element.getAnimations()) {
      if (animation instanceof CSSTransition) animation.finish();
    }
  });
  return samples;
}

export async function openSettings(page: Page) {
  const dialog = page.getByRole("dialog", { name: "Navigation and settings" });
  if (!(await dialog.isVisible())) {
    await page
      .getByRole("button", {
        name: "Menu: navigation and settings",
        exact: true,
      })
      .click();
  }
  await expect(dialog).toBeVisible();
}

export async function closeSettings(page: Page) {
  const dialog = page.getByRole("dialog", { name: "Navigation and settings" });
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await expect(dialog).not.toBeVisible();
}

export async function selectTheme(page: Page, theme: FoundationTheme) {
  await openSettings(page);
  await expect(page.locator('button[aria-pressed="true"]')).toBeVisible();
  const choice = page.getByRole("button", { name: labels[theme], exact: true });
  await choice.click();
  await expect(choice).toHaveAttribute("aria-pressed", "true");
  if (theme === "default")
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  else await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await settleStyles(page);
  await closeSettings(page);
}

// Composite actual browser colors through ancestor backgrounds. Reject images
// and group opacity, which this focused flat-color fixture does not measure.
export async function renderedPair(
  locator: Locator,
  property: "color" | "outlineColor" | "borderTopColor" = "color",
  outside = false,
) {
  return locator.evaluate(
    (element, { property, outside }) => {
      const style = getComputedStyle(element);
      const parse = (value: string): number[] => {
        if (!/^rgba?\(/.test(value))
          throw new Error(`Unsupported computed color: ${value}`);
        return (value.match(/[\d.]+/g) ?? []).map(Number);
      };
      const composite = (fg: number[], bg: number[]) =>
        fg
          .slice(0, 3)
          .map(
            (value, index) =>
              value * (fg[3] ?? 1) + bg[index] * (1 - (fg[3] ?? 1)),
          );
      const layers: { element: string; color: string }[] = [];
      for (
        let node = outside ? element.parentElement : element;
        node;
        node = node.parentElement
      ) {
        const css = getComputedStyle(node);
        if (css.opacity !== "1" || css.backgroundImage !== "none")
          throw new Error(
            "Pairing fixture requires flat colors without element/group opacity",
          );
        layers.push({ element: node.tagName, color: css.backgroundColor });
      }
      let background = [255, 255, 255];
      for (const layer of [...layers].reverse())
        background = composite(parse(layer.color), background);
      const foreground = composite(parse(style[property]), background);
      const luminance = (rgb: number[]) =>
        rgb
          .map((value) => value / 255)
          .map((value) =>
            value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
          )
          .reduce(
            (sum, value, index) =>
              sum + value * [0.2126, 0.7152, 0.0722][index],
            0,
          );
      const a = luminance(foreground),
        b = luminance(background);
      return {
        foreground: style[property],
        background,
        layers,
        ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineOffset: style.outlineOffset,
      };
    },
    { property, outside },
  );
}
