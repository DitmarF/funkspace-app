import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ParticleSceneController } from "@/application/animations/ParticleSceneController";
import { DEFAULT_PARTICLE_CONFIG } from "@/domain/particles/ParticleSettings";
import {
  advanceParticles,
  createParticleScene,
  getParticleStill,
  resetParticles,
  type ParticleSceneState,
} from "@/domain/particles/ParticleScene";
import type { MotionSnapshot } from "@/domain/motion/MotionPolicy";
import type { ParticleSceneBinding } from "@/domain/ports/ParticleScenePort";
import type { DialogBindingOptions } from "@/domain/ports/DialogBindingPort";
import PortfolioOverlayScope, {
  usePortfolioOverlays,
} from "../Layouts/PortfolioOverlayScope";
import SceneCustomization from "./SceneCustomization";

const deps = vi.hoisted(() => ({ services: {} }));
vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: () => deps.services,
}));
let openingFails = false;
let locks = 0;
const departures = new Set<() => void>();
const handoff = {
  fallbackTarget: () => document.querySelector<HTMLElement>("main"),
  observeDeparture: (cb: () => void) => {
    departures.add(cb);
    return () => {
      departures.delete(cb);
    };
  },
};
beforeEach(() => {
  openingFails = false;
  locks = 0;
  deps.services = {
    navigationHandoff: handoff,
    apertureAssets: {
      checkMask: (cb: (ok: boolean) => void) => {
        cb(true);
        return () => {};
      },
      load: () => () => {},
    },
    bindDialog: (
      node: HTMLDialogElement,
      options: DialogBindingOptions<HTMLElement>,
    ) => {
      let active = false;
      const finish = (mode = options.closeDisposition?.() ?? "dismiss") => {
        if (!active) return;
        active = false;
        node.open = false;
        locks--;
        if (mode === "dismiss") options.returnFocus()?.focus();
        options.onReleased?.(mode);
      };
      return {
        sync(open: boolean) {
          if (open && !active) {
            if (openingFails) throw Error("Unavailable");
            expect(locks).toBe(0);
            active = true;
            node.open = true;
            locks++;
          } else if (!open) finish();
        },
        requestClose: () => options.onCloseRequest("close-button"),
        destroy: finish,
      };
    },
  };
});
afterEach(() => {
  cleanup();
  expect(locks).toBe(0);
  expect(departures.size).toBe(0);
});

function fixture(
  mode: "playing" | "paused" | "reduced" | "off" | "failed" = "playing",
) {
  const policy: MotionSnapshot = {
    status: "ready",
    preference: mode === "off" ? "off" : mode === "reduced" ? "reduced" : "on",
    systemMotion: "no-preference",
    documentVisible: true,
  };
  let state: ParticleSceneState;
  const runtime = {
    update: vi.fn(),
    resume: vi.fn(),
    pause: vi.fn(),
    destroy: vi.fn(),
    setGeometry: vi.fn(),
    setPalette: vi.fn(),
    setVisible: vi.fn(),
    invalidate: vi.fn(),
    reset: vi.fn(() => resetParticles(state)),
  };
  const surface = {
    width: 640,
    height: 360,
    visible: true,
    dpr: 1,
    palette: { background: "white", particle: "black" },
  };
  const binding: ParticleSceneBinding = {
    getSnapshot: () => surface,
    subscribe: (cb) => {
      cb(surface);
      return () => {};
    },
    destroy: vi.fn(),
    prepare: vi.fn(async (value, _current, events) => {
      state = value;
      if (mode === "failed") throw Error("Canvas unavailable");
      events.frameReady(true);
      return runtime;
    }),
  };
  const scene = new ParticleSceneController(
    {
      getSnapshot: () => policy,
      subscribe: (cb) => {
        cb(policy);
        return () => {};
      },
      setPreference: vi.fn(),
    },
    true,
    () => binding,
    {
      optedIn: true,
      presentation: { introReady: true, coverReady: true, occluded: false },
    },
  );
  scene.initialize();
  function Contents() {
    const overlays = usePortfolioOverlays()!;
    const setNavigationReady = overlays.setNavigationReady;
    const [snapshot, setSnapshot] = useState(scene.getSnapshot);
    const [overlayTransparent, setOverlayTransparent] = useState(false);
    useEffect(() => {
      setNavigationReady(true);
      const release = scene.subscribe(setSnapshot);
      return () => {
        release();
        scene.destroy();
      };
    }, [setNavigationReady]);
    useLayoutEffect(
      () =>
        scene.setPresentation({
          introReady: true,
          coverReady: true,
          occluded: overlays.owner !== "none",
        }),
      [overlays.owner],
    );
    return (
      <main tabIndex={-1}>
        <SceneCustomization
          scene={scene}
          snapshot={snapshot}
          statusMessage="Scene state"
          overlayTransparent={overlayTransparent}
          onOverlayTransparentChange={setOverlayTransparent}
        />
      </main>
    );
  }
  const view = render(
    <PortfolioOverlayScope>
      <Contents />
    </PortfolioOverlayScope>,
  );
  return {
    scene,
    binding,
    runtime,
    view,
    advance: () => {
      if (state) advanceParticles(state, 50);
    },
  };
}

it.each(["playing", "paused", "reduced", "off", "failed"] as const)(
  "Reset under %s restores defaults/seed without changing Pause or starting covered motion",
  async (mode) => {
    const f = fixture(mode);
    await act(async () => {});
    if (mode === "paused") act(() => f.scene.pause());
    f.advance();
    const wasPaused = f.scene.getSnapshot().locallyPaused;
    fireEvent.click(
      screen.getByRole("button", { name: "Customize animation" }),
    );
    f.runtime.resume.mockClear();
    fireEvent.change(screen.getByRole("slider", { name: "Density" }), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Speed" }), {
      target: { value: "0.6" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "Size" }), {
      target: { value: "2" },
    });
    fireEvent.change(
      screen.getByRole("slider", { name: "Connections per particle" }),
      { target: { value: "1" } },
    );
    fireEvent.change(
      screen.getByRole("slider", { name: "Connection distance" }),
      { target: { value: "10" } },
    );
    fireEvent.click(
      screen.getByRole("switch", { name: "Transparent WEB overlay" }),
    );
    expect(
      screen.getByRole("switch", { name: "Transparent WEB overlay" }),
    ).toHaveAttribute("aria-checked", "true");
    expect(f.scene.getSnapshot().config).toEqual({
      ...DEFAULT_PARTICLE_CONFIG,
      count: 100,
      speed: 0.6,
      size: 2,
      connectionsPerParticle: 1,
      connectionDistance: 10,
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset animation" }));
    expect(f.scene.getSnapshot().config).toEqual(DEFAULT_PARTICLE_CONFIG);
    expect(
      screen.getByRole("switch", { name: "Transparent WEB overlay" }),
    ).toHaveAttribute("aria-checked", "false");
    expect(f.scene.getSnapshot().locallyPaused).toBe(wasPaused);
    expect(f.runtime.resume).not.toHaveBeenCalled();
    expect(f.scene.getStill().particles).toEqual(
      getParticleStill(createParticleScene({ width: 640, height: 360 }))
        .particles,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    if (mode !== "playing") expect(f.runtime.resume).not.toHaveBeenCalled();
    expect(f.binding.prepare).toHaveBeenCalledTimes(1);
  },
);

it("uses effective Domain values, rejects invalid calls, retains edits on reopen and keeps one owner", async () => {
  const f = fixture();
  await act(async () => {});
  fireEvent.click(screen.getByRole("button", { name: "Customize animation" }));
  act(() => f.scene.configure({ count: -50, speed: 100, size: 100 }));
  expect(screen.getByRole("slider", { name: "Density" })).toHaveValue("10");
  expect(screen.getByRole("slider", { name: "Speed" })).toHaveValue("2");
  expect(screen.getByRole("slider", { name: "Size" })).toHaveValue("4");
  const before = f.scene.getSnapshot().config;
  act(() => expect(f.scene.configure({ count: NaN })).toEqual(before));
  expect(f.scene.getSnapshot().config).toEqual(before);
  act(() => f.scene.configure({ ...before, count: 21 }));
  expect(screen.getByRole("slider", { name: "Density" })).toHaveValue("21");
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(
    screen.getByRole("button", { name: "Customize animation" }),
  ).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "Customize animation" }));
  expect(screen.getByRole("slider", { name: "Density" })).toHaveValue("21");
  expect(f.binding.prepare).toHaveBeenCalledTimes(1);
  expect(f.runtime.destroy).not.toHaveBeenCalled();
  expect(
    document.querySelectorAll(
      "[data-particle-static], [data-aperture-fallback] circle, [data-aperture-fallback] line",
    ),
  ).toHaveLength(0);
});

it("failed dialog opening reports inline unavailability and releases coordination", async () => {
  fixture();
  await act(async () => {});
  openingFails = true;
  fireEvent.click(screen.getByRole("button", { name: "Customize animation" }));
  await waitFor(() =>
    expect(
      screen.getByText(
        "Customization is unavailable. The animation page and navigation remain usable.",
      ),
    ).toBeVisible(),
  );
  expect(locks).toBe(0);
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("route departure releases without restoring the old Customize invoker", async () => {
  fixture();
  await act(async () => {});
  const focus = vi.spyOn(HTMLElement.prototype, "focus");
  fireEvent.click(screen.getByRole("button", { name: "Customize animation" }));
  focus.mockClear();
  act(() => departures.forEach((cb) => cb()));
  expect(locks).toBe(0);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(focus).not.toHaveBeenCalled();
  focus.mockRestore();
});
