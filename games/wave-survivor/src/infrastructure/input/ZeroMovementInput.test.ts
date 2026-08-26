import { describe, expect, it } from "vitest";
import { ZERO_MOVEMENT_INTENT } from "../../domain/movement/MovementIntent.js";
import { ZeroMovementInput } from "./ZeroMovementInput.js";

describe("ZeroMovementInput", () => {
  it("provides zero movement and has repeatable no-op lifecycle methods", () => {
    const input = new ZeroMovementInput();

    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
    expect(() => {
      input.reset();
      input.reset();
      input.destroy();
      input.destroy();
    }).not.toThrow();
    expect(input.readMovementIntent()).toBe(ZERO_MOVEMENT_INTENT);
  });
});
