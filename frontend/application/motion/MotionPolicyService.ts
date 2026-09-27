import {
  MOTION_PREFERENCE_KEY,
  isMotionPreference,
  type MotionPreference,
  type MotionSnapshot,
} from "@/domain/motion/MotionPolicy";
import type { StoragePort } from "@/domain/ports/StoragePort";
import type { MotionEnvironmentPort } from "@/domain/ports/MotionEnvironmentPort";

export interface MotionPolicyService {
  getSnapshot(): MotionSnapshot;
  subscribe(listener: (snapshot: MotionSnapshot) => void): () => void;
  setPreference(value: MotionPreference): void;
  initialize(): () => void;
  dispose(): void;
}

export type MotionPolicyConsumer = Pick<
  MotionPolicyService,
  "getSnapshot" | "subscribe" | "setPreference"
>;

type Activation = { release: () => void; detach?: () => void };
const noop = () => {};

export class MotionPolicyServiceImpl implements MotionPolicyService {
  private snapshot: MotionSnapshot = Object.freeze({
    status: "pending",
    preference: "system",
    systemMotion: "unknown",
    documentVisible: false,
  });
  private listeners = new Set<(snapshot: MotionSnapshot) => void>();
  private capturedPreference = false;
  private activation: Activation | undefined;

  constructor(
    private storage: StoragePort,
    private environment: MotionEnvironmentPort,
  ) {}

  getSnapshot(): MotionSnapshot {
    return this.snapshot;
  }

  subscribe(listener: (snapshot: MotionSnapshot) => void): () => void {
    // Each call owns its registration, even if callbacks are identical.
    const entry = (snapshot: MotionSnapshot) => listener(snapshot);
    if (this.snapshot.status !== "disposed") this.listeners.add(entry);
    try {
      entry(this.snapshot);
    } catch (error) {
      this.listeners.delete(entry);
      throw error;
    }
    return () => {
      this.listeners.delete(entry);
    };
  }

  setPreference(value: MotionPreference): void {
    if (this.snapshot.status === "disposed") return;
    if (!isMotionPreference(value))
      throw new RangeError("Invalid motion preference");
    this.capturedPreference = true;
    // Persist before notification: a reentrant newer update must be the final write.
    // State is committed first, independently of persistence success.
    const next = Object.freeze({ ...this.snapshot, preference: value });
    const changed = value !== this.snapshot.preference;
    this.snapshot = changed ? next : this.snapshot;
    try {
      this.storage.setItem(MOTION_PREFERENCE_KEY, value);
    } catch {
      /* Best effort. */
    }
    if (changed && this.snapshot === next) this.notify(next);
  }

  initialize(): () => void {
    if (this.snapshot.status === "disposed") return noop;
    if (this.activation) return this.activation.release;
    const activation: Activation = {
      release: () => {
        if (this.activation !== activation) return;
        this.activation = undefined;
        try {
          activation.detach?.();
        } finally {
          // A hostile cleanup may synchronously start a new cycle or dispose.
          if (!this.activation && this.snapshot.status !== "disposed")
            this.publish({
              ...this.snapshot,
              status: "pending",
              systemMotion: "unknown",
              documentVisible: false,
            });
        }
      },
    };
    this.activation = activation;
    try {
      if (!this.capturedPreference) {
        let stored: unknown;
        try {
          stored = this.storage.getItem(MOTION_PREFERENCE_KEY);
        } catch {
          /* Default System. */
        }
        if (!this.capturedPreference && this.activation === activation) {
          this.capturedPreference = true;
          this.publish({
            ...this.snapshot,
            preference: isMotionPreference(stored) ? stored : "system",
          });
        }
      }
      if (this.activation !== activation) return activation.release;
      let observation: ReturnType<MotionEnvironmentPort["observe"]>;
      try {
        observation = this.environment.observe((current) => {
          if (this.activation === activation)
            this.publish({ ...this.snapshot, ...current, status: "ready" });
        });
      } catch {
        // Adapters own rollback of partial acquisition before throwing.
        observation = {
          current: { systemMotion: "unavailable", documentVisible: false },
          unsubscribe: noop,
        };
      }
      if (this.activation !== activation) {
        observation.unsubscribe();
        return activation.release;
      }
      activation.detach = observation.unsubscribe;
      this.publish({
        ...this.snapshot,
        ...observation.current,
        status: "ready",
      });
      return activation.release;
    } catch (error) {
      // Setup must be atomic even when a consumer callback throws. Release the
      // acquired generation, preserve the original programming error, and allow retry.
      try {
        activation.release();
      } catch {
        /* Original setup error wins. */
      }
      throw error;
    }
  }

  dispose(): void {
    if (this.snapshot.status === "disposed") return;
    const activation = this.activation;
    this.activation = undefined;
    // Terminal state precedes detach, so reentrant initialize cannot acquire.
    const next: MotionSnapshot = Object.freeze({
      ...this.snapshot,
      status: "disposed",
      systemMotion: "unknown",
      documentVisible: false,
    });
    this.snapshot = next;
    try {
      activation?.detach?.();
      this.notify(next);
    } finally {
      this.listeners.clear();
    }
  }

  private publish(next: MotionSnapshot): void {
    const old = this.snapshot;
    if (
      old.status === next.status &&
      old.preference === next.preference &&
      old.systemMotion === next.systemMotion &&
      old.documentVisible === next.documentVisible
    )
      return;
    this.snapshot = Object.freeze(next);
    this.notify(this.snapshot);
  }

  private notify(snapshot: MotionSnapshot): void {
    let failed = false;
    let firstError: unknown;
    for (const listener of [...this.listeners]) {
      // A nested update has already delivered the newer snapshot.
      if (this.snapshot !== snapshot) break;
      if (!this.listeners.has(listener)) continue;
      try {
        listener(snapshot);
      } catch (error) {
        // One consumer must not leave others running with obsolete permission.
        if (!failed) {
          failed = true;
          firstError = error;
        }
      }
    }
    if (failed) throw firstError;
  }
}
