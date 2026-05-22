import Image from "next/image";

import { CyberBorder } from "@/components/CyberBorder";
import { HomeConnectFeatured } from "@/components/home/HomeConnectFeatured";
import { HOME_CONNECT_PLATFORMS } from "@/lib/home-connect";

export function HomeConnect() {
  return (
    <section
      className="home-connect relative z-10 w-full bg-black"
      aria-labelledby="connect-heading"
    >
      <div className="home-section-pad w-full px-[var(--home-pad)]">
        <CyberBorder className="w-full">
          <div className="flex flex-wrap items-end gap-4 sm:gap-6">
            <h2
              id="connect-heading"
              className="font-mono text-lg tracking-[0.2em] text-foreground uppercase sm:text-xl lg:text-2xl"
            >
              {"// CONNECT"}
            </h2>
            <span className="ml-auto shrink-0 font-mono text-xs tracking-[0.2em] text-muted uppercase sm:text-sm">
              LEVEL : 03
            </span>
          </div>

          <div className="home-what-i-do__rule mt-6 sm:mt-8" aria-hidden />

          <ul className="home-connect__icon-bar mt-10 list-none sm:mt-14 lg:mt-16">
            {HOME_CONNECT_PLATFORMS.map((platform) => (
              <li key={platform.id} className="min-w-0">
                <span
                  className="home-connect__icon-slot relative block w-full"
                  aria-label={platform.name}
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

          <HomeConnectFeatured platforms={HOME_CONNECT_PLATFORMS} />
        </CyberBorder>
      </div>
    </section>
  );
}
