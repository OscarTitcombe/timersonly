"use client";

import { useEffect } from "react";

type UseTimerHotkeysOptions = {
  onToggle?: () => void;
  onReset?: () => void;
  onSkip?: () => void;
  enabled?: boolean;
};

export function useTimerHotkeys({
  onToggle,
  onReset,
  onSkip,
  enabled = true,
}: UseTimerHotkeysOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Ignore if modifier keys are pressed (except for shortcuts that might use them)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
          if (onToggle) {
            e.preventDefault();
            onToggle();
          }
          break;
        case "r":
          if (onReset) {
            e.preventDefault();
            onReset();
          }
          break;
        case "n":
          if (onSkip) {
            e.preventDefault();
            onSkip();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggle, onReset, onSkip, enabled]);
}

