"use client";

import { useEffect, useState } from "react";

type Theme = "default" | "dark" | "muted" | "dark-high-contrast";

export default function ThemeSwitcher() {
  // Initialize state by reading from localStorage or document, default to "dark"
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("theme") as Theme | null;
    // Return saved theme if it exists (including "default" if user chose it)
    if (saved) return saved;
    const current = document.documentElement.getAttribute(
      "data-theme",
    ) as Theme | null;
    if (current) return current;
    return "dark";
  };

  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Sync theme on mount - read from localStorage or default to "dark"
    // Only migrate empty/null values to "dark" (not "default" - respect user choice)
    let savedTheme = localStorage.getItem("theme") as Theme | null;
    if (!savedTheme) {
      savedTheme = "dark";
      localStorage.setItem("theme", "dark");
    }
    setTheme(savedTheme);
  }, []);

  const setTheme = (theme: Theme) => {
    const htmlElement = document.documentElement;

    if (theme === "default") {
      htmlElement.removeAttribute("data-theme");
    } else {
      htmlElement.setAttribute("data-theme", theme);
    }

    localStorage.setItem("theme", theme);
    setCurrentTheme(theme);
  };

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
