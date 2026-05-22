import { CyberHeroGrid } from "@/components/CyberDeco";
import { HomeCyberFrame } from "@/components/home/HomeCyberFrame";
import { HomeHeroName } from "@/components/home/HomeHeroName";
import { HomeSideDeco } from "@/components/home/HomeSideDeco";
import { HomeStatsBox } from "@/components/home/HomeStatsBox";

export function HomeHeroOverlay() {
  return (
    <section
      className="home-hero-overlay relative z-10 w-full max-w-full min-h-[90dvh] overflow-x-hidden sm:min-h-svh"
      aria-label="Hero"
    >
      <CyberHeroGrid />
      <HomeHeroName />
      <HomeCyberFrame>
        <HomeSideDeco />
        <HomeStatsBox />
      </HomeCyberFrame>
    </section>
  );
}
