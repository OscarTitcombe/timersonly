"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PomodoroConfig,
  PomodoroPhase,
  defaultPomodoroConfig,
  getPhaseDurationSeconds,
} from "@/lib/pomodoro";
import { useTimer } from "@/components/useTimer";

export type PomodoroState = {
  phase: PomodoroPhase;
  completedFocusSessions: number;
  config: PomodoroConfig;
};

export type UsePomodoroResult = {
  state: PomodoroState;
  isRunning: boolean;
  remainingSeconds: number;
  durationSeconds: number;
  start: () => void;
  pause: () => void;
  resetPhase: () => void; // reset current phase to full duration
  skipPhase: () => void; // immediately jump to next phase
  setPhase: (phase: PomodoroPhase) => void; // manually set phase
  updateConfig: (partial: Partial<PomodoroConfig>) => void;
};

export function usePomodoro(): UsePomodoroResult {
  const [config, setConfig] = useState<PomodoroConfig>(defaultPomodoroConfig);
  const [phase, setPhase] = useState<PomodoroPhase>("focus");
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);

  const durationSeconds = getPhaseDurationSeconds(phase, config);

  const getNextPhase = useCallback(
    (currentPhase: PomodoroPhase, sessions: number): PomodoroPhase => {
      if (currentPhase === "focus") {
        // Check if we should do a long break
        if (sessions > 0 && sessions % config.longBreakInterval === 0) {
          return "longBreak";
        }
        return "shortBreak";
      }
      // After any break, go to focus
      return "focus";
    },
    [config.longBreakInterval]
  );

  const handlePhaseComplete = useCallback(() => {
    if (phase === "focus") {
      const newSessions = completedFocusSessions + 1;
      setCompletedFocusSessions(newSessions);
      const nextPhase = getNextPhase(phase, newSessions);
      setPhase(nextPhase);
    } else {
      // After break, go to focus
      setPhase("focus");
    }
  }, [phase, completedFocusSessions, getNextPhase]);

  const timer = useTimer({
    initialSeconds: durationSeconds,
    autoStart: false,
    onComplete: handlePhaseComplete,
  });

  // Update timer duration when phase or config changes
  useEffect(() => {
    const newDuration = getPhaseDurationSeconds(phase, config);
    timer.setDuration(newDuration);
    if (!timer.isRunning) {
      timer.reset(newDuration);
    }
  }, [phase, config, timer]);

  const resetPhase = useCallback(() => {
    const newDuration = getPhaseDurationSeconds(phase, config);
    timer.reset(newDuration);
  }, [phase, config, timer]);

  const skipPhase = useCallback(() => {
    let nextPhase: PomodoroPhase;
    let newSessions = completedFocusSessions;

    if (phase === "focus") {
      newSessions = completedFocusSessions + 1;
      setCompletedFocusSessions(newSessions);
      nextPhase = getNextPhase(phase, newSessions);
    } else {
      nextPhase = "focus";
    }

    setPhase(nextPhase);
    const newDuration = getPhaseDurationSeconds(nextPhase, config);
    timer.reset(newDuration);
  }, [phase, completedFocusSessions, config, getNextPhase, timer]);

  const setPhaseManually = useCallback(
    (newPhase: PomodoroPhase) => {
      setPhase(newPhase);
      const newDuration = getPhaseDurationSeconds(newPhase, config);
      timer.reset(newDuration);
      // Don't increment session count when manually changing phase
    },
    [config, timer]
  );

  const updateConfig = useCallback(
    (partial: Partial<PomodoroConfig>) => {
      setConfig((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  return {
    state: {
      phase,
      completedFocusSessions,
      config,
    },
    isRunning: timer.isRunning,
    remainingSeconds: timer.remainingSeconds,
    durationSeconds,
    start: timer.start,
    pause: timer.pause,
    resetPhase,
    skipPhase,
    setPhase: setPhaseManually,
    updateConfig,
  };
}

