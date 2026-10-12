import { aboutContent } from "@/data/aboutContent";
import { portfolioDestinations as destinations } from "@/data/portfolioDestinations";
import ButtonLink from "../Controls/ButtonLink";
import PortfolioSection from "../Layouts/PortfolioSection";
import { Icon } from "../Icons/Icon";
import styles from "./AboutPreview.module.css";

export default function AboutPreview() {
  return (
    <PortfolioSection id="about" tabIndex={-1} aria-labelledby="about-heading">
      <h2 id="about-heading" className={styles.heading}>
        About
      </h2>
      <div className={styles.copy}>
        {aboutContent.preview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div className="flex justify-start">
          <ButtonLink
            href={destinations.aboutPage.href}
            className="scroll-mb-fs-2xl"
            aria-label={destinations.aboutPage.label}
            icon={<Icon name="more" size={24} />}
            iconPosition="trailing"
          >
            more
          </ButtonLink>
        </div>
      </div>
    </PortfolioSection>
  );
}
