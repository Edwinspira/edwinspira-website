"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { HomeHeroLoopVideo } from "@/components/home/HomeHeroLoopVideo";
import { HomeHeroMarks } from "@/components/home/HomeHeroMarks";
import {
  flagPendingHeroMode,
  getHeroModeForDate,
  HERO_BINARY_BANNER_SRC,
  heroProfileSrcForMode,
  heroVideoSrcForMode,
  msUntilNextHeroBoundary,
  resolveHeroModeForVisit,
  type HeroDayNightMode,
} from "@/lib/home-hero-day-night";

export function HomeHero() {
  const [mode, setMode] = useState<HeroDayNightMode | null>(null);
  const [preferStill, setPreferStill] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setPreferStill(true);
      setMode(resolveHeroModeForVisit());
      return;
    }

    const resolved = resolveHeroModeForVisit();
    setMode(resolved);

    let timeoutId: number | null = null;

    const armBoundaryTimer = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (document.visibilityState !== "visible") return;

      const delay = msUntilNextHeroBoundary();
      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        const nextMode = getHeroModeForDate();
        flagPendingHeroMode(nextMode);
        // Do not swap the playing video mid-session; apply on next visit.
        armBoundaryTimer();
      }, delay);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        armBoundaryTimer();
      } else if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    armBoundaryTimer();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const videoSrc = mode ? heroVideoSrcForMode(mode) : null;
  const profileSrc = mode ? heroProfileSrcForMode(mode) : null;

  return (
    <div className="home-hero pointer-events-none fixed inset-0 z-0" aria-hidden>
      {videoSrc ? (
        preferStill ? (
          <video
            className="home-hero-image absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <HomeHeroLoopVideo key={videoSrc} src={videoSrc} />
        )
      ) : null}

      <Image
        src={HERO_BINARY_BANNER_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="home-hero-image home-hero-binary object-cover"
      />

      {/* Black under the masked bust edge so it fades to black, not the video */}
      <div className="home-hero-profile-bottom-blend" />

      {profileSrc ? (
        <Image
          key={profileSrc}
          src={profileSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-hero-image home-hero-profile object-cover"
        />
      ) : null}

      <HomeHeroMarks />

      <div className="home-hero-vignette absolute inset-0" />
    </div>
  );
}
