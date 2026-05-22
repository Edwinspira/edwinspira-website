"use client";

import Image from "next/image";

import { CyberSignalBridge } from "@/components/CyberDeco";
import type { HomeConnectPlatform } from "@/lib/home-connect";

const SOCIAL_BORDER_SRC = "/images/social/SocialBorder.png";
const BUTTON_BORDER_SRC = "/images/social/ButtonIconTwo.png";

type HomeConnectFeaturedProps = {
  platforms: HomeConnectPlatform[];
  activeIndex: number;
  goToPrevious: () => void;
  goToNext: () => void;
};

function FeaturedVisual({
  active,
}: {
  active: HomeConnectPlatform;
}) {
  const inner = (
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
        key={`${active.id}-viewport`}
        className="home-connect__icon-viewport home-connect__icon-viewport--glitch absolute inset-[12%] flex items-center justify-center"
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
              className="home-connect__glitch-chroma home-connect__glitch-chroma--r pointer-events-none absolute inset-0 z-[2]"
              aria-hidden
            />
            <span
              className="home-connect__glitch-chroma home-connect__glitch-chroma--b pointer-events-none absolute inset-0 z-[2]"
              aria-hidden
            />
            <span
              className="home-connect__glitch-slices pointer-events-none absolute inset-0 z-[3]"
              aria-hidden
            />
            <span
              className="home-connect__digital-scanlines pointer-events-none absolute inset-0 z-[4]"
              aria-hidden
            />
            <span
              className="home-connect__digital-noise pointer-events-none absolute inset-0 z-[5]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (active.href) {
    return (
      <a
        href={active.href}
        target="_blank"
        rel="noopener noreferrer"
        className="home-connect__featured-link relative block w-full"
        aria-label={`Open ${active.name} profile (opens in new tab)`}
      >
        {inner}
      </a>
    );
  }

  return <div className="relative w-full">{inner}</div>;
}

export function HomeConnectFeatured({
  platforms,
  activeIndex,
  goToPrevious,
  goToNext,
}: HomeConnectFeaturedProps) {
  const active = platforms[activeIndex];

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
          <FeaturedVisual active={active} />
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

      <CyberSignalBridge
        key={`${active.id}-bridge`}
        className="home-connect__signal-bridge"
      />

      <div
        key={`${active.id}-cta`}
        className="home-connect__establish-cta flex min-w-0 justify-center lg:justify-end"
      >
        {active.href ? (
          <a
            href={active.href}
            target="_blank"
            rel="noopener noreferrer"
            className="home-connect__establish-button relative block w-full min-w-[13.5rem] max-w-[22rem] sm:min-w-[15rem] sm:max-w-[24rem] lg:min-w-[16.5rem] lg:max-w-[22rem] xl:min-w-[18rem] xl:max-w-[26rem]"
            aria-label={`Open ${active.name} profile (opens in new tab)`}
          >
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
          </a>
        ) : (
          <span
            className="home-connect__establish-button home-connect__establish-button--inactive relative block w-full min-w-[13.5rem] max-w-[22rem] cursor-not-allowed opacity-60 sm:min-w-[15rem] sm:max-w-[24rem] lg:min-w-[16.5rem] lg:max-w-[22rem] xl:min-w-[18rem] xl:max-w-[26rem]"
            aria-disabled
          >
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
        )}
      </div>
    </div>
  );
}
