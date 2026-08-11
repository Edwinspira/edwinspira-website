import Image from "next/image";
import type { CSSProperties } from "react";

import { ArtHudCardBorder } from "@/components/home/ArtHudCardBorder";
import type { ExpandOrigin } from "@/components/home/home-what-i-do-expand";
import { HomeWhatIDoSkillIcon } from "@/components/home/HomeWhatIDoSkillIcon";
import { CyberHudBracket } from "@/components/CyberDeco";
import type { HomeWhatIDoCard as HomeWhatIDoCardData } from "@/lib/home-what-i-do";

type HomeWhatIDoCardProps = {
  card: HomeWhatIDoCardData;
  /** Non-interactive clone for glitch layers (Codrops-style). */
  decorative?: boolean;
  expanded?: boolean;
  onExpand?: (origin: ExpandOrigin) => void;
};

export function HomeWhatIDoCard({
  card,
  decorative = false,
  expanded = false,
  onExpand,
}: HomeWhatIDoCardProps) {
  const accentStyle = { "--card-accent": card.accent } as CSSProperties;

  const frame = (
    <div className="home-what-i-do-card__frame">
      <span className="home-what-i-do-card__bg" data-expand-bg aria-hidden />
      {card.borderVariant === "hud" ? (
        <span className="home-what-i-do-card__border home-what-i-do-card__border--hud" aria-hidden>
          <ArtHudCardBorder accent={card.accent} />
        </span>
      ) : (
        <>
          {!decorative ? <CyberHudBracket /> : null}
          <Image
            src={card.borderSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 18vw"
            className="home-what-i-do-card__border object-fill"
          />
        </>
      )}
      <span className="home-what-i-do-card__glow" aria-hidden />
      <div className="home-what-i-do-card__content absolute inset-0 z-10 flex flex-col">
        <span
          className="home-what-i-do-card__icon relative mx-auto block shrink-0"
          data-expand-img
          aria-hidden
        >
          <HomeWhatIDoSkillIcon
            id={card.id}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </span>
        <span className="home-what-i-do-card__title home-role-label font-semibold text-foreground">
          {card.title}
        </span>
        <span
          className="home-what-i-do-card__subtitle font-mono tracking-wide"
          style={{ color: card.accent }}
        >
          {card.subtitle}
        </span>
        <span className="home-what-i-do-card__description text-foreground/75">
          {card.description}
        </span>
      </div>
    </div>
  );

  if (decorative) {
    return (
      <div className="home-what-i-do-card home-what-i-do-card--decorative relative w-full" style={accentStyle}>
        {frame}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={[
        "home-what-i-do-card group relative w-full",
        expanded ? "is-expand-origin" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={accentStyle}
      aria-label={`${card.title} — ${card.subtitle}. ${card.description} Open details.`}
      aria-expanded={expanded}
      aria-haspopup="dialog"
      aria-controls="what-i-do-details"
      onClick={(event) => {
        if (!onExpand) return;
        const trigger = event.currentTarget;
        const bg = trigger.querySelector<HTMLElement>("[data-expand-bg]");
        const img = trigger.querySelector<HTMLElement>("[data-expand-img]");
        if (!bg || !img) return;
        onExpand({ bg, img, trigger });
      }}
    >
      {frame}
    </button>
  );
}
