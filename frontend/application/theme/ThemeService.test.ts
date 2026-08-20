import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DOMPort } from "@/domain/ports/DOMPort";
import type { StoragePort } from "@/domain/ports/StoragePort";
import { ThemeServiceImpl } from "./ThemeService";

describe("ThemeServiceImpl", () => {
  let storedValues: Map<string, string>;
  let storage: StoragePort;
  let prefersDark: boolean;
  let systemChangeListener: ((event: MediaQueryListEvent) => void) | null;
  let mediaQuery: MediaQueryList;
  let dom: DOMPort;

  beforeEach(() => {
    storedValues = new Map();
    storage = {
      getItem: vi.fn((key: string) => storedValues.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storedValues.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        storedValues.delete(key);
      }),
    };
    prefersDark = false;
    systemChangeListener = null;
    mediaQuery = {
      get matches() {
        return prefersDark;
      },
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: vi.fn((_type, listener) => {
        systemChangeListener = listener as (event: MediaQueryListEvent) => void;
      }),
      removeEventListener: vi.fn((_type, listener) => {
        if (systemChangeListener === listener) {
          systemChangeListener = null;
        }
      }),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    };
    dom = {
      getDocumentElement: () => document.documentElement,
      querySelector: vi.fn(() => null),
      hasMatchMedia: () => true,
      matchMedia: () => mediaQuery,
    };
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("initializes an absent preference as system without applying an attribute", () => {
    const service = new ThemeServiceImpl(storage, dom);

    service.initialize();

    expect(storedValues.get("theme")).toBe("system");
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("replaces an invalid stored preference before applying the theme", () => {
    storedValues.set("theme", "unknown");
    prefersDark = true;
    const service = new ThemeServiceImpl(storage, dom);

    service.initialize();

    expect(storedValues.get("theme")).toBe("system");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("persists and applies explicit theme selections", () => {
    const service = new ThemeServiceImpl(storage, dom);

    service.setTheme("muted");
    expect(storedValues.get("theme")).toBe("muted");
    expect(document.documentElement).toHaveAttribute("data-theme", "muted");

    service.setTheme("default");
    expect(storedValues.get("theme")).toBe("default");
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("subscribes immediately and notifies explicit theme changes", () => {
    storedValues.set("theme", "dark");
    const service = new ThemeServiceImpl(storage, dom);
    const subscriber = vi.fn();

    const unsubscribe = service.subscribe(subscriber);
    expect(subscriber).toHaveBeenLastCalledWith({
      selectedTheme: "dark",
      resolvedTheme: "dark",
    });

    service.setTheme("muted");
    expect(subscriber).toHaveBeenLastCalledWith({
      selectedTheme: "muted",
      resolvedTheme: "muted",
    });

    unsubscribe();
    service.setTheme("default");
    expect(subscriber).toHaveBeenCalledTimes(2);
  });

  it("reapplies system preferences while system mode is selected", () => {
    storedValues.set("theme", "system");
    const service = new ThemeServiceImpl(storage, dom);
    const subscriber = vi.fn();
    service.initialize();
    service.subscribe(subscriber);

    prefersDark = true;
    systemChangeListener?.({ matches: true } as MediaQueryListEvent);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(subscriber).toHaveBeenLastCalledWith({
      selectedTheme: "system",
      resolvedTheme: "dark",
    });

    prefersDark = false;
    systemChangeListener?.({ matches: false } as MediaQueryListEvent);
    expect(document.documentElement).not.toHaveAttribute("data-theme");
    expect(subscriber).toHaveBeenLastCalledWith({
      selectedTheme: "system",
      resolvedTheme: "default",
    });
  });

  it("ignores system changes when an explicit theme is selected", () => {
    const service = new ThemeServiceImpl(storage, dom);
    service.initialize();
    service.setTheme("dark-high-contrast");

    prefersDark = true;
    systemChangeListener?.({ matches: true } as MediaQueryListEvent);

    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "dark-high-contrast",
    );
  });

  it("owns one system listener and removes it on destroy", () => {
    const service = new ThemeServiceImpl(storage, dom);
    const subscriber = vi.fn();

    service.initialize();
    service.initialize();
    service.subscribe(subscriber);
    expect(mediaQuery.addEventListener).toHaveBeenCalledTimes(1);

    service.destroy();
    expect(mediaQuery.removeEventListener).toHaveBeenCalledTimes(1);
    expect(systemChangeListener).toBeNull();

    service.setTheme("dark");
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
});
