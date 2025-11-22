"use client";

import { useState } from "react";
import { PomodoroConfig } from "@/lib/pomodoro";
import { useTheme } from "./ThemeProvider";
import { darkenColor } from "@/lib/colorUtils";

type PomodoroSettingsProps = {
  config: PomodoroConfig;
  onChange: (partial: Partial<PomodoroConfig>) => void;
};

export function PomodoroSettings({ config, onChange }: PomodoroSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const handleChange = (key: keyof PomodoroConfig, value: number) => {
    onChange({ [key]: value });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
        style={{ color: theme.text }}
        title="Settings"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Settings panel */}
          <div
            className="absolute top-12 right-0 z-20 rounded-lg border border-black/10 p-4"
            style={{ 
              backgroundColor: theme.cardBg,
              boxShadow: `5px 5px 0 ${darkenColor(theme.cardBg, 25)}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-medium" style={{ color: theme.text }}>
                  Focus
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.focusMinutes}
                  onChange={(e) =>
                    handleChange("focusMinutes", parseInt(e.target.value) || 1)
                  }
                  className="w-16 rounded border border-black/10 bg-white/80 px-2 py-1 text-xs text-center"
                  style={{ color: theme.text }}
                />
                <span className="text-xs opacity-60">min</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-medium" style={{ color: theme.text }}>
                  Short Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.shortBreakMinutes}
                  onChange={(e) =>
                    handleChange("shortBreakMinutes", parseInt(e.target.value) || 1)
                  }
                  className="w-16 rounded border border-black/10 bg-white/80 px-2 py-1 text-xs text-center"
                  style={{ color: theme.text }}
                />
                <span className="text-xs opacity-60">min</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-medium" style={{ color: theme.text }}>
                  Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.longBreakMinutes}
                  onChange={(e) =>
                    handleChange("longBreakMinutes", parseInt(e.target.value) || 1)
                  }
                  className="w-16 rounded border border-black/10 bg-white/80 px-2 py-1 text-xs text-center"
                  style={{ color: theme.text }}
                />
                <span className="text-xs opacity-60">min</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-medium" style={{ color: theme.text }}>
                  Long Break After
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={config.longBreakInterval}
                  onChange={(e) =>
                    handleChange("longBreakInterval", parseInt(e.target.value) || 2)
                  }
                  className="w-16 rounded border border-black/10 bg-white/80 px-2 py-1 text-xs text-center"
                  style={{ color: theme.text }}
                />
                <span className="text-xs opacity-60">sessions</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

