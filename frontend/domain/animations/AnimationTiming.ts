/**
 * Animation timing domain rules
 * Pure business logic for animation timing calculations
 */

/**
 * Animation timing constants
 */
export const ANIMATION_TIMING = {
  TARGET_DURATION: 1500, // ms - target duration for logo animation
  BASE_STROKE_DURATION_TOKEN: "--fs-motion-duration-800",
  BASE_STROKE_DURATION_FALLBACK: 800, // ms
  BASE_FILL_DURATION_TOKEN: "--fs-motion-duration-400",
  BASE_FILL_DURATION_FALLBACK: 400, // ms
  BASE_LETTER_STAGGER: 100, // ms
  LOGOMARK_START_DELAY_MULTIPLIER: 2, // Start when letter "N" (index 2) starts
  LOGOMARK_DURATION_MULTIPLIER: 2, // logoMark animation is half as slow
} as const;

/**
 * Calculate scaled animation durations to fit target duration
 */
export interface ScaledTiming {
  strokeDuration: number;
  fillDuration: number;
  letterStagger: number;
  logomarkStrokeDuration: number;
  logomarkStartDelay: number;
}

/**
 * Calculate scaled timing values
 * @param baseStrokeDuration Base stroke duration in ms
 * @param baseFillDuration Base fill duration in ms
 * @param baseLetterStagger Base letter stagger in ms
 * @param targetDuration Target total duration in ms
 * @param lastLetterIndex Index of last letter (0-based)
 * @returns Scaled timing values
 */
export function calculateScaledTiming(
  baseStrokeDuration: number,
  baseFillDuration: number,
  baseLetterStagger: number,
  targetDuration: number,
  lastLetterIndex: number,
): ScaledTiming {
  // Calculate max end time considering:
  // - Last letter fill end = lastLetterIndex * baseLetterStagger + baseStrokeDuration + baseFillDuration
  // - logoMark end = LOGOMARK_START_DELAY_MULTIPLIER * baseLetterStagger + baseStrokeDuration * LOGOMARK_DURATION_MULTIPLIER
  const lastLetterFillEnd =
    lastLetterIndex * baseLetterStagger + baseStrokeDuration + baseFillDuration;
  const logomarkEnd =
    ANIMATION_TIMING.LOGOMARK_START_DELAY_MULTIPLIER * baseLetterStagger +
    baseStrokeDuration * ANIMATION_TIMING.LOGOMARK_DURATION_MULTIPLIER;
  const currentMaxEnd = Math.max(lastLetterFillEnd, logomarkEnd);

  // Scale factor to fit in target duration
  const scaleFactor = targetDuration / currentMaxEnd;

  return {
    strokeDuration: Math.round(baseStrokeDuration * scaleFactor),
    fillDuration: Math.round(baseFillDuration * scaleFactor),
    letterStagger: Math.round(baseLetterStagger * scaleFactor),
    logomarkStrokeDuration: Math.round(
      baseStrokeDuration *
        ANIMATION_TIMING.LOGOMARK_DURATION_MULTIPLIER *
        scaleFactor,
    ),
    logomarkStartDelay:
      ANIMATION_TIMING.LOGOMARK_START_DELAY_MULTIPLIER *
      Math.round(baseLetterStagger * scaleFactor),
  };
}
