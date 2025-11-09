import type { ComponentPropsWithoutRef } from "react";

export type FullscreenScrollProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * Scroll snap behavior mode for the container.
   * - `mandatory`: Always snaps to the nearest snap point
   * - `proximity`: Snaps only when close to a snap point
   * - `none`: Disables scroll snapping
   */
  snapMode?: "mandatory" | "proximity" | "none";
};

/**
 * FullscreenScroll provides a native scroll container with CSS Scroll Snap.
 *
 * Uses `100dvh` (dynamic viewport height) on mobile to handle browser chrome
 * correctly, falling back to `h-screen` on larger viewports.
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

  const classes = [
    "h-screen",
    "md:h-[100dvh]",
    "overflow-y-auto",
    "snap-y",
    "scroll-smooth",
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
