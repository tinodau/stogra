/**
 * useTheme Hook
 * Manages theme switching between light, dark, and system
 */

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

const THEME_KEY = "stogra-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme;
    return saved || "system";
  });
  const [isDark, setIsDark] = useState(false);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDarkMode =
      theme === "dark" || (theme === "system" && systemDark);

    setIsDark(isDarkMode);

    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        setIsDark(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const setLight = useCallback(() => {
    setTheme("light");
    localStorage.setItem(THEME_KEY, "light");
  }, []);

  const setDark = useCallback(() => {
    setTheme("dark");
    localStorage.setItem(THEME_KEY, "dark");
  }, []);

  const setSystem = useCallback(() => {
    setTheme("system");
    localStorage.setItem(THEME_KEY, "system");
  }, []);

  const toggle = useCallback(() => {
    if (theme === "dark") {
      setLight();
    } else {
      setDark();
    }
  }, [theme, setLight, setDark]);

  return {
    theme,
    isDark,
    setLight,
    setDark,
    setSystem,
    toggle,
  };
}
