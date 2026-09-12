import { describe, expect, it } from "vitest";
import { ARENA } from "../arena/index.js";
import {
  createInitialRuntimeState,
  PLAYER_COLLISION_RADIUS,
} from "../state/index.js";
import { calculateNextPlayerPosition } from "./PlayerMovement.js";

function expectPositionCloseTo(
  actual: { readonly x: number; readonly y: number },
  expected: { readonly x: number; readonly y: number },
): void {
  expect(actual.x).toBeCloseTo(expected.x);
  expect(actual.y).toBeCloseTo(expected.y);
}

describe("calculateNextPlayerPosition", () => {
  it("moves horizontally using speed and delta seconds", () => {
    const state = createInitialRuntimeState();

    expectPositionCloseTo(
      calculateNextPlayerPosition(state.player, { x: 1, y: 0 }, 0.5),
      {
        x: ARENA.width / 2 + state.player.movementSpeedUnitsPerSecond * 0.5,
        y: ARENA.height / 2,
      },
    );
  });

  it("moves vertically using speed and delta seconds", () => {
    const state = createInitialRuntimeState();

    expectPositionCloseTo(
      calculateNextPlayerPosition(state.player, { x: 0, y: -1 }, 0.25),
      {
        x: ARENA.width / 2,
        y: ARENA.height / 2 - state.player.movementSpeedUnitsPerSecond * 0.25,
      },
    );
  });

  it("normalizes diagonal movement so it is not faster", () => {
    const state = createInitialRuntimeState();
    const nextPosition = calculateNextPlayerPosition(
      state.player,
      { x: 1, y: 1 },
      0.5,
    );
    const displacement = Math.hypot(
      nextPosition.x - state.player.position.x,
      nextPosition.y - state.player.position.y,
    );

    expect(displacement).toBeCloseTo(
      state.player.movementSpeedUnitsPerSecond * 0.5,
    );
  });

  it("preserves partial analog movement", () => {
    const state = createInitialRuntimeState();

    expectPositionCloseTo(
      calculateNextPlayerPosition(state.player, { x: 0.3, y: 0.4 }, 0.5),
      {
        x:
          ARENA.width / 2 +
          state.player.movementSpeedUnitsPerSecond * 0.3 * 0.5,
        y:
          ARENA.height / 2 +
          state.player.movementSpeedUnitsPerSecond * 0.4 * 0.5,
      },
    );
  });

  it("does not move for zero intention", () => {
    const state = createInitialRuntimeState();

    expect(
      calculateNextPlayerPosition(state.player, { x: 0, y: 0 }, 1),
    ).toEqual(state.player.position);
  });

  it("returns a new position without mutating the player", () => {
    const state = createInitialRuntimeState();
    const initialPosition = { ...state.player.position };

    const nextPosition = calculateNextPlayerPosition(
      state.player,
      { x: 1, y: 0 },
      0.25,
    );

    expect(nextPosition).not.toBe(state.player.position);
    expect(state.player.position).toEqual(initialPosition);
  });

  it.each([
    [
      "left",
      { x: -1, y: 0 },
      { x: PLAYER_COLLISION_RADIUS, y: ARENA.height / 2 },
    ],
    [
      "right",
      { x: 1, y: 0 },
      { x: ARENA.width - PLAYER_COLLISION_RADIUS, y: ARENA.height / 2 },
    ],
    [
      "top",
      { x: 0, y: -1 },
      { x: ARENA.width / 2, y: PLAYER_COLLISION_RADIUS },
    ],
    [
      "bottom",
      { x: 0, y: 1 },
      { x: ARENA.width / 2, y: ARENA.height - PLAYER_COLLISION_RADIUS },
    ],
  ])("clamps movement at the %s edge", (_edge, intent, expected) => {
    const state = createInitialRuntimeState();

    expect(calculateNextPlayerPosition(state.player, intent, 10)).toEqual(
      expected,
    );
  });

  it.each([
    [
      "top-left",
      { x: -1, y: -1 },
      { x: PLAYER_COLLISION_RADIUS, y: PLAYER_COLLISION_RADIUS },
    ],
    [
      "top-right",
      { x: 1, y: -1 },
      { x: ARENA.width - PLAYER_COLLISION_RADIUS, y: PLAYER_COLLISION_RADIUS },
    ],
    [
      "bottom-left",
      { x: -1, y: 1 },
      { x: PLAYER_COLLISION_RADIUS, y: ARENA.height - PLAYER_COLLISION_RADIUS },
    ],
    [
      "bottom-right",
      { x: 1, y: 1 },
      {
        x: ARENA.width - PLAYER_COLLISION_RADIUS,
        y: ARENA.height - PLAYER_COLLISION_RADIUS,
      },
    ],
  ])("clamps movement at the %s corner", (_corner, intent, expected) => {
    const state = createInitialRuntimeState();

    expect(calculateNextPlayerPosition(state.player, intent, 10)).toEqual(
      expected,
    );
  });

  it("clamps a large displacement across multiple bounds", () => {
    const state = createInitialRuntimeState();

    expect(
      calculateNextPlayerPosition(
        state.player,
        { x: Number.MAX_VALUE, y: -Number.MAX_VALUE },
        Number.MAX_VALUE,
      ),
    ).toEqual({
      x: ARENA.width - PLAYER_COLLISION_RADIUS,
      y: PLAYER_COLLISION_RADIUS,
    });
  });

  it("treats non-finite intention as zero movement", () => {
    const state = createInitialRuntimeState();

    expect(
      calculateNextPlayerPosition(
        state.player,
        { x: Number.POSITIVE_INFINITY, y: -1 },
        1,
      ),
    ).toEqual(state.player.position);
  });

  it("produces equal displacement for equal time with different deltas", () => {
    const singleStep = createInitialRuntimeState();
    const groupedSteps = createInitialRuntimeState();
    const intent = { x: 0.25, y: -0.5 };

    singleStep.player.position = calculateNextPlayerPosition(
      singleStep.player,
      intent,
      1,
    );

    for (const deltaSeconds of [0.1, 0.2, 0.3, 0.4]) {
      groupedSteps.player.position = calculateNextPlayerPosition(
        groupedSteps.player,
        intent,
        deltaSeconds,
      );
    }

    expectPositionCloseTo(
      groupedSteps.player.position,
      singleStep.player.position,
    );
  });

  it.each([
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])("does not move for an invalid delta (%s)", (deltaSeconds) => {
    const state = createInitialRuntimeState();

    expect(
      calculateNextPlayerPosition(state.player, { x: 1, y: -1 }, deltaSeconds),
    ).toEqual(state.player.position);
  });
});
