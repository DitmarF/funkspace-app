import type { RandomSource } from "../../domain/RandomSource.js";

const UINT32_RANGE = 0x1_0000_0000;
const LCG_MULTIPLIER = 1_664_525;
const LCG_INCREMENT = 1_013_904_223;

/**
 * Deterministic 32-bit linear congruential generator for gameplay and tests.
 *
 * Seeds are normalized to unsigned 32-bit state. This small generator uses the
 * Numerical Recipes constants and is not suitable for cryptographic purposes.
 */
export class SeededRandomSource implements RandomSource {
  private readonly initialState: number;
  private state: number;

  constructor(seed: number) {
    this.initialState = seed >>> 0;
    this.state = this.initialState;
  }

  nextFloat(minInclusive: number, maxExclusive: number): number {
    if (!Number.isFinite(minInclusive) || !Number.isFinite(maxExclusive)) {
      throw new RangeError("Random bounds must be finite.");
    }

    if (maxExclusive <= minInclusive) {
      throw new RangeError(
        "The exclusive maximum must be greater than the inclusive minimum.",
      );
    }

    this.state = (Math.imul(this.state, LCG_MULTIPLIER) + LCG_INCREMENT) >>> 0;

    const unitValue = this.state / UINT32_RANGE;
    const value = minInclusive * (1 - unitValue) + maxExclusive * unitValue;

    // Preserve the half-open contract when floating-point rounding reaches a
    // bound, including for very narrow or very large finite ranges.
    return value >= minInclusive && value < maxExclusive ? value : minInclusive;
  }

  reset(): void {
    this.state = this.initialState;
  }
}
