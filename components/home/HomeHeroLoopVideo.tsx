"use client";

import { useEffect, useRef } from "react";

const CROSSFADE_MS = 1000;
/** Start decoding the standby clip this far before the fade begins. */
const PREPARE_LEAD_S = 1.75;
const FADE_LEAD_S = CROSSFADE_MS / 1000;

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

    primary.currentTime = 0;
    secondary.currentTime = 0;
    secondary.pause();
    void primary.play().catch(() => {});

    const clearFadeTimeout = () => {
      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
    };

    const prepareStandby = async () => {
      if (preparingRef.current || standbyReadyRef.current || crossfadingRef.current) {
        return;
      }

      preparingRef.current = true;
      const toIndex = activeIndexRef.current === 0 ? 1 : 0;
      const to = layers[toIndex];

      try {
        to.pause();
        to.style.transition = "none";
        to.style.opacity = "0";
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

      if (!standbyReadyRef.current) {
        await seekToStart(to);
      }
      if (cancelled) return;

      try {
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
      clearFadeTimeout();
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
        src={src}
        muted
        playsInline
        preload="auto"
        style={{ opacity: 0, zIndex: 1 }}
      />
    </div>
  );
}
