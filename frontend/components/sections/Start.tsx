import { LogoMotion } from "../Logo/LogoMotion";
import PortfolioSection from "../Layouts/PortfolioSection";
import styles from "./Start.module.css";

/** Static portfolio opening; this section owns the reserved scene frame. */
export default function Start() {
  return (
    <PortfolioSection id="start" tabIndex={-1} aria-labelledby="start-heading">
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
    </PortfolioSection>
  );
}
