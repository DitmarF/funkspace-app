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
 * Uses `100dvh` for mobile viewport handling and supports keyboard navigation.
 *
 * @example
 * ```tsx
 * <SnapSection id="hero" aria-label="Hero section" snap="start">
 *   <h1>Welcome</h1>
 * </SnapSection>
 * ```
 */
const SnapSection = ({
  id,
  "aria-label": ariaLabel,
  snap = "start",
  relaxSnap = false,
  className = "",
  children,
  ...props
}: SnapSectionProps) => {
  const snapClass =
    snap === "start"
      ? "snap-start"
      : snap === "center"
        ? "snap-center"
        : snap === "end"
          ? "snap-end"
          : "";

  const classes = ["h-[100dvh]", "w-screen", snapClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <section
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
};

export default SnapSection;
