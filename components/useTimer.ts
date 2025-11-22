"use client";

import { useEffect, useRef, useState } from "react";

export type UseTimerOptions = {
  initialSeconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
};

export type UseTimerResult = {
  remainingSeconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (nextInitialSeconds?: number) => void;
  setDuration: (seconds: number) => void;
};

export function useTimer(options: UseTimerOptions): UseTimerResult {
  const { initialSeconds, autoStart = false, onComplete } = options;

  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  
  // Use refs to track timer state for accurate calculations
  const startTimeRef = useRef<number | null>(autoStart ? performance.now() : null);
  const pausedRemainingRef = useRef<number>(initialSeconds);
  const currentInitialSecondsRef = useRef<number>(initialSeconds);
  
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  // Update onComplete ref when it changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Update when initialSeconds changes externally
  useEffect(() => {
    currentInitialSecondsRef.current = initialSeconds;
    if (!isRunning) {
      pausedRemainingRef.current = initialSeconds;
      setRemainingSeconds(initialSeconds);
    }
  }, [initialSeconds, isRunning]);

  // Timer tick logic
  useEffect(() => {
    if (!isRunning || startTimeRef.current === null) {
      return;
    }

    const interval = setInterval(() => {
      const now = performance.now();
      if (startTimeRef.current === null) return;
      
      const elapsed = (now - startTimeRef.current) / 1000; // Convert to seconds
      const newRemaining = pausedRemainingRef.current - elapsed;

      if (newRemaining <= 0) {
        setRemainingSeconds(0);
        setIsRunning(false);
        startTimeRef.current = null;
        pausedRemainingRef.current = 0;
        if (!hasCompletedRef.current && onCompleteRef.current) {
          hasCompletedRef.current = true;
          onCompleteRef.current();
        }
      } else {
        setRemainingSeconds(newRemaining);
      }
    }, 200); // Update every 200ms for smooth display

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    if (isRunning) return;
    
    // Record the current remaining seconds and start time
    pausedRemainingRef.current = remainingSeconds;
    startTimeRef.current = performance.now();
    
    setIsRunning(true);
    hasCompletedRef.current = false;
  };

  const pause = () => {
    if (!isRunning || startTimeRef.current === null) return;
    
    // Calculate remaining time based on elapsed time
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    const newRemaining = pausedRemainingRef.current - elapsed;
    pausedRemainingRef.current = Math.max(0, newRemaining);
    
    setIsRunning(false);
    startTimeRef.current = null;
    setRemainingSeconds(pausedRemainingRef.current);
  };

  const reset = (nextInitialSeconds?: number) => {
    const newInitial = nextInitialSeconds ?? currentInitialSecondsRef.current;
    currentInitialSecondsRef.current = newInitial;
    pausedRemainingRef.current = newInitial;
    setRemainingSeconds(newInitial);
    setIsRunning(false);
    startTimeRef.current = null;
    hasCompletedRef.current = false;
  };

  const setDuration = (seconds: number) => {
    currentInitialSecondsRef.current = seconds;
    if (!isRunning) {
      pausedRemainingRef.current = seconds;
      setRemainingSeconds(seconds);
    }
  };

  return {
    remainingSeconds,
    isRunning,
    start,
    pause,
    reset,
    setDuration,
  };
}

