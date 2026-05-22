"use client";

import Image from "next/image";
import { useState } from "react";

import { HomeConnectFeatured } from "@/components/home/HomeConnectFeatured";
import type { HomeConnectPlatform } from "@/lib/home-connect";

type HomeConnectBodyProps = {
  platforms: HomeConnectPlatform[];
};

export function HomeConnectBody({ platforms }: HomeConnectBodyProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <ul className="home-connect__icon-bar mt-10 list-none sm:mt-14 lg:mt-16">
        {platforms.map((platform, index) => (
          <li key={platform.id} className="min-w-0">
            <span
              className={
                index === activeIndex
                  ? "home-connect__icon-slot home-connect__icon-slot--active relative block w-full"
                  : "home-connect__icon-slot relative block w-full"
              }
              aria-label={platform.name}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <Image
                src={platform.iconSrc}
                alt=""
                fill
                sizes="(max-width: 640px) 11vw, 9vw"
                className="object-contain object-center"
              />
            </span>
          </li>
        ))}
      </ul>

      <div className="home-what-i-do__rule mt-10 sm:mt-14 lg:mt-16" aria-hidden />

      <HomeConnectFeatured
        platforms={platforms}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
      />
    </>
  );
}
