import Image from "next/image";

const SIDE_DECO_SRC = "/images/home/SideDeco1.png";

export function HomeSideDeco() {
  return (
    <div
      className="home-side-deco pointer-events-none relative z-30 h-[9.25rem] w-[var(--home-deco-w)] shrink-0 sm:h-[20.75rem]"
      aria-hidden
    >
      <Image
        src={SIDE_DECO_SRC}
        alt=""
        fill
        sizes="(max-width: 640px) 32px, 64px"
        className="object-contain object-bottom"
        priority
      />
    </div>
  );
}
