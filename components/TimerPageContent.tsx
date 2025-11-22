"use client";

import { NumericTimer } from "@/components/NumericTimer";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { ThemePicker } from "@/components/ThemePicker";
import { useTheme } from "@/components/ThemeProvider";
import { TimerConfig, timerConfigs } from "@/lib/timerConfigs";
import Link from "next/link";

type TimerPageContentProps = {
  config: TimerConfig;
};

export function TimerPageContent({ config }: TimerPageContentProps) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight hover:opacity-70 transition-opacity"
            style={{ color: theme.text }}
          >
            TimersOnly
          </Link>
          <ThemePicker />
        </header>

        {/* Main content */}
        <main className="flex flex-1 flex-col items-center justify-center pt-16 pb-10">
          <div className="w-full max-w-2xl text-center space-y-8">
            <h1
              className="text-2xl font-semibold tracking-tight"
              style={{ color: theme.text }}
            >
              {config.label}
            </h1>

            {config.type === "simple" && (
              <NumericTimer defaultMinutes={config.minutes} />
            )}
            {config.type === "pomodoro" && (
              <PomodoroTimer defaultMinutes={config.minutes} />
            )}

            <div
              className="text-sm opacity-70 leading-relaxed pt-6"
              style={{ color: theme.text }}
            >
              {config.description}
            </div>

            {/* SEO Copy */}
            <div
              className="text-sm leading-relaxed space-y-3 pt-4"
              style={{ color: theme.text, opacity: 0.7 }}
            >
              <p>
                Use this free {config.label.toLowerCase()} to stay focused and
                organized. TimersOnly provides a clean, ad-free experience
                designed for productivity and calm work sessions.
              </p>
              <p>
                Start the timer with one click, switch themes instantly, and
                enjoy a minimalist layout that works beautifully on both mobile
                and desktop.
              </p>
            </div>

            {/* Quick links - show neighbors of same type */}
            {(() => {
              const sameTypeConfigs = timerConfigs.filter(
                (t) => t.type === config.type
              );
              const currentIndex = sameTypeConfigs.findIndex(
                (t) => t.slug === config.slug
              );
              const neighbors =
                currentIndex >= 0
                  ? sameTypeConfigs.slice(
                      Math.max(currentIndex - 3, 0),
                      currentIndex + 4
                    )
                  : timerConfigs.slice(0, 6);

              return (
                <div className="flex flex-wrap gap-3 justify-center pt-6">
                  {neighbors
                    .filter((t) => t.slug !== config.slug)
                    .map((t) => (
                      <Link
                        key={t.slug}
                        href={`/t/${t.slug}`}
                        className="px-3 py-1 rounded-full border text-xs hover:opacity-70 transition"
                        style={{
                          borderColor: theme.text + "20",
                          backgroundColor: theme.cardBg + "66",
                          color: theme.text,
                        }}
                      >
                        {t.label}
                      </Link>
                    ))}
                </div>
              );
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}

