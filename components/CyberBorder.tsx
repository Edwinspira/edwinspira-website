import type { ReactNode } from "react";

type CyberBorderProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Reusable cyber HUD frame: four vector corner brackets plus inset red edge lines.
 * Edge lines stop short of corners so decorations stay separate.
 */
export function CyberBorder({ children, className = "" }: CyberBorderProps) {
  const rootClass = className ? `cyber-border ${className}` : "cyber-border";

  return (
    <div className={rootClass}>
      <CyberCornerMark className="cyber-border__corner cyber-border__corner--tl" />
      <CyberCornerMark className="cyber-border__corner cyber-border__corner--tr" />
      <CyberCornerMark className="cyber-border__corner cyber-border__corner--bl" />
      <CyberCornerMark className="cyber-border__corner cyber-border__corner--br" />

      <span className="cyber-border__edge cyber-border__edge--top" aria-hidden />
      <span className="cyber-border__edge cyber-border__edge--bottom" aria-hidden />
      <span className="cyber-border__edge cyber-border__edge--left" aria-hidden />
      <span className="cyber-border__edge cyber-border__edge--right" aria-hidden />

      <div className="cyber-border__content">{children}</div>
    </div>
  );
}

type CyberCornerMarkProps = {
  className: string;
};

/** Top-left oriented HUD corner; rotate via CSS for other positions. */
function CyberCornerMark({ className }: CyberCornerMarkProps) {
  return (
    <span className={className} aria-hidden>
      <svg
        className="cyber-border__corner-svg"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g stroke="currentColor">
          {/* Outer L-bracket with end ticks */}
          <path d="M 3 18 V 3 H 18" strokeWidth="1.5" />
          <path d="M 3 18 H 7" strokeWidth="1.35" />
          <path d="M 18 3 V 7" strokeWidth="1.35" />

          {/* Nested inner bracket */}
          <path d="M 8 16 V 8 H 16" strokeWidth="1" opacity="0.85" />
          <path d="M 8 16 H 11" strokeWidth="0.9" opacity="0.7" />
          <path d="M 16 8 V 11" strokeWidth="0.9" opacity="0.7" />

          {/* Diagonal chamfer accent */}
          <path d="M 3 3 L 9 9" strokeWidth="1" opacity="0.55" />

          {/* Circuit ticks along arms */}
          <path d="M 22 3 H 26" strokeWidth="1.15" />
          <path d="M 30 3 H 34" strokeWidth="1.15" />
          <path d="M 3 22 V 26" strokeWidth="1.15" />
          <path d="M 3 30 V 34" strokeWidth="1.15" />

          {/* Terminal nodes */}
          <rect x="36" y="1.5" width="4" height="3" fill="currentColor" opacity="0.85" />
          <rect x="1.5" y="36" width="3" height="4" fill="currentColor" opacity="0.85" />

          {/* Targeting ring + crosshair */}
          <circle
            className="cyber-border__corner-ring"
            cx="18"
            cy="18"
            r="5.5"
            strokeWidth="1.15"
          />
          <circle cx="18" cy="18" r="1.6" fill="currentColor" stroke="none" opacity="0.9" />
          <path d="M 18 11.5 V 13.5" strokeWidth="0.9" opacity="0.7" />
          <path d="M 18 22.5 V 24.5" strokeWidth="0.9" opacity="0.7" />
          <path d="M 11.5 18 H 13.5" strokeWidth="0.9" opacity="0.7" />
          <path d="M 22.5 18 H 24.5" strokeWidth="0.9" opacity="0.7" />
        </g>
      </svg>
    </span>
  );
}
