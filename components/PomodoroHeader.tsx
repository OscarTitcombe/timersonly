"use client";

import { PomodoroPhase } from "@/lib/pomodoro";
import { useTheme } from "./ThemeProvider";
import { darkenColor } from "@/lib/colorUtils";

type PomodoroHeaderProps = {
  phase: PomodoroPhase;
  onPhaseChange?: (phase: PomodoroPhase) => void;
  completedFocusSessions: number;
  longBreakInterval: number;
};

const phaseLabels: Record<PomodoroPhase, string> = {
  focus: "Pomodoro",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export function PomodoroHeader({
  phase,
  onPhaseChange,
  completedFocusSessions,
  longBreakInterval,
}: PomodoroHeaderProps) {
  const { theme } = useTheme();
  const phases: PomodoroPhase[] = ["focus", "shortBreak", "longBreak"];

  return (
    <div className="flex justify-center mb-8">
      <div
        className="inline-flex rounded-lg p-1"
        style={{ 
          backgroundColor: theme.cardBg,
          boxShadow: `4px 4px 0 ${darkenColor(theme.cardBg, 25)}`,
        }}
      >
        {phases.map((p) => (
          <button
            key={p}
            onClick={() => onPhaseChange?.(p)}
            disabled={!onPhaseChange}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              !onPhaseChange ? "cursor-default" : ""
            }`}
            style={{
              backgroundColor: phase === p ? theme.accent : "transparent",
              color: phase === p ? "#FFFFFF" : theme.text,
              opacity: !onPhaseChange && phase !== p ? 0.6 : 1,
            }}
          >
            {phaseLabels[p]}
          </button>
        ))}
      </div>
    </div>
  );
}
