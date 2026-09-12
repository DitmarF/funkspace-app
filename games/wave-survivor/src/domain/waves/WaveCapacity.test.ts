import { describe, expect, it } from "vitest";
import { createBasicEnemyState } from "../enemies/index.js";
import { countEnemiesOccupyingWaveCapacity } from "./WaveCapacity.js";

describe("countEnemiesOccupyingWaveCapacity", () => {
  it("counts entering and active enemies", () => {
    const entering = createBasicEnemyState(1, { x: -66, y: 100 });
    const active = createBasicEnemyState(2, { x: 100, y: 100 });
    active.phase = "active";

    expect(countEnemiesOccupyingWaveCapacity([entering, active])).toBe(2);
  });

  it("does not count dying or invalid enemies", () => {
    const dying = createBasicEnemyState(1, { x: 100, y: 100 });
    dying.phase = "dying";
    dying.removeAtSimulationSeconds = 1;
    const invalid = createBasicEnemyState(2, { x: Number.NaN, y: 100 });
    invalid.phase = "active";

    expect(countEnemiesOccupyingWaveCapacity([dying, invalid])).toBe(0);
  });
});
