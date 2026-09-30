import {
  isMotionPreference,
  MOTION_PREFERENCE_KEY,
  resolveMotionPermission,
} from "@/domain/motion/MotionPolicy";

type SceneRoot = HTMLElement & { __fsSceneStartup?: () => void };

/** Parser/CSR startup only. Shared live policy and the scene own all playback. */
function bootstrap(
  resolve: typeof resolveMotionPermission,
  valid: typeof isMotionPreference,
  key: string,
  available: boolean,
  root = document.currentScript?.parentElement as SceneRoot | null,
): () => void {
  if (!root) return () => {};
  if (root.__fsSceneStartup) return root.__fsSceneStartup;
  if (["fade", "static"].includes(root.dataset.sceneReveal ?? ""))
    return () => {};
  let observer: MutationObserver | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const release = () => {
    observer?.disconnect();
    clearTimeout(timeout);
    if (root.__fsSceneStartup === release) delete root.__fsSceneStartup;
  };
  root.dataset.sceneStartup = "static";
  try {
    const stored = localStorage.getItem(key);
    const preference = valid(stored) ? stored : "system";
    const systemMotion =
      typeof matchMedia !== "function"
        ? "unavailable"
        : matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "reduce"
          : "no-preference";
    if (
      !resolve(
        { status: "ready", preference, systemMotion, documentVisible: true },
        {
          supportsReducedMotion: true,
          supportsOffStill: true,
          featureAvailable: available,
          optedIn: true,
          visible: true,
          locallyPaused: false,
          runtime: "unprepared",
        },
      ).mayPrepare
    )
      return release;
    // Observe geometry normally while concealed. Hydration and async Canvas
    // cannot strand the decorative area if either fails to finish.
    observer = new MutationObserver(() => {
      if (["fade", "static"].includes(root.dataset.sceneReveal ?? "")) {
        root.dataset.sceneStartup = "ready";
        release();
      }
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-scene-reveal"],
    });
    timeout = setTimeout(() => {
      root.dataset.sceneStartup = "expired";
      release();
    }, 5000);
    root.__fsSceneStartup = release;
    root.dataset.sceneStartup = "waiting";
  } catch {
    release();
  }
  return release;
}

/** Trusted composition source, matching the existing homepage parser boundary. */
export function sceneStartupScript(available: boolean): string {
  return `(${bootstrap.toString()})(${resolveMotionPermission.toString()},${isMotionPreference.toString()},${JSON.stringify(MOTION_PREFERENCE_KEY)},${JSON.stringify(available)});`;
}

export function bindSceneStartup(
  root: HTMLElement,
  available: boolean,
): () => void {
  // A parser deadline is terminal for this mount, including late hydration.
  if (root.dataset.sceneStartup === "expired") return () => {};
  return bootstrap(
    resolveMotionPermission,
    isMotionPreference,
    MOTION_PREFERENCE_KEY,
    available,
    root,
  );
}
