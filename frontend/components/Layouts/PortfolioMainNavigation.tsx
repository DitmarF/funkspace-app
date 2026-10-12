"use client";

import { useServices } from "@/application/providers/ServiceProvider";
import { portfolioMainNavigation } from "@/data/portfolioNavigation";
import { portfolioDestinations } from "@/data/portfolioDestinations";
import PortfolioNavigationRow from "./PortfolioNavigationRow";
import styles from "./PortfolioMainNavigation.module.css";

/** Persistent first-level links; the shared tree remains the complete navigation. */
export default function PortfolioMainNavigation() {
  const { navigationHandoff } = useServices();
  return (
    <nav aria-label="Main" className={styles.navigation} data-home-content="">
      <ul className={styles.list}>
        {portfolioMainNavigation.map((item) => (
          <li key={item.id}>
            <PortfolioNavigationRow
              item={item}
              compact
              onNavigate={(key) => {
                const ticket = navigationHandoff.begin(
                  portfolioDestinations[key],
                );
                // Header links have no departing overlay to wait for.
                navigationHandoff.released(ticket.id);
              }}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
