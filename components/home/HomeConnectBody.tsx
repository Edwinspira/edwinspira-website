"use client";

import Image from "next/image";
import { useState } from "react";

import { CyberRuleEndcap } from "@/components/CyberDeco";
import { HomeConnectFeatured } from "@/components/home/HomeConnectFeatured";
import type { HomeConnectPlatform } from "@/lib/home-connect";
import { useConnectCarousel } from "@/lib/use-connect-carousel";

type HomeConnectBodyProps = {
  platforms: HomeConnectPlatform[];
};

export function HomeConnectBody({ platforms }: HomeConnectBodyProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { selectPlatform, goToPrevious, goToNext } = useConnectCarousel({
    platforms,
    onActiveIndexChange: setActiveIndex,
  });

  return (
    <>
      <ul className="home-connect__icon-bar mt-10 list-none sm:mt-14 lg:mt-16">
        {platforms.map((platform, index) => {
          const isActive = index === activeIndex;
          const slotClass = isActive
            ? "home-connect__icon-slot home-connect__icon-slot--active relative block w-full"
            : "home-connect__icon-slot relative block w-full";

          const icon = (
            <Image
              src={platform.iconSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 11vw, 9vw"
              className="object-contain object-center"
            />
          );

          return (
            <li key={platform.id} className="min-w-0">
              {platform.href ? (
                <a
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${slotClass} home-connect__icon-slot--link`}
                  aria-label={`Open ${platform.name} profile (opens in new tab)`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => selectPlatform(index)}
                >
                  {icon}
                </a>
              ) : (
                <button
                  type="button"
                  className={`${slotClass} home-connect__icon-slot--button`}
                  aria-label={`Show ${platform.name}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => selectPlatform(index)}
                >
                  {icon}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="home-section-rule mt-10 sm:mt-14 lg:mt-16" aria-hidden>
        <div className="home-section-rule__line" />
        <CyberRuleEndcap />
      </div>

      <HomeConnectFeatured
        platforms={platforms}
        activeIndex={activeIndex}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
      />
    </>
  );
}
