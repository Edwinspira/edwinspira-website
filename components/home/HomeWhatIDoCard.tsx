import Image from "next/image";
import type { CSSProperties } from "react";

import { CyberHudBracket } from "@/components/CyberDeco";
import type { HomeWhatIDoCard as HomeWhatIDoCardData } from "@/lib/home-what-i-do";

type HomeWhatIDoCardProps = {
  card: HomeWhatIDoCardData;
};

export function HomeWhatIDoCard({ card }: HomeWhatIDoCardProps) {
  const accentStyle = { "--card-accent": card.accent } as CSSProperties;

  return (
    <button
      type="button"
      className="home-what-i-do-card group relative w-full"
      style={accentStyle}
      aria-label={`${card.title} — ${card.subtitle}. ${card.description}`}
    >
      <div className="home-what-i-do-card__frame">
        <CyberHudBracket />
        <span className="home-what-i-do-card__glow" aria-hidden />
        <Image
          src={card.borderSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1280px) 50vw, 22vw"
          className="home-what-i-do-card__border object-fill"
        />
        <div className="home-what-i-do-card__content absolute inset-0 z-10 flex flex-col px-[10%] pb-[12%] pt-[14%] sm:px-[12%] sm:pb-[14%] sm:pt-[16%]">
          <span
            className="relative mx-auto mb-3 block h-12 w-12 shrink-0 sm:mb-6 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
            aria-hidden
          >
            <Image
              src={card.iconSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 48px, (max-width: 1024px) 80px, 96px"
              className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
            />
          </span>
          <span className="text-[0.5rem] font-semibold leading-tight tracking-[0.08em] text-foreground uppercase sm:text-sm lg:text-base">
            {card.title}
          </span>
          <span
            className="mt-1 font-mono text-[0.5rem] tracking-wide sm:mt-2 sm:text-xs lg:text-sm"
            style={{ color: card.accent }}
          >
            {card.subtitle}
          </span>
          <span className="mt-2 text-[0.5rem] leading-snug text-foreground/75 sm:mt-6 sm:text-xs sm:leading-relaxed lg:text-sm">
            {card.description}
          </span>
        </div>
      </div>
    </button>
  );
}
