import { useId } from "react";

type CyberEstablishButtonBorderProps = {
  className?: string;
};

/**
 * Wide cyber HUD frame for the Establish Connection CTA (732×103 viewBox).
 * Replaces ButtonIconTwo.png with site-matching vector lines.
 */
export function CyberEstablishButtonBorder({
  className = "",
}: CyberEstablishButtonBorderProps) {
  const rawId = useId();
  const glowId = `establish-btn-glow-${rawId.replace(/:/g, "")}`;

  const rootClass = ["block h-full w-full", className].filter(Boolean).join(" ");

  return (
    <svg
      viewBox="0 0 732 103"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={rootClass}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter
          id={glowId}
          x="-2%"
          y="-8%"
          width="104%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 0.15 0 0 0  0 0 0.15 0 0  0 0 0 0.85 0"
            result="glowColor"
          />
          <feMerge>
            <feMergeNode in="glowColor" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${glowId})`} stroke="currentColor">
        {/* Outer chamfered shell */}
        <path
          d="M 30 9 H 702 L 723 30 V 73 L 702 94 H 30 L 9 73 V 30 Z"
          strokeWidth="1.5"
        />
        <path
          d="M 38 17 H 694 L 711 34 V 69 L 694 86 H 38 L 21 69 V 34 Z"
          strokeWidth="0.85"
          opacity="0.8"
        />

        {/* Top / bottom rails (segmented) */}
        <path d="M 30 9 H 118" strokeWidth="1.35" />
        <path d="M 614 9 H 702" strokeWidth="1.35" />
        <path d="M 30 94 H 118" strokeWidth="1.35" />
        <path d="M 614 94 H 702" strokeWidth="1.35" />

        {/* Short side connectors */}
        <path d="M 9 34 V 69" strokeWidth="1.25" />
        <path d="M 723 34 V 69" strokeWidth="1.25" />

        {/* Top-left corner */}
        <path d="M 30 9 L 9 30" strokeWidth="1.5" />
        <path d="M 38 17 L 21 34" strokeWidth="1.1" opacity="0.85" />
        <path d="M 46 25 L 30 41" strokeWidth="0.9" opacity="0.6" />
        <path d="M 52 17 H 62" strokeWidth="1" />
        <path d="M 72 17 H 82" strokeWidth="1" />
        <path d="M 17 52 V 62" strokeWidth="1" />

        {/* Top-right corner */}
        <path d="M 702 9 L 723 30" strokeWidth="1.5" />
        <path d="M 694 17 L 711 34" strokeWidth="1.1" opacity="0.85" />
        <path d="M 686 25 L 702 41" strokeWidth="0.9" opacity="0.6" />
        <path d="M 670 17 H 680" strokeWidth="1" />
        <path d="M 650 17 H 660" strokeWidth="1" />

        {/* Bottom-left corner */}
        <path d="M 30 94 L 9 73" strokeWidth="1.5" />
        <path d="M 38 86 L 21 69" strokeWidth="1.1" opacity="0.85" />
        <path d="M 52 86 H 62" strokeWidth="1" />
        <path d="M 17 41 V 51" strokeWidth="1" />

        {/* Bottom-right corner */}
        <path d="M 702 94 L 723 73" strokeWidth="1.5" />
        <path d="M 694 86 L 711 69" strokeWidth="1.1" opacity="0.85" />
        <path d="M 670 86 H 680" strokeWidth="1" />
        <path d="M 708 58 H 718" strokeWidth="1" />
        <path d="M 714 52 V 62" strokeWidth="1" />

        {/* Mid-edge accents */}
        <path d="M 340 9 H 352" strokeWidth="1" opacity="0.45" />
        <path d="M 380 9 H 392" strokeWidth="1" opacity="0.45" />
        <path d="M 340 94 H 352" strokeWidth="1" opacity="0.45" />
        <path d="M 380 94 H 392" strokeWidth="1" opacity="0.45" />
        <rect x="364" y="6" width="4" height="3" fill="currentColor" opacity="0.5" />
        <rect x="364" y="94" width="4" height="3" fill="currentColor" opacity="0.5" />
      </g>
    </svg>
  );
}
