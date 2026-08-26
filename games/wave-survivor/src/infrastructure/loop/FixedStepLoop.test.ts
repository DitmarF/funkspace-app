import { describe, expect, it, vi } from "vitest";
import type {
  FrameScheduler,
  MonotonicClock,
} from "../../domain/RuntimeTimingPort.js";
import {
  FIXED_SIMULATION_STEP_SECONDS,
  FixedStepLoop,
  MAX_FIXED_UPDATES_PER_FRAME,
  MAX_FRAME_GAP_MILLISECONDS,
} from "./FixedStepLoop.js";

class FakeMonotonicClock implements MonotonicClock {
  constructor(private currentTimeMilliseconds = 0) {}

  nowMilliseconds(): number {
    return this.currentTimeMilliseconds;
  }

  advanceByMilliseconds(deltaMilliseconds: number): void {
    this.currentTimeMilliseconds += deltaMilliseconds;
  }
}

class FakeFrameScheduler implements FrameScheduler {
  readonly cancelledFrameIds: number[] = [];
  readonly requestedFrameIds: number[] = [];
  private readonly callbacks = new Map<number, () => void>();
  private nextFrameId = 1;

  get pendingFrameCount(): number {
    return this.callbacks.size;
  }

  requestFrame(callback: () => void): number {
    const frameId = this.nextFrameId;
    this.nextFrameId += 1;
    this.requestedFrameIds.push(frameId);
    this.callbacks.set(frameId, callback);
    return frameId;
  }

  cancelFrame(frameId: number): void {
    this.cancelledFrameIds.push(frameId);
    this.callbacks.delete(frameId);
  }

  getFrameCallback(frameId: number): (() => void) | undefined {
    return this.callbacks.get(frameId);
  }

  runNextFrame(): void {
    const nextFrame = this.callbacks.entries().next().value;
    if (!nextFrame) throw new Error("No frame is pending.");

    const [frameId, callback] = nextFrame;
    this.callbacks.delete(frameId);
    callback();
  }
}

function createLoop() {
  const clock = new FakeMonotonicClock();
  const frameScheduler = new FakeFrameScheduler();
  const fixedUpdate = vi.fn();
  const render = vi.fn();
  const loop = new FixedStepLoop(clock, frameScheduler, {
    fixedUpdate,
    render,
  });

  return { clock, fixedUpdate, frameScheduler, loop, render };
}

const FIXED_SIMULATION_STEP_MILLISECONDS = FIXED_SIMULATION_STEP_SECONDS * 1000;

describe("FixedStepLoop scheduling", () => {
  it("requests exactly one frame when started", () => {
    const { frameScheduler, loop } = createLoop();

    loop.start();

    expect(frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(frameScheduler.pendingFrameCount).toBe(1);
  });

  it("does not request another loop when start is repeated", () => {
    const { frameScheduler, loop } = createLoop();

    loop.start();
    loop.start();

    expect(frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(frameScheduler.pendingFrameCount).toBe(1);
  });

  it("requests at most one successor for each executed frame", () => {
    const { frameScheduler, loop } = createLoop();
    loop.start();

    frameScheduler.runNextFrame();

    expect(frameScheduler.requestedFrameIds).toHaveLength(2);
    expect(frameScheduler.pendingFrameCount).toBe(1);

    frameScheduler.runNextFrame();

    expect(frameScheduler.requestedFrameIds).toHaveLength(3);
    expect(frameScheduler.pendingFrameCount).toBe(1);
  });

  it("cancels the pending frame when stopped", () => {
    const { frameScheduler, loop } = createLoop();
    loop.start();
    const pendingFrameId = frameScheduler.requestedFrameIds[0];
    if (pendingFrameId === undefined)
      throw new Error("No frame was requested.");

    loop.stop();

    expect(frameScheduler.cancelledFrameIds).toEqual([pendingFrameId]);
    expect(frameScheduler.pendingFrameCount).toBe(0);
  });

  it("makes repeated stop safe", () => {
    const { frameScheduler, loop } = createLoop();
    loop.start();

    loop.stop();
    loop.stop();

    expect(frameScheduler.cancelledFrameIds).toHaveLength(1);
    expect(frameScheduler.pendingFrameCount).toBe(0);
  });
});

describe("FixedStepLoop advancement", () => {
  it("renders even when no fixed update is ready", () => {
    const { fixedUpdate, frameScheduler, loop, render } = createLoop();
    loop.start();

    frameScheduler.runNextFrame();

    expect(fixedUpdate).not.toHaveBeenCalled();
    expect(render).toHaveBeenCalledOnce();
  });

  it("executes expected fixed updates before rendering a normal frame", () => {
    const { clock, fixedUpdate, frameScheduler, loop, render } = createLoop();
    loop.start();
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS * 3);

    frameScheduler.runNextFrame();

    expect(fixedUpdate).toHaveBeenCalledTimes(3);
    expect(fixedUpdate).toHaveBeenNthCalledWith(
      1,
      FIXED_SIMULATION_STEP_SECONDS,
    );
    expect(fixedUpdate).toHaveBeenNthCalledWith(
      2,
      FIXED_SIMULATION_STEP_SECONDS,
    );
    expect(fixedUpdate).toHaveBeenNthCalledWith(
      3,
      FIXED_SIMULATION_STEP_SECONDS,
    );
    expect(render).toHaveBeenCalledOnce();
    expect(fixedUpdate.mock.invocationCallOrder.at(-1)).toBeLessThan(
      render.mock.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY,
    );
  });

  it("caps fixed updates after a long suspension", () => {
    const { clock, fixedUpdate, frameScheduler, loop, render } = createLoop();
    loop.start();
    clock.advanceByMilliseconds(MAX_FRAME_GAP_MILLISECONDS * 40);

    frameScheduler.runNextFrame();

    expect(fixedUpdate).toHaveBeenCalledTimes(MAX_FIXED_UPDATES_PER_FRAME);
    expect(render).toHaveBeenCalledOnce();
  });

  it("discards excess accumulated suspension time after the cap", () => {
    const { clock, fixedUpdate, frameScheduler, loop } = createLoop();
    loop.start();
    clock.advanceByMilliseconds(MAX_FRAME_GAP_MILLISECONDS * 40);
    frameScheduler.runNextFrame();

    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();

    expect(fixedUpdate).toHaveBeenCalledTimes(MAX_FIXED_UPDATES_PER_FRAME + 1);
  });

  it("uses a fresh baseline and empty accumulator after restarting", () => {
    const { clock, fixedUpdate, frameScheduler, loop } = createLoop();
    loop.start();
    const firstFrameId = frameScheduler.requestedFrameIds[0];
    if (firstFrameId === undefined) throw new Error("No frame was requested.");
    const staleCallback = frameScheduler.getFrameCallback(firstFrameId);
    if (!staleCallback) throw new Error("No frame callback was stored.");
    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS / 2);
    frameScheduler.runNextFrame();
    loop.stop();

    clock.advanceByMilliseconds(10_000);
    loop.start();
    staleCallback();

    expect(frameScheduler.pendingFrameCount).toBe(1);
    expect(fixedUpdate).not.toHaveBeenCalled();

    clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
    frameScheduler.runNextFrame();

    expect(fixedUpdate).toHaveBeenCalledOnce();
    expect(fixedUpdate).toHaveBeenCalledWith(FIXED_SIMULATION_STEP_SECONDS);
  });

  it("produces equivalent progress for equivalent processed time", () => {
    const first = createLoop();
    const second = createLoop();
    let firstProgressSeconds = 0;
    let secondProgressSeconds = 0;
    first.fixedUpdate.mockImplementation((deltaSeconds) => {
      firstProgressSeconds += deltaSeconds;
    });
    second.fixedUpdate.mockImplementation((deltaSeconds) => {
      secondProgressSeconds += deltaSeconds;
    });
    first.loop.start();
    second.loop.start();

    for (const stepCount of [2, 2, 2]) {
      first.clock.advanceByMilliseconds(
        FIXED_SIMULATION_STEP_MILLISECONDS * stepCount,
      );
      first.frameScheduler.runNextFrame();
    }

    for (let stepCount = 0; stepCount < 6; stepCount += 1) {
      second.clock.advanceByMilliseconds(FIXED_SIMULATION_STEP_MILLISECONDS);
      second.frameScheduler.runNextFrame();
    }

    expect(first.fixedUpdate).toHaveBeenCalledTimes(6);
    expect(second.fixedUpdate).toHaveBeenCalledTimes(6);
    expect(firstProgressSeconds).toBeCloseTo(secondProgressSeconds);
  });
});

describe("FixedStepLoop destruction", () => {
  it("cancels scheduling, ignores stale callbacks, and is terminal", () => {
    const { fixedUpdate, frameScheduler, loop, render } = createLoop();
    loop.start();
    const pendingFrameId = frameScheduler.requestedFrameIds[0];
    if (pendingFrameId === undefined)
      throw new Error("No frame was requested.");
    const staleCallback = frameScheduler.getFrameCallback(pendingFrameId);
    if (!staleCallback) throw new Error("No frame callback was stored.");

    loop.destroy();
    loop.destroy();
    staleCallback();
    loop.start();

    expect(frameScheduler.cancelledFrameIds).toEqual([pendingFrameId]);
    expect(frameScheduler.requestedFrameIds).toHaveLength(1);
    expect(frameScheduler.pendingFrameCount).toBe(0);
    expect(fixedUpdate).not.toHaveBeenCalled();
    expect(render).not.toHaveBeenCalled();
  });
});
