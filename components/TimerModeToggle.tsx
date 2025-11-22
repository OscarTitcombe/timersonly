"use client";

import { useTheme } from "./ThemeProvider";

export type TimerMode = "hourglass" | "numeric";

type TimerModeToggleProps = {
  mode: TimerMode;
  onChange: (m: TimerMode) => void;
};

export function TimerModeToggle({ mode, onChange }: TimerModeToggleProps) {
  const { theme } = useTheme();

  return (
    <div
      className="inline-flex rounded-full border border-black/5 p-1 shadow-sm backdrop-blur"
      style={{ backgroundColor: theme.cardBg + "80" }}
    >
      <button
        onClick={() => onChange("hourglass")}
        className="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
        style={{
          backgroundColor: mode === "hourglass" ? theme.accent : "transparent",
          color: mode === "hourglass" ? "#FFFFFF" : theme.text,
        }}
      >
        Hourglass
      </button>
      <button
        onClick={() => onChange("numeric")}
        className="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
        style={{
          backgroundColor: mode === "numeric" ? theme.accent : "transparent",
          color: mode === "numeric" ? "#FFFFFF" : theme.text,
        }}
      >
        Digits
      </button>
    </div>
  );
}

