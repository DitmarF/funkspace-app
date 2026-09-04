import { describe, expect, it } from "vitest";
import {
  getUpgradeDefinition,
  INITIAL_UPGRADE_DEFINITIONS,
} from "./UpgradeDefinition.js";

describe("initial upgrade definitions", () => {
  it("defines only the three approved upgrades in stable order", () => {
    expect(INITIAL_UPGRADE_DEFINITIONS).toEqual([
      {
        id: "rapid-fire",
        title: "Rapid Fire",
        description: "Increase fire rate by 10% per level.",
        maximumLevel: 5,
        effect: {
          kind: "fire-rate",
          rateIncreasePerLevel: 0.1,
          minimumCooldownSeconds: 0.6,
        },
      },
      {
        id: "swift-movement",
        title: "Swift Movement",
        description:
          "Increase movement speed by 10% of its base value per level.",
        maximumLevel: 5,
        effect: {
          kind: "movement-speed",
          baseSpeedIncreasePerLevel: 0.1,
        },
      },
      {
        id: "vitality",
        title: "Vitality",
        description:
          "Increase maximum health by 1 and immediately heal 1 health.",
        maximumLevel: 5,
        effect: {
          kind: "vitality",
          maximumHealthIncrease: 1,
          immediateHeal: 1,
        },
      },
    ]);
  });

  it("uses unique stable IDs", () => {
    const ids = INITIAL_UPGRADE_DEFINITIONS.map((definition) => definition.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("deeply freezes the list, definitions, and effects", () => {
    expect(Object.isFrozen(INITIAL_UPGRADE_DEFINITIONS)).toBe(true);
    for (const definition of INITIAL_UPGRADE_DEFINITIONS) {
      expect(Object.isFrozen(definition)).toBe(true);
      expect(Object.isFrozen(definition.effect)).toBe(true);
    }
  });

  it("resolves supported IDs and rejects unsupported values", () => {
    expect(getUpgradeDefinition("rapid-fire")?.title).toBe("Rapid Fire");
    expect(getUpgradeDefinition("unsupported")).toBeNull();
  });
});
