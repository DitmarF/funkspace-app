import styles from "./controlAppearance.module.css";

export type ControlVariant =
  | "primary"
  | "secondary"
  | "outlined"
  | "accent-outlined";

// Paint variables and keyboard focus only; each family owns its geometry.
export function controlAppearanceClassName(variant: ControlVariant) {
  return `${styles.focus} ${styles[variant]}`;
}
