"use client";

import { usePathname } from "next/navigation";
import {
  isCurrentPortfolioDestination,
  type PortfolioDestinationKey,
} from "../../data/portfolioDestinations";
import {
  portfolioNavigation,
  type PortfolioNavigationItem,
} from "../../data/portfolioNavigation";
import PortfolioNavigationRow, {
  NavigationRowContent,
} from "./PortfolioNavigationRow";
import styles from "./PortfolioNavigationTree.module.css";

interface Props {
  items?: readonly PortfolioNavigationItem[];
  onNavigate?: (destination: PortfolioDestinationKey) => void;
}

function containsCurrentPage(
  items: readonly PortfolioNavigationItem[],
  pathname: string | null,
): boolean {
  return items.some((item) =>
    item.kind === "group"
      ? containsCurrentPage(item.children, pathname)
      : item.kind === "link" &&
        isCurrentPortfolioDestination(pathname, item.destination),
  );
}

function Rows({
  items,
  onNavigate,
  pathname,
}: Required<Pick<Props, "items">> &
  Pick<Props, "onNavigate"> & { pathname: string | null }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id}>
          {item.kind === "group" ? (
            <details
              className={styles.branch}
              open={containsCurrentPage(item.children, pathname)}
              // Native disclosure input may precede hydration.
              suppressHydrationWarning
            >
              <summary className={styles.row}>
                <NavigationRowContent item={item} />
              </summary>
              <Rows
                items={item.children}
                onNavigate={onNavigate}
                pathname={pathname}
              />
            </details>
          ) : (
            <PortfolioNavigationRow item={item} onNavigate={onNavigate} />
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
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className={styles.tree}>
      <Rows
        key={pathname}
        items={items}
        onNavigate={onNavigate}
        pathname={pathname}
      />
    </nav>
  );
}
