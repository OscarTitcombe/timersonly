"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { ThemePicker } from "@/components/ThemePicker";
import { NumericTimer } from "@/components/NumericTimer";
import { HourglassTimer } from "@/components/HourglassTimer";
import { TimerModeToggle, TimerMode } from "@/components/TimerModeToggle";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { useTimer } from "@/components/useTimer";
import { useTimerHotkeys } from "@/hooks/useTimerHotkeys";
import { useChime } from "@/hooks/useChime";
import { minutesToSeconds } from "@/lib/time";
import { darkenColor } from "@/lib/colorUtils";
import { useEffect, useRef } from "react";

type TimerKind = "simple" | "pomodoro";

export default function HomePage() {
  const { theme, cycleTheme } = useTheme();
  const [kind, setKind] = useState<TimerKind>("simple");
  const [mode, setMode] = useState<TimerMode>("hourglass");
  const [durationSeconds, setDurationSeconds] = useState(minutesToSeconds(25));
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { play: playChime } = useChime();
  const hasPlayedRef = useRef(false);
  const lastRemainingRef = useRef<number>(-1);

  // Shared timer state for simple mode
  const timer = useTimer({
    initialSeconds: durationSeconds,
    autoStart: false,
  });

  // Play chime when simple timer completes (only once per completion)
  useEffect(() => {
    if (kind !== "simple") return;

    // Reset flag when timer is reset
    if (timer.remainingSeconds === durationSeconds && durationSeconds > 0) {
      hasPlayedRef.current = false;
    }

    // Play sound when timer reaches 0 (only once)
    if (
      timer.remainingSeconds === 0 &&
      durationSeconds > 0 &&
      soundEnabled &&
      !hasPlayedRef.current &&
      lastRemainingRef.current > 0
    ) {
      hasPlayedRef.current = true;
      playChime();
    }

    lastRemainingRef.current = timer.remainingSeconds;
  }, [timer.remainingSeconds, durationSeconds, soundEnabled, kind, playChime]);

  // Keyboard shortcuts for simple timer
  useTimerHotkeys({
    onToggle: kind === "simple" ? () => {
      if (timer.isRunning) timer.pause();
      else timer.start();
    } : undefined,
    onReset: kind === "simple" ? () => timer.reset() : undefined,
    enabled: kind === "simple",
  });

  const handlePresetChange = (seconds: number) => {
    setDurationSeconds(seconds);
    timer.setDuration(seconds);
    timer.reset(seconds);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight" style={{ color: theme.text }}>
              TimersOnly
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Sound toggle */}
            {kind === "simple" && (
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                style={{ color: theme.text }}
                title={soundEnabled ? "Sound on" : "Sound off"}
              >
                {soundEnabled ? "🔔" : "🔕"}
              </button>
            )}
            {/* Kind toggle */}
            <div
              className="inline-flex rounded-lg p-1"
              style={{ 
                backgroundColor: theme.cardBg,
                boxShadow: `4px 4px 0 ${darkenColor(theme.cardBg, 25)}`,
              }}
            >
              <button
                onClick={() => setKind("simple")}
                className="px-3 py-1 text-sm font-medium rounded-md transition-all"
                style={{
                  backgroundColor: kind === "simple" ? theme.accent : "transparent",
                  color: kind === "simple" ? "#FFFFFF" : theme.text,
                }}
              >
                Simple
              </button>
              <button
                onClick={() => setKind("pomodoro")}
                className="px-3 py-1 text-sm font-medium rounded-md transition-all"
                style={{
                  backgroundColor: kind === "pomodoro" ? theme.accent : "transparent",
                  color: kind === "pomodoro" ? "#FFFFFF" : theme.text,
                }}
              >
                Pomodoro
              </button>
            </div>
            <ThemePicker />
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-1 flex-col items-center justify-center pb-10">
          {kind === "pomodoro" ? (
            <PomodoroTimer />
          ) : (
            <div className="w-full max-w-2xl">
              {/* Simple timer - numeric only, no hourglass */}
              <NumericTimer
                defaultMinutes={25}
                timer={timer}
                durationSeconds={durationSeconds}
                onPresetChange={handlePresetChange}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

