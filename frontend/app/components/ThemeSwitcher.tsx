"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "default" | "dark" | "muted" | "dark-high-contrast";

export default function ThemeSwitcher() {
  // Do not assume an initial theme for button highlight to avoid visual flip.
  // The page theme itself is applied by the inline script in layout.tsx.
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const setTheme = useCallback((theme: Theme) => {
    const htmlElement = document.documentElement;

    if (theme === "default") {
      htmlElement.removeAttribute("data-theme");
    } else {
      htmlElement.setAttribute("data-theme", theme);
    }

    localStorage.setItem("theme", theme);
    setCurrentTheme(theme);
  }, []);

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setIsMounted(true);

    // Read the current theme from the document element (set by layout script)
    // This ensures we sync with what the script already applied
    const currentDataTheme = document.documentElement.getAttribute(
      "data-theme",
    ) as Theme | null;
    
    // Read from localStorage
    let savedTheme = localStorage.getItem("theme") as Theme | null;
    const hasMigrated = localStorage.getItem("theme-migrated");
    
    // Migrate if needed
    if (!savedTheme) {
      savedTheme = "dark";
      localStorage.setItem("theme", "dark");
      localStorage.setItem("theme-migrated", "true");
    } else if (!hasMigrated && savedTheme === "default") {
      // One-time migration from "default" to "dark"
      savedTheme = "dark";
      localStorage.setItem("theme", "dark");
      localStorage.setItem("theme-migrated", "true");
    }
    
    // If script already set a theme, sync with it (don't reapply)
    if (currentDataTheme && currentDataTheme === savedTheme) {
      setCurrentTheme(savedTheme);
      return;
    }
    
    // If script set a theme but localStorage is different, use script's value
    // (script ran first and applied migration)
    if (currentDataTheme && currentDataTheme !== savedTheme) {
      setCurrentTheme(currentDataTheme);
      localStorage.setItem("theme", currentDataTheme);
      return;
    }
    
    // Otherwise, apply the theme from localStorage
    setTheme(savedTheme);
  }, [setTheme]);

  const themes: { value: Theme; label: string }[] = [
    { value: "default", label: "Default" },
    { value: "dark", label: "Dark" },
    { value: "muted", label: "Muted" },
    { value: "dark-high-contrast", label: "High Contrast" },
  ];

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {themes.map((theme) => (
        <button
          key={theme.value}
          onClick={() => setTheme(theme.value)}
          className={`
            px-4 
            py-2 
            rounded-lg 
            font-medium 
            transition-colors 
            border ${
              isMounted && currentTheme === theme.value
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
