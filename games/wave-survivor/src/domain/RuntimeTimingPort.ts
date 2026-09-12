/** Application-facing source of monotonic elapsed time in milliseconds. */
export interface MonotonicClock {
  nowMilliseconds(): number;
}

/** Application-facing boundary for scheduling one runtime frame. */
export interface FrameScheduler {
  requestFrame(callback: () => void): number;
  cancelFrame(frameId: number): void;
}
