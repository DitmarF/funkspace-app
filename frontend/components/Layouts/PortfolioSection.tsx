import type { ComponentPropsWithoutRef } from "react";
import styles from "./PortfolioSection.module.css";

/** Shared content-driven framing for the Start and About portfolio sections. */
export default function PortfolioSection({
  children,
  className = "",
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section {...props} className={`${styles.section} ${className}`}>
      {[
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
