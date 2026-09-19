import type { ReactNode } from "react";
import ButtonLink from "../Controls/ButtonLink";
import Container from "./Container";
import { portfolioDestinations as destinations } from "../../data/portfolioDestinations";

export default function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:p-fs-md bg-fs-surface-background text-fs-action-link focus:outline focus:outline-2 focus:outline-fs-border-focus"
      >
        Skip to main content
      </a>
      <Container as="header" width="wide" className="space-y-fs-md">
        <a
          href={destinations.home.href}
          className="inline-block font-display text-2xl font-bold text-fs-action-link underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fs-border-focus"
        >
          {destinations.home.label}
        </a>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap gap-fs-md">
            {[destinations.start, destinations.about].map((destination) => (
              <li key={destination.href}>
                <ButtonLink href={destination.href}>
                  {destination.label}
                </ButtonLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container as="main" id="main-content" tabIndex={-1} width="wide">
        {children}
      </Container>
      <Container as="footer" width="wide">
        <nav aria-label="Legal">
          <ButtonLink href={destinations.privacy.href}>
            {destinations.privacy.label}
          </ButtonLink>
        </nav>
      </Container>
    </>
  );
}
