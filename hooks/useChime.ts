"use client";

import { useRef, useCallback } from "react";

export function useChime() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/chime.mp3");
      audioRef.current.volume = 0.3; // Keep it subtle
    }
    audioRef.current.play().catch((err) => {
      // Ignore errors (e.g., user hasn't interacted with page yet)
      console.debug("Could not play chime:", err);
    });
  }, []);

  return { play };
}

