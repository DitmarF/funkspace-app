import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

export type SnapSectionProps = ComponentPropsWithoutRef<"section"> & {
  /**
   * Unique identifier for the section. Required for accessibility and anchor navigation.
   */
  id: string;
  /**
   * Accessible label for the section. Required for screen readers.
   */
  "aria-label": string;
  /**
   * Scroll snap alignment for this section.
   * - `start`: Section snaps to the start of the viewport (default)
   * - `center`: Section snaps to the center of the viewport
   * - `end`: Section snaps to the end of the viewport
   * - `none`: Disables snapping for this section
   */
  snap?: "start" | "center" | "end" | "none";
  /**
   * If true, relaxes snap behavior for this section by using proximity-based snapping.
   * This is useful for sections with dense or scrollable content.
   */
  relaxSnap?: boolean;
};

/**
 * SnapSection is a semantic full-screen section component with CSS Scroll Snap support.
 *
 * Renders a `<section>` with proper accessibility attributes and scroll snap behavior.
 * Uses `100dvh` (dynamic viewport height) to handle mobile browser chrome correctly.
 *
 * Why `100dvh`?
 * - Accounts for dynamic browser UI (address bar, toolbars) that can show/hide
 * - On iOS Safari, prevents content from being cropped when address bar appears/disappears
 * - Ensures sections always fill the actual visible viewport, not the static viewport
 * - Fallback to `h-screen` (100vh) for older browsers without `dvh` support
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/length#dynamic_viewport_units
 *
 * @example
 * ```tsx
 * <SnapSection id="hero" aria-label="Hero section" snap="start">
 *   <h1>Welcome</h1>
 * </SnapSection>
 * ```
 */
const SnapSection = forwardRef<HTMLElement, SnapSectionProps>(
  (
    {
      id,
      "aria-label": ariaLabel,
      snap = "start",
      relaxSnap = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const snapClass =
      snap === "start"
        ? "snap-start"
        : snap === "center"
          ? "snap-center"
          : snap === "end"
            ? "snap-end"
            : "";

    // Use 100dvh as primary, with h-screen as fallback for older browsers
    // Modern browsers will use h-[100dvh], older browsers will fall back to h-screen
    const classes = [
      "h-screen", // Fallback for browsers without dvh support
      "h-[100dvh]", // Primary: dynamic viewport height for mobile browser chrome
      "w-screen",
      snapClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <section
        ref={ref}
        id={id}
        role="region"
        tabIndex={-1}
        aria-label={ariaLabel}
        data-snap={relaxSnap ? "proximity" : undefined}
        className={classes}
        {...props}
      >
        {children}
      </section>
    );
  },
);

SnapSection.displayName = "SnapSection";

export default SnapSection;
