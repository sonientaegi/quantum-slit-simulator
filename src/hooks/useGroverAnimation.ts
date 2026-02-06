/**
 * Timer-based animation controller for auto-playing Grover iterations
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseGroverAnimationResult {
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setSpeed: (speed: number) => void;
}

export function useGroverAnimation(
  stepForward: () => void,
  maxSteps: number,
  currentStep: number
): UseGroverAnimationResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(500); // milliseconds per step

  // Auto-play with interval
  useEffect(() => {
    if (!isPlaying) return;

    // Auto-stop when reaching the end
    if (currentStep >= maxSteps - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalId = setInterval(() => {
      stepForward();
    }, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, speed, currentStep, maxSteps, stepForward]);

  // Auto-stop when reaching max steps
  useEffect(() => {
    if (currentStep >= maxSteps - 1) {
      setIsPlaying(false);
    }
  }, [currentStep, maxSteps]);

  const play = useCallback(() => {
    if (currentStep < maxSteps - 1) {
      setIsPlaying(true);
    }
  }, [currentStep, maxSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
  }, []);

  return {
    isPlaying,
    speed,
    play,
    pause,
    toggle,
    setSpeed,
  };
}
