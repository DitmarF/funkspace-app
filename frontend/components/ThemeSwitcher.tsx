"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "default" | "dark" | "muted" | "dark-high-contrast" | "system";

const isTheme = (value: string | null): value is Theme => {
  return (
    value === "default" ||
    value === "dark" ||
    value === "muted" ||
    value === "dark-high-contrast" ||
    value === "system"
  );
};

export default function ThemeSwitcher() {
  // Do not assume an initial theme for button highlight to avoid visual flip.
  // The page theme itself is applied by the inline script in layout.tsx.
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const resolveSystemTheme = useCallback((): Theme => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "default";
  }, []);

  const setTheme = useCallback(
    (theme: Theme) => {
      const htmlElement = document.documentElement;

      if (theme === "system") {
        const systemTheme = resolveSystemTheme();
        if (systemTheme === "default") {
          htmlElement.removeAttribute("data-theme");
        } else {
          htmlElement.setAttribute("data-theme", systemTheme);
        }
      } else if (theme === "default") {
        htmlElement.removeAttribute("data-theme");
      } else {
        htmlElement.setAttribute("data-theme", theme);
      }

      localStorage.setItem("theme", theme);
      setCurrentTheme(theme);
    },
    [resolveSystemTheme],
  );

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setIsMounted(true);

    const storedTheme = localStorage.getItem("theme");
    const initialTheme: Theme = isTheme(storedTheme) ? storedTheme : "system";

    if (!isTheme(storedTheme)) {
      localStorage.setItem("theme", "system");
    }

    setCurrentTheme(initialTheme);
    setTheme(initialTheme);

    const mediaQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    const handleSystemChange = () => {
      if (localStorage.getItem("theme") === "system") {
        setTheme("system");
      }
    };

    if (mediaQuery && typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemChange);
    } else if (mediaQuery && typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery && typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleSystemChange);
      } else if (
        mediaQuery &&
        typeof mediaQuery.removeListener === "function"
      ) {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, [setTheme]);

  const themes: { value: Theme; label: string }[] = [
    { value: "system", label: "System" },
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
                ? "bg-fs-action-primary border-fs-action-primary text-fs-black"
                : "bg-transparent text-fs-action-primary border-fs-action-primary hover:bg-fs-action-hover hover:text-fs-black hover:border-fs-action-hover"
            }`}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}
