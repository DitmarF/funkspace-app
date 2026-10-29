import { Icon } from "../Icons/Icon";
import PortfolioLegalLinks from "./PortfolioLegalLinks";
import rowStyles from "./PortfolioNavigationTree.module.css";
import styles from "./PortfolioFooterNavigation.module.css";

/** Native footer destinations remain available before hydration and without JS. */
export default function PortfolioFooterNavigation() {
  return (
    <nav aria-label="Footer" className={styles.navigation} data-home-content="">
      <ul className={styles.list}>
        <PortfolioLegalLinks />
        <li className={styles.socialItem}>
          <a
            href="https://github.com/DitmarF/funkspace-app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FunkSpace project on GitHub (opens in a new tab)"
            title="FunkSpace project on GitHub (opens in a new tab)"
            className={`${rowStyles.row} ${rowStyles.compact} ${styles.social}`}
          >
            <Icon
              name="github"
              size={36}
              className={`${rowStyles.icon} ${styles.socialIcon}`}
            />
          </a>
        </li>
      </ul>
    </nav>
  );
}
