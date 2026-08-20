"use client";

import { useEffect, useState } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import { THEME_METADATA, type Theme } from "@/domain/theme/Theme";

export default function ThemeSwitcher() {
  const { themeService } = useServices();

  // Do not assume an initial theme for button highlight to avoid visual flip.
  // The page theme itself is applied by the inline script in layout.tsx.
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

  useEffect(() => {
    return themeService.subscribe(({ selectedTheme }) => {
      setCurrentTheme(selectedTheme);
    });
  }, [themeService]);

  const selectTheme = (theme: Theme) => {
    themeService.setTheme(theme);
  };

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {THEME_METADATA.map((theme) => (
        <button
          key={theme.value}
          type="button"
          aria-pressed={currentTheme === theme.value}
          onClick={() => selectTheme(theme.value)}
          className={`
            px-4 
            py-2 
            rounded-lg 
            font-medium 
            transition-colors 
            border ${
              currentTheme === theme.value
                ? "bg-fs-action-primary border-fs-action-primary text-fs-white"
                : "bg-transparent text-fs-action-primary border-fs-action-primary hover:bg-fs-action-hover hover:text-fs-white hover:border-fs-action-hover"
            }`}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}
