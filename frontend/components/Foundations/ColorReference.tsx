"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { colors } from "@funkspace/common/tokens/colors";
import { useServices } from "@/application/providers/ServiceProvider";
import type { ResolvedTheme } from "@/domain/theme/Theme";
import styles from "./ColorReference.module.css";

type SemanticName = keyof typeof colors.default.semantic;
type PrimitiveName = keyof typeof colors.default.primitive;
type ColorVariables = CSSProperties & Record<`--fs-color-${string}`, string>;

const themeLabels: Record<ResolvedTheme, string> = {
  default: "Light",
  dark: "Dark",
  muted: "Muted",
  "dark-high-contrast": "High contrast",
};
const hues: PrimitiveName[] = [
  "red",
  "vermilion",
  "orange",
  "amber",
  "yellow",
  "chartreuse",
  "green",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "magenta",
];
const roles: Record<SemanticName, string> = {
  "surface-background": "Page canvas",
  "surface-elevation-1": "First surface level",
  "surface-elevation-2": "Second surface level",
  "surface-overlay": "Overlay surface",
  "content-primary": "Primary text and icons",
  "content-inverse": "Inverse text and icons",
  "content-elevation-1": "First content level",
  "content-elevation-2": "Second content level",
  "content-disabled": "Unavailable content",
  "action-primary": "Primary action",
  "action-hover": "Ordinary action hover",
  "action-hover-large": "Standard hover with large labels (24px+)",
  "action-link": "Link accent",
  "action-disabled": "Unavailable action",
  "feedback-success": "Success signal",
  "feedback-warning": "Warning signal",
  "feedback-error": "Error signal",
  "feedback-info": "Information signal",
  "border-subtle": "Subtle boundary",
  "border-strong": "Strong boundary",
  "border-focus": "Keyboard focus",
};
const groups = [
  ["surface", "Surfaces"],
  ["content", "Content"],
  ["action", "Actions"],
  ["feedback", "Feedback"],
  ["border", "Borders"],
] as const;

function Swatch({
  name,
  value,
  description,
  matches,
}: {
  name: string;
  value: string;
  description?: string;
  matches?: string[];
}) {
  return (
    <li className={styles.card} data-color-token={name}>
      <span
        className={styles.swatch}
        aria-hidden="true"
        style={{ backgroundColor: `var(--fs-color-${name})` }}
      />
      <div className={styles.details}>
        <strong>{name}</strong>
        <code data-color-value>{value.toUpperCase()}</code>
        {description ? <p>{description}</p> : null}
        <code className={styles.variable}>--fs-color-{name}</code>
        {matches ? (
          <p className={styles.match}>
            {matches.length
              ? `Same value as: ${matches.join(", ")}`
              : "Distinct semantic value"}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function Palette({ theme }: { theme: ResolvedTheme }) {
  const primitive = colors[theme].primitive;
  const neutral = (Object.keys(primitive) as PrimitiveName[]).filter(
    (name) => !hues.includes(name),
  );
  return (
    <>
      {(
        [
          ["Chromatic palette", hues],
          ["Neutral palette", neutral],
        ] as const
      ).map(([title, names]) => (
        <section key={title} aria-label={title} className={styles.section}>
          <h2>{title}</h2>
          <ul className={styles.grid}>
            {names.map((name) => (
              <Swatch key={name} name={name} value={primitive[name]} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function Semantic({ theme }: { theme: ResolvedTheme }) {
  const { primitive, semantic } = colors[theme];
  return (
    <>
      <p>
        Use semantic roles in components. Matching palette values below are
        comparisons, not source aliases.
      </p>
      {groups.map(([prefix, label]) => (
        <section key={prefix} aria-label={label} className={styles.section}>
          <h2>{label}</h2>
          <ul className={styles.grid}>
            {(Object.keys(semantic) as SemanticName[])
              .filter((name) => name.startsWith(`${prefix}-`))
              .map((name) => (
                <Swatch
                  key={name}
                  name={name}
                  value={semantic[name]}
                  description={roles[name]}
                  matches={Object.entries(primitive)
                    .filter(([, value]) => value === semantic[name])
                    .map(([name]) => name)}
                />
              ))}
          </ul>
        </section>
      ))}
      <p>
        Foreground/background pairings follow the accepted component contracts;
        these swatches document individual values.
      </p>
    </>
  );
}

// Explicit values isolate all four comparison panels, including light inside
// a dark/system preview. They are read from existing generated output.
function themeVariables(theme: ResolvedTheme): ColorVariables {
  return Object.fromEntries(
    [
      ...Object.entries(colors[theme].primitive),
      ...Object.entries(colors[theme].semantic),
    ].map(([name, value]) => [`--fs-color-${name}`, value]),
  );
}

export function ColorReference({
  view = "palette",
}: {
  view?: "palette" | "semantic" | "comparison";
}) {
  const { themeService } = useServices();
  const [theme, setTheme] = useState<ResolvedTheme | null>(null);
  useEffect(
    () => themeService.subscribe((state) => setTheme(state.resolvedTheme)),
    [themeService],
  );
  if (!theme) return <p>Loading color reference…</p>;

  return (
    <main className={styles.reference} data-resolved-theme={theme}>
      <header className={styles.header}>
        <div>
          <h1>
            {view === "palette"
              ? "Color palettes"
              : view === "semantic"
                ? "Semantic colors"
                : "Theme comparison"}
          </h1>
          <p>
            {view === "comparison"
              ? "All four palettes, shown together."
              : "Use the Storybook theme toolbar to explore each palette."}
          </p>
        </div>
        <span className={styles.themeLabel}>
          Current theme: {themeLabels[theme]}
        </span>
      </header>
      {view === "palette" ? (
        <Palette theme={theme} />
      ) : view === "semantic" ? (
        <Semantic theme={theme} />
      ) : (
        <div className={styles.comparison}>
          {(Object.keys(themeLabels) as ResolvedTheme[]).map((mode) => (
            <section
              key={mode}
              className={styles.themePanel}
              aria-label={themeLabels[mode]}
              style={themeVariables(mode)}
            >
              <h2>{themeLabels[mode]}</h2>
              <h3>Palette</h3>
              <ul className={styles.compactGrid}>
                {Object.entries(colors[mode].primitive).map(([name, value]) => (
                  <Swatch key={name} name={name} value={value} />
                ))}
              </ul>
              <h3>Semantic roles</h3>
              <ul className={styles.compactGrid}>
                {Object.entries(colors[mode].semantic).map(([name, value]) => (
                  <Swatch key={name} name={name} value={value} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
