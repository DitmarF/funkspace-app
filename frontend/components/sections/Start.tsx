import StartScene from "../Scene/StartScene";
import ButtonLink from "../Controls/ButtonLink";
import { portfolioDestinations } from "@/data/portfolioDestinations";
import { startIntroduction } from "@/data/startContent";
import PortfolioSection from "../Layouts/PortfolioSection";
import styles from "./Start.module.css";

/** Portfolio opening with independent static artwork and optional motion. */
export default function Start() {
  return (
    <PortfolioSection id="start" tabIndex={-1} aria-labelledby="start-heading">
      <h1 id="start-heading" className={styles.title}>
        Aperture - 1
      </h1>
      <StartScene />
      <ButtonLink
        href={portfolioDestinations.aperture.href}
        aria-label={portfolioDestinations.aperture.label}
      >
        More
      </ButtonLink>
      <p data-start-introduction className={styles.introduction}>
        {startIntroduction}
      </p>
    </PortfolioSection>
  );
}
