import type { MotionPolicyConsumer } from "@/application/motion/MotionPolicyService";
import { resolveMotionPermission } from "@/domain/motion/MotionPolicy";
import type { StickyHeaderFactory } from "@/domain/ports/StickyHeaderPort";

/** Document-scroll enhancement; no React updates or shared scheduler. */
export function bindStickyHeader(
  root: HTMLElement,
  policy: MotionPolicyConsumer,
  motionAvailable: boolean,
): ReturnType<StickyHeaderFactory<HTMLElement>> {
  const releases: (() => void)[] = [];
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    for (const dispose of releases.reverse()) {
      try {
        dispose();
      } catch {
        /* Release all remaining owned resources. */
      }
    }
  };
  try {
    const header = root.querySelector("header");
    const view = root.ownerDocument.defaultView;
    if (!header || !view?.matchMedia || !view.ResizeObserver)
      return { release() {} };
    releases.push(() => {
      for (const name of [
        "data-sticky-header",
        "data-header-hidden",
        "data-header-focused",
        "data-header-motion",
      ])
        root.removeAttribute(name);
      root.style.removeProperty("--portfolio-header-height");
    });
    const desktop = view.matchMedia("(min-width: 48rem)");
    let height = 0;
    let enabled = false;
    let moving = false;
    let previous = Math.max(0, view.scrollY);
    let travel = 0;
    let scrollingWithPointer = false;
    let pointerFocus = false;
    const pointer = () => {
      pointerFocus = true;
    };
    const set = (key: string, value: string) => {
      if (root.getAttribute(key) !== value) root.setAttribute(key, value);
    };
    const focused = () => {
      const active = root.ownerDocument.activeElement;
      return (
        !scrollingWithPointer &&
        !!active &&
        (header.contains(active) || !!active.closest("[data-home-menu]"))
      );
    };
    const pinned = () =>
      focused() ||
      !!root.querySelector(
        'dialog[open], details[data-home-menu][open], [data-home-menu] [aria-expanded="true"]',
      ) ||
      ["preparing", "waiting", "menu", "fading"].includes(
        root.dataset.homeIntro ?? "",
      );
    const show = () => set("data-header-hidden", "false");
    const syncPin = () => {
      if (released) return;
      set("data-header-focused", String(focused()));
      if (pinned()) {
        show();
        travel = 0;
      }
    };
    const focus = (event: FocusEvent) => {
      scrollingWithPointer = false;
      syncPin();
      const target = event.target;
      if (
        pointerFocus ||
        !desktop.matches ||
        !(target instanceof HTMLElement) ||
        !target.closest("main, footer") ||
        target.closest("dialog, [data-home-menu]")
      )
        return;
      const bounds = target.getBoundingClientRect();
      // Native focus can leave an already-visible target behind a sticky header.
      // Use the shell's measured scroll margin, only when new focus is obscured.
      if (
        enabled &&
        bounds.top >= 0 &&
        bounds.top < height &&
        bounds.bottom > 0
      )
        target.scrollIntoView({ block: "start", behavior: "instant" });
      else if (
        bounds.bottom > view.innerHeight &&
        bounds.bottom - bounds.top <= view.innerHeight
      )
        target.scrollIntoView({ block: "end", behavior: "instant" });
    };
    // Dialog restores launcher focus. Keep that focus, but let an explicit wheel
    // or touch scroll resume the header; keyboard use/new focus pins it again.
    const pointerScroll = () => {
      scrollingWithPointer = true;
      syncPin();
    };
    const wheel = (event: WheelEvent) => {
      if (event.deltaY !== 0 && !event.ctrlKey) pointerScroll();
    };
    const keyboard = () => {
      pointerFocus = false;
      scrollingWithPointer = false;
      syncPin();
    };
    const scroll = () => {
      if (released) return;
      // Clamp elastic overscroll at both document ends.
      const max = Math.max(
        0,
        root.ownerDocument.documentElement.scrollHeight - view.innerHeight,
      );
      const y = Math.max(0, Math.min(view.scrollY, max));
      const delta = y - previous;
      previous = y;
      if (!enabled) return;
      if (!moving || pinned() || y <= height) {
        show();
        travel = 0;
        return;
      }
      if (Math.sign(delta) !== Math.sign(travel)) travel = 0;
      travel += delta;
      // Separate thresholds avoid flicker from small direction changes.
      if (travel >= 32) set("data-header-hidden", "true");
      if (travel <= -12) show();
    };
    const measure = () => {
      if (released) return;
      height = header.offsetHeight;
      // Preserve room for content at large text sizes / short landscape heights.
      enabled = desktop.matches && height > 0 && height < view.innerHeight / 2;
      root.style.setProperty("--portfolio-header-height", `${height}px`);
      if (enabled) set("data-sticky-header", "");
      else root.removeAttribute("data-sticky-header");
      previous = Math.max(0, view.scrollY);
      travel = 0;
      show();
      scroll();
    };
    const resize = new view.ResizeObserver(measure);
    releases.push(() => resize.disconnect());
    const mutations = new view.MutationObserver(syncPin);
    releases.push(() => mutations.disconnect());
    resize.observe(header);
    mutations.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["open", "aria-expanded", "data-home-intro"],
    });
    releases.push(() => view.removeEventListener("scroll", scroll));
    view.addEventListener("scroll", scroll, { passive: true });
    releases.push(() => view.removeEventListener("wheel", wheel));
    view.addEventListener("wheel", wheel, { passive: true });
    releases.push(() => view.removeEventListener("touchmove", pointerScroll));
    view.addEventListener("touchmove", pointerScroll, { passive: true });
    releases.push(() => view.removeEventListener("resize", measure));
    view.addEventListener("resize", measure);
    releases.push(() => desktop.removeEventListener("change", measure));
    desktop.addEventListener("change", measure);
    releases.push(() => root.removeEventListener("focusin", focus));
    root.addEventListener("focusin", focus);
    releases.push(() => root.removeEventListener("focusout", syncPin));
    root.addEventListener("focusout", syncPin);
    releases.push(() => root.removeEventListener("keydown", keyboard));
    root.addEventListener("keydown", keyboard);
    releases.push(() => root.removeEventListener("pointerdown", pointer, true));
    root.addEventListener("pointerdown", pointer, true);
    const unsubscribe = policy.subscribe((snapshot) => {
      moving = resolveMotionPermission(snapshot, {
        featureAvailable: motionAvailable,
        optedIn: true,
        visible: true,
        locallyPaused: false,
        runtime: "ready",
      }).mayRun;
      set("data-header-motion", String(moving));
      if (!moving) show();
      travel = 0;
    });
    releases.push(unsubscribe);
    measure();
    // Native fragment scrolling can precede hydration's measured scroll margin.
    // Correct only a covered initial target, never on subsequent resize/scroll.
    const navigation = view.performance.getEntriesByType?.("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (enabled && view.location.hash && navigation?.type !== "back_forward") {
      let target: HTMLElement | null = null;
      try {
        target = root.ownerDocument.getElementById(
          decodeURIComponent(view.location.hash.slice(1)),
        );
      } catch {
        // Malformed fragments retain the browser's native behavior.
      }
      if (
        target &&
        root.contains(target) &&
        target.closest("main, footer") &&
        !target.closest("dialog, [data-home-menu]")
      ) {
        const bounds = target.getBoundingClientRect();
        if (bounds.top >= 0 && bounds.top < height && bounds.bottom > 0) {
          target.scrollIntoView({ block: "start", behavior: "instant" });
          previous = Math.max(0, view.scrollY);
        }
      }
    }
    syncPin();
    return { release };
  } catch {
    // Optional enhancement must never replace a usable server-rendered page.
    release();
    return { release };
  }
}
