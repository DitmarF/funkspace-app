import { aboutContent } from "@/data/aboutContent";
import { portfolioDestinations as destinations } from "@/data/portfolioDestinations";
import ButtonLink from "../Controls/ButtonLink";
import PortfolioSection from "../Layouts/PortfolioSection";

export default function AboutPreview() {
  return (
    <PortfolioSection id="about" tabIndex={-1} aria-labelledby="about-heading">
      <div className="max-w-prose space-y-fs-md break-words">
        <h2 id="about-heading" className="text-2xl font-bold">
          About
        </h2>
        <p className="text-sm leading-6">{aboutContent.draftNotice}</p>
        <p lang="la" className="text-base leading-7">
          {aboutContent.preview}
        </p>
        <ButtonLink
          href={destinations.aboutPage.href}
          className="scroll-mb-fs-2xl"
        >
          {destinations.aboutPage.label}
        </ButtonLink>
      </div>
    </PortfolioSection>
  );
}
