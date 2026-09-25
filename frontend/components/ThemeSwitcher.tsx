"use client";

import { useEffect, useState } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import { THEME_METADATA, type Theme } from "@/domain/theme/Theme";
import Button from "./Controls/Button";
import styles from "./ThemeSwitcher.module.css";

export default function ThemeSwitcher({
  presentation = "default",
}: {
  presentation?: "default" | "outlined";
}) {
  const { themeService } = useServices();

  // Do not assume an initial theme for button highlight to avoid visual flip.
  // ThemeBootstrapScript applies the initial page appearance before hydration.
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

  useEffect(() => {
    return themeService.subscribe(({ selectedTheme }) => {
      setCurrentTheme(selectedTheme);
    });
  }, [themeService]);

  const selectTheme = (theme: Theme) => {
    themeService.setTheme(theme);
  };

  if (presentation === "outlined")
    return (
      <div className={styles.choices}>
        {THEME_METADATA.map((theme) => (
          <Button
            key={theme.value}
            variant="outlined"
            aria-pressed={currentTheme === theme.value}
            onClick={() => selectTheme(theme.value)}
          >
            {theme.label}
          </Button>
        ))}
      </div>
    );

  return (
    <div className="flex gap-fs-xs flex-wrap justify-center">
      {THEME_METADATA.map((theme) => (
        <button
          key={theme.value}
          type="button"
          aria-pressed={currentTheme === theme.value}
          onClick={() => selectTheme(theme.value)}
          className={`
            px-fs-md
            py-fs-xs
            rounded-lg 
            font-medium 
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fs-border-focus
            border ${
              currentTheme === theme.value
                ? "bg-fs-action-primary border-fs-action-primary text-fs-content-inverse"
                : "bg-transparent text-fs-action-primary border-fs-action-primary hover:bg-fs-action-hover hover:text-fs-content-inverse hover:border-fs-action-hover"
            }`}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}
