import { describe, expect, it } from "vitest";
import type { RandomSource } from "../RandomSource.js";
import {
  applyRunUpgrade,
  createInitialRunUpgradeState,
  generateUpgradeOptionIds,
  INITIAL_UPGRADE_DEFINITIONS,
  type RunUpgradeState,
} from "../upgrades/index.js";
import {
  createRunDefinition,
  getRunEncounter,
  PROVISIONAL_RUN_DEFINITION,
  resolveNextEncounter,
} from "./RunDefinition.js";
import { PROVISIONAL_EPIC_5_WAVES } from "./WaveDefinition.js";
import { compileWaveSchedule } from "./WaveSchedule.js";

const RUN = PROVISIONAL_RUN_DEFINITION;
const STABLE_RANDOM: RandomSource = {
  nextFloat: (minimum) => minimum,
  reset() {},
};

describe("finite run definition", () => {
  it("orders the existing four normal waves followed by exactly one boss", () => {
    expect(RUN.normalWaves).toEqual(PROVISIONAL_EPIC_5_WAVES);
    expect(
      Array.from({ length: 5 }, (_, index) => getRunEncounter(RUN, index).kind),
    ).toEqual([
      "normal-wave",
      "normal-wave",
      "normal-wave",
      "normal-wave",
      "boss",
    ]);
    RUN.normalWaves.forEach((wave, index) => {
      expect(getRunEncounter(RUN, index)).toEqual({
        kind: "normal-wave",
        wave,
      });
    });
  });

  it("requires one upgrade after every normal wave, including before the boss", () => {
    for (let index = 0; index < RUN.normalWaves.length; index += 1) {
      expect(resolveNextEncounter(RUN, index)).toEqual({
        kind: "upgrade",
        nextEncounter: getRunEncounter(RUN, index + 1),
      });
    }
    expect(resolveNextEncounter(RUN, RUN.normalWaves.length - 1)).toEqual({
      kind: "upgrade",
      nextEncounter: { kind: "boss" },
    });
  });

  it("resolves completion after the final encounter without another upgrade", () => {
    expect(resolveNextEncounter(RUN, RUN.normalWaves.length)).toEqual({
      kind: "complete",
    });
  });

  it.each([
    -1,
    0.5,
    5,
    99,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ])(
    "rejects invalid encounter index %s in lookup and successor resolution",
    (index) => {
      expect(() => getRunEncounter(RUN, index)).toThrow(RangeError);
      expect(() => resolveNextEncounter(RUN, index)).toThrow(RangeError);
    },
  );

  it("copies and deeply freezes caller-owned configuration", () => {
    const group = { ...RUN.normalWaves[0].groups[0]! };
    const groups = [group];
    const normalWaves = [{ ...RUN.normalWaves[0], groups }];
    const run = createRunDefinition({ ...RUN, normalWaves });
    group.count = 99;
    groups.push({ ...group });
    normalWaves.push({ ...RUN.normalWaves[0], groups });
    expect(run.normalWaves).toHaveLength(1);
    expect(run.normalWaves[0].groups).toHaveLength(1);
    expect(run.normalWaves[0].groups[0]?.count).toBe(4);
    expect(Object.isFrozen(run)).toBe(true);
    expect(Object.isFrozen(run.normalWaves)).toBe(true);
    expect(Object.isFrozen(run.finalEncounter)).toBe(true);
    expect(Object.isFrozen(run.normalWaves[0].groups[0])).toBe(true);
  });

  it("rejects no normal waves or an unsupported final encounter", () => {
    expect(() => createRunDefinition({ ...RUN, normalWaves: [] })).toThrow(
      RangeError,
    );
    expect(() =>
      createRunDefinition({
        ...RUN,
        finalEncounter: {
          kind: "normal-wave",
        } as unknown as typeof RUN.finalEncounter,
      }),
    ).toThrow(TypeError);
  });

  it.each([
    { ...RUN.normalWaves[0], groups: [] },
    { ...RUN.normalWaves[0], maxActiveEnemies: 0 },
    {
      ...RUN.normalWaves[0],
      groups: [{ ...RUN.normalWaves[0].groups[0]!, count: 0 }],
    },
    {
      ...RUN.normalWaves[0],
      groups: [
        { ...RUN.normalWaves[0].groups[0]!, intervalSeconds: Number.MAX_VALUE },
      ],
    },
  ])("revalidates nested wave content", (wave) => {
    expect(() => createRunDefinition({ ...RUN, normalWaves: [wave] })).toThrow(
      RangeError,
    );
  });

  it("records schedule counts, caps, and last due offsets without claiming clear times", () => {
    const measurements = RUN.normalWaves.map((wave) => {
      const requests = compileWaveSchedule(wave);
      return [
        requests.length,
        wave.maxActiveEnemies,
        Number(requests.at(-1)!.scheduledAtSeconds.toFixed(2)),
      ];
    });
    expect(measurements).toEqual([
      [4, 2, 3.5],
      [6, 3, 4.75],
      [8, 4, 6.6],
      [10, 5, 6.8],
    ]);
  });
});

describe("run upgrade capacity", () => {
  it("accepts exactly the available level budget and rejects one more choice", () => {
    const capacity = INITIAL_UPGRADE_DEFINITIONS.reduce(
      (total, upgrade) => total + upgrade.maximumLevel,
      0,
    );
    expect(capacity).toBe(15);
    const normalWaves = Array.from(
      { length: capacity },
      () => RUN.normalWaves[0],
    );
    expect(
      createRunDefinition({ ...RUN, normalWaves }).normalWaves,
    ).toHaveLength(capacity);
    expect(() =>
      createRunDefinition({
        ...RUN,
        normalWaves: [...normalWaves, RUN.normalWaves[0]],
      }),
    ).toThrow(RangeError);
  });

  it("keeps all four choices legal for every possible candidate upgrade path", () => {
    let pathsToBoss = 0;
    function visit(
      index: number,
      state: Readonly<RunUpgradeState>,
      health: number,
    ): void {
      if (getRunEncounter(RUN, index).kind === "boss") {
        pathsToBoss += 1;
        expect(
          Object.values(state.levels).reduce((sum, level) => sum + level, 0),
        ).toBe(4);
        return;
      }
      const options = generateUpgradeOptionIds(
        INITIAL_UPGRADE_DEFINITIONS,
        state,
        3,
        STABLE_RANDOM,
      );
      // Even choosing the same upgrade repeatedly leaves all three options
      // available at the fourth choice with the current five-level caps.
      expect(options).toHaveLength(3);
      for (const id of options) {
        const applied = applyRunUpgrade(id, state, health, 3);
        expect(applied).not.toBeNull();
        visit(index + 1, applied!.upgrades, applied!.currentHealth);
      }
    }
    visit(0, createInitialRunUpgradeState(), 3);
    expect(pathsToBoss).toBe(81);
  });
});
