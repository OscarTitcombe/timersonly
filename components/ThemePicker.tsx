"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { themes, ThemeId } from "@/lib/themes";

export function ThemePicker() {
  const { theme, themeId, setThemeId } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeSelect = (id: ThemeId) => {
    setThemeId(id);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Palette button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
        style={{ 
          color: theme.text,
          backgroundColor: isOpen ? theme.accent + "30" : theme.accent + "20",
        }}
        title="Choose theme"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute top-10 right-0 z-20 rounded-md border border-black/10 py-1.5 shadow-lg min-w-[140px]"
          style={{ backgroundColor: theme.cardBg }}
        >
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeSelect(t.id)}
              className="w-full px-3 py-2 flex items-center gap-2.5 text-sm transition-colors hover:opacity-80"
              style={{
                color: theme.text,
                backgroundColor: themeId === t.id ? theme.accent + "15" : "transparent",
              }}
            >
              {/* Color circle */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: t.accent,
                  border: themeId === t.id ? "1.5px solid white" : "none",
                  boxShadow: themeId === t.id ? "0 0 0 1px rgba(0,0,0,0.1)" : "none",
                }}
              />
              {/* Theme name */}
              <span className="font-medium">{t.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
