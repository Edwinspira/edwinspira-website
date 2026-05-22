"use client";

import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";

import {
  CONNECT_MANUAL_FREEZE_MS,
  CONNECT_ROTATE_MS,
  type HomeConnectPlatform,
} from "@/lib/home-connect";

type UseConnectCarouselOptions = {
  platforms: HomeConnectPlatform[];
  onActiveIndexChange: Dispatch<SetStateAction<number>>;
};

export function useConnectCarousel({
  platforms,
  onActiveIndexChange,
}: UseConnectCarouselOptions) {
  const intervalRef = useRef<number | null>(null);
  const freezeTimeoutRef = useRef<number | null>(null);

  const clearRotation = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearFreeze = useCallback(() => {
    if (freezeTimeoutRef.current !== null) {
      window.clearTimeout(freezeTimeoutRef.current);
      freezeTimeoutRef.current = null;
    }
  }, []);

  const startRotation = useCallback(() => {
    clearRotation();
    if (platforms.length <= 1) return;

    intervalRef.current = window.setInterval(() => {
      onActiveIndexChange((current) => (current + 1) % platforms.length);
    }, CONNECT_ROTATE_MS);
  }, [clearRotation, onActiveIndexChange, platforms.length]);

  const freezeThenResume = useCallback(() => {
    clearRotation();
    clearFreeze();
    freezeTimeoutRef.current = window.setTimeout(() => {
      startRotation();
    }, CONNECT_MANUAL_FREEZE_MS);
  }, [clearFreeze, clearRotation, startRotation]);

  const selectPlatform = useCallback(
    (index: number) => {
      onActiveIndexChange(index);
      freezeThenResume();
    },
    [freezeThenResume, onActiveIndexChange],
  );

  const goToPrevious = useCallback(() => {
    onActiveIndexChange(
      (current) => (current - 1 + platforms.length) % platforms.length,
    );
    freezeThenResume();
  }, [freezeThenResume, onActiveIndexChange, platforms.length]);

  const goToNext = useCallback(() => {
    onActiveIndexChange((current) => (current + 1) % platforms.length);
    freezeThenResume();
  }, [freezeThenResume, onActiveIndexChange, platforms.length]);

  useEffect(() => {
    startRotation();
    return () => {
      clearRotation();
      clearFreeze();
    };
  }, [clearFreeze, clearRotation, startRotation]);

  return { selectPlatform, goToPrevious, goToNext };
}
