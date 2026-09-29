import { DEFAULT_PARTICLE_CONFIG } from "@/domain/particles/ParticleSettings";
import { describe, expect, it, vi } from "vitest";
import { ParticleSceneController } from "./ParticleSceneController";
import type { MotionSnapshot } from "@/domain/motion/MotionPolicy";
import type {
  ParticleSceneBinding,
  ParticleSceneRuntime,
  ParticleSurface,
} from "@/domain/ports/ParticleScenePort";

const flush = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};
function fixture(available = true) {
  let policy: MotionSnapshot = {
    status: "ready",
    preference: "on",
    systemMotion: "reduce",
    documentVisible: true,
  };
  const policyListeners = new Set<(s: MotionSnapshot) => void>();
  const surfaceListeners = new Set<(s: ParticleSurface) => void>();
  let surface: ParticleSurface = {
    width: 640,
    height: 360,
    dpr: 1,
    visible: false,
    palette: { background: "white", particle: "black" },
  };
  const runtime = () => ({
    update: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    reset: vi.fn(),
    destroy: vi.fn(),
    setGeometry: vi.fn(),
    setPalette: vi.fn(),
    setVisible: vi.fn(),
    invalidate: vi.fn(),
  });
  const attempts: {
    resolve: (r: ParticleSceneRuntime) => void;
    reject: (e: unknown) => void;
    current: () => boolean;
  }[] = [];
  const binding: ParticleSceneBinding = {
    getSnapshot: () => surface,
    subscribe: (cb) => {
      surfaceListeners.add(cb);
      cb(surface);
      return () => {
        surfaceListeners.delete(cb);
      };
    },
    destroy: vi.fn(),
    prepare: vi.fn<ParticleSceneBinding["prepare"]>(
      (_state, current) =>
        new Promise((resolve, reject) =>
          attempts.push({ resolve, reject, current }),
        ),
    ),
  };
  const service = {
    getSnapshot: () => policy,
    setPreference: vi.fn(),
    subscribe: (cb: (s: MotionSnapshot) => void) => {
      policyListeners.add(cb);
      cb(policy);
      return () => {
        policyListeners.delete(cb);
      };
    },
  };
  const controller = new ParticleSceneController(
    service,
    available,
    () => binding,
    {
      optedIn: true,
      presentation: { introReady: true, coverReady: true, occluded: false },
    },
  );
  const visibility = (visible: boolean) => {
    surface = { ...surface, visible };
    surfaceListeners.forEach((cb) => cb(surface));
  };
  const change = (patch: Partial<MotionSnapshot>) => {
    policy = { ...policy, ...patch };
    policyListeners.forEach((cb) => cb(policy));
  };
  controller.initialize();
  return {
    controller,
    binding,
    attempts,
    runtime,
    visibility,
    change,
    policyListeners,
    surfaceListeners,
    surface: (patch: Partial<ParticleSurface>) => {
      surface = { ...surface, ...patch };
      surfaceListeners.forEach((cb) => cb(surface));
    },
  };
}
describe("particle permission orchestration", () => {
  it("distinguishes palette rejection from unmeasured or hidden geometry without granting preparation", async () => {
    const f = fixture();
    expect(f.controller.getSnapshot().paletteUnavailable).toBe(false);
    f.surface({ width: 0, height: 0, palette: null });
    expect(f.controller.getSnapshot().paletteUnavailable).toBe(false);
    f.surface({ width: 640, height: 360, visible: true });
    await flush();
    expect(f.controller.getSnapshot().paletteUnavailable).toBe(true);
    expect(f.binding.prepare).not.toHaveBeenCalled();
    expect(f.controller.getSnapshot().frameReady).toBe(false);
    f.surface({ palette: { background: "white", particle: "black" } });
    await flush();
    expect(f.controller.getSnapshot().paletteUnavailable).toBe(false);
    expect(f.binding.prepare).toHaveBeenCalledTimes(1);
    f.controller.destroy();
  });
  it("observes before loading and starts only when actually visible", async () => {
    const f = fixture();
    await flush();
    expect(f.attempts).toHaveLength(0);
    expect(f.controller.getStill().particles).toHaveLength(
      DEFAULT_PARTICLE_CONFIG.count,
    );
    f.visibility(true);
    await flush();
    expect(f.attempts).toHaveLength(1);
    const runtime = f.runtime();
    f.attempts[0].resolve(runtime);
    await flush();
    expect(f.controller.getSnapshot().status).toBe("ready");
    expect(runtime.resume).toHaveBeenCalled();
    f.controller.destroy();
  });
  it.each(["resolve", "reject"] as const)(
    "cancels and ignores stale %s while a newer attempt succeeds",
    async (result) => {
      const f = fixture();
      f.visibility(true);
      await flush();
      f.visibility(false);
      expect(f.controller.getSnapshot().status).toBe("unprepared");
      expect(f.attempts[0].current()).toBe(false);
      f.controller.configure({ count: 84 });
      f.visibility(true);
      await flush();
      expect(f.attempts).toHaveLength(2);
      const stale = f.runtime();
      if (result === "resolve") f.attempts[0].resolve(stale);
      else f.attempts[0].reject(Error("old"));
      await flush();
      expect(f.controller.getSnapshot().status).toBe("preparing");
      if (result === "resolve") expect(stale.destroy).toHaveBeenCalledTimes(1);
      const current = f.runtime();
      f.attempts[1].resolve(current);
      await flush();
      expect(f.controller.getSnapshot().status).toBe("ready");
      expect(f.controller.getSnapshot().config.count).toBe(84);
      f.controller.destroy();
    },
  );
  it("destroy invalidates preparation before cleanup, including throwing cleanup", async () => {
    const f = fixture();
    f.visibility(true);
    await flush();
    vi.mocked(f.binding.destroy).mockImplementation(() => {
      throw Error("cleanup");
    });
    f.controller.destroy();
    f.controller.destroy();
    const late = f.runtime();
    f.attempts[0].resolve(late);
    await flush();
    expect(late.destroy).toHaveBeenCalledTimes(1);
    expect(f.controller.getSnapshot().status).toBe("disposed");
    expect(f.policyListeners.size + f.surfaceListeners.size).toBe(0);
    expect(f.binding.destroy).toHaveBeenCalledTimes(1);
  });
  it("failure does not retry on visibility or policy changes", async () => {
    const f = fixture();
    f.visibility(true);
    await flush();
    f.attempts[0].reject(Error("load"));
    await flush();
    f.visibility(false);
    f.visibility(true);
    f.change({ preference: "off" });
    f.change({ preference: "on" });
    await flush();
    expect(f.attempts).toHaveLength(1);
    expect(f.controller.getSnapshot().status).toBe("failed");
    f.controller.destroy();
  });
  it.each(["system", "off"] as const)(
    "%s stays static with device reduction and never loads",
    async (preference) => {
      const f = fixture();
      f.change({ preference });
      f.visibility(true);
      await flush();
      expect(f.attempts).toHaveLength(0);
      expect(f.controller.getSnapshot().presentation).toBe("complete-static");
      f.controller.destroy();
    },
  );
  it("Reduced prepares a visible still, never resumes, and preserves local Pause", async () => {
    const f = fixture();
    f.change({ preference: "reduced" });
    f.visibility(true);
    await flush();
    const runtime = f.runtime();
    f.attempts[0].resolve(runtime);
    await flush();
    expect(runtime.setVisible).toHaveBeenLastCalledWith(true);
    expect(runtime.pause).toHaveBeenCalled();
    expect(runtime.resume).not.toHaveBeenCalled();
    expect(f.controller.getSnapshot()).toMatchObject({
      reducedMotion: true,
      locallyPaused: false,
      presentation: "hold-frame",
    });
    f.controller.resume();
    expect(runtime.resume).not.toHaveBeenCalled();
    f.controller.pause();
    f.change({ preference: "on" });
    expect(runtime.resume).not.toHaveBeenCalled();
    f.controller.resume();
    expect(runtime.resume).toHaveBeenCalledTimes(1);
    f.change({ preference: "reduced" });
    expect(f.attempts).toHaveLength(1);
    expect(runtime.reset).not.toHaveBeenCalled();
    f.change({ documentVisible: false });
    expect(runtime.setVisible).toHaveBeenLastCalledWith(false);
    f.controller.destroy();
  });
  it("feature denial, pending policy, intro, cover and occlusion deny preparation", async () => {
    const off = fixture(false);
    off.visibility(true);
    await flush();
    expect(off.attempts).toHaveLength(0);
    off.controller.destroy();
    const f = fixture();
    f.change({ status: "pending" });
    f.visibility(true);
    await flush();
    expect(f.attempts).toHaveLength(0);
    for (const presentation of [
      { introReady: false, coverReady: true, occluded: false },
      { introReady: true, coverReady: false, occluded: false },
      { introReady: true, coverReady: true, occluded: true },
    ]) {
      f.controller.setPresentation(presentation);
      f.change({ status: "ready" });
      await flush();
      expect(f.attempts).toHaveLength(0);
    }
    f.controller.destroy();
  });
  it("local Pause allows still invalidation, document hiding denies it, reset retains Pause", async () => {
    const f = fixture();
    f.visibility(true);
    await flush();
    const runtime = f.runtime();
    f.attempts[0].resolve(runtime);
    await flush();
    f.controller.pause();
    expect(runtime.setVisible).toHaveBeenLastCalledWith(true);
    expect(runtime.pause).toHaveBeenCalled();
    f.controller.configure({ count: 90 });
    expect(runtime.invalidate).toHaveBeenCalled();
    f.controller.reset();
    expect(f.controller.getSnapshot().locallyPaused).toBe(true);
    expect(runtime.reset).toHaveBeenCalled();
    f.change({ documentVisible: false });
    expect(runtime.setVisible).toHaveBeenLastCalledWith(false);
    f.controller.destroy();
  });
});
