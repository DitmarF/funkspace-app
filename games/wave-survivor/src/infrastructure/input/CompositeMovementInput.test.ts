import { describe, expect, it, vi } from "vitest";
import type { MovementInputPort } from "../../domain/MovementInputPort.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../../domain/movement/MovementIntent.js";
import { CompositeMovementInput } from "./CompositeMovementInput.js";

function createInput(initialIntent: MovementIntent = ZERO_MOVEMENT_INTENT) {
  let intent = initialIntent;
  const input: MovementInputPort = {
    readMovementIntent: vi.fn(() => intent),
    reset: vi.fn(() => {
      intent = ZERO_MOVEMENT_INTENT;
    }),
    destroy: vi.fn(() => {
      intent = ZERO_MOVEMENT_INTENT;
    }),
  };

  return { input };
}

describe("CompositeMovementInput combination", () => {
  it("combines zero with zero", () => {
    const first = createInput();
    const second = createInput();
    const input = new CompositeMovementInput(first.input, second.input);

    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(first.input.readMovementIntent).toHaveBeenCalledOnce();
    expect(second.input.readMovementIntent).toHaveBeenCalledOnce();
  });

  it("preserves keyboard input when the joystick is inactive", () => {
    const keyboard = createInput(createMovementIntent(-1, 0));
    const joystick = createInput();
    const input = new CompositeMovementInput(keyboard.input, joystick.input);

    expect(input.readMovementIntent()).toEqual({ x: -1, y: 0 });
  });

  it("preserves partial joystick input when the keyboard is inactive", () => {
    const keyboard = createInput();
    const joystick = createInput(createMovementIntent(0.3, 0.4));
    const input = new CompositeMovementInput(keyboard.input, joystick.input);

    const intent = input.readMovementIntent();

    expect(intent).toEqual({ x: 0.3, y: 0.4 });
    expect(Math.hypot(intent.x, intent.y)).toBeCloseTo(0.5);
  });

  it("clamps matching directions to full speed", () => {
    const keyboard = createInput(createMovementIntent(1, 0));
    const joystick = createInput(createMovementIntent(0.5, 0));
    const input = new CompositeMovementInput(keyboard.input, joystick.input);

    expect(input.readMovementIntent()).toEqual({ x: 1, y: 0 });
  });

  it("cancels opposing directions", () => {
    const keyboard = createInput(createMovementIntent(1, 0));
    const joystick = createInput(createMovementIntent(-1, 0));
    const input = new CompositeMovementInput(keyboard.input, joystick.input);

    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
  });

  it("normalizes perpendicular directions into a diagonal", () => {
    const keyboard = createInput(createMovementIntent(1, 0));
    const joystick = createInput(createMovementIntent(0, -1));
    const input = new CompositeMovementInput(keyboard.input, joystick.input);

    const intent = input.readMovementIntent();

    expect(intent.x).toBeCloseTo(Math.SQRT1_2);
    expect(intent.y).toBeCloseTo(-Math.SQRT1_2);
    expect(Math.hypot(intent.x, intent.y)).toBeCloseTo(1);
  });

  it("preserves a partial analog contribution alongside keyboard input", () => {
    const keyboard = createInput(createMovementIntent(1, 0));
    const joystick = createInput(createMovementIntent(0, 0.5));
    const input = new CompositeMovementInput(keyboard.input, joystick.input);

    const intent = input.readMovementIntent();

    expect(intent.x).toBeCloseTo(1 / Math.hypot(1, 0.5));
    expect(intent.y).toBeCloseTo(0.5 / Math.hypot(1, 0.5));
    expect(intent.y).toBeGreaterThan(0);
  });

  it.each([
    [createMovementIntent(1, 0), createMovementIntent(1, 1)],
    [createMovementIntent(-1, -1), createMovementIntent(0.75, -0.25)],
    [createMovementIntent(0.8, 0.2), createMovementIntent(-0.4, 0.9)],
  ])(
    "never returns combined magnitude above one",
    (firstIntent, secondIntent) => {
      const first = createInput(firstIntent);
      const second = createInput(secondIntent);
      const input = new CompositeMovementInput(first.input, second.input);

      const intent = input.readMovementIntent();

      expect(Math.hypot(intent.x, intent.y)).toBeLessThanOrEqual(1);
    },
  );
});

describe("CompositeMovementInput lifecycle", () => {
  it("delegates reset to every owned source", () => {
    const first = createInput(createMovementIntent(1, 0));
    const second = createInput(createMovementIntent(0, 1));
    const input = new CompositeMovementInput(first.input, second.input);

    input.reset();

    expect(first.input.reset).toHaveBeenCalledOnce();
    expect(second.input.reset).toHaveBeenCalledOnce();
    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
  });

  it("destroys every owned source exactly once", () => {
    const first = createInput();
    const second = createInput();
    const input = new CompositeMovementInput(first.input, second.input);

    input.destroy();
    input.destroy();

    expect(first.input.destroy).toHaveBeenCalledOnce();
    expect(second.input.destroy).toHaveBeenCalledOnce();
  });

  it("keeps repeated reset safe before and after destruction", () => {
    const first = createInput();
    const second = createInput();
    const input = new CompositeMovementInput(first.input, second.input);

    input.reset();
    input.reset();
    input.destroy();
    input.reset();

    expect(first.input.reset).toHaveBeenCalledTimes(2);
    expect(second.input.reset).toHaveBeenCalledTimes(2);
    expect(first.input.destroy).toHaveBeenCalledOnce();
    expect(second.input.destroy).toHaveBeenCalledOnce();
  });

  it("returns zero without reading sources after destruction", () => {
    const first = createInput(createMovementIntent(1, 0));
    const second = createInput(createMovementIntent(0, 1));
    const input = new CompositeMovementInput(first.input, second.input);
    input.destroy();

    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(first.input.readMovementIntent).not.toHaveBeenCalled();
    expect(second.input.readMovementIntent).not.toHaveBeenCalled();
  });
});
