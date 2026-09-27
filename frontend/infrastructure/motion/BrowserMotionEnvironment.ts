import type {
  MotionEnvironment,
  MotionEnvironmentPort,
  SystemMotion,
} from "@/domain/ports/MotionEnvironmentPort";

/** No browser work until the provider activates observe(). */
export class BrowserMotionEnvironment implements MotionEnvironmentPort {
  observe(onChange: (value: MotionEnvironment) => void) {
    let active = true;
    let listening = false;
    let media: MediaQueryList | undefined;
    let visibleDocument: Document | undefined;
    let removeMedia = () => {};
    let removeVisibility = () => {};
    const safelyRemove = (remove: () => void) => {
      try {
        remove();
      } catch {
        /* Continue releasing other owned resources. */
      }
    };
    const sample = (): MotionEnvironment => {
      let systemMotion: SystemMotion = "unavailable";
      let documentVisible = false;
      try {
        if (media) systemMotion = media.matches ? "reduce" : "no-preference";
      } catch {
        /* Unavailable signal stays static. */
      }
      try {
        documentVisible = visibleDocument?.visibilityState === "visible";
      } catch {
        /* Unavailable visibility stays hidden. */
      }
      return { systemMotion, documentVisible };
    };
    const changed = () => {
      if (active && listening) onChange(sample());
    };
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function"
      ) {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (
          typeof query.addEventListener === "function" &&
          typeof query.removeEventListener === "function"
        ) {
          removeMedia = () => query.removeEventListener("change", changed);
          query.addEventListener("change", changed);
        } else if (
          typeof query.addListener === "function" &&
          typeof query.removeListener === "function"
        ) {
          removeMedia = () => query.removeListener(changed);
          query.addListener(changed);
        } else throw new Error("Media query observation unavailable");
        media = query;
      }
    } catch {
      safelyRemove(removeMedia);
      removeMedia = () => {};
    }
    try {
      if (typeof document !== "undefined") {
        const target = document;
        removeVisibility = () =>
          target.removeEventListener("visibilitychange", changed);
        target.addEventListener("visibilitychange", changed);
        visibleDocument = target;
      }
    } catch {
      safelyRemove(removeVisibility);
      removeVisibility = () => {};
    }
    const current = sample();
    listening = true;
    return {
      current,
      unsubscribe: () => {
        if (!active) return;
        active = false;
        safelyRemove(removeMedia);
        safelyRemove(removeVisibility);
      },
    };
  }
}
