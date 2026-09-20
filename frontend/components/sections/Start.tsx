import { LogoMotion } from "../Logo/LogoMotion";
import styles from "./Start.module.css";

/** Static portfolio opening; this section owns the reserved scene frame. */
export default function Start() {
  return (
    <section
      id="start"
      tabIndex={-1}
      aria-labelledby="start-heading"
      className={styles.section}
    >
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
      <h1 id="start-heading" className={styles.title}>
        FunkSpace
      </h1>
      <div data-start-scene="" aria-hidden="true" className={styles.scene}>
        {/* Explicitly static even when the global animation flag is enabled. */}
        <LogoMotion
          enabled={false}
          autoPlay={false}
          className="block h-auto w-full"
        />
      </div>
      <p className={styles.introduction}>
        FunkSpace is a design-system-first web experience built as a PNPM
        workspace.
      </p>
    </section>
  );
}
