/**
 * Theme domain entity
 * Pure domain model with no framework dependencies
 */

export type Theme =
  | "default"
  | "dark"
  | "muted"
  | "dark-high-contrast"
  | "system";

/**
 * Validates if a string is a valid theme value
 */
export function isTheme(value: string | null): value is Theme {
  return (
    value === "default" ||
    value === "dark" ||
    value === "muted" ||
    value === "dark-high-contrast" ||
    value === "system"
  );
}

/**
 * Resolved theme (system theme resolved to actual theme)
 */
export type ResolvedTheme = Exclude<Theme, "system">;

/**
 * Theme metadata for UI display
 */
export interface ThemeMetadata {
  value: Theme;
  label: string;
}

/**
 * Default theme metadata list
 */
export const THEME_METADATA: ThemeMetadata[] = [
  { value: "system", label: "System" },
  { value: "default", label: "Default" },
  { value: "dark", label: "Dark" },
  { value: "muted", label: "Muted" },
  { value: "dark-high-contrast", label: "High Contrast" },
];
