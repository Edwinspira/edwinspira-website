import type { ReactNode } from "react";
import Image from "next/image";

const CORNER_UP_LEFT = "/images/general/CornerUpLeft.png";
const CORNER_UP_RIGHT = "/images/general/CornerUpRight.png";
const CORNER_DOWN_LEFT = "/images/general/CornerDownLeft.png";
const CORNER_DOWN_RIGHT = "/images/general/CornerDownRight.png";

type CyberBorderProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Reusable cyber HUD frame: four corner assets plus inset red edge lines.
 * Edge lines stop short of corners so decorations stay separate.
 */
export function CyberBorder({ children, className = "" }: CyberBorderProps) {
  const rootClass = className ? `cyber-border ${className}` : "cyber-border";

  return (
    <div className={rootClass}>
      <span className="cyber-border__corner cyber-border__corner--tl relative block" aria-hidden>
        <Image src={CORNER_UP_LEFT} alt="" fill sizes="44px" className="object-contain" />
      </span>
      <span className="cyber-border__corner cyber-border__corner--tr relative block" aria-hidden>
        <Image src={CORNER_UP_RIGHT} alt="" fill sizes="44px" className="object-contain" />
      </span>
      <span className="cyber-border__corner cyber-border__corner--bl relative block" aria-hidden>
        <Image src={CORNER_DOWN_LEFT} alt="" fill sizes="44px" className="object-contain" />
      </span>
      <span className="cyber-border__corner cyber-border__corner--br relative block" aria-hidden>
        <Image src={CORNER_DOWN_RIGHT} alt="" fill sizes="44px" className="object-contain" />
      </span>

      <span className="cyber-border__edge cyber-border__edge--top" aria-hidden />
      <span className="cyber-border__edge cyber-border__edge--bottom" aria-hidden />
      <span className="cyber-border__edge cyber-border__edge--left" aria-hidden />
      <span className="cyber-border__edge cyber-border__edge--right" aria-hidden />

      <div className="cyber-border__content">{children}</div>
    </div>
  );
}
