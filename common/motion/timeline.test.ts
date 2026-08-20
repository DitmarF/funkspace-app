// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  advanceTimeline,
  createTimeline,
  resolveTween,
  sampleTimeline,
  sampleTween,
  seekTimeline,
} from "./timeline";

describe("motion timeline", () => {
  const definitions = [
    {
      target: "player",
      property: "x",
      from: 0,
      to: 100,
      duration: 400,
      easing: "linear" as const,
    },
    {
      target: "player",
      property: "opacity",
      from: 0,
      to: 1,
      duration: 200,
      delay: 300,
      easing: "standard" as const,
    },
  ];

  it("resolves tween timing without renderer data", () => {
    expect(resolveTween(definitions[1])).toEqual({
      ...definitions[1],
      delay: 300,
      startTime: 300,
      endTime: 500,
    });
  });

  it("derives duration from overlapping tweens", () => {
    const timeline = createTimeline(definitions);

    expect(timeline.duration).toBe(500);
    expect(timeline.tweens).toHaveLength(2);
  });

  it("samples before, active, and completed tween states", () => {
    const tween = resolveTween(definitions[0]);

    expect(sampleTween(tween, -1)).toMatchObject({
      phase: "before",
      progress: 0,
      value: 0,
    });
    expect(sampleTween(tween, 200)).toMatchObject({
      phase: "active",
      progress: 0.5,
      value: 50,
    });
    expect(sampleTween(tween, 500)).toMatchObject({
      phase: "after",
      progress: 1,
      value: 100,
    });
  });

  it("jumps zero-duration tweens to their end value", () => {
    const tween = resolveTween({
      target: "effect",
      property: "strength",
      from: 0,
      to: 1,
      duration: 0,
    });

    expect(sampleTween(tween, 0)).toMatchObject({
      phase: "active",
      progress: 1,
      value: 1,
    });
  });

  it("samples all tweens at a clamped timeline time", () => {
    const timeline = createTimeline(definitions);
    const samples = sampleTimeline(timeline, 1_000);

    expect(samples.map((sample) => sample.value)).toEqual([100, 1]);
    expect(seekTimeline(timeline, -100)).toBe(0);
    expect(seekTimeline(timeline, 1_000)).toBe(500);
  });

  it("advances forward and reverse state using an injected delta", () => {
    const forward = advanceTimeline(
      { time: 100, duration: 500, direction: 1, speed: 2 },
      100,
    );
    const reverse = advanceTimeline(
      { time: 100, duration: 500, direction: -1, speed: 1 },
      150,
    );

    expect(forward).toEqual({
      state: { time: 300, duration: 500, direction: 1, speed: 2 },
      completed: false,
    });
    expect(reverse).toEqual({
      state: { time: 0, duration: 500, direction: -1, speed: 1 },
      completed: true,
    });
  });
});
