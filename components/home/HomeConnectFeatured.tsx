"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  CONNECT_ROTATE_MS,
  type HomeConnectPlatform,
} from "@/lib/home-connect";

const SOCIAL_BORDER_SRC = "/images/social/SocialBorder.png";

type HomeConnectFeaturedProps = {
  platforms: HomeConnectPlatform[];
};

export function HomeConnectFeatured({ platforms }: HomeConnectFeaturedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = platforms[activeIndex];

  useEffect(() => {
    if (platforms.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % platforms.length);
    }, CONNECT_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [platforms.length]);

  if (!active) return null;

  return (
    <div className="home-connect__featured mt-10 flex flex-col gap-8 sm:mt-14 lg:mt-16 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
      <div className="home-connect__featured-visual mx-auto w-full max-w-[17rem] shrink-0 sm:max-w-[20rem] lg:mx-0 lg:max-w-[22rem] xl:max-w-[26rem]">
        <div className="relative aspect-[982/984] w-full">
          <Image
            src={SOCIAL_BORDER_SRC}
            alt=""
            fill
            sizes="(max-width: 640px) 272px, (max-width: 1024px) 320px, 416px"
            className="pointer-events-none object-contain"
            priority
          />
          <div
            className="absolute inset-[12%] flex items-center justify-center"
            aria-hidden
          >
            <div className="home-connect__featured-icon relative h-full w-full">
              <Image
                key={active.id}
                src={active.iconSrc}
                alt=""
                fill
                sizes="(max-width: 640px) 208px, (max-width: 1024px) 248px, 300px"
                className="home-connect__featured-icon-image object-contain object-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="home-connect__featured-copy flex min-w-0 flex-1 flex-col justify-center text-center lg:text-left"
        aria-live="polite"
        aria-atomic="true"
      >
        <h3
          key={`${active.id}-name`}
          className="home-connect__featured-name font-mono text-2xl font-semibold tracking-[0.14em] text-foreground uppercase sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
        >
          {active.name}
        </h3>
        <p
          key={`${active.id}-description`}
          className="home-connect__featured-description mt-4 max-w-xl font-mono text-xs leading-relaxed tracking-wide text-foreground/70 sm:mt-5 sm:text-sm lg:mx-0 lg:mt-6 lg:text-base"
        >
          {active.description}
        </p>
      </div>
    </div>
  );
}
