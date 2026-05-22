import { CyberBorder } from "@/components/CyberBorder";
import { HomeConnectBody } from "@/components/home/HomeConnectBody";
import { HomeSideBarDeco } from "@/components/home/HomeSideBarDeco";
import { HOME_CONNECT_PLATFORMS } from "@/lib/home-connect";

export function HomeConnect() {
  return (
    <section
      className="home-connect relative z-10 w-full bg-black"
      aria-labelledby="connect-heading"
    >
      <div className="home-section-pad w-full px-[var(--home-pad)]">
        <CyberBorder className="w-full">
          <div className="flex flex-wrap items-end gap-4 gap-y-3 sm:gap-6">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-2 max-sm:w-full">
              <h2
                id="connect-heading"
                className="font-mono text-lg tracking-[0.2em] text-foreground uppercase sm:text-xl lg:text-2xl"
              >
                {"// CONNECT"}
              </h2>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-3 max-sm:w-full max-sm:justify-end">
              <HomeSideBarDeco size="compact" />
              <span className="font-mono text-xs tracking-[0.2em] text-muted uppercase sm:text-sm">
                LEVEL : 03
              </span>
            </div>
          </div>

          <div className="home-what-i-do__rule mt-6 sm:mt-8" aria-hidden />

          <HomeConnectBody platforms={HOME_CONNECT_PLATFORMS} />
        </CyberBorder>
      </div>
    </section>
  );
}
