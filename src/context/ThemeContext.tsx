"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Por defecto modo claro para una experiencia luminosa de cristal líquido
    const savedTheme = (localStorage.getItem("despacho_theme") as Theme) || "light";
    setThemeState(savedTheme);
    applyThemeClass(savedTheme);
    setMounted(true);
  }, []);

  function applyThemeClass(t: Theme) {
    const root = document.documentElement;
    if (t === "light") {
      root.classList.remove("dark");
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-light");
      root.classList.add("dark");
    }
  }

  function toggleTheme() {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    localStorage.setItem("despacho_theme", newTheme);
    applyThemeClass(newTheme);
  }

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("despacho_theme", t);
    applyThemeClass(t);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
