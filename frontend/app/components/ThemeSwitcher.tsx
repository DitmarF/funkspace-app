"use client";

import { useEffect, useState } from "react";

type Theme = "default" | "dark" | "muted" | "dark-high-contrast";

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");

  useEffect(() => {
    // Get theme from localStorage or default to "default"
    const savedTheme = (localStorage.getItem("theme") as Theme) || "default";
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

