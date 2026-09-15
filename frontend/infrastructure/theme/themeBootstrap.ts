import { isTheme, THEME_STORAGE_KEY } from "../../domain/theme/Theme";
import { DOMAdapter } from "../dom/DOMAdapter";
import { LocalStorageAdapter } from "../storage/LocalStorageAdapter";

/** One-shot appearance application. ThemeService owns everything after startup. */
export function initializeTheme(): void {
  const storage = new LocalStorageAdapter();
  const dom = new DOMAdapter();
  const stored = storage.getItem(THEME_STORAGE_KEY);
  const selected = isTheme(stored) ? stored : "system";
  const resolved =
    selected === "system"
      ? dom.matchMedia("(prefers-color-scheme: dark)")?.matches
        ? "dark"
        : "default"
      : selected;
  const root = dom.getDocumentElement();

  if (resolved === "default") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", resolved);

  // Best effort normalization must never prevent the appearance from applying.
  if (!isTheme(stored)) storage.setItem(THEME_STORAGE_KEY, "system");
}

// Defined only by the browser bundle build. Ordinary imports have no effects.
declare const __THEME_BOOTSTRAP_ENTRY__: boolean;
if (
  typeof __THEME_BOOTSTRAP_ENTRY__ !== "undefined" &&
  __THEME_BOOTSTRAP_ENTRY__
) {
  initializeTheme();
}
