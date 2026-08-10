"use client";

import { useEffect, useRef } from "react";

const CROSSFADE_MS = 1000;
/** Desktop: start decoding the standby clip this far before the fade. */
const PREPARE_LEAD_S = 1.75;
/**
 * Mobile timeupdate is sparse and decode is slower — prepare earlier so the
 * seamless crossfade is ready before the clip ends.
 */
const PREPARE_LEAD_MOBILE_S = 3.25;
const FADE_LEAD_S = CROSSFADE_MS / 1000;
const PLAY_RETRY_MS = 300;
const PLAY_RETRY_MAX = 60;

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

    if (video.currentTime < 0.001) {
      video.currentTime = 0.001;
    }
    video.currentTime = 0;

    window.setTimeout(finish, 350);
  });
}

function waitUntilCanPlay(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
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
    window.setTimeout(finish, 4000);
  });
}

function armMutedInline(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "true");
}

function isCoarsePointer(): boolean {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/**
 * Seamless visual loop via dual-element crossfade.
 * Native `loop` hard-cuts; this overlaps ending frames into a fresh start.
 *
 * The incoming clip stays opacity 0 until a decoded frame is painted, then
 * fades in over a still-fully-opaque outgoing clip (avoids black page flash).
 * Standby stays unloaded until near loop end so cold mobile autoplay can start.
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
    const prepareLeadS = isCoarsePointer() ? PREPARE_LEAD_MOBILE_S : PREPARE_LEAD_S;
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

    armMutedInline(primary);
    armMutedInline(secondary);
    // Keep standby cold until near the loop end — critical for mobile first play.
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
      if (!primary.paused && !primary.ended) {
        clearPlayRetry();
        return;
      }

      try {
        armMutedInline(primary);
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

    void ensurePrimaryPlaying();

    const onVisibility = () => {
      if (document.visibilityState === "visible") void ensurePrimaryPlaying();
    };

    const unlockEvents = ["touchstart", "pointerdown", "click"] as const;
    const onUserGesture = () => {
      void ensurePrimaryPlaying();
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
      armMutedInline(secondary);
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

      let played = false;
      try {
        armMutedInline(to);
        await to.play();
        played = true;
      } catch {
        // Fall through — may still paint a seeked frame.
      }
      if (cancelled) return;

      if (played || to.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        await waitForPaintedFrame(to);
        if (cancelled) return;

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
        return;
      }

      // Last resort on constrained mobile decoders: hard restart active clip.
      try {
        await seekToStart(from);
        armMutedInline(from);
        await from.play();
      } catch {
        // Ignore — retry path on next visibility/gesture via primary only.
      }
      to.style.opacity = "0";
      from.style.opacity = "1";
      from.style.zIndex = "2";
      crossfadingRef.current = false;
    };

    const onTimeUpdate = (event: Event) => {
      if (crossfadingRef.current) return;
      const video = event.currentTarget as HTMLVideoElement;
      if (video !== layers[activeIndexRef.current]) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const remaining = video.duration - video.currentTime;

      if (remaining <= prepareLeadS) {
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
