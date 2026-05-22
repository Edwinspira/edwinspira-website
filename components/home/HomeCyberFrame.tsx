import type { ReactNode } from "react";

/**
 * L-shaped HUD frame (left + bottom only). Wraps hero stats cluster; navbar stays separate in layout.
 */
export function HomeCyberFrame({ children }: { children: ReactNode }) {
  return (
    <div className="home-cyber-frame pointer-events-none absolute top-0 bottom-[6vh] left-[var(--home-pad)] z-[25] flex items-end gap-2 pb-3 pl-3 sm:bottom-[12vh] sm:gap-5 sm:pb-7 sm:pl-6">
      <span className="home-cyber-frame__corner home-cyber-frame__corner--bl" aria-hidden />
      <span className="home-cyber-frame__tick home-cyber-frame__tick--bottom-left" aria-hidden />
      <div className="pointer-events-auto flex items-end gap-2 sm:gap-5">{children}</div>
    </div>
  );
}
