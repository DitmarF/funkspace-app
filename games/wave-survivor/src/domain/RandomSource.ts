/** Domain-owned source of bounded deterministic random values. */
export interface RandomSource {
  /**
   * Return the next value in the half-open range
   * `[minInclusive, maxExclusive)`.
   *
   * Implementations must reject non-finite bounds and ranges where
   * `maxExclusive <= minInclusive`.
   */
  nextFloat(minInclusive: number, maxExclusive: number): number;

  /** Restore the source to the start of its original deterministic sequence. */
  reset(): void;
}
