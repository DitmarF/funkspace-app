import type { ReactNode } from "react";
import ButtonLink from "../Controls/ButtonLink";
import Container from "./Container";
import { portfolioDestinations as destinations } from "../../data/portfolioDestinations";
import { LogoMotion } from "../Logo/LogoMotion";
import PortfolioNavigation from "./PortfolioNavigation";
import PortfolioLegalLinks from "./PortfolioLegalLinks";
import styles from "./PortfolioShell.module.css";

export default function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <a
        href="#main-content"
        className={`${styles.skipLink} sr-only focus:not-sr-only focus:fixed focus:z-10 focus:p-fs-md bg-fs-surface-background text-fs-action-link focus:outline focus:outline-2 focus:outline-fs-border-focus`}
      >
        Skip to main content
      </a>
      <Container
        as="header"
        width="wide"
        padding="none"
        className={`${styles.frame} ${styles.header}`}
      >
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
        padding="none"
        className={`${styles.frame} ${styles.main}`}
      >
        {children}
      </Container>
      <Container
        as="footer"
        width="wide"
        padding="none"
        className={`${styles.frame} ${styles.footer}`}
      >
        <PortfolioNavigation />
        <nav aria-label="Footer">
          <ul className={styles.links}>
            <li>
              <ButtonLink href={destinations.contact.href}>
                {destinations.contact.label}
              </ButtonLink>
            </li>
            <PortfolioLegalLinks />
          </ul>
        </nav>
      </Container>
    </div>
  );
}
