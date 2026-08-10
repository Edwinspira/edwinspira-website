"use client";

import { useEffect, useRef } from "react";

const PLAY_RETRY_MS = 300;
const PLAY_RETRY_MAX = 60;

type HomeHeroLoopVideoProps = {
  src: string;
};

function armMutedInline(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "true");
}

/**
 * Single looping hero video. Loop seam is handled in the source files
 * (matching end/start frames); no JS crossfade.
 */
export function HomeHeroLoopVideo({ src }: HomeHeroLoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let playRetryId: number | null = null;
    let playAttempts = 0;

    armMutedInline(video);

    const clearPlayRetry = () => {
      if (playRetryId !== null) {
        window.clearTimeout(playRetryId);
        playRetryId = null;
      }
    };

    const ensurePlaying = async () => {
      if (cancelled) return;
      if (!video.paused && !video.ended) {
        clearPlayRetry();
        return;
      }

      try {
        armMutedInline(video);
        await video.play();
        clearPlayRetry();
      } catch {
        if (cancelled || playAttempts >= PLAY_RETRY_MAX) return;
        playAttempts += 1;
        clearPlayRetry();
        playRetryId = window.setTimeout(() => {
          playRetryId = null;
          void ensurePlaying();
        }, PLAY_RETRY_MS);
      }
    };

    void ensurePlaying();

    const onVisibility = () => {
      if (document.visibilityState === "visible") void ensurePlaying();
    };

    const unlockEvents = ["touchstart", "pointerdown", "click"] as const;
    const onUserGesture = () => {
      void ensurePlaying();
    };

    document.addEventListener("visibilitychange", onVisibility);
    for (const eventName of unlockEvents) {
      window.addEventListener(eventName, onUserGesture, {
        passive: true,
        once: true,
      });
    }

    return () => {
      cancelled = true;
      clearPlayRetry();
      document.removeEventListener("visibilitychange", onVisibility);
      for (const eventName of unlockEvents) {
        window.removeEventListener(eventName, onUserGesture);
      }
      video.pause();
    };
  }, [src]);

  return (
    <div className="home-hero-loop absolute inset-0">
      <video
        ref={videoRef}
        className="home-hero-image absolute inset-0 h-full w-full object-cover"
        src={src}
        muted
        playsInline
        loop
        autoPlay
        preload="auto"
      />
    </div>
  );
}
