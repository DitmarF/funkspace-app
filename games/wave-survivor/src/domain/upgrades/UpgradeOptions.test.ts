import { describe, expect, it, vi } from "vitest";
import type { RandomSource } from "../RandomSource.js";
import { SeededRandomSource } from "../../infrastructure/random/SeededRandomSource.js";
import {
  INITIAL_UPGRADE_DEFINITIONS,
  RAPID_FIRE_UPGRADE,
  SWIFT_MOVEMENT_UPGRADE,
  type UpgradeDefinition,
} from "./UpgradeDefinition.js";
import { generateUpgradeOptionIds } from "./UpgradeOptions.js";
import {
  createInitialRunUpgradeState,
  createRunUpgradeState,
} from "./RunUpgradeState.js";

describe("generateUpgradeOptionIds", () => {
  it("returns equal immutable options for equal seeds and run state", () => {
    const state = createInitialRunUpgradeState();

    const first = generateUpgradeOptionIds(
      INITIAL_UPGRADE_DEFINITIONS,
      state,
      3,
      new SeededRandomSource(1),
    );
    const second = generateUpgradeOptionIds(
      INITIAL_UPGRADE_DEFINITIONS,
      state,
      3,
      new SeededRandomSource(1),
    );

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
  });

  it("allows different deterministic seeds to produce different orderings", () => {
    const state = createInitialRunUpgradeState();
    const first = generateUpgradeOptionIds(
      INITIAL_UPGRADE_DEFINITIONS,
      state,
      3,
      new SeededRandomSource(1),
    );
    const second = generateUpgradeOptionIds(
      INITIAL_UPGRADE_DEFINITIONS,
      state,
      3,
      new SeededRandomSource(1_000),
    );

    expect(second).not.toEqual(first);
    expect(new Set(second)).toEqual(new Set(first));
  });

  it("returns no duplicate IDs even when definitions repeat", () => {
    const options = generateUpgradeOptionIds(
      [
        ...INITIAL_UPGRADE_DEFINITIONS,
        RAPID_FIRE_UPGRADE,
        SWIFT_MOVEMENT_UPGRADE,
      ],
      createInitialRunUpgradeState(),
      3,
      new SeededRandomSource(3),
    );

    expect(options).toHaveLength(3);
    expect(new Set(options).size).toBe(options.length);
  });

  it("excludes capped upgrades and safely returns fewer eligible choices", () => {
    const state = createRunUpgradeState({
      "rapid-fire": 5,
      "swift-movement": 5,
    });

    expect(
      generateUpgradeOptionIds(
        INITIAL_UPGRADE_DEFINITIONS,
        state,
        3,
        new SeededRandomSource(4),
      ),
    ).toEqual(["vitality"]);
  });

  it.each([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 3],
  ])(
    "returns %s requested choices as %s available options",
    (requestedOptionCount, expectedOptionCount) => {
      const options = generateUpgradeOptionIds(
        INITIAL_UPGRADE_DEFINITIONS,
        createInitialRunUpgradeState(),
        requestedOptionCount,
        new SeededRandomSource(5),
      );

      expect(options).toHaveLength(expectedOptionCount);
      expect(new Set(options).size).toBe(expectedOptionCount);
    },
  );

  it("returns an empty immutable set when no upgrade is eligible", () => {
    const options = generateUpgradeOptionIds(
      INITIAL_UPGRADE_DEFINITIONS,
      createRunUpgradeState({
        "rapid-fire": 5,
        "swift-movement": 5,
        vitality: 5,
      }),
      3,
      new SeededRandomSource(6),
    );

    expect(options).toEqual([]);
    expect(Object.isFrozen(options)).toBe(true);
  });

  it("normalizes eligible definitions to canonical stable order", () => {
    const nextFloat = vi.fn((minimum: number) => minimum);
    const randomSource: RandomSource = {
      nextFloat,
      reset: vi.fn(),
    };

    const options = generateUpgradeOptionIds(
      [...INITIAL_UPGRADE_DEFINITIONS].reverse(),
      createInitialRunUpgradeState(),
      3,
      randomSource,
    );

    expect(options).toEqual(["rapid-fire", "swift-movement", "vitality"]);
    expect(nextFloat.mock.calls).toEqual([
      [0, 3],
      [1, 3],
    ]);
  });

  it("excludes unsupported and altered definition values", () => {
    const unsupported = Object.freeze({
      ...RAPID_FIRE_UPGRADE,
      id: "unsupported",
    }) as unknown as Readonly<UpgradeDefinition>;
    const altered = Object.freeze({
      ...RAPID_FIRE_UPGRADE,
      maximumLevel: 99,
    });
    const invalidDefinitions = [
      null,
      unsupported,
      altered,
      SWIFT_MOVEMENT_UPGRADE,
    ] as unknown as readonly Readonly<UpgradeDefinition>[];

    expect(
      generateUpgradeOptionIds(
        invalidDefinitions,
        createInitialRunUpgradeState(),
        3,
        new SeededRandomSource(7),
      ),
    ).toEqual(["swift-movement"]);
  });

  it.each([-1, 1.5, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid requested option count %s",
    (requestedOptionCount) => {
      expect(() =>
        generateUpgradeOptionIds(
          INITIAL_UPGRADE_DEFINITIONS,
          createInitialRunUpgradeState(),
          requestedOptionCount,
          new SeededRandomSource(8),
        ),
      ).toThrow(RangeError);
    },
  );
});
