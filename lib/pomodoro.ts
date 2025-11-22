import { minutesToSeconds } from "./time";

export type PomodoroPhase = "focus" | "shortBreak" | "longBreak";

export type PomodoroConfig = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number; // after how many focus sessions we do a long break
};

export const defaultPomodoroConfig: PomodoroConfig = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

export function getPhaseDurationSeconds(
  phase: PomodoroPhase,
  config: PomodoroConfig
): number {
  switch (phase) {
    case "focus":
      return minutesToSeconds(config.focusMinutes);
    case "shortBreak":
      return minutesToSeconds(config.shortBreakMinutes);
    case "longBreak":
      return minutesToSeconds(config.longBreakMinutes);
  }
}
