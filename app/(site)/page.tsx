import { HomeFeaturedProjects } from "@/components/home/HomeFeaturedProjects";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeHeroOverlay } from "@/components/home/HomeHeroOverlay";
import { HomeWhatIDo } from "@/components/home/HomeWhatIDo";

export default function HomePage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-black">
      <HomeHero />

      <HomeHeroOverlay />

      <HomeWhatIDo />

      <HomeFeaturedProjects />
    </div>
  );
}
