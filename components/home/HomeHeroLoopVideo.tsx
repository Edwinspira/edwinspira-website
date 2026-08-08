"use client";

import { useEffect, useRef } from "react";

const CROSSFADE_MS = 1000;
/** Start decoding the standby clip this far before the fade begins. */
const PREPARE_LEAD_S = 1.75;
const FADE_LEAD_S = CROSSFADE_MS / 1000;
/** Retry muted autoplay while the first frame is still buffering on mobile. */
const PLAY_RETRY_MS = 400;
const PLAY_RETRY_MAX = 40;

type HomeHeroLoopVideoProps = {
  src: string;
};

function waitForPaintedFrame(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    const rvfc = (
      video as HTMLVideoElement & {
        requestVideoFrameCallback?: (
          cb: (now: number, meta: unknown) => void,
        ) => number;
      }
    ).requestVideoFrameCallback;

    if (typeof rvfc === "function") {
      rvfc.call(video, () => resolve());
      return;
    }

    // Double rAF: after play(), one frame is usually committed by the second.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function seekToStart(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("seeked", finish);
      resolve();
    };

    video.addEventListener("seeked", finish);

    // Force a seek even when already at 0 so `seeked` fires and a frame decodes.
    if (video.currentTime < 0.001) {
      video.currentTime = 0.001;
    }
    video.currentTime = 0;

    window.setTimeout(finish, 250);
  });
}

function waitUntilCanPlay(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("canplay", finish);
      video.removeEventListener("loadeddata", finish);
      resolve();
    };

    video.addEventListener("canplay", finish);
    video.addEventListener("loadeddata", finish);

    // Some WebKit builds stall event delivery after a cold cache miss.
    window.setTimeout(finish, 8000);
  });
}

/**
 * Seamless visual loop via dual-element crossfade.
 * Native `loop` hard-cuts; this overlaps ending frames into a fresh start.
 *
 * The incoming clip stays opacity 0 until a decoded frame is painted, then
 * fades in over a still-fully-opaque outgoing clip (avoids black page flash).
 */
export function HomeHeroLoopVideo({ src }: HomeHeroLoopVideoProps) {
  const primaryRef = useRef<HTMLVideoElement>(null);
  const secondaryRef = useRef<HTMLVideoElement>(null);
  const activeIndexRef = useRef<0 | 1>(0);
  const crossfadingRef = useRef(false);
  const standbyReadyRef = useRef(false);
  const preparingRef = useRef(false);
  const fadeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    if (!primary || !secondary) return;

    const layers = [primary, secondary] as const;
    let cancelled = false;
    let playRetryId: number | null = null;
    let playAttempts = 0;

    activeIndexRef.current = 0;
    crossfadingRef.current = false;
    standbyReadyRef.current = false;
    preparingRef.current = false;

    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    primary.style.transition = "none";
    secondary.style.transition = "none";
    primary.style.opacity = "1";
    primary.style.zIndex = "2";
    secondary.style.opacity = "0";
    secondary.style.zIndex = "1";
    void primary.offsetHeight;
    primary.style.transition = "";
    secondary.style.transition = "";

    // Standby stays cold until near loop end so the primary can buffer first.
    secondary.preload = "none";
    secondary.removeAttribute("src");
    secondary.load();

    const clearPlayRetry = () => {
      if (playRetryId !== null) {
        window.clearTimeout(playRetryId);
        playRetryId = null;
      }
    };

    const ensurePrimaryPlaying = async () => {
      if (cancelled) return;
      if (!primary.paused && !primary.ended && primary.currentTime > 0) {
        clearPlayRetry();
        return;
      }

      try {
        await waitUntilCanPlay(primary);
        if (cancelled) return;
        if (primary.currentTime > 0.05 && !primary.paused) return;

        primary.muted = true;
        await primary.play();
        clearPlayRetry();
      } catch {
        if (cancelled || playAttempts >= PLAY_RETRY_MAX) return;
        playAttempts += 1;
        clearPlayRetry();
        playRetryId = window.setTimeout(() => {
          playRetryId = null;
          void ensurePrimaryPlaying();
        }, PLAY_RETRY_MS);
      }
    };

    const kickPlayback = () => {
      void ensurePrimaryPlaying();
    };

    // Seek only after metadata exists — setting currentTime too early fails on WebKit.
    const bootPrimary = async () => {
      try {
        if (primary.readyState < HTMLMediaElement.HAVE_METADATA) {
          await new Promise<void>((resolve) => {
            const onMeta = () => {
              primary.removeEventListener("loadedmetadata", onMeta);
              resolve();
            };
            primary.addEventListener("loadedmetadata", onMeta);
            window.setTimeout(() => {
              primary.removeEventListener("loadedmetadata", onMeta);
              resolve();
            }, 8000);
          });
        }
        if (cancelled) return;
        await seekToStart(primary);
      } catch {
        // Ignore seek failures; play retry still runs.
      }
      kickPlayback();
    };

    void bootPrimary();

    const onVisibility = () => {
      if (document.visibilityState === "visible") kickPlayback();
    };

    // First-tap / scroll often unlocks muted autoplay after a cold load.
    const unlockEvents = ["touchstart", "pointerdown", "click"] as const;
    const onUserGesture = () => {
      kickPlayback();
    };

    document.addEventListener("visibilitychange", onVisibility);
    for (const eventName of unlockEvents) {
      window.addEventListener(eventName, onUserGesture, {
        passive: true,
        once: true,
      });
    }

    const clearFadeTimeout = () => {
      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
    };

    const ensureStandbySrc = () => {
      if (secondary.getAttribute("src") === src) return;
      secondary.preload = "auto";
      secondary.src = src;
      secondary.load();
    };

    const prepareStandby = async () => {
      if (preparingRef.current || standbyReadyRef.current || crossfadingRef.current) {
        return;
      }

      preparingRef.current = true;
      const toIndex = activeIndexRef.current === 0 ? 1 : 0;
      const to = layers[toIndex];

      try {
        ensureStandbySrc();
        to.pause();
        to.style.transition = "none";
        to.style.opacity = "0";
        await waitUntilCanPlay(to);
        if (cancelled) return;
        await seekToStart(to);
        if (!cancelled) standbyReadyRef.current = true;
      } finally {
        preparingRef.current = false;
      }
    };

    const beginCrossfade = async () => {
      if (crossfadingRef.current || cancelled) return;
      crossfadingRef.current = true;

      const from = layers[activeIndexRef.current];
      const toIndex = activeIndexRef.current === 0 ? 1 : 0;
      const to = layers[toIndex];

      if (!Number.isFinite(from.duration) || from.duration <= 0) {
        crossfadingRef.current = false;
        return;
      }

      from.style.zIndex = "1";
      from.style.opacity = "1";
      to.style.zIndex = "2";
      to.style.transition = "none";
      to.style.opacity = "0";

      ensureStandbySrc();

      if (!standbyReadyRef.current) {
        await waitUntilCanPlay(to);
        if (cancelled) return;
        await seekToStart(to);
      }
      if (cancelled) return;

      try {
        to.muted = true;
        await to.play();
      } catch {
        // Autoplay can fail; still attempt the frame wait below.
      }
      if (cancelled) return;

      await waitForPaintedFrame(to);
      if (cancelled) return;

      // Frame is on screen at opacity 0 — now fade in over the opaque outgoing.
      void to.offsetHeight;
      to.style.transition = "";
      to.style.opacity = "1";

      clearFadeTimeout();
      fadeTimeoutRef.current = window.setTimeout(() => {
        fadeTimeoutRef.current = null;
        from.pause();
        from.currentTime = 0;
        from.style.transition = "none";
        from.style.opacity = "0";
        void from.offsetHeight;
        from.style.transition = "";

        standbyReadyRef.current = false;
        activeIndexRef.current = toIndex;
        crossfadingRef.current = false;
      }, CROSSFADE_MS);
    };

    const onTimeUpdate = (event: Event) => {
      if (crossfadingRef.current) return;
      const video = event.currentTarget as HTMLVideoElement;
      if (video !== layers[activeIndexRef.current]) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const remaining = video.duration - video.currentTime;

      if (remaining <= PREPARE_LEAD_S) {
        void prepareStandby();
      }

      if (remaining <= FADE_LEAD_S) {
        void beginCrossfade();
      }
    };

    const onEnded = (event: Event) => {
      const video = event.currentTarget as HTMLVideoElement;
      if (video !== layers[activeIndexRef.current]) return;
      void beginCrossfade();
    };

    for (const video of layers) {
      video.addEventListener("timeupdate", onTimeUpdate);
      video.addEventListener("ended", onEnded);
    }

    return () => {
      cancelled = true;
      clearPlayRetry();
      clearFadeTimeout();
      document.removeEventListener("visibilitychange", onVisibility);
      for (const eventName of unlockEvents) {
        window.removeEventListener(eventName, onUserGesture);
      }
      for (const video of layers) {
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.removeEventListener("ended", onEnded);
        video.pause();
      }
    };
  }, [src]);

  return (
    <div className="home-hero-loop absolute inset-0">
      <video
        ref={primaryRef}
        className="home-hero-image home-hero-loop-video absolute inset-0 h-full w-full object-cover"
        src={src}
        muted
        playsInline
        preload="auto"
        autoPlay
        style={{ opacity: 1, zIndex: 2 }}
      />
      <video
        ref={secondaryRef}
        className="home-hero-image home-hero-loop-video absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="none"
        style={{ opacity: 0, zIndex: 1 }}
      />
    </div>
  );
}
