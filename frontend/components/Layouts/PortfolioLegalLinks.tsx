import { portfolioDestinations as destinations } from "@/data/portfolioDestinations";
import { NavigationRowContent } from "./PortfolioNavigationRow";
import styles from "./PortfolioNavigationTree.module.css";

/** Both routes contain readable material; legal completeness is tracked in FS-2.4. */
export default function PortfolioLegalLinks() {
  return (
    <>
      {(
        [
          { id: "impressum", label: "Legal notice", icon: "legal-notice" },
          { id: "privacy", label: "Privacy policy", icon: "privacy-policy" },
        ] as const
      ).map((item) => (
        <li key={item.id}>
          <a
            href={destinations[item.id].href}
            className={`${styles.row} ${styles.compact}`}
          >
            <NavigationRowContent
              item={{ ...item, kind: "link", destination: item.id }}
            />
          </a>
        </li>
      ))}
    </>
  );
}
