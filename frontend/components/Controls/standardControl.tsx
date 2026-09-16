import type { ReactElement, ReactNode } from "react";
import styles from "./standardControl.module.css";
import { controlAppearanceClassName } from "./controlAppearance";

import type { ControlVariant } from "./controlAppearance";
export type ButtonVariant = ControlVariant;
export type ButtonSize = "small" | "medium" | "large";

// Preserve the original single-slot API. Named slots also support the revised
// Figma matrix; never mix the two forms. A visible label remains required.
export type StandardIconProps =
  | {
      icon?: undefined;
      iconPosition?: never;
      leadingIcon?: ReactElement;
      trailingIcon?: ReactElement;
    }
  | {
      icon: ReactElement;
      iconPosition?: "leading" | "trailing";
      leadingIcon?: never;
      trailingIcon?: never;
    };

export function standardControlClassName(
  variant: ButtonVariant,
  className: string,
  size: ButtonSize = "small",
) {
  return `${styles.control} ${controlAppearanceClassName(variant)} ${styles[size]} ${className}`.trim();
}

export function StandardControlContent({
  children,
  icon,
  iconPosition = "leading",
  leadingIcon,
  trailingIcon,
  reservePending = false,
  pending = false,
}: {
  children: ReactNode;
  icon?: ReactElement;
  iconPosition?: "leading" | "trailing";
  leadingIcon?: ReactElement;
  trailingIcon?: ReactElement;
  reservePending?: boolean;
  pending?: boolean;
}) {
  const leading =
    leadingIcon ?? (iconPosition === "leading" ? icon : undefined);
  const trailing =
    trailingIcon ?? (iconPosition === "trailing" ? icon : undefined);
  const pendingPlacement = trailing || !leading ? "trailing" : "leading";
  const slot = (
    artwork: ReactElement | undefined,
    position: "leading" | "trailing",
  ) =>
    artwork || (reservePending && position === pendingPlacement) ? (
      <span className={styles.icon} aria-hidden="true" inert>
        {pending && position === pendingPlacement ? "…" : artwork}
      </span>
    ) : null;

  return (
    <>
      {slot(leading, "leading")}
      <span className={styles.label}>{children}</span>
      {slot(trailing, "trailing")}
    </>
  );
}
