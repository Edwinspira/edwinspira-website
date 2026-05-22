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
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 22vw"
          className="pointer-events-none object-fill"
        />
        <div className="relative z-10 flex h-full flex-col px-[12%] pb-[14%] pt-[16%]">
          <span
            className="relative mx-auto mb-5 block h-[4.5rem] w-[4.5rem] shrink-0 sm:mb-6 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
            aria-hidden
          >
            <Image
              src={card.iconSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 72px, (max-width: 1024px) 80px, 96px"
              className="object-contain object-center"
            />
          </span>
          <h3
            id={`what-i-do-${card.title}`}
            className="text-xs font-semibold leading-tight tracking-[0.12em] text-foreground uppercase sm:text-sm lg:text-base"
          >
            {card.title}
          </h3>
          <p
            className="mt-2 font-mono text-[0.7rem] tracking-wide sm:text-xs lg:text-sm"
            style={{ color: card.accent }}
          >
            {card.subtitle}
          </p>
          <p className="mt-5 text-[0.7rem] leading-relaxed text-foreground/75 sm:mt-6 sm:text-xs lg:text-sm lg:leading-relaxed">
            {card.description}
          </p>
        </div>
      </div>
    </article>
  );
}
