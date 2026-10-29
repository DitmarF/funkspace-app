import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_VALUES } from "../../domain/theme/Theme";
import { ThemeServiceImpl } from "../../application/theme/ThemeService";
import { themeBootstrapScript } from "../../generated/theme-bootstrap";
import { DOMAdapter } from "../dom/DOMAdapter";
import { LocalStorageAdapter } from "../storage/LocalStorageAdapter";
import { initializeTheme } from "./themeBootstrap";

const storage = window.localStorage;
let query: ReturnType<typeof vi.fn>;
let media: MediaQueryList;

beforeEach(() => {
  storage.clear();
  document.documentElement.setAttribute("data-theme", "muted");
  document.documentElement.setAttribute("lang", "en");
  document.documentElement.setAttribute("class", "font-preserved");
  media = {
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as unknown as MediaQueryList;
  query = vi.fn(() => media);
  vi.stubGlobal("matchMedia", query);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// Execute the shipped payload itself, not a test reimplementation. Eval is test-only.
describe.each([
  ["typed source", initializeTheme],
  ["generated browser payload", () => window.eval(themeBootstrapScript)],
] as const)("%s", (_name, run) => {
  it.each(THEME_VALUES)(
    "applies %s and preserves unrelated root attributes",
    (theme) => {
      storage.setItem("theme", theme);
      run();
      expect(document.documentElement.getAttribute("data-theme")).toBe(
        theme === "default" ? null : theme === "system" ? "dark" : theme,
      );
      expect(query).toHaveBeenCalledTimes(theme === "system" ? 1 : 0);
      expect(document.documentElement.lang).toBe("en");
      expect(document.documentElement.className).toBe("font-preserved");
      expect(media.addEventListener).not.toHaveBeenCalled();
      expect(storage.getItem("theme")).toBe(theme);
    },
  );

  it.each([null, "invalid", "system"])(
    "resolves %s against light OS",
    (stored) => {
      if (stored !== null) storage.setItem("theme", stored);
      query.mockReturnValue({ ...media, matches: false });
      run();
      expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
      expect(storage.getItem("theme")).toBe("system");
    },
  );

  it.each([null, "invalid"])("applies dark before normalizing %s", (stored) => {
    if (stored !== null) storage.setItem("theme", stored);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      expect(document.documentElement.dataset.theme).toBe("dark");
      throw new Error("blocked write");
    });
    run();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it.each([
    "storage access",
    "read",
    "write",
    "media absent",
    "media getter",
    "media method",
    "matches getter",
  ])("survives %s failure and hands off to ThemeService", (fault) => {
    if (fault === "storage access") vi.stubGlobal("localStorage", undefined);
    if (fault === "storage access")
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get: () => {
          throw new Error("blocked access");
        },
      });
    if (fault === "read")
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("blocked read");
      });
    if (fault === "write")
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("blocked write");
      });
    if (fault === "media absent") vi.stubGlobal("matchMedia", undefined);
    if (fault === "media getter")
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        get: () => {
          throw new Error("blocked media access");
        },
      });
    if (fault === "media method")
      query.mockImplementation(() => {
        throw new Error("blocked media call");
      });
    if (fault === "matches getter")
      Object.defineProperty(media, "matches", {
        get: () => {
          throw new Error("blocked matches");
        },
      });
    const expected =
      fault.startsWith("media") || fault === "matches getter"
        ? "default"
        : "dark";
    run();
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      expected === "default" ? null : expected,
    );
    const service = new ThemeServiceImpl(
      new LocalStorageAdapter(),
      new DOMAdapter(),
    );
    service.initialize();
    const subscriber = vi.fn();
    const unsubscribe = service.subscribe(subscriber);
    expect(subscriber).toHaveBeenLastCalledWith({
      selectedTheme: "system",
      resolvedTheme: expected,
    });
    unsubscribe();
    service.destroy();
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      expected === "default" ? null : expected,
    );
  });

  it("is harmless when repeated and does not own listeners or timers", () => {
    storage.setItem("theme", "dark");
    const timer = vi.spyOn(window, "setTimeout");
    const interval = vi.spyOn(window, "setInterval");
    run();
    run();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(timer).not.toHaveBeenCalled();
    expect(interval).not.toHaveBeenCalled();
    expect(query).not.toHaveBeenCalled();
  });

  it("does not swallow programming errors from DOM application", () => {
    vi.spyOn(document.documentElement, "setAttribute").mockImplementation(
      () => {
        throw new Error("DOM programming error");
      },
    );
    expect(run).toThrow("DOM programming error");
  });
});

it("ordinary imports have no browser effects, including in Node", async () => {
  vi.resetModules();
  vi.stubGlobal("window", undefined);
  vi.stubGlobal("document", undefined);
  await expect(import("./themeBootstrap")).resolves.toHaveProperty(
    "initializeTheme",
  );
});

it("the build-only entry flag launches the maintained initializer", async () => {
  vi.resetModules();
  vi.stubGlobal("__THEME_BOOTSTRAP_ENTRY__", false);
  await import("./themeBootstrap");
  expect(query).not.toHaveBeenCalled();
  vi.resetModules();
  vi.stubGlobal("__THEME_BOOTSTRAP_ENTRY__", true);
  await import("./themeBootstrap");
  expect(document.documentElement.dataset.theme).toBe("dark");
});
