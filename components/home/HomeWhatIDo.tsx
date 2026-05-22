import { CyberBorder } from "@/components/CyberBorder";
import { HomeSideBarDeco } from "@/components/home/HomeSideBarDeco";
import { HomeWhatIDoCard } from "@/components/home/HomeWhatIDoCard";
import { HOME_WHAT_I_DO_CARDS } from "@/lib/home-what-i-do";

export function HomeWhatIDo() {
  return (
    <section className="home-what-i-do relative z-10 w-full bg-black" aria-labelledby="what-i-do-heading">
      <div className="home-section-pad w-full px-[var(--home-pad)]">
        <CyberBorder className="w-full">
        <div className="flex flex-wrap items-end gap-4 sm:gap-6">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-2">
            <h2
              id="what-i-do-heading"
              className="font-mono text-lg tracking-[0.2em] text-foreground uppercase sm:text-xl lg:text-2xl"
            >
              {"// WHAT I DO"}
            </h2>
            <span className="font-mono text-lg tracking-wide text-[var(--home-stat-red)] sm:text-xl lg:text-2xl">
              スキルセット
            </span>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <HomeSideBarDeco size="compact" />
            <span className="font-mono text-xs tracking-[0.2em] text-muted uppercase sm:text-sm">
              LEVEL : 01
            </span>
          </div>
        </div>
        <div className="home-what-i-do__rule mt-6 sm:mt-8" aria-hidden />

        <ul className="mt-10 grid list-none grid-cols-2 gap-4 max-sm:mt-12 sm:mt-16 sm:gap-12 lg:gap-14 xl:grid-cols-4">
          {HOME_WHAT_I_DO_CARDS.map((card) => (
            <li key={card.title}>
              <HomeWhatIDoCard card={card} />
            </li>
          ))}
        </ul>
        </CyberBorder>
      </div>
    </section>
  );
}
