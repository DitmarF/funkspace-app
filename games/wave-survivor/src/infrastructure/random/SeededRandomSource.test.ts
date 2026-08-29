import { describe, expect, it } from "vitest";
import { SeededRandomSource } from "./SeededRandomSource.js";

function takeValues(
  source: SeededRandomSource,
  count: number,
  minInclusive = 0,
  maxExclusive = 1,
): number[] {
  return Array.from({ length: count }, () =>
    source.nextFloat(minInclusive, maxExclusive),
  );
}

describe("SeededRandomSource", () => {
  it("produces identical sequences for the same seed and calls", () => {
    const first = new SeededRandomSource(42);
    const second = new SeededRandomSource(42);

    expect(takeValues(first, 12, -10.5, 25.25)).toEqual(
      takeValues(second, 12, -10.5, 25.25),
    );
  });

  it("restores the initial sequence on reset", () => {
    const source = new SeededRandomSource(2_026);
    const initialSequence = takeValues(source, 10, -4, 9);

    source.reset();

    expect(takeValues(source, 10, -4, 9)).toEqual(initialSequence);
  });

  it("produces different representative sequences for different seeds", () => {
    expect(takeValues(new SeededRandomSource(1), 10)).not.toEqual(
      takeValues(new SeededRandomSource(2), 10),
    );
  });

  it.each([
    ["positive", 10, 25],
    ["negative", -25, -10],
    ["fractional", -0.25, 0.75],
  ])(
    "keeps values inside a %s half-open range",
    (_range, minInclusive, maxExclusive) => {
      const values = takeValues(
        new SeededRandomSource(7),
        1_024,
        minInclusive,
        maxExclusive,
      );

      for (const value of values) {
        expect(value).toBeGreaterThanOrEqual(minInclusive);
        expect(value).toBeLessThan(maxExclusive);
      }
    },
  );

  it("never returns the exclusive maximum for a narrow range", () => {
    const minInclusive = 1;
    const maxExclusive = 1 + Number.EPSILON;
    const values = takeValues(
      new SeededRandomSource(99),
      1_024,
      minInclusive,
      maxExclusive,
    );

    for (const value of values) {
      expect(value).toBe(minInclusive);
      expect(value).not.toBe(maxExclusive);
    }
  });

  it.each([
    [Number.NaN, 1],
    [0, Number.NaN],
    [Number.NEGATIVE_INFINITY, 1],
    [0, Number.POSITIVE_INFINITY],
    [1, 1],
    [2, 1],
  ])("rejects invalid bounds (%s, %s)", (minInclusive, maxExclusive) => {
    const source = new SeededRandomSource(42);

    expect(() => source.nextFloat(minInclusive, maxExclusive)).toThrow(
      RangeError,
    );
  });

  it("supports zero as a deterministic seed", () => {
    const firstSequence = takeValues(new SeededRandomSource(0), 10);
    const secondSequence = takeValues(new SeededRandomSource(0), 10);

    expect(firstSequence).toEqual(secondSequence);
    expect(firstSequence).not.toEqual(Array<number>(10).fill(0));
  });

  it("normalizes seeds to unsigned 32-bit state", () => {
    expect(takeValues(new SeededRandomSource(-1), 10)).toEqual(
      takeValues(new SeededRandomSource(0xffff_ffff), 10),
    );
  });
});
