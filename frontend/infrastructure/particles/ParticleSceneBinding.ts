import type { ThemeService } from "@/application/theme/ThemeService";
import type {
  ParticleSceneBinding,
  ParticleSurface,
} from "@/domain/ports/ParticleScenePort";

/** Observes permission inputs without importing or creating Canvas. */
export function bindParticleScene(
  host: HTMLElement,
  theme: Pick<ThemeService, "subscribe">,
  load = () => import("./CanvasParticleScene"),
): ParticleSceneBinding {
  const win = host.ownerDocument.defaultView;
  if (!win) throw new Error("Scene window unavailable");
  let active = true;
  let intersecting = false;
  let observedBounds: Pick<DOMRectReadOnly, "width" | "height"> | undefined;
  let snapshot: ParticleSurface = {
    width: 0,
    height: 0,
    dpr: 1,
    visible: false,
    palette: null,
  };
  const listeners = new Set<(value: ParticleSurface) => void>();
  const releases: (() => void)[] = [];
  let releaseResolution = () => {};
  const publish = () => {
    if (active) for (const listener of listeners) listener(snapshot);
  };
  const measure = (rect?: Pick<DOMRectReadOnly, "width" | "height">) => {
    if (!active) return;
    if (rect) observedBounds = { width: rect.width, height: rect.height };
    const style = win.getComputedStyle(host);
    const width =
      observedBounds?.width ??
      Math.max(
        0,
        host.clientWidth -
          (parseFloat(style.paddingLeft) || 0) -
          (parseFloat(style.paddingRight) || 0),
      );
    const height =
      observedBounds?.height ??
      Math.max(
        0,
        host.clientHeight -
          (parseFloat(style.paddingTop) || 0) -
          (parseFloat(style.paddingBottom) || 0),
      );
    const background = style
      .getPropertyValue("--fs-color-surface-background")
      .trim();
    const particle = style
      .getPropertyValue("--fs-color-content-primary")
      .trim();
    const valid = (color: string) =>
      color !== "" &&
      !color.includes("var(") &&
      (win.CSS?.supports?.("color", color) ?? true);
    snapshot = {
      width,
      height,
      dpr: win.devicePixelRatio,
      visible: host.isConnected && intersecting,
      palette:
        valid(background) && valid(particle) ? { background, particle } : null,
    };
    publish();
  };
  const resolution = () => {
    releaseResolution();
    if (!active) return;
    const query = win.matchMedia(`(resolution: ${win.devicePixelRatio}dppx)`);
    const changed = () => {
      if (active) {
        measure();
        resolution();
      }
    };
    releaseResolution = () => query.removeEventListener("change", changed);
    query.addEventListener("change", changed);
  };
  const destroy = () => {
    if (!active) return;
    active = false;
    listeners.clear();
    let first: unknown;
    let failed = false;
    for (const release of [() => releaseResolution(), ...releases.splice(0)]) {
      try {
        release();
      } catch (error) {
        if (!failed) first = error;
        failed = true;
      }
    }
    if (failed) throw first;
  };
  try {
    const resize = new ResizeObserver((entries) => {
      if (!active) return;
      const entry = entries.find((item) => item.target === host);
      if (entry) measure(entry.contentRect);
    });
    releases.push(() => resize.disconnect());
    resize.observe(host);
    const intersection = new IntersectionObserver((entries) => {
      if (!active) return;
      const entry = entries.find((item) => item.target === host);
      if (entry) {
        intersecting = entry.isIntersecting;
        measure();
      }
    });
    releases.push(() => intersection.disconnect());
    intersection.observe(host);
    resolution();
    releases.push(theme.subscribe(() => measure()));
    measure();
  } catch (error) {
    try {
      destroy();
    } catch {
      /* Preserve setup failure after attempting all cleanup. */
    }
    throw error;
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      const entry = (value: ParticleSurface) => listener(value);
      if (active) listeners.add(entry);
      try {
        entry(snapshot);
      } catch (error) {
        listeners.delete(entry);
        throw error;
      }
      return () => {
        listeners.delete(entry);
      };
    },
    async prepare(state, current, events) {
      if (!active || !current()) throw new Error("Scene preparation canceled");
      const module = await load();
      if (!active || !current() || !snapshot.palette)
        throw new Error("Scene preparation canceled");
      const runtime = module.createCanvasParticleScene(
        host,
        state,
        snapshot,
        snapshot.palette,
        events,
      );
      if (!active || !current()) {
        runtime.destroy();
        throw new Error("Scene preparation canceled");
      }
      return runtime;
    },
    destroy,
  };
}
