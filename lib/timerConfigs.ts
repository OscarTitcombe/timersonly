export type TimerType = "simple" | "pomodoro";

export type TimerConfig = {
  slug: string;
  label: string;
  description: string;
  minutes: number;
  type: TimerType;
};

// Helper: pluralise minute/minutes
function pluraliseMinute(m: number): string {
  return m === 1 ? "minute" : "minutes";
}

// Helper: build description for simple timers based on duration
function buildSimpleDescription(minutes: number): string {
  const label = `${minutes} ${pluraliseMinute(minutes)}`;

  if (minutes <= 3) {
    return `A clean, minimalist ${label} timer for quick tasks, stretching, or tiny breaks.`;
  }

  if (minutes <= 15) {
    return `Use this distraction-free ${label} timer for study sprints, coffee breaks, or short focus sessions.`;
  }

  if (minutes <= 30) {
    return `A calm ${label} countdown timer ideal for deep work, reading, or productivity blocks.`;
  }

  if (minutes <= 60) {
    return `A minimalist ${label} timer for longer focus blocks, workouts, or cooking sessions.`;
  }

  return `A simple ${label} timer designed for long study sessions, workouts, or meditation.`;
}

// Simple timer durations
const simpleDurations: number[] = [
  // 1–15
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15,
  // 20–60
  20, 25, 30, 35, 40, 45, 50, 55, 60,
  // Longer
  75, 90, 120,
];

// Generator for simple minute-based timers
function buildSimpleTimerConfigs(): TimerConfig[] {
  return simpleDurations.map((minutes) => {
    const label = `${minutes} Minute Timer`;
    const slug = `${minutes}-minute-timer`;

    return {
      slug,
      label,
      description: buildSimpleDescription(minutes),
      minutes,
      type: "simple" as const,
    };
  });
}

// Pomodoro timer durations
const pomodoroDurations: number[] = [15, 20, 25, 30, 45];

// Generator for Pomodoro-style timers
function buildPomodoroTimerConfigs(): TimerConfig[] {
  return pomodoroDurations.map((minutes) => {
    const label = `${minutes} Minute Pomodoro Timer`;
    const slug = `${minutes}-minute-pomodoro-timer`;

    return {
      slug,
      label,
      description: `A clean Pomodoro timer with ${minutes}-minute focus intervals and gentle breaks.`,
      minutes,
      type: "pomodoro" as const,
    };
  });
}

// Special use-case timers
const specialConfigs: TimerConfig[] = [
  {
    slug: "study-timer",
    label: "Study Timer",
    description:
      "A minimalist study timer designed to keep you focused during revision, reading, and homework.",
    minutes: 50,
    type: "pomodoro",
  },
  {
    slug: "adhd-focus-timer",
    label: "ADHD Focus Timer",
    description:
      "A gentle focus timer with shorter intervals, ideal for ADHD brains that thrive on frequent resets.",
    minutes: 20,
    type: "pomodoro",
  },
  {
    slug: "workout-rest-timer",
    label: "Workout Rest Timer",
    description:
      "A clean, no-clutter timer for tracking rest periods between sets at the gym.",
    minutes: 2,
    type: "simple",
  },
  {
    slug: "meditation-timer",
    label: "Meditation Timer",
    description:
      "A calm, distraction-free meditation timer with a soft visual design and no ads.",
    minutes: 10,
    type: "simple",
  },
  {
    slug: "exam-timer",
    label: "Exam Timer",
    description:
      "A simple exam timer to keep you aware of the remaining time without adding stress or distractions.",
    minutes: 60,
    type: "simple",
  },
];

// Combine all timer configs
const simpleTimerConfigs = buildSimpleTimerConfigs();
const pomodoroTimerConfigs = buildPomodoroTimerConfigs();

export const timerConfigs: TimerConfig[] = [
  ...simpleTimerConfigs,
  ...pomodoroTimerConfigs,
  ...specialConfigs,
];

export function getTimerConfig(slug: string): TimerConfig | undefined {
  return timerConfigs.find((t) => t.slug === slug);
}
