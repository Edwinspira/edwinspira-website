"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";

import {
  CONNECT_MANUAL_FREEZE_MS,
  CONNECT_ROTATE_MS,
  type HomeConnectPlatform,
} from "@/lib/home-connect";

const SOCIAL_BORDER_SRC = "/images/social/SocialBorder.png";
const BUTTON_BORDER_SRC = "/images/social/ButtonIconTwo.png";

type HomeConnectFeaturedProps = {
  platforms: HomeConnectPlatform[];
  activeIndex: number;
  onActiveIndexChange: Dispatch<SetStateAction<number>>;
};

export function HomeConnectFeatured({
  platforms,
  activeIndex,
  onActiveIndexChange,
}: HomeConnectFeaturedProps) {
  const intervalRef = useRef<number | null>(null);
  const freezeTimeoutRef = useRef<number | null>(null);

  const active = platforms[activeIndex];

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

  if (!active) return null;

  return (
    <div
      className="home-connect__featured mt-10 min-w-0 sm:mt-14 lg:mt-16"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="home-connect__featured-carousel flex w-full items-center justify-start gap-2 sm:gap-3 lg:gap-4">
        <button
          type="button"
          onClick={goToPrevious}
          className="home-connect__nav-arrow shrink-0"
          aria-label="Previous social platform"
        >
          <span className="home-connect__nav-arrow-glyph" aria-hidden>
            &lt;
          </span>
        </button>

        <div className="home-connect__featured-visual w-[min(58vw,16.5rem)] shrink-0 sm:w-[min(50vw,19rem)] lg:w-[min(22rem,32vw)] xl:w-[min(24rem,28vw)]">
          <div className="relative aspect-[982/984] w-full">
            <Image
              src={SOCIAL_BORDER_SRC}
              alt=""
              fill
              sizes="(max-width: 1024px) 304px, 384px"
              className="pointer-events-none object-contain"
              priority
            />
            <div
              className="home-connect__icon-viewport absolute inset-[12%] flex items-center justify-center"
              aria-hidden
            >
              <div className="home-connect__icon-stage relative h-full w-full">
                <div
                  key={active.id}
                  className="home-connect__featured-icon home-connect__digital-icon-enter relative h-full w-full"
                >
                  <Image
                    src={active.iconSrc}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 192px, 240px"
                    className="home-connect__featured-icon-image relative z-[1] object-contain object-center"
                  />
                  <span
                    className="home-connect__digital-scanlines pointer-events-none absolute inset-0 z-[2]"
                    aria-hidden
                  />
                  <span
                    className="home-connect__digital-noise pointer-events-none absolute inset-0 z-[3]"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={goToNext}
          className="home-connect__nav-arrow shrink-0"
          aria-label="Next social platform"
        >
          <span className="home-connect__nav-arrow-glyph" aria-hidden>
            &gt;
          </span>
        </button>
      </div>

      <div className="home-connect__featured-copy min-w-0">
        <h3
          key={`${active.id}-name`}
          className="home-connect__featured-name font-mono text-2xl font-semibold tracking-[0.14em] text-foreground uppercase sm:text-3xl lg:text-2xl xl:text-3xl"
        >
          {active.name}
        </h3>
        <p
          key={`${active.id}-description`}
          className="home-connect__featured-description home-connect__digital-text-enter mx-auto mt-3 max-w-[22rem] font-mono text-xs leading-relaxed tracking-wide text-[var(--home-stat-red)] sm:mt-4 sm:max-w-[26rem] sm:text-sm lg:mx-0 lg:max-w-none lg:text-sm xl:text-base"
        >
          {active.description}
        </p>
      </div>

      <div
        key={`${active.id}-cta`}
        className="home-connect__establish-cta flex min-w-0 justify-center lg:justify-end"
      >
        <span className="home-connect__establish-button relative block w-full min-w-[13.5rem] max-w-[22rem] sm:min-w-[15rem] sm:max-w-[24rem] lg:min-w-[16.5rem] lg:max-w-[22rem] xl:min-w-[18rem] xl:max-w-[26rem]">
          <Image
            src={BUTTON_BORDER_SRC}
            alt=""
            width={732}
            height={103}
            className="h-auto w-full"
            sizes="(max-width: 640px) 216px, (max-width: 1024px) 264px, 416px"
          />
          <span className="absolute inset-0 flex items-center justify-center px-4 font-mono text-[0.62rem] tracking-[0.14em] whitespace-nowrap text-foreground uppercase sm:text-[0.7rem] sm:tracking-[0.18em] lg:text-[0.68rem] xl:text-[0.75rem]">
            ESTABLISH CONNECTION
          </span>
        </span>
      </div>
    </div>
  );
}
