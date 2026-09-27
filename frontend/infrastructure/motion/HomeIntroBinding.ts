import type { HomeIntroBinding } from "@/domain/ports/HomeIntroPort";
import {
  isMotionPreference,
  MOTION_PREFERENCE_KEY,
  resolveMotionPermission,
} from "@/domain/motion/MotionPolicy";

type IntroRoot = HTMLElement & {
  __fsHomeIntro?: {
    reveal(): void;
    release(): void;
    onCancelled(callback: () => void): () => void;
  };
};

/** Executed once by the parser before homepage content. Effects stay here.
 * No writes/listeners to preferences: the live provider takes over after hydration.
 * Arguments keep the serialized function independent of bundler-local names. */
function bootstrap(
  resolve: typeof resolveMotionPermission,
  valid: typeof isMotionPreference,
  key: string,
  available: boolean,
) {
  const root = document.currentScript?.parentElement as IntroRoot | null;
  if (!root) return;
  let cleanup = () => {};
  let cancelled = false;
  let cancelListener: (() => void) | undefined;
  const reveal = () => {
    const retireIntroduction = root.dataset.homeIntro === "preparing";
    root.dataset.homeIntro = "visible";
    cleanup();
    // Retain the result even if the logo has not hydrated yet. Mark it first:
    // retiring a live logo can synchronously report its static fallback here.
    if (retireIntroduction && !cancelled) {
      cancelled = true;
      cancelListener?.();
    }
  };
  try {
    if (
      !available ||
      location.hash ||
      window.scrollY > 0 ||
      typeof IntersectionObserver === "undefined" ||
      (
        performance.getEntriesByType("navigation")[0] as
          | PerformanceNavigationTiming
          | undefined
      )?.type === "back_forward"
    )
      return;
    const stored = localStorage.getItem(key);
    const preference = valid(stored) ? stored : "system";
    const systemMotion =
      typeof matchMedia === "function"
        ? matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "reduce"
          : "no-preference"
        : "unavailable";
    if (
      !resolve(
        { status: "ready", preference, systemMotion, documentVisible: true },
        {
          supportsReducedMotion: true,
          featureAvailable: available,
          optedIn: true,
          visible: true,
          locallyPaused: false,
          runtime: "ready",
        },
      ).mayRun
    )
      return;
    // A bounded fail-open deadline, not the sequencing clock. Slow/failed
    // hydration must never make content depend indefinitely on decoration.
    let timeout: number | undefined;
    let hasBeenVisible = false;
    const visibilityChanged = () => {
      if (document.visibilityState === "visible") {
        if (!hasBeenVisible) {
          hasBeenVisible = true;
          timeout = window.setTimeout(reveal, 5000);
        }
      } else if (hasBeenVisible) reveal();
    };
    const events = [
      "keydown",
      "pointerdown",
      "focusin",
      "wheel",
      "touchstart",
      "pagehide",
      "popstate",
      "hashchange",
    ];
    cleanup = () => {
      window.clearTimeout(timeout);
      window.removeEventListener("visibilitychange", visibilityChanged, true);
      for (const event of events)
        window.removeEventListener(event, reveal, true);
    };
    root.__fsHomeIntro = {
      reveal,
      release: reveal,
      onCancelled(callback) {
        cancelListener = callback;
        if (cancelled) callback();
        return () => {
          if (cancelListener === callback) cancelListener = undefined;
        };
      },
    };
    for (const event of events)
      window.addEventListener(event, reveal, { capture: true, passive: true });
    window.addEventListener("visibilitychange", visibilityChanged, true);
    root.dataset.homeIntro = "preparing";
    // A background tab has not presented its intro yet. Start its bounded
    // startup deadline on first visibility, not while the tab is still hidden.
    visibilityChanged();
  } catch {
    reveal();
  }
}

/** Trusted, self-contained startup source; no effects at import/render time. */
export function homeIntroBootstrapScript(available: boolean): string {
  return `(${bootstrap.toString()})(${resolveMotionPermission.toString()},${isMotionPreference.toString()},${JSON.stringify(MOTION_PREFERENCE_KEY)},${JSON.stringify(available)});`;
}

export function bindHomeIntro(
  element: HTMLElement,
  cancelIntroduction?: () => void,
): HomeIntroBinding {
  const root = element as IntroRoot;
  let active = true;
  const stopObservingCancellation = cancelIntroduction
    ? root.__fsHomeIntro?.onCancelled(cancelIntroduction)
    : undefined;
  const reveal = () => {
    root.__fsHomeIntro?.reveal();
    root.dataset.homeIntro = "visible";
  };
  const ended = (event: AnimationEvent) => {
    const target = event.target as HTMLElement;
    if (
      root.dataset.homeIntro === "menu" &&
      target.hasAttribute("data-home-menu")
    )
      root.dataset.homeIntro = "fading";
    else if (
      root.dataset.homeIntro === "fading" &&
      target.hasAttribute("data-home-content")
    )
      reveal();
  };
  root.addEventListener("animationend", ended);
  return {
    logoState(state) {
      if (!active || root.dataset.homeIntro === "visible") return;
      // The controller reports running only after preparing the first frame.
      // Release the initial logo mask synchronously, before the next paint.
      if (state === "running" && root.dataset.homeIntro === "preparing")
        root.dataset.homeIntro = "waiting";
      else if (
        state === "completed" &&
        (root.dataset.homeIntro === "preparing" ||
          root.dataset.homeIntro === "waiting")
      )
        root.dataset.homeIntro = root.querySelector("[data-home-menu]")
          ? "menu"
          : "fading";
      else if (state === "static") reveal();
    },
    release() {
      if (!active) return;
      active = false;
      stopObservingCancellation?.();
      root.removeEventListener("animationend", ended);
      // Strict Mode setup/cleanup before playback must not consume the parser
      // handoff. Its bounded timer still owns fallback; a detached page is safe.
      if (!root.isConnected) {
        root.__fsHomeIntro?.release();
        delete root.__fsHomeIntro;
      }
    },
  };
}
