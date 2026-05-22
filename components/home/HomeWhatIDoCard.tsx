import Image from "next/image";
import type { CSSProperties } from "react";

import { ArtHudCardBorder } from "@/components/home/ArtHudCardBorder";
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
        {card.borderVariant === "hud" ? (
          <span className="home-what-i-do-card__border home-what-i-do-card__border--hud" aria-hidden>
            <ArtHudCardBorder accent={card.accent} />
          </span>
        ) : (
          <>
            <CyberHudBracket />
            <Image
              src={card.borderSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 46vw, (max-width: 1280px) 50vw, 22vw"
              className="home-what-i-do-card__border object-fill"
            />
          </>
        )}
        <span className="home-what-i-do-card__glow" aria-hidden />
        <div className="home-what-i-do-card__content absolute inset-0 z-10 flex flex-col">
          <span className="home-what-i-do-card__icon relative mx-auto block shrink-0" aria-hidden>
            <Image
              src={card.iconSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 64px, (max-width: 1024px) 96px, 120px"
              className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
            />
          </span>
          <span className="home-what-i-do-card__title font-semibold tracking-[0.08em] text-foreground uppercase">
            {card.title}
          </span>
          <span
            className="home-what-i-do-card__subtitle font-mono tracking-wide"
            style={{ color: card.accent }}
          >
            {card.subtitle}
          </span>
          <span className="home-what-i-do-card__description leading-snug text-foreground/75">
            {card.description}
          </span>
        </div>
      </div>
    </button>
  );
}
