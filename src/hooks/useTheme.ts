import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("app-theme") as Theme;
      if (savedTheme) return savedTheme;
      if (document.documentElement.classList.contains("dark")) return "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("app-theme", theme);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const handleThemeSync = (e: any) => {
      if (e.detail !== theme) {
        setTheme(e.detail);
      }
    };
    window.addEventListener('theme-change', handleThemeSync);
    return () => window.removeEventListener('theme-change', handleThemeSync);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};
