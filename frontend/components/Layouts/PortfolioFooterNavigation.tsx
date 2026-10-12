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
            aria-label="FunkSpace project on GitHub"
            title="FunkSpace project on GitHub"
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
