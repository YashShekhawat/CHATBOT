"use client";

import * as React from "react";
import { type ThemeProviderProps } from "next-themes/dist/types";

type Theme = "dark" | "light" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light" | null;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light" | null>(null);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let currentResolvedTheme: "dark" | "light";
    if (theme === "system") {
      currentResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      currentResolvedTheme = theme;
    }

    root.classList.add(currentResolvedTheme);
    localStorage.setItem(storageKey, theme);
    setResolvedTheme(currentResolvedTheme);
  }, [theme, storageKey]);

  React.useEffect(() => {
    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? "dark" : "light");
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      };
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
  }, [theme]);


  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = React.useMemo(() => ({ theme, setTheme, resolvedTheme }), [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}