import {
  createParticleScene,
  configureParticles,
  getParticleStill,
  resetParticles,
  resizeParticleScene,
} from "@/domain/particles/ParticleScene";
import { resolveMotionPermission } from "@/domain/motion/MotionPolicy";
import type {
  ParticleSceneBinding,
  ParticleSceneHandle,
  ParticleSceneOptions,
  ParticleSceneRuntime,
  ParticleSceneSnapshot,
  ParticleSurface,
  ParticlePresentation,
} from "@/domain/ports/ParticleScenePort";
import type { MotionPolicyConsumer } from "../motion/MotionPolicyService";

/** No platform clock or DOM: one owned state is borrowed by one prepared runtime. */
export class ParticleSceneController implements ParticleSceneHandle {
  private state;
  private status: ParticleSceneSnapshot["status"] = "unprepared";
  private localPause = false;
  private frameReady = false;
  private presentation: ParticlePresentation;
  private surface: ParticleSurface = {
    width: 0,
    height: 0,
    dpr: 1,
    visible: false,
    palette: null,
  };
  private binding?: ParticleSceneBinding;
  private runtime?: ParticleSceneRuntime;
  private releases: (() => void)[] = [];
  private listeners = new Set<(snapshot: ParticleSceneSnapshot) => void>();
  private generation = 0;
  private initialized = false;

  constructor(
    private policy: MotionPolicyConsumer,
    private available: boolean,
    private bind: () => ParticleSceneBinding,
    private options: ParticleSceneOptions,
  ) {
    this.state = createParticleScene(null, options.config, options.seed);
    this.presentation = options.presentation ?? {
      introReady: false,
      coverReady: false,
      occluded: false,
    };
  }

  private permission(runtime = this.status, locallyPaused = this.localPause) {
    return resolveMotionPermission(this.policy.getSnapshot(), {
      featureAvailable: this.available,
      optedIn: this.options.optedIn === true,
      supportsReducedMotion: false,
      runtime,
      locallyPaused,
      visible:
        this.surface.visible &&
        this.surface.width > 0 &&
        this.surface.height > 0 &&
        this.surface.palette !== null &&
        this.presentation.introReady &&
        this.presentation.coverReady &&
        !this.presentation.occluded,
    });
  }

  initialize() {
    if (this.initialized || this.status === "disposed") return;
    this.initialized = true;
    try {
      this.binding = this.bind();
      this.surface = this.binding.getSnapshot();
      this.releases.push(
        this.binding.subscribe((surface) => {
          if (this.status === "disposed") return;
          this.surface = surface;
          if (this.runtime) {
            this.runtime.setGeometry(surface);
            if (surface.palette) this.runtime?.setPalette(surface.palette);
          } else resizeParticleScene(this.state, surface);
          this.reconcile();
        }),
      );
      this.releases.push(this.policy.subscribe(() => this.reconcile()));
      this.reconcile();
    } catch {
      this.fail();
    }
  }

  private releaseRuntime() {
    const runtime = this.runtime;
    this.runtime = undefined;
    this.frameReady = false;
    try {
      runtime?.destroy();
    } catch {
      /* Adapter must attempt every owned release. */
    }
  }

  private fail() {
    if (this.status === "disposed") return;
    ++this.generation;
    this.status = "failed";
    this.releaseRuntime();
    this.releaseBinding();
    this.publish();
  }

  private reconcile() {
    if (this.status === "disposed") return;
    // R2: a ready-copy probes permission during loading, never publishes readiness.
    if (this.status === "preparing" && !this.permission("ready").mayRun) {
      ++this.generation;
      this.status = "unprepared";
    }
    if (this.runtime) {
      const runtime = this.runtime;
      runtime.setVisible(this.permission("ready", false).mayRun);
      if (this.permission().mayRun) runtime.resume();
      else runtime.pause();
    } else if (this.binding && this.permission().mayPrepare) {
      this.prepare();
    }
    this.publish();
  }

  private prepare() {
    const generation = ++this.generation;
    this.status = "preparing";
    const current = () =>
      this.generation === generation &&
      this.status !== "disposed" &&
      this.status !== "failed";
    const eligible = () => current() && this.permission("ready").mayRun;
    // Start in a microtask so synchronous cancellation also prevents loading.
    void Promise.resolve()
      .then(() => {
        if (!eligible()) return undefined;
        return this.binding?.prepare(this.state, eligible, {
          frameReady: (value) => {
            if (current()) {
              this.frameReady = value;
              this.publish();
            }
          },
          failed: () => {
            if (current()) this.fail();
          },
        });
      })
      .then(
        (runtime) => {
          if (!runtime) return;
          if (!eligible()) {
            try {
              runtime.destroy();
            } catch {
              /* stale owner */
            }
            return;
          }
          this.runtime = runtime;
          this.status = "ready";
          this.reconcile();
        },
        () => {
          if (!current()) return;
          if (!eligible()) {
            ++this.generation;
            this.status = "unprepared";
            this.reconcile();
          } else this.fail();
        },
      );
  }

  getSnapshot = (): ParticleSceneSnapshot =>
    Object.freeze({
      status: this.status,
      config: this.state.config,
      locallyPaused: this.localPause,
      frameReady: this.frameReady && this.permission("ready", false).mayRun,
      presentation: this.permission().presentation,
    });
  getStill = () => getParticleStill(this.state);
  subscribe(listener: (snapshot: ParticleSceneSnapshot) => void) {
    const entry = (snapshot: ParticleSceneSnapshot) => listener(snapshot);
    if (this.status !== "disposed") this.listeners.add(entry);
    try {
      entry(this.getSnapshot());
    } catch (error) {
      this.listeners.delete(entry);
      throw error;
    }
    return () => {
      this.listeners.delete(entry);
    };
  }
  private publish() {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      try {
        listener(snapshot);
      } catch {
        /* A view subscriber cannot interrupt cleanup. */
      }
    }
  }
  setPresentation(value: ParticlePresentation) {
    if (this.status !== "disposed") {
      this.presentation = value;
      this.reconcile();
    }
  }
  configure(input: unknown) {
    if (this.status !== "disposed") {
      configureParticles(this.state, input);
      this.runtime?.invalidate();
      this.publish();
    }
    return this.state.config;
  }
  pause() {
    if (this.status !== "disposed") {
      this.localPause = true;
      this.reconcile();
    }
  }
  resume() {
    if (this.status !== "disposed") {
      this.localPause = false;
      this.reconcile();
    }
  }
  reset() {
    if (this.status === "disposed") return;
    if (this.runtime) this.runtime.reset();
    else resetParticles(this.state);
    this.reconcile();
  }
  destroy() {
    if (this.status === "disposed") return;
    this.status = "disposed";
    ++this.generation;
    this.releaseRuntime();
    this.releaseBinding();
    this.publish();
    this.listeners.clear();
  }
  private releaseBinding() {
    const binding = this.binding;
    this.binding = undefined;
    for (const release of [
      ...this.releases.splice(0),
      () => binding?.destroy(),
    ]) {
      try {
        release();
      } catch {
        /* Continue releasing independently owned resources. */
      }
    }
  }
}
