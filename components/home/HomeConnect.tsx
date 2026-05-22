import { CyberBorder } from "@/components/CyberBorder";
import { HomeConnectBody } from "@/components/home/HomeConnectBody";
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

          <HomeConnectBody platforms={HOME_CONNECT_PLATFORMS} />
        </CyberBorder>
      </div>
    </section>
  );
}
