"use client";

import { formatSeconds, minutesToSeconds } from "@/lib/time";
import { useTimer, UseTimerResult } from "./useTimer";
import { useTheme } from "./ThemeProvider";
import { Hourglass } from "./Hourglass";

type HourglassTimerProps = {
  defaultMinutes?: number;
  // Optional: if provided, use external timer state instead of creating own
  timer?: UseTimerResult;
  durationSeconds?: number;
};

export function HourglassTimer({
  defaultMinutes = 25,
  timer: externalTimer,
  durationSeconds: externalDurationSeconds,
}: HourglassTimerProps) {
  const { theme } = useTheme();
  const internalDurationSeconds = minutesToSeconds(defaultMinutes);
  const durationSeconds = externalDurationSeconds ?? internalDurationSeconds;

  // Use external timer if provided, otherwise create internal one
  const internalTimer = useTimer({
    initialSeconds: internalDurationSeconds,
    autoStart: false,
  });
  const timer = externalTimer ?? internalTimer;

  const { remainingSeconds, isRunning, start, pause, reset } = timer;

  // Calculate progress (0 = not started, 1 = complete)
  // Use the initial duration from the timer's current state
  // When reset, we need to track the initial duration
  const currentInitial = externalDurationSeconds ?? internalDurationSeconds;
  const progress = currentInitial > 0 
    ? Math.max(0, Math.min(1, 1 - remainingSeconds / currentInitial))
    : 0;

  const handleToggle = () => {
    if (isRunning) pause();
    else start();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Hourglass SVG */}
      <div className="flex items-center justify-center">
        <Hourglass
          progress={progress}
          size={180}
          sandColor={theme.accent}
          glassColor={theme.text}
        />
      </div>

      {/* Big time display */}
      <div
        className="text-5xl font-medium tabular-nums sm:text-6xl md:text-7xl"
        style={{ color: theme.text }}
      >
        {formatSeconds(remainingSeconds)}
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-3">
        {/* Start/Pause button */}
        <button
          onClick={handleToggle}
          className="rounded-full border border-black/10 bg-white/80 px-6 py-2.5 text-sm font-medium shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md"
          style={{
            backgroundColor: isRunning ? theme.accent : "rgba(255, 255, 255, 0.8)",
            color: isRunning ? "#FFFFFF" : theme.text,
            borderColor: isRunning ? theme.accent : "rgba(0, 0, 0, 0.1)",
          }}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="rounded-full border border-black/10 bg-white/80 px-6 py-2.5 text-sm font-medium shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md"
          style={{ color: theme.text }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

