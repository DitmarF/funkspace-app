import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { bindStickyHeader } from "./StickyHeaderBinding";
import type { MotionSnapshot } from "@/domain/motion/MotionPolicy";
import type { MotionPolicyConsumer } from "@/application/motion/MotionPolicyService";

let root: HTMLDivElement;
let media: EventTarget & { matches: boolean };
let snapshot: MotionSnapshot;
let notify: (value: MotionSnapshot) => void;
let resize: () => void;
let cleanup: () => void;
let height: number;
const unsubscribe = vi.fn();
const disconnect = vi.fn();
const policy: MotionPolicyConsumer = {
  getSnapshot: () => snapshot,
  setPreference: vi.fn(),
  subscribe(listener) {
    notify = listener;
    listener(snapshot);
    return unsubscribe;
  },
};
function scroll(y: number) {
  vi.spyOn(window, "scrollY", "get").mockReturnValue(y);
  window.dispatchEvent(new Event("scroll"));
}
function bind(available = true) {
  cleanup = bindStickyHeader(root, policy, available).release;
}
beforeEach(() => {
  height = 160;
  snapshot = {
    status: "ready",
    preference: "system",
    systemMotion: "no-preference",
    documentVisible: true,
  };
  media = Object.assign(new EventTarget(), { matches: true });
  vi.stubGlobal("matchMedia", () => media);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(900);
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(
    4000,
  );
  scroll(0);
  root = document.createElement("div");
  root.innerHTML =
    '<header><a href="/">Home</a></header><main><button>Content</button></main><div data-home-menu><button>Menu</button></div><dialog></dialog>';
  document.body.append(root);
  vi.spyOn(
    root.querySelector("header")!,
    "offsetHeight",
    "get",
  ).mockImplementation(() => height);
  cleanup = () => {};
});
afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
  root.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it("clears an initial encoded fragment once without moving focus or revisiting it on resize", () => {
  const target = root.querySelector("main")!;
  target.id = "start";
  target.scrollIntoView = vi.fn();
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
    top: 16,
    bottom: 600,
  } as DOMRect);
  window.history.replaceState(null, "", "/#%73tart");
  const active = document.activeElement;
  bind();
  expect(target.scrollIntoView).toHaveBeenCalledWith({
    block: "start",
    behavior: "instant",
  });
  expect(document.activeElement).toBe(active);
  scroll(700);
  resize();
  expect(target.scrollIntoView).toHaveBeenCalledTimes(1);
});

it.each(["mobile", "clear", "above", "missing", "malformed", "history"])(
  "preserves initial positioning for %s arrivals",
  (scenario) => {
    const target = root.querySelector("main")!;
    target.id = "start";
    target.scrollIntoView = vi.fn();
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      top: scenario === "clear" ? 200 : scenario === "above" ? -300 : 16,
      bottom: 600,
    } as DOMRect);
    if (scenario === "mobile") media.matches = false;
    if (scenario === "history")
      vi.stubGlobal("performance", {
        getEntriesByType: () => [{ type: "back_forward" }],
      });
    window.history.replaceState(
      null,
      "",
      scenario === "missing"
        ? "/#missing"
        : scenario === "malformed"
          ? "/#%"
          : "/#start",
    );
    bind();
    expect(target.scrollIntoView).not.toHaveBeenCalled();
  },
);

it("hides after deliberate downward travel, tolerates jitter and reveals upward or at top", () => {
  bind();
  expect(root).toHaveAttribute("data-sticky-header");
  scroll(150);
  expect(root).toHaveAttribute("data-header-hidden", "false");
  scroll(190);
  expect(root).toHaveAttribute("data-header-hidden", "true");
  scroll(187);
  scroll(189);
  scroll(180);
  expect(root).toHaveAttribute("data-header-hidden", "true");
  scroll(177);
  expect(root).toHaveAttribute("data-header-hidden", "false");
  scroll(220);
  scroll(0);
  expect(root).toHaveAttribute("data-header-hidden", "false");
});

it("reveals immediately for focus and pins while a dialog is open", async () => {
  bind();
  scroll(800);
  root.querySelector("a")!.focus();
  expect(root).toHaveAttribute("data-header-hidden", "false");
  expect(root).toHaveAttribute("data-header-focused", "true");
  scroll(1000);
  expect(root).toHaveAttribute("data-header-hidden", "false");
  root
    .querySelector("main button")!
    .dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  root.querySelector<HTMLButtonElement>("main button")!.focus();
  root.querySelector("dialog")!.setAttribute("open", "");
  await Promise.resolve();
  scroll(1200);
  expect(root).toHaveAttribute("data-header-hidden", "false");
  root.querySelector("dialog")!.removeAttribute("open");
  await Promise.resolve();
  scroll(1400);
  expect(root).toHaveAttribute("data-header-hidden", "true");
});

it.each(["off", "reduced", "system"] as const)(
  "keeps a static visible header for %s with device reduction",
  (preference) => {
    snapshot = { ...snapshot, preference, systemMotion: "reduce" };
    bind();
    scroll(800);
    expect(root).toHaveAttribute("data-header-motion", "false");
    expect(root).toHaveAttribute("data-header-hidden", "false");
    notify({ ...snapshot, preference: "on" });
    scroll(850);
    expect(root).toHaveAttribute("data-header-hidden", "true");
    notify({ ...snapshot, preference: "off" });
    expect(root).toHaveAttribute("data-header-hidden", "false");
  },
);

it("uses the static header when the feature flag is off", () => {
  bind(false);
  scroll(800);
  expect(root).toHaveAttribute("data-header-hidden", "false");
});

it.each(["wheel", "touchmove"])(
  "resumes after Off → On with restored menu focus and %s scrolling, preserving keyboard access",
  (type) => {
    bind();
    const trigger = root.querySelector<HTMLButtonElement>(
      "[data-home-menu] button",
    )!;
    notify({ ...snapshot, preference: "off" });
    trigger.focus();
    viewScrollIntent();
    scroll(400);
    expect(root).toHaveAttribute("data-header-hidden", "false");
    notify({ ...snapshot, preference: "on" });
    trigger.blur();
    trigger.focus();
    scroll(450);
    expect(root).toHaveAttribute("data-header-hidden", "false");
    viewScrollIntent();
    scroll(500);
    expect(root).toHaveAttribute("data-header-hidden", "true");
    expect(trigger).toHaveFocus();
    expect(root).toHaveAttribute("data-header-focused", "false");
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
    );
    expect(root).toHaveAttribute("data-header-hidden", "false");
    expect(root).toHaveAttribute("data-header-focused", "true");
    scroll(600);
    expect(root).toHaveAttribute("data-header-hidden", "false");
    cleanup();
    viewScrollIntent();
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
    );
    expect(root).not.toHaveAttribute("data-header-focused");

    function viewScrollIntent() {
      window.dispatchEvent(
        type === "wheel"
          ? new WheelEvent(type, { deltaY: 100 })
          : new Event(type),
      );
    }
  },
);

it("preserves mobile and short-viewport layout and remeasures without retaining hidden state", () => {
  bind();
  scroll(800);
  media.matches = false;
  media.dispatchEvent(new Event("change"));
  expect(root).not.toHaveAttribute("data-sticky-header");
  media.matches = true;
  height = 500;
  resize();
  expect(root).not.toHaveAttribute("data-sticky-header");
  height = 160;
  resize();
  expect(root).toHaveAttribute("data-sticky-header");
  expect(root).toHaveAttribute("data-header-hidden", "false");
});

it("pins the homepage introduction and preserves native fallback disclosure", async () => {
  root.dataset.homeIntro = "waiting";
  bind();
  scroll(800);
  expect(root).toHaveAttribute("data-header-hidden", "false");
  root.dataset.homeIntro = "visible";
  const details = document.createElement("details");
  details.dataset.homeMenu = "";
  details.open = true;
  root.append(details);
  scroll(1000);
  expect(root).toHaveAttribute("data-header-hidden", "false");
  details.open = false;
  await Promise.resolve();
  scroll(1200);
  expect(root).toHaveAttribute("data-header-hidden", "true");
});

it("clamps end overscroll and releases owned resources exactly once", () => {
  bind();
  scroll(3200);
  scroll(3100);
  expect(root).toHaveAttribute("data-header-hidden", "true");
  cleanup();
  cleanup();
  expect(unsubscribe).toHaveBeenCalledTimes(1);
  expect(disconnect).toHaveBeenCalledTimes(1);
  scroll(0);
  window.dispatchEvent(new Event("resize"));
  expect(root).not.toHaveAttribute("data-sticky-header");
  expect(root.style.getPropertyValue("--portfolio-header-height")).toBe("");
});

it("leaves the server/native layout intact when measurement is unavailable", () => {
  vi.stubGlobal("ResizeObserver", undefined);
  bind();
  expect(root).not.toHaveAttribute("data-sticky-header");
});

it("clears newly focused content obscured by the sticky header without moving mobile focus", () => {
  const button = root.querySelector<HTMLButtonElement>("main button")!;
  button.scrollIntoView = vi.fn();
  vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
    top: 20,
    bottom: 60,
  } as DOMRect);
  bind();
  button.focus();
  expect(button.scrollIntoView).toHaveBeenCalledWith({
    block: "start",
    behavior: "instant",
  });
  button.blur();
  media.matches = false;
  media.dispatchEvent(new Event("change"));
  button.focus();
  expect(button.scrollIntoView).toHaveBeenCalledTimes(1);
});
