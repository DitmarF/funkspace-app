import { PARTICLE_SETTINGS as settings } from "@/domain/particles/ParticleSettings";
import { createParticleConnectionSampler } from "@/domain/particles/ParticleConnections";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCanvasParticleScene } from "./CanvasParticleScene";
import {
  createParticleScene,
  getParticleStill,
  configureParticles,
} from "@/domain/particles/ParticleScene";

function fixture() {
  const host = document.createElement("div");
  document.body.append(host);
  const pending = new Map<number, FrameRequestCallback>();
  const callbacks: FrameRequestCallback[] = [];
  let next = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    callbacks.push(cb);
    pending.set(++next, cb);
    return next;
  });
  const cancel = vi
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation((id) => {
      pending.delete(id);
    });
  const context = {
    setTransform: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    globalAlpha: 1,
    strokeStyle: "",
    lineWidth: 1,
    fillStyle: "",
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  const events = { frameReady: vi.fn(), failed: vi.fn() };
  const state = createParticleScene({ width: 640, height: 360 });
  const palette = { background: "white", particle: "black" };
  const runtime = createCanvasParticleScene(
    host,
    state,
    { width: 640, height: 360, dpr: 2 },
    palette,
    events,
  );
  const canvas = host.querySelector("canvas")!;
  const tick = (time: number) => {
    const entries = [...pending.values()];
    pending.clear();
    entries.forEach((cb) => cb(time));
  };
  return {
    host,
    pending,
    callbacks,
    cancel,
    context,
    events,
    state,
    palette,
    runtime,
    canvas,
    tick,
  };
}
afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

describe("Canvas particle ownership", () => {
  it("applies connection controls to the same paused Canvas with one still redraw", () => {
    const f = fixture();
    f.runtime.setVisible(true);
    f.tick(0);
    const before = structuredClone(f.state.particles);
    const original = f.canvas;
    f.context.stroke.mockClear();
    configureParticles(f.state, {
      connectionsPerParticle: 1,
      connectionDistance: 2,
    });
    f.runtime.invalidate();
    f.runtime.invalidate();
    expect(f.pending.size).toBe(1);
    f.tick(16);
    expect(f.context.stroke.mock.calls.length).toBeGreaterThan(0);
    expect(f.context.stroke.mock.calls.length).toBeLessThanOrEqual(
      f.state.config.count / 2,
    );
    expect(f.state.particles).toEqual(before);
    expect(f.host.querySelector("canvas")).toBe(original);
    expect(f.pending.size).toBe(0);
    f.runtime.destroy();
  });
  it("draws the same size-dependent links as the independent still after a size change", () => {
    const f = fixture();
    configureParticles(f.state, { size: 2 });
    const strokes: { width: number; opacity: number }[] = [];
    f.context.stroke.mockImplementation(() => {
      strokes.push({
        width: f.context.lineWidth,
        opacity: f.context.globalAlpha,
      });
    });
    f.runtime.setVisible(true);
    f.tick(0);
    const still = getParticleStill(f.state);
    const sample = createParticleConnectionSampler(
      (i) => still.particles[i].radius,
    )(still.particles, still.bounds);
    expect(strokes).toEqual(
      sample.links
        .slice(0, sample.count)
        .map(({ width, opacity }) => ({ width, opacity })),
    );
    expect(strokes.length).toBeGreaterThan(0);
    f.runtime.destroy();
  });
  it("draws proximity lines before opaque particles in the same frame", () => {
    const f = fixture();
    f.runtime.setVisible(true);
    f.tick(0);
    expect(f.context.stroke).toHaveBeenCalled();
    expect(f.context.stroke.mock.invocationCallOrder[0]).toBeLessThan(
      f.context.arc.mock.invocationCallOrder[0],
    );
    expect(f.context.globalAlpha).toBe(1);
    expect(f.context.strokeStyle).toBe(f.palette.particle);
    expect(f.context.lineWidth).toBeGreaterThanOrEqual(
      settings.connections.widthCssPx * settings.connections.sizeScale[0],
    );
    expect(f.context.lineWidth).toBeLessThanOrEqual(
      settings.connections.widthCssPx * settings.connections.sizeScale[1],
    );
    expect(f.pending.size).toBe(0);
    f.runtime.destroy();
  });
  it("a throwing frame request fails once and a late callback cannot resurrect", () => {
    const f = fixture();
    vi.mocked(window.requestAnimationFrame).mockImplementation(() => {
      throw Error("schedule");
    });
    f.runtime.setVisible(true);
    f.runtime.resume();
    expect(f.events.failed).toHaveBeenCalledTimes(1);
    expect(f.host.children).toHaveLength(0);
  });
  it("backing resize failure releases the canvas", () => {
    const f = fixture();
    Object.defineProperty(f.canvas, "width", {
      set() {
        throw Error("backing");
      },
    });
    f.runtime.setGeometry({ width: 320, height: 180, dpr: 1 });
    expect(f.events.failed).toHaveBeenCalledTimes(1);
    expect(f.host.children).toHaveLength(0);
  });
  it("destroy during readiness prevents the next frame and later remount owns one canvas", () => {
    const f = fixture();
    f.events.frameReady.mockImplementation(() => f.runtime.destroy());
    f.runtime.setVisible(true);
    f.runtime.resume();
    f.tick(0);
    expect(f.pending.size).toBe(0);
    expect(f.host.children).toHaveLength(0);
    const next = createCanvasParticleScene(
      f.host,
      createParticleScene(null),
      { width: 640, height: 360, dpr: 1 },
      f.palette,
      { frameReady: vi.fn(), failed: vi.fn() },
    );
    next.setVisible(true);
    next.resume();
    expect(f.pending.size).toBe(1);
    next.destroy();
    expect(f.pending.size).toBe(0);
    expect(f.host.children).toHaveLength(0);
  });
  it("paused zero-size recovery draws exactly one fresh still", () => {
    const f = fixture();
    f.runtime.setVisible(true);
    f.tick(0);
    f.runtime.setGeometry({ width: 0, height: 0, dpr: 1 });
    f.runtime.setGeometry({ width: 640, height: 360, dpr: 2 });
    expect(f.pending.size).toBe(1);
    f.tick(30);
    expect(f.canvas.hidden).toBe(false);
    expect(f.pending.size).toBe(0);
    f.runtime.destroy();
  });
  it("starts inert, owns one chain, first/resumed ticks are zero and hidden time is discarded", () => {
    const f = fixture();
    const initial = getParticleStill(f.state);
    expect(f.pending.size).toBe(0);
    expect(f.canvas.hidden).toBe(true);
    f.runtime.setVisible(true);
    f.runtime.resume();
    f.runtime.resume();
    expect(f.pending.size).toBe(1);
    f.tick(100);
    expect(getParticleStill(f.state)).toEqual(initial);
    expect(f.events.frameReady).toHaveBeenCalledWith(true);
    f.tick(120);
    expect(getParticleStill(f.state)).not.toEqual(initial);
    expect(f.pending.size).toBe(1);
    f.runtime.setVisible(false);
    f.runtime.pause();
    expect(f.pending.size).toBe(0);
    const held = getParticleStill(f.state);
    f.runtime.setVisible(true);
    f.runtime.resume();
    f.tick(100000);
    expect(getParticleStill(f.state)).toEqual(held);
    f.runtime.destroy();
    f.runtime.destroy();
    expect(f.pending.size).toBe(0);
    expect(f.host.children).toHaveLength(0);
    f.callbacks.forEach((cb) => cb(200000));
    f.runtime.resume();
    expect(f.pending.size).toBe(0);
  });
  it("coalesces visible paused changes into one still and defers hidden redraws", () => {
    const f = fixture();
    f.runtime.setVisible(true);
    f.tick(0);
    f.runtime.pause();
    const still = getParticleStill(f.state);
    const draws = f.context.fillRect.mock.calls.length;
    f.runtime.invalidate();
    f.runtime.invalidate();
    f.runtime.setPalette({ background: "black", particle: "white" });
    f.runtime.pause();
    expect(f.pending.size).toBe(1);
    f.tick(30);
    expect(f.pending.size).toBe(0);
    expect(f.context.fillRect).toHaveBeenCalledTimes(draws + 1);
    expect(getParticleStill(f.state)).toEqual(still);
    f.runtime.setVisible(false);
    f.runtime.invalidate();
    f.runtime.setPalette(f.palette);
    expect(f.pending.size).toBe(0);
    f.runtime.setVisible(true);
    f.tick(50);
    expect(f.pending.size).toBe(0);
    f.runtime.destroy();
  });
  it("bounds backing allocation, resets transforms and preserves physics on DPR changes", () => {
    const f = fixture();
    f.runtime.setVisible(true);
    f.tick(0);
    const still = getParticleStill(f.state);
    f.runtime.setGeometry({ width: 640, height: 360, dpr: 10 });
    f.tick(1);
    expect(getParticleStill(f.state)).toEqual(still);
    expect(f.canvas.width).toBe(1280);
    f.runtime.setGeometry({ width: 10000, height: 5000, dpr: 3 });
    f.tick(2);
    expect(f.canvas.width).toBeLessThanOrEqual(4096);
    expect(f.canvas.height).toBeLessThanOrEqual(4096);
    expect(f.canvas.width * f.canvas.height).toBeLessThanOrEqual(4000000);
    expect(f.state.particles.map((p) => p.id)).toEqual(
      still.particles.map((p) => p.id),
    );
    const transform = f.context.setTransform.mock.lastCall!;
    expect(transform[0]).toBeLessThan(1);
    expect(transform[1]).toBe(0);
    expect(transform[4]).toBe(0);
    f.runtime.setGeometry({ width: 640, height: 360, dpr: NaN });
    f.tick(3);
    expect(f.canvas.width).toBe(640);
    expect(f.context.setTransform).toHaveBeenLastCalledWith(1, 0, 0, 1, 0, 0);
    f.runtime.destroy();
  });
  it("suspends zero and disconnected geometry, restores with zero delta", () => {
    const f = fixture();
    f.runtime.setVisible(true);
    f.runtime.resume();
    f.tick(0);
    f.tick(20);
    f.runtime.setGeometry({ width: 0, height: 0, dpr: 2 });
    expect(f.pending.size).toBe(0);
    expect(f.canvas.hidden).toBe(true);
    f.runtime.setGeometry({ width: 640, height: 360, dpr: 2 });
    const still = getParticleStill(f.state);
    f.tick(9999);
    expect(getParticleStill(f.state)).toEqual(still);
    f.host.remove();
    f.tick(10010);
    expect(f.pending.size).toBe(0);
    expect(f.canvas.hidden).toBe(true);
    f.runtime.destroy();
  });
  it.each(["fillRect", "arc", "setTransform", "stroke"] as const)(
    "fails closed when %s throws",
    (method) => {
      const f = fixture();
      f.context[method].mockImplementation(() => {
        throw Error("draw");
      });
      f.runtime.setVisible(true);
      f.runtime.resume();
      f.tick(0);
      expect(f.events.failed).toHaveBeenCalledTimes(1);
      expect(f.host.children).toHaveLength(0);
      expect(f.pending.size).toBe(0);
      f.runtime.resume();
      expect(f.pending.size).toBe(0);
    },
  );
  it("context loss is terminal and removes listeners even if frame cancellation throws", () => {
    const f = fixture();
    const removed = vi.spyOn(f.canvas, "removeEventListener");
    f.runtime.setVisible(true);
    f.runtime.resume();
    f.cancel.mockImplementation(() => {
      throw Error("cancel");
    });
    f.canvas.dispatchEvent(new Event("contextlost", { cancelable: true }));
    expect(f.events.failed).toHaveBeenCalledTimes(1);
    expect(removed).toHaveBeenCalledWith("contextlost", expect.any(Function));
    expect(f.host.children).toHaveLength(0);
    f.callbacks.forEach((cb) => cb(10));
    expect(f.context.fillRect).not.toHaveBeenCalled();
    f.runtime.destroy();
  });
  it("continues cleanup when removing a listener throws", () => {
    const f = fixture();
    vi.spyOn(f.canvas, "removeEventListener").mockImplementation(() => {
      throw Error("listener");
    });
    expect(() => f.runtime.destroy()).toThrow("listener");
    expect(f.host.children).toHaveLength(0);
    expect(() => f.runtime.destroy()).not.toThrow();
  });
  it.each(["null", "throw", "append"])(
    "rolls back %s setup failure",
    (failure) => {
      const f = fixture();
      f.runtime.destroy();
      if (failure === "null")
        vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
      if (failure === "throw")
        vi.mocked(HTMLCanvasElement.prototype.getContext).mockImplementation(
          () => {
            throw Error("context");
          },
        );
      if (failure === "append")
        vi.spyOn(f.host, "appendChild").mockImplementation(() => {
          throw Error("append");
        });
      expect(() =>
        createCanvasParticleScene(
          f.host,
          f.state,
          { width: 10, height: 10, dpr: 1 },
          f.palette,
          f.events,
        ),
      ).toThrow();
      expect(f.host.children).toHaveLength(0);
      expect(f.pending.size).toBe(0);
    },
  );
  it("reset keeps current configuration and never creates a second loop", () => {
    const f = fixture();
    const initial = getParticleStill(f.state);
    f.runtime.setVisible(true);
    f.runtime.resume();
    f.tick(0);
    f.tick(50);
    f.runtime.reset();
    f.tick(60);
    expect(getParticleStill(f.state)).toEqual(initial);
    expect(f.pending.size).toBe(0);
    f.runtime.resume();
    expect(f.pending.size).toBe(1);
    f.runtime.destroy();
  });
});
