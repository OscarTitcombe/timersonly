"use client";

import { formatSeconds } from "@/lib/time";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useTheme } from "./ThemeProvider";
import { PomodoroHeader } from "./PomodoroHeader";
import { PomodoroSettings } from "./PomodoroSettings";
import { useTimerHotkeys } from "@/hooks/useTimerHotkeys";
import { useChime } from "@/hooks/useChime";
import { useState, useEffect, useRef } from "react";

export function PomodoroTimer() {
  const { theme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { play: playChime } = useChime();
  const hasPlayedRef = useRef(false);
  const lastRemainingRef = useRef<number>(-1);
  const timerRef = useRef<HTMLDivElement>(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const {
    state,
    isRunning,
    remainingSeconds,
    durationSeconds,
    start,
    pause,
    resetPhase,
    skipPhase,
    setPhase,
    updateConfig,
  } = usePomodoro();

  // Measure timer width and set progress bar width
  useEffect(() => {
    if (timerRef.current) {
      setProgressBarWidth(timerRef.current.offsetWidth);
    }
  }, [remainingSeconds]);

  // Play chime when timer completes (only once per completion)
  useEffect(() => {
    // Reset flag when timer is reset or phase changes
    if (remainingSeconds === durationSeconds && durationSeconds > 0) {
      hasPlayedRef.current = false;
    }

    // Play sound when timer reaches 0 (only once)
    if (
      remainingSeconds === 0 &&
      durationSeconds > 0 &&
      soundEnabled &&
      !hasPlayedRef.current &&
      lastRemainingRef.current > 0
    ) {
      hasPlayedRef.current = true;
      playChime();
    }

    lastRemainingRef.current = remainingSeconds;
  }, [remainingSeconds, durationSeconds, soundEnabled, playChime]);

  // Keyboard shortcuts
  useTimerHotkeys({
    onToggle: () => {
      if (isRunning) pause();
      else start();
    },
    onReset: resetPhase,
    onSkip: skipPhase,
  });

  const handleToggle = () => {
    if (isRunning) pause();
    else start();
  };

  // Calculate session info
  const currentSession = state.completedFocusSessions + 1;
  const totalSessions = state.config.longBreakInterval;
  const sessionDots = Array.from({ length: totalSessions }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Phase selector */}
      <PomodoroHeader
        phase={state.phase}
        onPhaseChange={setPhase}
        completedFocusSessions={state.completedFocusSessions}
        longBreakInterval={state.config.longBreakInterval}
      />

      {/* Large timer display */}
      <div
        ref={timerRef}
        className="text-9xl font-bold tabular-nums mb-4 inline-block"
        style={{ color: theme.text }}
      >
        {formatSeconds(remainingSeconds)}
      </div>

      {/* Progress bar - matches timer width */}
      <div className="mb-8" style={{ width: progressBarWidth || "auto", minWidth: "200px" }}>
        <div
          className="h-1 rounded-full transition-all duration-200"
          style={{
            backgroundColor: theme.accent,
            width: `${durationSeconds > 0 ? (remainingSeconds / durationSeconds) * 100 : 100}%`,
          }}
        />
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {/* Reset button */}
        <button
          onClick={resetPhase}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ color: theme.text }}
          title="Reset (R)"
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
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>

        {/* Start/Pause button */}
        <button
          onClick={handleToggle}
          className="px-8 py-3 rounded-lg font-semibold text-sm shadow-md transition-all hover:shadow-lg"
          style={{
            backgroundColor: theme.accent,
            color: "#FFFFFF",
          }}
        >
          <div className="flex items-center gap-2">
            {isRunning ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>START</span>
              </>
            )}
          </div>
        </button>

        {/* Settings button */}
        <PomodoroSettings config={state.config} onChange={updateConfig} />
      </div>

      {/* Session indicator */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium" style={{ color: theme.text }}>
          Session {currentSession} of {totalSessions}
        </p>
        <div className="flex items-center gap-2">
          {sessionDots.map((session) => (
            <div
              key={session}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor:
                  session <= currentSession ? theme.accent : theme.cardBg,
                opacity: session <= currentSession ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
