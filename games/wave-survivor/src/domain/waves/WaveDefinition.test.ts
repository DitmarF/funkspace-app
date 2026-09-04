import { describe, expect, it } from "vitest";
import {
  createSpawnGroup,
  createWaveDefinition,
  PROVISIONAL_EPIC_5_WAVES,
  type SpawnGroup,
} from "./index.js";

const VALID_GROUP: SpawnGroup = {
  startOffsetSeconds: 0.5,
  enemyId: "basic",
  count: 4,
  intervalSeconds: 1,
  pattern: "random-perimeter",
};

describe("createSpawnGroup", () => {
  it("constructs and freezes a valid group", () => {
    const group = createSpawnGroup(VALID_GROUP);

    expect(group).toEqual(VALID_GROUP);
    expect(group).not.toBe(VALID_GROUP);
    expect(Object.isFrozen(group)).toBe(true);
  });

  it("accepts a count-one group with a zero interval", () => {
    expect(
      createSpawnGroup({
        ...VALID_GROUP,
        count: 1,
        intervalSeconds: 0,
      }).intervalSeconds,
    ).toBe(0);
  });

  it.each([
    ["count", -1],
    ["count", 0],
    ["count", 1.5],
    ["count", Number.MAX_SAFE_INTEGER + 1],
    ["count", Number.NaN],
    ["count", Number.POSITIVE_INFINITY],
    ["startOffsetSeconds", -1],
    ["startOffsetSeconds", Number.NaN],
    ["startOffsetSeconds", Number.POSITIVE_INFINITY],
    ["intervalSeconds", -1],
    ["intervalSeconds", Number.NaN],
    ["intervalSeconds", Number.NEGATIVE_INFINITY],
  ] as const)("rejects invalid %s value %s", (property, value) => {
    expect(() =>
      createSpawnGroup({
        ...VALID_GROUP,
        [property]: value,
      }),
    ).toThrow(RangeError);
  });

  it("rejects a zero interval when count is greater than one", () => {
    expect(() =>
      createSpawnGroup({ ...VALID_GROUP, intervalSeconds: 0 }),
    ).toThrow(RangeError);
  });

  it("rejects unsupported enemy IDs", () => {
    expect(() =>
      createSpawnGroup({ ...VALID_GROUP, enemyId: "unsupported" }),
    ).toThrow(TypeError);
  });

  it("rejects unsupported spawn patterns", () => {
    expect(() =>
      createSpawnGroup({ ...VALID_GROUP, pattern: "unsupported" }),
    ).toThrow(TypeError);
  });
});

describe("createWaveDefinition", () => {
  it("constructs a valid wave and preserves declared group order", () => {
    const laterGroup = createSpawnGroup({
      ...VALID_GROUP,
      startOffsetSeconds: 4.5,
      count: 2,
      intervalSeconds: 0.7,
    });
    const wave = createWaveDefinition({
      groups: [VALID_GROUP, laterGroup],
      maxActiveEnemies: 3,
    });

    expect(wave.groups.map((group) => group.startOffsetSeconds)).toEqual([
      0.5, 4.5,
    ]);
    expect(wave.maxActiveEnemies).toBe(3);
  });

  it("copies and deeply freezes nested caller-owned data", () => {
    const callerGroup = { ...VALID_GROUP };
    const callerGroups: SpawnGroup[] = [callerGroup];
    const wave = createWaveDefinition({
      groups: callerGroups,
      maxActiveEnemies: 2,
    });

    expect(wave.groups).not.toBe(callerGroups);
    expect(wave.groups[0]).not.toBe(callerGroup);
    expect(Object.isFrozen(wave)).toBe(true);
    expect(Object.isFrozen(wave.groups)).toBe(true);
    expect(Object.isFrozen(wave.groups[0])).toBe(true);

    callerGroup.count = 99;
    callerGroups.push({ ...VALID_GROUP });

    expect(wave.groups).toHaveLength(1);
    expect(wave.groups[0]?.count).toBe(4);
    expect(Reflect.set(wave.groups[0]!, "count", 99)).toBe(false);
  });

  it("rejects an empty group list", () => {
    expect(() =>
      createWaveDefinition({ groups: [], maxActiveEnemies: 1 }),
    ).toThrow(RangeError);
  });

  it.each([
    -1,
    0,
    1.5,
    Number.MAX_SAFE_INTEGER + 1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])("rejects invalid maximum active enemy value %s", (maxActiveEnemies) => {
    expect(() =>
      createWaveDefinition({
        groups: [VALID_GROUP],
        maxActiveEnemies,
      }),
    ).toThrow(RangeError);
  });

  it("revalidates nested groups instead of trusting their declared type", () => {
    const invalidGroup = {
      ...VALID_GROUP,
      count: 0,
    } as SpawnGroup;

    expect(() =>
      createWaveDefinition({ groups: [invalidGroup], maxActiveEnemies: 1 }),
    ).toThrow(RangeError);
  });
});

describe("PROVISIONAL_EPIC_5_WAVES", () => {
  it("defines the four provisional waves in declared order", () => {
    expect(PROVISIONAL_EPIC_5_WAVES).toEqual([
      { groups: [{ ...VALID_GROUP }], maxActiveEnemies: 2 },
      {
        groups: [{ ...VALID_GROUP, count: 6, intervalSeconds: 0.85 }],
        maxActiveEnemies: 3,
      },
      {
        groups: [
          { ...VALID_GROUP, intervalSeconds: 0.8 },
          {
            ...VALID_GROUP,
            startOffsetSeconds: 4.5,
            intervalSeconds: 0.7,
          },
        ],
        maxActiveEnemies: 4,
      },
      {
        groups: [
          { ...VALID_GROUP, count: 6, intervalSeconds: 0.7 },
          {
            ...VALID_GROUP,
            startOffsetSeconds: 5,
            intervalSeconds: 0.6,
          },
        ],
        maxActiveEnemies: 4,
      },
    ]);
  });

  it("is deeply frozen", () => {
    expect(Object.isFrozen(PROVISIONAL_EPIC_5_WAVES)).toBe(true);

    for (const wave of PROVISIONAL_EPIC_5_WAVES) {
      expect(Object.isFrozen(wave)).toBe(true);
      expect(Object.isFrozen(wave.groups)).toBe(true);
      expect(wave.groups.every(Object.isFrozen)).toBe(true);
    }
  });
});
