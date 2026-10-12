import type { ComponentPropsWithoutRef } from "react";
import styles from "./PortfolioSection.module.css";

export type PortfolioSectionProps = ComponentPropsWithoutRef<"section"> & {
  /** Plain for content; cornered for interactive sections with multiple controls. */
  variant?: "plain" | "cornered";
};

/** Shared content-driven section; decoration never changes semantics or spacing. */
export default function PortfolioSection({
  children,
  className = "",
  variant = "plain",
  ...props
}: PortfolioSectionProps) {
  return (
    <section {...props} className={`${styles.section} ${className}`}>
      {variant === "cornered" &&
        [
          styles.topLeft,
          styles.topRight,
          styles.bottomRight,
          styles.bottomLeft,
        ].map((position) => (
          <svg
            key={position}
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 12 12"
            className={`${styles.corner} ${position}`}
          >
            <path
              d="M0 3H12M5 0V12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        ))}
      {children}
    </section>
  );
}
