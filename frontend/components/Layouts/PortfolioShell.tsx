import type { ReactNode } from "react";
import ButtonLink from "../Controls/ButtonLink";
import Container from "./Container";
import { portfolioDestinations as destinations } from "../../data/portfolioDestinations";
import { LogoMotion } from "../Logo/LogoMotion";
import PortfolioNavigation from "./PortfolioNavigation";
import styles from "./PortfolioShell.module.css";

export default function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:p-fs-md bg-fs-surface-background text-fs-action-link focus:outline focus:outline-2 focus:outline-fs-border-focus"
      >
        Skip to main content
      </a>
      <Container as="header" width="wide">
        <a
          href={destinations.home.href}
          aria-label={destinations.home.label}
          className={styles.identity}
        >
          <span aria-hidden="true">
            <LogoMotion
              enabled={false}
              autoPlay={false}
              className="block h-auto w-full"
            />
          </span>
        </a>
      </Container>
      <Container
        as="main"
        id="main-content"
        tabIndex={-1}
        width="wide"
        className={styles.main}
      >
        {children}
      </Container>
      <Container as="footer" width="wide" className={styles.footer}>
        <PortfolioNavigation />
        <nav aria-label="Legal">
          <ButtonLink href={destinations.privacy.href}>
            {destinations.privacy.label}
          </ButtonLink>
        </nav>
      </Container>
    </>
  );
}
