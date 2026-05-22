import { useId } from "react";

type ArtHudCardBorderProps = {
  accent?: string;
  className?: string;
};

/**
 * Full-frame cyber HUD border for What I Do skill cards (833×981 viewBox).
 * Replaces the pixel border PNGs with a glowing, layered sci-fi frame.
 */
export function ArtHudCardBorder({
  accent = "#cb3c37",
  className = "",
}: ArtHudCardBorderProps) {
  const rawId = useId();
  const glowId = `art-hud-glow-${rawId.replace(/:/g, "")}`;
  const bloomId = `art-hud-bloom-${rawId.replace(/:/g, "")}`;

  const dotYs = [300, 332, 364, 396, 428, 460, 492, 524, 556, 588, 620, 652];

  const rootClass = ["block h-full w-full", className].filter(Boolean).join(" ");

  return (
    <svg
      viewBox="0 0 833 981"
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
          y="-2%"
          width="104%"
          height="104%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 0.15 0 0 0  0 0 0.15 0 0  0 0 0 0.9 0"
            result="glowColor"
          />
          <feMerge>
            <feMergeNode in="glowColor" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={bloomId} x="-4%" y="-4%" width="108%" height="108%">
          <feGaussianBlur stdDeviation="3" result="soft" />
          <feColorMatrix
            in="soft"
            type="matrix"
            values="1 0 0 0 0  0 0.18 0 0 0  0 0 0.18 0 0  0 0 0 0.5 0"
          />
        </filter>
      </defs>

      {/* Soft outer bloom (kept subtle — large blur bleeds outside the card) */}
      <g filter={`url(#${bloomId})`} opacity="0.35">
        <path
          d="M 54 28 H 779 L 805 54 V 927 L 779 953 H 54 L 28 927 V 54 Z"
          stroke={accent}
          strokeWidth="1.5"
        />
      </g>

      <g filter={`url(#${glowId})`} stroke={accent}>
        {/* ── Outer chamfered shell ── */}
        <path
          d="M 54 28 H 779 L 805 54 V 927 L 779 953 H 54 L 28 927 V 54 Z"
          strokeWidth="1.75"
        />
        <path
          d="M 66 40 H 767 L 791 64 V 917 L 767 941 H 66 L 42 917 V 64 Z"
          strokeWidth="1"
          opacity="0.85"
        />

        {/* ── Top edge (segmented + center crown for icon) ── */}
        <path d="M 54 28 H 318" strokeWidth="1.5" />
        <path d="M 515 28 H 779" strokeWidth="1.5" />
        <path d="M 318 28 V 38 H 358" strokeWidth="1.25" />
        <path d="M 475 28 V 38 H 515" strokeWidth="1.25" />
        <path d="M 358 38 H 475" strokeWidth="1.25" />
        <path d="M 388 28 V 20 H 445" strokeWidth="1.5" />
        <path d="M 400 20 H 433" strokeWidth="2" />
        <path d="M 408 20 V 12" strokeWidth="1.5" />
        <path d="M 425 20 V 12" strokeWidth="1.5" />
        <path d="M 394 24 L 382 36" strokeWidth="1" opacity="0.7" />
        <path d="M 439 24 L 451 36" strokeWidth="1" opacity="0.7" />
        <path d="M 416 12 V 8" strokeWidth="1.25" />
        <path d="M 410 8 H 422" strokeWidth="1.5" />
        <path d="M 368 32 H 382" strokeWidth="1" opacity="0.7" />
        <path d="M 451 32 H 465" strokeWidth="1" opacity="0.7" />
        <path d="M 340 32 H 352" strokeWidth="1" opacity="0.65" />
        <path d="M 481 32 H 493" strokeWidth="1" opacity="0.65" />
        <path d="M 296 34 H 308" strokeWidth="1" opacity="0.55" />
        <path d="M 525 34 H 537" strokeWidth="1" opacity="0.55" />

        {/* ── Bottom edge (layered segments) ── */}
        <path d="M 54 953 H 290" strokeWidth="1.5" />
        <path d="M 543 953 H 779" strokeWidth="1.5" />
        <path d="M 290 953 V 943 H 330" strokeWidth="1.25" />
        <path d="M 503 953 V 943 H 543" strokeWidth="1.25" />
        <path d="M 330 943 H 503" strokeWidth="1.25" />
        <path d="M 268 948 H 280" strokeWidth="1" opacity="0.55" />
        <path d="M 553 948 H 565" strokeWidth="1" opacity="0.55" />
        <path d="M 396 948 H 412" strokeWidth="1" opacity="0.5" />
        <path d="M 421 948 H 437" strokeWidth="1" opacity="0.5" />

        {/* ── Left / right vertical rails ── */}
        <path d="M 28 54 V 280" strokeWidth="1.5" />
        <path d="M 28 700 V 927" strokeWidth="1.5" />
        <path d="M 805 54 V 280" strokeWidth="1.5" />
        <path d="M 805 700 V 927" strokeWidth="1.5" />
        <path d="M 38 280 V 700" strokeWidth="1" opacity="0.75" />
        <path d="M 795 280 V 700" strokeWidth="1" opacity="0.75" />

        {/* ── Top-left corner (nested bracket + dash ticks) ── */}
        <path d="M 54 28 L 28 54" strokeWidth="1.75" />
        <path d="M 66 40 L 42 64" strokeWidth="1.25" opacity="0.9" />
        <path d="M 78 52 L 54 76" strokeWidth="1" opacity="0.65" />
        <path d="M 88 40 H 100" strokeWidth="1.25" />
        <path d="M 112 40 H 124" strokeWidth="1.25" />
        <path d="M 136 40 H 148" strokeWidth="1.25" />
        <path d="M 40 88 V 100" strokeWidth="1.25" />
        <path d="M 40 112 V 124" strokeWidth="1.25" />
        <path d="M 40 136 V 148" strokeWidth="1.25" />
        <rect x="152" y="36" width="8" height="4" fill={accent} opacity="0.8" />
        <rect x="36" y="152" width="4" height="8" fill={accent} opacity="0.8" />

        {/* ── Top-right corner ── */}
        <path d="M 779 28 L 805 54" strokeWidth="1.75" />
        <path d="M 767 40 L 791 64" strokeWidth="1.25" opacity="0.9" />
        <path d="M 755 52 L 779 76" strokeWidth="1" opacity="0.65" />
        <path d="M 733 40 H 745" strokeWidth="1.25" />
        <path d="M 709 40 H 721" strokeWidth="1.25" />
        <path d="M 685 40 H 697" strokeWidth="1.25" />
        <rect x="673" y="36" width="8" height="4" fill={accent} opacity="0.8" />

        {/* ── Bottom-left corner ── */}
        <path d="M 54 953 L 28 927" strokeWidth="1.75" />
        <path d="M 66 941 L 42 917" strokeWidth="1.25" opacity="0.9" />
        <path d="M 78 929 L 54 905" strokeWidth="1" opacity="0.65" />
        <path d="M 88 941 H 100" strokeWidth="1.25" />
        <path d="M 112 941 H 124" strokeWidth="1.25" />
        <rect x="36" y="821" width="4" height="8" fill={accent} opacity="0.8" />

        {/* ── Bottom-right corner (+ mark inside bracket) ── */}
        <path d="M 779 953 L 805 927" strokeWidth="1.75" />
        <path d="M 767 941 L 791 917" strokeWidth="1.25" opacity="0.9" />
        <path d="M 755 929 L 779 905" strokeWidth="1" opacity="0.65" />
        <path d="M 733 941 H 745" strokeWidth="1.25" />
        <path d="M 709 941 H 721" strokeWidth="1.25" />
        <path d="M 748 908 H 764" strokeWidth="1.5" />
        <path d="M 756 900 V 916" strokeWidth="1.5" />

        {/* ── Side signal dot columns ── */}
        {dotYs.map((y) => (
          <rect key={`l-${y}`} x="46" y={y} width="5" height="5" fill={accent} opacity="0.9" />
        ))}
        {dotYs.map((y) => (
          <rect key={`r-${y}`} x="782" y={y} width="5" height="5" fill={accent} opacity="0.9" />
        ))}

        {/* ── Mid-edge circuit ticks ── */}
        <path d="M 28 416 H 44" strokeWidth="1" opacity="0.6" />
        <path d="M 789 416 H 805" strokeWidth="1" opacity="0.6" />
        <path d="M 28 564 H 44" strokeWidth="1" opacity="0.5" />
        <path d="M 789 564 H 805" strokeWidth="1" opacity="0.5" />
        <rect x="50" y="412" width="6" height="3" fill={accent} opacity="0.55" />
        <rect x="777" y="412" width="6" height="3" fill={accent} opacity="0.55" />
        <rect x="50" y="560" width="6" height="3" fill={accent} opacity="0.55" />
        <rect x="777" y="560" width="6" height="3" fill={accent} opacity="0.55" />

        {/* ── Inner parallel rails (depth) ── */}
        <path
          d="M 78 62 H 755 L 773 80 V 901 L 755 919 H 78 L 60 901 V 80 Z"
          strokeWidth="0.75"
          opacity="0.55"
        />

        {/* ── Inner corner accents (mechanical joints) ── */}
        <path d="M 100 100 H 128 V 128" strokeWidth="1" opacity="0.45" />
        <path d="M 733 100 H 705 V 128" strokeWidth="1" opacity="0.45" />
        <path d="M 100 881 H 128 V 853" strokeWidth="1" opacity="0.45" />
        <path d="M 733 881 H 705 V 853" strokeWidth="1" opacity="0.45" />
        <path d="M 88 88 L 104 104" strokeWidth="1" opacity="0.4" />
        <path d="M 745 88 L 729 104" strokeWidth="1" opacity="0.4" />
        <path d="M 88 893 L 104 877" strokeWidth="1" opacity="0.4" />
        <path d="M 745 893 L 729 877" strokeWidth="1" opacity="0.4" />

        {/* ── Horizontal micro-segments along sides ── */}
        <path d="M 52 220 H 64" strokeWidth="1" opacity="0.5" />
        <path d="M 52 760 H 64" strokeWidth="1" opacity="0.5" />
        <path d="M 769 220 H 781" strokeWidth="1" opacity="0.5" />
        <path d="M 769 760 H 781" strokeWidth="1" opacity="0.5" />
      </g>
    </svg>
  );
}
