import Link from "next/link";
import { portfolioDestinations } from "../../data/portfolioDestinations";
import {
  portfolioNavigation,
  type PortfolioNavigationItem,
} from "../../data/portfolioNavigation";
import { Icon } from "../Icons/Icon";
import styles from "./PortfolioNavigationTree.module.css";

interface Props {
  items?: readonly PortfolioNavigationItem[];
  onNavigate?: (href: string) => void;
}

function RowContent({ item }: { item: PortfolioNavigationItem }) {
  return (
    <>
      {item.kind === "group" && (
        <span className={styles.arrow} aria-hidden="true">
          <Icon
            name="arrow-right-small"
            size={24}
            className={styles.collapsedArrow}
          />
          <Icon
            name="arrow-down-small"
            size={24}
            className={styles.expandedArrow}
          />
        </span>
      )}
      <Icon name={item.icon} size={24} className={styles.icon} />
      <span className={styles.label}>
        {item.label}
        {item.kind === "pending" && (
          <span className={styles.pendingLabel}>Coming soon</span>
        )}
      </span>
    </>
  );
}

function Rows({
  items,
  onNavigate,
}: Required<Pick<Props, "items">> & Pick<Props, "onNavigate">) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id}>
          {item.kind === "group" ? (
            <details className={styles.branch}>
              <summary className={styles.row}>
                <RowContent item={item} />
              </summary>
              <Rows items={item.children} onNavigate={onNavigate} />
            </details>
          ) : item.kind === "link" ? (
            <Link
              className={styles.row}
              href={portfolioDestinations[item.destination].href}
              prefetch={false}
              onNavigate={() =>
                onNavigate?.(portfolioDestinations[item.destination].href)
              }
            >
              <RowContent item={item} />
            </Link>
          ) : (
            <span className={styles.row} aria-disabled="true">
              <RowContent item={item} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Native disclosures and ordinary anchors, including without JavaScript. */
export default function PortfolioNavigationTree({
  items = portfolioNavigation,
  onNavigate,
}: Props) {
  return (
    <nav aria-label="Primary" className={styles.tree}>
      <Rows items={items} onNavigate={onNavigate} />
    </nav>
  );
}
