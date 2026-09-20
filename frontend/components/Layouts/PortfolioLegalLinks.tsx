import { portfolioDestinations as destinations } from "@/data/portfolioDestinations";
import ButtonLink from "../Controls/ButtonLink";

/** Both routes contain readable material; legal completeness is tracked in FS-2.4. */
export default function PortfolioLegalLinks() {
  return (
    <>
      {[destinations.impressum, destinations.privacy].map((destination) => (
        <li key={destination.href}>
          <ButtonLink href={destination.href}>{destination.label}</ButtonLink>
        </li>
      ))}
    </>
  );
}
