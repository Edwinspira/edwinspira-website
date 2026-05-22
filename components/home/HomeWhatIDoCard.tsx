import Image from "next/image";

import type { HomeWhatIDoCard as HomeWhatIDoCardData } from "@/lib/home-what-i-do";

type HomeWhatIDoCardProps = {
  card: HomeWhatIDoCardData;
};

export function HomeWhatIDoCard({ card }: HomeWhatIDoCardProps) {
  return (
    <article className="relative w-full" aria-labelledby={`what-i-do-${card.title}`}>
      <div className="relative aspect-[833/981] w-full">
        <Image
          src={card.borderSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1280px) 50vw, 22vw"
          className="pointer-events-none object-fill"
        />
        <div className="relative z-10 flex h-full flex-col px-[10%] pb-[12%] pt-[14%] sm:px-[12%] sm:pb-[14%] sm:pt-[16%]">
          <span
            className="relative mx-auto mb-3 block h-12 w-12 shrink-0 sm:mb-6 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
            aria-hidden
          >
            <Image
              src={card.iconSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 48px, (max-width: 1024px) 80px, 96px"
              className="object-contain object-center"
            />
          </span>
          <h3
            id={`what-i-do-${card.title}`}
            className="text-[0.5rem] font-semibold leading-tight tracking-[0.08em] text-foreground uppercase sm:text-sm lg:text-base"
          >
            {card.title}
          </h3>
          <p
            className="mt-1 font-mono text-[0.5rem] tracking-wide sm:mt-2 sm:text-xs lg:text-sm"
            style={{ color: card.accent }}
          >
            {card.subtitle}
          </p>
          <p className="mt-2 text-[0.5rem] leading-snug text-foreground/75 sm:mt-6 sm:text-xs sm:leading-relaxed lg:text-sm">
            {card.description}
          </p>
        </div>
      </div>
    </article>
  );
}
