"use client";

import { formatSeconds, minutesToSeconds } from "@/lib/time";
import { useTimer, UseTimerResult } from "./useTimer";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

type NumericTimerProps = {
  defaultMinutes?: number;
  timer?: UseTimerResult;
  durationSeconds?: number;
  onPresetChange?: (seconds: number) => void;
};

export function NumericTimer({
  defaultMinutes = 25,
  timer: externalTimer,
  durationSeconds: externalDurationSeconds,
  onPresetChange,
}: NumericTimerProps) {
  const internalDurationSeconds = minutesToSeconds(defaultMinutes);
  const durationSeconds = externalDurationSeconds ?? internalDurationSeconds;
  const [localDurationSeconds, setLocalDurationSeconds] = useState(durationSeconds);
  
  const { theme } = useTheme();

  // Use external timer if provided, otherwise create internal one
  const internalTimer = useTimer({
    initialSeconds: internalDurationSeconds,
    autoStart: false,
  });
  const timer = externalTimer ?? internalTimer;

  const { remainingSeconds, isRunning, start, pause, reset, setDuration } = timer;
  const timerRef = useRef<HTMLDivElement>(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // Measure timer width and set progress bar width
  useEffect(() => {
    if (timerRef.current) {
      setProgressBarWidth(timerRef.current.offsetWidth);
    }
  }, [remainingSeconds]);

  const handlePreset = (minutes: number) => {
    const seconds = minutesToSeconds(minutes);
    setLocalDurationSeconds(seconds);
    reset(seconds);
    setDuration(seconds);
    onPresetChange?.(seconds);
  };

  const handleToggle = () => {
    if (isRunning) pause();
    else start();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center">
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
      <div className="flex items-center justify-center gap-4 mb-8">
        {/* Reset button */}
        <button
          onClick={handleReset}
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
      </div>

      {/* Preset buttons - optional, smaller */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[5, 10, 25, 50].map((minutes) => (
          <button
            key={minutes}
            onClick={() => handlePreset(minutes)}
            className="px-3 py-1 text-xs font-medium rounded-md transition-opacity hover:opacity-70"
            style={{
              color: theme.text,
              opacity: localDurationSeconds === minutesToSeconds(minutes) ? 1 : 0.5,
            }}
          >
            {minutes} min
          </button>
        ))}
      </div>
    </div>
  );
}
