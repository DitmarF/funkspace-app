import { PARTICLE_SETTINGS } from "@/domain/particles/ParticleSettings";
import {
  advanceParticles,
  resetParticles,
  resizeParticleScene,
  type ParticleSceneState,
} from "@/domain/particles/ParticleScene";
import type {
  ParticleGeometry,
  ParticlePalette,
  ParticleRuntimeEvents,
  ParticleSceneRuntime,
} from "@/domain/ports/ParticleScenePort";
import { createParticleConnectionSampler } from "@/domain/particles/ParticleConnections";

/** Canvas and its single frame chain are owned by exactly this instance. */
export function createCanvasParticleScene(
  host: HTMLElement,
  state: ParticleSceneState,
  initialGeometry: ParticleGeometry,
  initialPalette: ParticlePalette,
  events: ParticleRuntimeEvents,
): ParticleSceneRuntime {
  const win = host.ownerDocument.defaultView;
  if (!win) throw new Error("Canvas window unavailable");
  const canvas = host.ownerDocument.createElement("canvas");
  let context: CanvasRenderingContext2D | null = null;
  let disposed = false;
  let running = false;
  let visible = false;
  let dirty = true;
  let validRaster = false;
  let ready = false;
  let scale = 1;
  let frame: number | undefined;
  let epoch = 0;
  let lastTime: number | undefined;
  let palette = initialPalette;
  const sampleConnections = createParticleConnectionSampler(
    (index) => state.particles[index].baseRadius * state.config.size,
  );

  const readiness = (next: boolean) => {
    if (ready === next) return;
    ready = next;
    events.frameReady(next);
  };
  const cancel = () => {
    const owned = frame;
    frame = undefined;
    epoch++;
    lastTime = undefined;
    if (owned !== undefined) win.cancelAnimationFrame(owned);
  };
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    running = false;
    let first: unknown;
    let failed = false;
    for (const release of [
      () => {
        canvas.hidden = true;
      },
      cancel,
      () => canvas.removeEventListener("contextlost", lost),
      () => canvas.remove(),
    ]) {
      try {
        release();
      } catch (error) {
        if (!failed) first = error;
        failed = true;
      }
    }
    context = null;
    if (failed) throw first;
  };
  const fail = (error: unknown) => {
    if (disposed) return;
    try {
      canvas.hidden = true;
    } finally {
      try {
        destroy();
      } catch {
        /* All releases were attempted; original failure wins. */
      }
      events.failed(error);
    }
  };
  function lost(event: Event) {
    if (disposed) return;
    event.preventDefault();
    fail(new Error("Canvas context lost"));
  }
  const draw = () => {
    if (!context || !state.bounds) return;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.fillStyle = palette.background;
    context.globalAlpha = 1;
    context.fillRect(0, 0, state.bounds.width, state.bounds.height);
    const connections = sampleConnections(state.particles, state.bounds);
    context.strokeStyle = palette.particle;
    for (let i = 0; i < connections.count; i++) {
      const link = connections.links[i];
      const from = state.particles[link.from],
        to = state.particles[link.to];
      context.lineWidth = link.width;
      context.globalAlpha = link.opacity;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
    context.globalAlpha = 1;
    context.fillStyle = palette.particle;
    for (const particle of state.particles) {
      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.baseRadius * state.config.size,
        0,
        2 * Math.PI,
      );
      context.fill();
    }
    if (disposed || !visible || !host.isConnected) return;
    dirty = false;
    canvas.hidden = false;
    readiness(true);
  };
  const schedule = () => {
    if (
      disposed ||
      !visible ||
      !validRaster ||
      frame !== undefined ||
      (!running && !dirty)
    )
      return;
    const ticket = epoch;
    frame = win.requestAnimationFrame((time) => {
      if (disposed || ticket !== epoch) return;
      frame = undefined;
      try {
        if (!host.isConnected) {
          visible = false;
          lastTime = undefined;
          canvas.hidden = true;
          readiness(false);
          return;
        }
        if (running) {
          advanceParticles(state, lastTime === undefined ? 0 : time - lastTime);
          lastTime = Number.isFinite(time) ? time : undefined;
        }
        draw();
        schedule();
      } catch (error) {
        fail(error);
      }
    });
  };
  const safely = (action: () => void) => {
    if (disposed) return;
    try {
      action();
    } catch (error) {
      fail(error);
    }
  };
  const raster = PARTICLE_SETTINGS.raster;
  const geometry = (value: ParticleGeometry) => {
    const old = state.bounds;
    const oldScale = scale;
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    const valid = resizeParticleScene(state, value);
    const dpr = Number.isFinite(value.dpr) && value.dpr > 0 ? value.dpr : 1;
    scale = valid
      ? Math.min(
          dpr,
          raster.maxDpr,
          raster.maxDimensionPx / value.width,
          raster.maxDimensionPx / value.height,
          Math.sqrt(raster.maxPixels / value.width) / Math.sqrt(value.height),
        )
      : 0;
    const width = valid
      ? Math.min(raster.maxDimensionPx, Math.floor(value.width * scale))
      : 0;
    const height = valid
      ? Math.min(raster.maxDimensionPx, Math.floor(value.height * scale))
      : 0;
    validRaster = width > 0 && height > 0;
    if (!validRaster) {
      dirty = true;
      cancel();
      canvas.hidden = true;
      readiness(false);
      return;
    }
    if (oldWidth !== width) canvas.width = width;
    if (oldHeight !== height) canvas.height = height;
    if (
      oldWidth !== width ||
      oldHeight !== height ||
      oldScale !== scale ||
      old?.width !== value.width ||
      old?.height !== value.height
    ) {
      canvas.hidden = true;
      readiness(false);
      dirty = true;
    }
    schedule();
  };
  const runtime: ParticleSceneRuntime = {
    update: (delta) =>
      safely(() => {
        if (running && visible && validRaster) {
          advanceParticles(state, delta);
          dirty = true;
        }
      }),
    pause: () =>
      safely(() => {
        running = false;
        cancel();
        schedule();
      }),
    resume: () =>
      safely(() => {
        if (!running) {
          running = true;
          lastTime = undefined;
        }
        schedule();
      }),
    reset: () =>
      safely(() => {
        running = false;
        cancel();
        resetParticles(state);
        dirty = true;
        schedule();
      }),
    setGeometry: (value) => safely(() => geometry(value)),
    setPalette: (value) =>
      safely(() => {
        if (
          value.background === palette.background &&
          value.particle === palette.particle
        )
          return;
        palette = value;
        dirty = true;
        schedule();
      }),
    setVisible: (value) =>
      safely(() => {
        if (visible === value) return;
        visible = value;
        if (!visible) {
          cancel();
          canvas.hidden = true;
        } else {
          canvas.hidden = !ready;
          schedule();
        }
      }),
    invalidate: () =>
      safely(() => {
        dirty = true;
        schedule();
      }),
    destroy,
  };
  try {
    canvas.hidden = true;
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.particleCanvas = "";
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    });
    context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D unavailable");
    canvas.addEventListener("contextlost", lost);
    geometry(initialGeometry);
    host.appendChild(canvas);
    return runtime;
  } catch (error) {
    try {
      destroy();
    } catch {
      /* Setup error wins; all owned cleanup was attempted. */
    }
    throw error;
  }
}
