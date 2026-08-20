/**
 * Theme Service
 * Application service for theme management
 */

import { isTheme, type Theme, type ResolvedTheme } from "@/domain/theme/Theme";
import type { StoragePort } from "@/domain/ports/StoragePort";
import type { DOMPort } from "@/domain/ports/DOMPort";

export interface ThemeState {
  selectedTheme: Theme;
  resolvedTheme: ResolvedTheme;
}

export type ThemeSubscriber = (state: ThemeState) => void;

export interface ThemeService {
  /**
   * Get the current theme from storage
   */
  getStoredTheme(): Theme;

  /**
   * Set and apply a theme
   */
  setTheme(theme: Theme): void;

  /**
   * Resolve system theme to actual theme
   */
  resolveSystemTheme(): ResolvedTheme;

  /**
   * Resolve a theme (if system, resolve to actual theme)
   */
  resolveTheme(theme: Theme): ResolvedTheme;

  /**
   * Get the currently applied theme
   */
  getCurrentTheme(): ResolvedTheme;

  /**
   * Initialize theme from storage
   */
  initialize(): void;

  /**
   * Subscribe to selected or resolved theme changes.
   * The subscriber receives the current state immediately.
   */
  subscribe(callback: ThemeSubscriber): () => void;

  /**
   * Release the system-theme listener owned by the service
   */
  destroy(): void;
}

export class ThemeServiceImpl implements ThemeService {
  private readonly storageKey = "theme";
  private readonly subscribers = new Set<ThemeSubscriber>();
  private unsubscribeSystemTheme: (() => void) | null = null;

  constructor(
    private readonly storage: StoragePort,
    private readonly dom: DOMPort,
  ) {}

  getStoredTheme(): Theme {
    const stored = this.storage.getItem(this.storageKey);
    return isTheme(stored) ? stored : "system";
  }

  setTheme(theme: Theme): void {
    this.storage.setItem(this.storageKey, theme);
    const resolvedTheme = this.applyTheme(theme);
    this.notifySubscribers(theme, resolvedTheme);
  }

  resolveSystemTheme(): ResolvedTheme {
    if (!this.dom.hasMatchMedia()) {
      return "default";
    }

    const mediaQuery = this.dom.matchMedia("(prefers-color-scheme: dark)");
    if (mediaQuery?.matches) {
      return "dark";
    }

    return "default";
  }

  resolveTheme(theme: Theme): ResolvedTheme {
    if (theme === "system") {
      return this.resolveSystemTheme();
    }
    return theme;
  }

  getCurrentTheme(): ResolvedTheme {
    const stored = this.getStoredTheme();
    return this.resolveTheme(stored);
  }

  initialize(): void {
    const storedValue = this.storage.getItem(this.storageKey);
    const theme = isTheme(storedValue) ? storedValue : "system";

    if (!isTheme(storedValue)) {
      this.storage.setItem(this.storageKey, "system");
    }

    const resolvedTheme = this.applyTheme(theme);
    this.notifySubscribers(theme, resolvedTheme);

    if (!this.unsubscribeSystemTheme) {
      this.unsubscribeSystemTheme = this.listenForSystemThemeChanges();
    }
  }

  subscribe(callback: ThemeSubscriber): () => void {
    this.subscribers.add(callback);
    callback(this.getThemeState());

    return () => {
      this.subscribers.delete(callback);
    };
  }

  destroy(): void {
    this.unsubscribeSystemTheme?.();
    this.unsubscribeSystemTheme = null;
    this.subscribers.clear();
  }

  private listenForSystemThemeChanges(): () => void {
    if (!this.dom.hasMatchMedia()) {
      return () => {};
    }

    const mediaQuery = this.dom.matchMedia("(prefers-color-scheme: dark)");
    if (!mediaQuery) {
      return () => {};
    }

    const handleChange = () => {
      const stored = this.getStoredTheme();
      if (stored === "system") {
        const resolvedTheme = this.applyTheme(stored);
        this.notifySubscribers(stored, resolvedTheme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    }

    return () => {};
  }

  private getThemeState(): ThemeState {
    const selectedTheme = this.getStoredTheme();
    return {
      selectedTheme,
      resolvedTheme: this.resolveTheme(selectedTheme),
    };
  }

  private notifySubscribers(
    selectedTheme: Theme,
    resolvedTheme: ResolvedTheme,
  ): void {
    const state: ThemeState = { selectedTheme, resolvedTheme };
    for (const subscriber of [...this.subscribers]) {
      subscriber(state);
    }
  }

  private applyTheme(theme: Theme): ResolvedTheme {
    const htmlElement = this.dom.getDocumentElement();
    const resolved = this.resolveTheme(theme);

    if (resolved === "default") {
      htmlElement.removeAttribute("data-theme");
    } else {
      htmlElement.setAttribute("data-theme", resolved);
    }

    return resolved;
  }
}
