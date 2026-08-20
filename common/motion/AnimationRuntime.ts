/**
 * Shared lifecycle for an animation runtime.
 *
 * Implementations may own a platform clock or receive updates from an external
 * loop, but rendering and platform resources remain the adapter's concern.
 */
export interface AnimationRuntime {
  /** Advance an active runtime by an elapsed duration in milliseconds. */
  update(deltaMilliseconds: number): void;

  /** Stop advancement while preserving the current state. */
  pause(): void;

  /** Continue advancement from the current state. */
  resume(): void;

  /** Stop advancement and restore the initial state. */
  reset(): void;

  /** Stop advancement and release resources owned by the implementation. */
  destroy(): void;
}
