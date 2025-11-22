"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme, ThemeId, defaultThemeId, getTheme, themes } from "@/lib/themes";

type ThemeContextValue = {
  theme: Theme;
  themeId: ThemeId;
  cycleTheme: () => void;
  setThemeId: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "timersonly-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultThemeId);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored) {
      setThemeId(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  const cycleTheme = () => {
    const index = themes.findIndex((t) => t.id === themeId);
    const next = themes[(index + 1) % themes.length];
    setThemeId(next.id as ThemeId);
  };

  const theme = getTheme(themeId);

  const handleSetThemeId = (id: ThemeId) => {
    setThemeId(id);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeId, cycleTheme, setThemeId: handleSetThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

