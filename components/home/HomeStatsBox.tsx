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
      className="relative w-[10.5rem] max-w-[48vw] shrink-0 sm:w-[24rem] sm:max-w-none"
      aria-labelledby="home-stats-heading"
    >
      <div className="relative aspect-[702/608] w-full">
        <Image
          src={STATS_BORDER_SRC}
          alt=""
          fill
          sizes="(max-width: 640px) 168px, 384px"
          className="pointer-events-none object-fill"
          priority
        />
        <div className="relative z-10 flex h-full flex-col justify-center px-[14%] pb-[15%] pt-[13%]">
          <h2
            id="home-stats-heading"
            className="font-mono text-xs font-bold tracking-[0.18em] text-[var(--home-stat-red)] uppercase sm:text-xl"
          >
            STATS
          </h2>
          <ul className="mt-2.5 space-y-2 sm:mt-6 sm:space-y-5" role="list">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <span className="font-mono text-[0.5rem] tracking-[0.14em] text-foreground/90 uppercase sm:text-xs">
                  {stat.label}
                </span>
                <div
                  className="home-stat-bar-track home-stat-bar-track--compact mt-1 sm:mt-1.5"
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
