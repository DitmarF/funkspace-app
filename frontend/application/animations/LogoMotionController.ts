import type { MotionPolicyConsumer } from "../motion/MotionPolicyService";
import {
  resolveMotionPermission,
  type MotionSnapshot,
  type ConsumerMotionInputs,
} from "@/domain/motion/MotionPolicy";
import type {
  LogoMotionBinding,
  LogoMotionBindingFactory,
  LogoMotionVariant,
  LogoPlaybackState,
} from "@/domain/ports/LogoMotionPort";

export interface LogoMotionOptions {
  enabled: boolean;
  autoPlay: boolean;
  speed: number;
  startAtMs?: number;
  onPlaybackState?: (state: LogoPlaybackState) => void;
  /** Read-only renderer observation. Consumers must not set per-frame React state. */
  onPosition?: (timeMs: number, durationMs: number) => void;
}

/** Retained by one mounted component across effect replay; never persisted. */
export interface LogoPlaybackHistory {
  paused: boolean;
  started: boolean;
  completed: boolean;
  time: number;
  reversed: boolean;
  /** A page fallback retires only automatic playback, not explicit controls. */
  autoPlayCancelled?: boolean;
}

export interface LogoMotionHandle {
  play(): void;
  pause(): void;
  reverse(): void;
  seek(ms: number): void;
  setSpeed(value: number): void;
  isReady(): boolean;
  cancelIntroduction(): void;
  update(options: LogoMotionOptions): void;
  release(): void;
}

export class LogoMotionController implements LogoMotionHandle {
  private binding?: LogoMotionBinding;
  private unsubscribe = () => {};
  private active = false;
  private visible = false;
  private visibilityKnown = false;
  private playbackState?: LogoPlaybackState;
  private runtime: ConsumerMotionInputs["runtime"] = "unprepared";
  private snapshot: MotionSnapshot;
  private intent: boolean;
  private running = false;
  private preparedVariant?: LogoMotionVariant;

  constructor(
    private policy: MotionPolicyConsumer,
    private available: boolean,
    private factory: LogoMotionBindingFactory,
    private options: LogoMotionOptions,
    private history: LogoPlaybackHistory,
  ) {
    this.snapshot = policy.getSnapshot();
    this.intent = options.autoPlay && !history.autoPlayCancelled;
  }

  initialize(): void {
    if (this.active) return;
    this.active = true;
    try {
      this.binding = this.factory({
        position: (time, duration) => {
          if (this.active) this.options.onPosition?.(time, duration);
        },
        visibility: (visible) => {
          if (this.active) {
            this.visibilityKnown = true;
            this.visible = visible;
            this.reconcile();
          }
        },
        completed: () => {
          if (!this.active) return;
          this.history.completed = true;
          this.running = false;
          this.history.time = this.binding?.time ?? this.history.time;
          this.binding?.showStatic();
          this.report("completed");
        },
        failed: () => {
          if (this.active) this.fail();
        },
      });
      this.unsubscribe = this.policy.subscribe((snapshot) => {
        this.snapshot = snapshot;
        this.reconcile();
      });
    } catch {
      this.fail();
    }
  }

  private permission() {
    return resolveMotionPermission(this.snapshot, {
      supportsReducedMotion: true,
      featureAvailable: this.available,
      optedIn: this.options.enabled,
      visible: this.visible,
      locallyPaused: this.history.paused,
      runtime: this.runtime,
    });
  }

  private hardAllowed(): boolean {
    // Public intent may resume a locally paused/offscreen consumer, but never
    // bypass the shared policy's hard restrictions.
    return (
      this.active &&
      resolveMotionPermission(
        { ...this.snapshot, documentVisible: true },
        {
          supportsReducedMotion: true,
          featureAvailable: this.available,
          optedIn: this.options.enabled,
          visible: true,
          locallyPaused: false,
          runtime: "ready",
        },
      ).mayRun
    );
  }

  private fail(): void {
    this.runtime = "failed";
    this.running = false;
    this.history.completed = this.history.started;
    try {
      this.binding?.destroy();
    } finally {
      this.report("static");
    }
  }

  private report(state: LogoPlaybackState): void {
    if (state === this.playbackState) return;
    this.playbackState = state;
    this.options.onPlaybackState?.(state);
  }

  private reconcile(): void {
    if (!this.active || !this.binding) return;
    try {
      const variant = this.variant();
      if (this.runtime === "ready" && this.preparedVariant !== variant) {
        this.binding.pause();
        this.binding.showStatic();
        this.running = false;
        // A preference change never starts a second introduction or carries a
        // partial drawing into the fade. Explicit seek/play remain available.
        if (this.history.started) this.history.completed = true;
        if (this.history.started) this.report("static");
        this.runtime = "unprepared";
      }
      let permission = this.permission();
      if (permission.mayPrepare) {
        this.runtime = "preparing";
        this.binding.prepare(variant);
        this.preparedVariant = variant;
        this.runtime = "ready";
        this.binding.setSpeed(this.options.speed);
        if (this.history.reversed) this.binding.reverse();
        permission = this.permission();
      }
      if (permission.presentation === "complete-static") {
        this.running = false;
        this.binding.pause();
        if (this.history.started && this.runtime === "ready")
          this.history.time = this.binding.time;
        if (
          this.history.started &&
          this.snapshot.status === "ready" &&
          !this.hardAllowed()
        )
          this.history.completed = true;
        this.binding.showStatic();
      } else if (!permission.mayRun || !this.intent || this.history.completed) {
        this.running = false;
        this.binding.pause();
        if (this.history.started) this.history.time = this.binding.time;
        this.binding.showStatic();
      } else if (!this.running) {
        if (!this.history.started) {
          this.history.time = Number.isFinite(this.options.startAtMs)
            ? this.options.startAtMs!
            : 0;
          this.history.started = true;
        }
        this.binding.seek(this.history.time);
        this.running = true;
        this.binding.play();
      }
      // Initial background suspension has not consumed the introduction.
      // Keep its completion consumer pending; hard denial/Pause still fail open.
      this.report(
        this.running
          ? "running"
          : this.snapshot.status === "pending"
            ? "pending"
            : !this.hardAllowed() ||
                this.history.paused ||
                !this.intent ||
                this.runtime === "failed"
              ? "static"
              : !this.snapshot.documentVisible
                ? this.history.started
                  ? "static"
                  : "pending"
                : this.visibilityKnown && !this.visible
                  ? "static"
                  : this.history.completed
                    ? "completed"
                    : "pending",
      );
    } catch {
      this.fail();
    }
  }

  private variant(): LogoMotionVariant {
    return this.snapshot.preference === "reduced" ? "fade" : "draw";
  }

  cancelIntroduction(): void {
    if (!this.active) return;
    this.history.autoPlayCancelled = true;
    this.intent = false;
    this.running = false;
    // Consume any started introduction just like a policy interruption. A
    // never-started logo can still respond to an explicit permitted play().
    if (this.history.started) this.history.completed = true;
    try {
      this.binding?.pause();
      this.binding?.showStatic();
      this.report("static");
    } catch {
      this.fail();
    }
  }

  play(): void {
    if (!this.hardAllowed() || this.runtime === "failed") return;
    this.history.paused = false;
    this.intent = true;
    this.reconcile();
  }
  pause(): void {
    if (!this.active) return;
    this.history.paused = true;
    this.reconcile();
  }
  reverse(): void {
    if (!this.hardAllowed() || !this.isReady()) return;
    try {
      // Reversing completed work permits a new explicit play, not a replay
      // triggered later by visibility or preference notifications.
      if (this.history.completed && !this.running) this.intent = false;
      this.binding?.reverse();
      this.history.reversed = !this.history.reversed;
      this.capturePosition();
    } catch {
      this.fail();
    }
  }
  seek(ms: number): void {
    if (
      !this.hardAllowed() ||
      !this.visible ||
      !this.snapshot.documentVisible ||
      !this.isReady() ||
      !Number.isFinite(ms)
    )
      return;
    try {
      this.binding!.seek(ms);
      this.history.started = true;
      this.capturePosition();
    } catch {
      this.fail();
    }
  }
  private capturePosition(): void {
    this.history.time = this.binding!.time;
    this.history.completed = this.history.reversed
      ? this.history.time === 0
      : this.history.time === this.binding!.duration;
  }
  setSpeed(value: number): void {
    if (!this.active || !Number.isFinite(value)) return;
    this.options = { ...this.options, speed: Math.max(0, value) };
    try {
      this.binding?.setSpeed(this.options.speed);
    } catch {
      this.fail();
    }
  }
  isReady(): boolean {
    return this.active && this.runtime === "ready";
  }
  update(options: LogoMotionOptions): void {
    const previous = this.options;
    this.options = options;
    if (previous.autoPlay !== options.autoPlay)
      this.intent = options.autoPlay && !this.history.autoPlayCancelled;
    if (previous.speed !== options.speed) this.setSpeed(options.speed);
    if (
      previous.startAtMs !== options.startAtMs &&
      options.startAtMs !== undefined
    )
      this.seek(options.startAtMs);
    this.reconcile();
  }
  release(): void {
    if (!this.active) return;
    this.active = false;
    this.unsubscribe();
    if (this.binding && this.runtime === "ready" && this.history.started)
      this.history.time = this.binding.time;
    this.binding?.destroy();
    this.runtime = "disposed";
  }
}
