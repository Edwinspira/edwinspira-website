import Image from "next/image";

const HERO_IMAGE_SRC = "/images/home/EdwinspiraHomeHero.png";

export function HomeHero() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Image
        src={HERO_IMAGE_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="home-hero-vignette absolute inset-0" />
    </div>
  );
}
