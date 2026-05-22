import Image from "next/image";

const SIDE_BAR_DECO_SRC = "/images/social/SideBarDeco.png";

type HomeSideBarDecoProps = {
  className?: string;
  /** `default` — connect divider; `compact` — section header accent */
  size?: "default" | "compact";
};

const sizeClass = {
  default: "home-sidebar-deco--default",
  compact: "home-sidebar-deco--compact",
} as const;

export function HomeSideBarDeco({
  className = "",
  size = "default",
}: HomeSideBarDecoProps) {
  const rootClass = ["home-sidebar-deco", sizeClass[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} aria-hidden>
      <Image
        src={SIDE_BAR_DECO_SRC}
        alt=""
        width={30}
        height={230}
        className="h-full w-full object-contain"
        sizes={size === "compact" ? "12px" : "24px"}
      />
    </div>
  );
}
