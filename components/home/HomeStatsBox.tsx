import type { CSSProperties } from "react";
import Image from "next/image";

const STATS_BORDER_SRC = "/images/home/StatsBox.png";

const STATS = [
  { label: "ARTIST", percent: 88, delayMs: 0 },
  { label: "SOFTWARE", percent: 96, delayMs: 380 },
  { label: "CREATIVE", percent: 82, delayMs: 760 },
] as const;

export function HomeStatsBox() {
  return (
    <article
      className="relative w-[21rem] shrink-0 sm:w-[24rem]"
      aria-labelledby="home-stats-heading"
    >
      <div className="relative aspect-[702/608] w-full">
        <Image
          src={STATS_BORDER_SRC}
          alt=""
          fill
          sizes="(max-width: 640px) 336px, 384px"
          className="pointer-events-none object-fill"
          priority
        />
        <div className="relative z-10 flex h-full flex-col justify-center px-[14%] pb-[15%] pt-[13%]">
          <h2
            id="home-stats-heading"
            className="font-mono text-lg font-bold tracking-[0.2em] text-[var(--home-stat-red)] uppercase sm:text-xl"
          >
            STATS
          </h2>
          <ul className="mt-5 space-y-4 sm:mt-6 sm:space-y-5" role="list">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <span className="font-mono text-[0.65rem] tracking-[0.18em] text-foreground/90 uppercase sm:text-xs">
                  {stat.label}
                </span>
                <div
                  className="home-stat-bar-track mt-1.5"
                  role="meter"
                  aria-label={stat.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={stat.percent}
                >
                  <div
                    className="home-stat-bar-fill"
                    style={
                      {
                        "--stat-target": `${stat.percent}%`,
                        "--stat-delay": `${stat.delayMs}ms`,
                      } as CSSProperties
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
