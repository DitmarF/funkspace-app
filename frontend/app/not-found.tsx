import PortfolioShell from "@/components/Layouts/PortfolioShell";
import ButtonLink from "@/components/Controls/ButtonLink";
import { portfolioDestinations as destinations } from "@/data/portfolioDestinations";

export default function NotFound() {
  return (
    <PortfolioShell>
      <div className="max-w-prose space-y-fs-lg break-words">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p>The page you requested could not be found.</p>
        <nav aria-label="Page recovery">
          <ul className="flex flex-wrap gap-fs-md">
            <li className="min-w-0 max-w-full">
              <ButtonLink href={destinations.home.href}>
                Back to FunkSpace
              </ButtonLink>
            </li>
            <li className="min-w-0 max-w-full">
              <ButtonLink href={destinations.contact.href}>
                {destinations.contact.label}
              </ButtonLink>
            </li>
          </ul>
        </nav>
      </div>
    </PortfolioShell>
  );
}
