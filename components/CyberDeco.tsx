type CyberDecoProps = {
  className?: string;
};

/** Horizontal signal divider — connect description → CTA */
export function CyberSignalBridge({ className = "" }: CyberDecoProps) {
  const root = ["cyber-signal-bridge", className].filter(Boolean).join(" ");

  return (
    <div className={root} aria-hidden>
      <span className="cyber-signal-bridge__line cyber-signal-bridge__line--left" />
      <span className="cyber-signal-bridge__ticks">
        <span className="cyber-signal-bridge__tick" />
        <span className="cyber-signal-bridge__tick cyber-signal-bridge__tick--mid" />
        <span className="cyber-signal-bridge__tick" />
      </span>
      <span className="cyber-signal-bridge__core">
        <span className="cyber-signal-bridge__label">SYNC::01</span>
        <span className="cyber-signal-bridge__pulse" />
      </span>
      <span className="cyber-signal-bridge__ticks cyber-signal-bridge__ticks--mirror">
        <span className="cyber-signal-bridge__tick" />
        <span className="cyber-signal-bridge__tick cyber-signal-bridge__tick--mid" />
        <span className="cyber-signal-bridge__tick" />
      </span>
      <span className="cyber-signal-bridge__line cyber-signal-bridge__line--right" />
    </div>
  );
}

/** HUD chip for section LEVEL labels */
export function CyberLevelBadge({
  level,
  className = "",
}: CyberDecoProps & { level: string }) {
  const root = ["cyber-level-badge", className].filter(Boolean).join(" ");

  return (
    <span className={root}>
      <span className="cyber-level-badge__ticks" aria-hidden>
        <span className="cyber-level-badge__tick" />
        <span className="cyber-level-badge__tick" />
        <span className="cyber-level-badge__tick" />
      </span>
      <span className="cyber-level-badge__text">
        LEVEL <span className="cyber-level-badge__sep">:</span>{" "}
        <span className="cyber-level-badge__num">{level}</span>
      </span>
    </span>
  );
}

/** Compact vertical HUD marker for section headers */
export function CyberSectionMarker({ className = "" }: CyberDecoProps) {
  const root = ["cyber-section-marker", className].filter(Boolean).join(" ");

  return (
    <div className={root} aria-hidden>
      <span className="cyber-section-marker__rail" />
      <span className="cyber-section-marker__node" />
      <span className="cyber-section-marker__node cyber-section-marker__node--dim" />
      <span className="cyber-section-marker__node" />
    </div>
  );
}

/** Trailing accent on section divider lines */
export function CyberRuleEndcap({ className = "" }: CyberDecoProps) {
  const root = ["cyber-rule-endcap", className].filter(Boolean).join(" ");

  return (
    <span className={root} aria-hidden>
      <span className="cyber-rule-endcap__bracket" />
      <span className="cyber-rule-endcap__dot" />
    </span>
  );
}

/** L-shaped corner brackets for cards and panels */
export function CyberHudBracket({ className = "" }: CyberDecoProps) {
  const root = ["cyber-hud-bracket", className].filter(Boolean).join(" ");

  return (
    <span className={root} aria-hidden>
      <span className="cyber-hud-bracket__corner cyber-hud-bracket__corner--tl" />
      <span className="cyber-hud-bracket__corner cyber-hud-bracket__corner--tr" />
      <span className="cyber-hud-bracket__corner cyber-hud-bracket__corner--bl" />
      <span className="cyber-hud-bracket__corner cyber-hud-bracket__corner--br" />
    </span>
  );
}

/** Footer status rail */
export function CyberFooterRail({ className = "" }: CyberDecoProps) {
  const root = ["cyber-footer-rail", className].filter(Boolean).join(" ");

  return (
    <div className={root} aria-hidden>
      <span className="cyber-footer-rail__line" />
      <span className="cyber-footer-rail__label">SYS::ONLINE</span>
      <span className="cyber-footer-rail__ticks">
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}

/** Subtle scan grid for hero overlay */
export function CyberHeroGrid({ className = "" }: CyberDecoProps) {
  const root = ["cyber-hero-grid", className].filter(Boolean).join(" ");

  return <div className={root} aria-hidden />;
}
