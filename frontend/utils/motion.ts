/**
 * Motion utilities for CSS transitions and variants
 *
 * This file provides utilities for CSS-based animations (transitions, variants).
 * For timeline-based SVG animations, see `utils/motion/` directory.
 *
 * Single source of truth for durations, easings, and safe animation variants.
 * Uses transform/opacity only per MDN performance guidance.
 */

export type DurationToken = "quick" | "normal" | "slow";
export type EasingToken = "linear" | "ease-out" | "ease-in-out";

/** CSS variable-backed durations (keep in sync with Style Dictionary tokens) */
export const dur: Record<DurationToken, string> = {
  quick: "var(--fs-motion-duration-quick)",
  normal: "var(--fs-motion-duration-normal)",
  slow: "var(--fs-motion-duration-slow)",
};

/** CSS variable-backed easing functions */
export const ease: Record<EasingToken, string> = {
  linear: "var(--fs-motion-easing-linear)",
  "ease-out": "var(--fs-motion-easing-ease-out)",
  "ease-in-out": "var(--fs-motion-easing-ease-in-out)",
};

/** Build a transition string limited to transform/opacity */
export function buildTransition(
  duration: DurationToken = "normal",
  easing: EasingToken = "ease-out",
  properties: string = "transform, opacity",
): string {
  return `${properties} ${dur[duration]} ${ease[easing]}`;
}

type StyleLike = Partial<{
  opacity: number;
  transform: string;
  willChange: string;
}>;

export type Variant = {
  from: StyleLike;
  to: StyleLike;
};

/**
 * Safe preset variants — never animate layout properties.
 */
export const variants = {
  fadeIn: {
    from: { opacity: 0, willChange: "opacity" },
    to: { opacity: 1 },
  },
  fadeInUp: {
    from: {
      opacity: 0,
      transform: "translateY(16px)",
      willChange: "transform, opacity",
    },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  scaleIn: {
    from: {
      opacity: 0,
      transform: "scale(0.98)",
      willChange: "transform, opacity",
    },
    to: { opacity: 1, transform: "scale(1)" },
  },
} as const satisfies Record<string, Variant>;
