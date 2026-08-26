import type {
  FrameScheduler,
  MonotonicClock,
} from "../../domain/RuntimeTimingPort.js";

export const FIXED_SIMULATION_STEP_SECONDS = 1 / 60;
export const MAX_FRAME_GAP_MILLISECONDS = 250;
export const MAX_FIXED_UPDATES_PER_FRAME = 5;

const FIXED_SIMULATION_STEP_MILLISECONDS = FIXED_SIMULATION_STEP_SECONDS * 1000;
const ACCUMULATOR_EPSILON_MILLISECONDS = 1e-9;

/** Game callbacks invoked by the platform-owned main loop. */
export interface FixedStepLoopCallbacks {
  fixedUpdate(deltaSeconds: number): void;
  render(): void;
}

/**
 * One bounded animation-frame loop for a Wave Survivor game instance.
 *
 * Large frame gaps are clamped, and no rendered frame performs more than five
 * fixed updates. If the update cap is reached while complete steps remain,
 * the leftover accumulator is discarded rather than carried as a backlog.
 */
export class FixedStepLoop {
  private accumulatorMilliseconds = 0;
  private destroyed = false;
  private pendingFrameId: number | null = null;
  private previousTimestampMilliseconds: number | null = null;
  private runGeneration = 0;
  private running = false;

  constructor(
    private readonly clock: MonotonicClock,
    private readonly frameScheduler: FrameScheduler,
    private readonly callbacks: FixedStepLoopCallbacks,
  ) {}

  start(): void {
    if (this.running || this.destroyed) return;

    this.accumulatorMilliseconds = 0;
    this.previousTimestampMilliseconds = this.readClockMilliseconds();
    this.runGeneration += 1;
    this.running = true;
    this.requestNextFrame();
  }

  stop(): void {
    this.running = false;
    this.runGeneration += 1;

    if (this.pendingFrameId !== null) {
      this.frameScheduler.cancelFrame(this.pendingFrameId);
      this.pendingFrameId = null;
    }

    this.previousTimestampMilliseconds = null;
    this.accumulatorMilliseconds = 0;
  }

  destroy(): void {
    if (this.destroyed) return;

    this.stop();
    this.destroyed = true;
  }

  private executeFrame(runGeneration: number): void {
    if (
      !this.running ||
      this.destroyed ||
      runGeneration !== this.runGeneration
    ) {
      return;
    }

    this.pendingFrameId = null;

    const currentTimestampMilliseconds = this.readClockMilliseconds();
    const elapsedMilliseconds = this.calculateElapsedMilliseconds(
      currentTimestampMilliseconds,
    );
    this.previousTimestampMilliseconds = currentTimestampMilliseconds;
    this.accumulatorMilliseconds += elapsedMilliseconds;

    let fixedUpdateCount = 0;
    while (
      this.running &&
      !this.destroyed &&
      fixedUpdateCount < MAX_FIXED_UPDATES_PER_FRAME &&
      this.accumulatorMilliseconds + ACCUMULATOR_EPSILON_MILLISECONDS >=
        FIXED_SIMULATION_STEP_MILLISECONDS
    ) {
      this.callbacks.fixedUpdate(FIXED_SIMULATION_STEP_SECONDS);
      this.accumulatorMilliseconds = Math.max(
        0,
        this.accumulatorMilliseconds - FIXED_SIMULATION_STEP_MILLISECONDS,
      );
      fixedUpdateCount += 1;
    }

    if (
      fixedUpdateCount === MAX_FIXED_UPDATES_PER_FRAME &&
      this.accumulatorMilliseconds + ACCUMULATOR_EPSILON_MILLISECONDS >=
        FIXED_SIMULATION_STEP_MILLISECONDS
    ) {
      this.accumulatorMilliseconds = 0;
    }

    if (!this.running || this.destroyed) return;

    this.callbacks.render();

    if (this.running && !this.destroyed) {
      this.requestNextFrame();
    }
  }

  private calculateElapsedMilliseconds(
    currentTimestampMilliseconds: number | null,
  ): number {
    if (
      currentTimestampMilliseconds === null ||
      this.previousTimestampMilliseconds === null
    ) {
      return 0;
    }

    return Math.min(
      MAX_FRAME_GAP_MILLISECONDS,
      Math.max(
        0,
        currentTimestampMilliseconds - this.previousTimestampMilliseconds,
      ),
    );
  }

  private readClockMilliseconds(): number | null {
    const timestampMilliseconds = this.clock.nowMilliseconds();
    return Number.isFinite(timestampMilliseconds)
      ? timestampMilliseconds
      : null;
  }

  private requestNextFrame(): void {
    if (!this.running || this.destroyed || this.pendingFrameId !== null) {
      return;
    }

    const runGeneration = this.runGeneration;
    this.pendingFrameId = this.frameScheduler.requestFrame(() => {
      this.executeFrame(runGeneration);
    });
  }
}
