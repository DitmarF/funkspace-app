"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  isCurrentPortfolioDestination,
  portfolioDestinations,
  type PortfolioDestinationKey,
} from "@/data/portfolioDestinations";
import type { PortfolioNavigationItem } from "@/data/portfolioNavigation";
import { Icon } from "../Icons/Icon";
import styles from "./PortfolioNavigationTree.module.css";

export function NavigationRowContent({
  item,
}: {
  item: PortfolioNavigationItem;
}) {
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
      <Icon
        name={item.icon}
        size={24}
        className={`${styles.icon} ${styles.smallIcon}`}
      />
      <Icon
        name={item.icon}
        size={36}
        className={`${styles.icon} ${styles.largeIcon}`}
      />
      <span className={styles.label}>
        {item.label}
        {item.kind === "pending" && (
          <span className={styles.pendingLabel}>Coming soon</span>
        )}
      </span>
    </>
  );
}

/** One visual and semantic contract for header and tree leaf rows. */
export default function PortfolioNavigationRow({
  item,
  compact = false,
  onNavigate,
}: {
  item: Exclude<PortfolioNavigationItem, { readonly kind: "group" }>;
  compact?: boolean;
  onNavigate?: (destination: PortfolioDestinationKey) => void;
}) {
  const pathname = usePathname();
  const className = `${styles.row} ${compact ? styles.compact : ""}`;
  const content = <NavigationRowContent item={item} />;
  const current =
    item.kind === "link" &&
    isCurrentPortfolioDestination(pathname, item.destination);
  if (current)
    return (
      <button type="button" className={className} disabled aria-current="page">
        {content}
      </button>
    );
  if (item.kind === "link")
    return (
      <Link
        className={className}
        href={portfolioDestinations[item.destination].href}
        prefetch={false}
        onNavigate={() => onNavigate?.(item.destination)}
      >
        {content}
      </Link>
    );
  if (item.kind === "disabled")
    return (
      <button type="button" className={className} disabled>
        {content}
      </button>
    );
  return (
    <span className={className} aria-disabled="true">
      {content}
    </span>
  );
}
