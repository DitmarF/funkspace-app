import type { ComponentPropsWithoutRef } from "react";

export type FullscreenScrollProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * Scroll snap behavior mode for the container.
   * - `mandatory`: Always snaps to the nearest snap point
   * - `proximity`: Snaps only when close to a snap point
   * - `none`: Disables scroll snapping
   */
  snapMode?: "mandatory" | "proximity" | "none";
  /**
   * Scroll padding top value to account for sticky headers.
   * When a sticky header is present, this ensures focused elements
   * are not hidden behind it. Can be a Tailwind class or custom value.
   * Default: `scroll-padding-top-0` (no padding)
   *
   * @example
   * ```tsx
   * <FullscreenScroll scrollPaddingTop="scroll-padding-top-20">
   *   {/* content with sticky header *\/}
   * </FullscreenScroll>
   * ```
   */
  scrollPaddingTop?: string;
};

/**
 * FullscreenScroll provides a native scroll container with CSS Scroll Snap.
 *
 * Uses `100dvh` (dynamic viewport height) to handle mobile browser chrome correctly.
 * The `dvh` unit accounts for dynamic browser UI (address bar, toolbars) that can
 * show/hide on scroll, ensuring sections always fill the actual visible viewport.
 *
 * Why `dvh` over `vh`?
 * - `vh` is static and doesn't account for browser chrome visibility changes
 * - On iOS Safari, the address bar can hide/show, causing `vh` to be incorrect
 * - `dvh` dynamically adjusts as browser chrome appears/disappears
 * - This prevents content from being cropped or having unwanted gaps
 *
 * Fallback: For older browsers that don't support `dvh`, we use `h-screen` (100vh)
 * as a fallback. Modern browsers (Safari 15.4+, Chrome 108+) support `dvh`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/length#dynamic_viewport_units
 *
 * @example
 * ```tsx
 * <FullscreenScroll snapMode="mandatory">
 *   <section className="h-[100dvh] snap-start">Section 1</section>
 *   <section className="h-[100dvh] snap-start">Section 2</section>
 * </FullscreenScroll>
 * ```
 */
const FullscreenScroll = ({
  snapMode = "mandatory",
  scrollPaddingTop = "scroll-padding-top-0",
  className = "",
  children,
  ...props
}: FullscreenScrollProps) => {
  const snapClass =
    snapMode === "mandatory"
      ? "snap-mandatory"
      : snapMode === "proximity"
        ? "snap-proximity"
        : "";

  // Use 100dvh as primary, with h-screen as fallback for older browsers
  // CSS cascade: modern browsers use h-[100dvh] (last valid), older browsers use h-screen
  const classes = [
    "h-screen", // Fallback for browsers without dvh support
    "h-[100dvh]", // Primary: dynamic viewport height for mobile browser chrome
    "overflow-y-auto",
    "snap-y",
    "scroll-smooth",
    scrollPaddingTop, // Scroll padding to account for sticky headers
    snapClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default FullscreenScroll;
