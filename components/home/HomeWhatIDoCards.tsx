"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import { HomeWhatIDoCard } from "@/components/home/HomeWhatIDoCard";
import { HomeWhatIDoDetails } from "@/components/home/HomeWhatIDoDetails";
import type { ExpandOrigin } from "@/components/home/home-what-i-do-expand";
import { HOME_WHAT_I_DO_CARDS, type HomeWhatIDoCard as HomeWhatIDoCardData } from "@/lib/home-what-i-do";

/**
 * What I Do cards with scroll-triggered glitch appear.
 * Animation adapted from Codrops CSS Glitch Effect:
 * https://github.com/codrops/CSSGlitchEffect/
 *
 * Click expands a skill via Codrops Expanding Grid Item Animation:
 * https://github.com/codrops/ExpandingGridItemAnimation/
 */
export function HomeWhatIDoCards() {
  const listRef = useRef<HTMLUListElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState<HomeWhatIDoCardData | null>(null);
  const [origin, setOrigin] = useState<ExpandOrigin | null>(null);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const onExpand = useCallback(
    (card: HomeWhatIDoCardData, nextOrigin: ExpandOrigin) => {
      if (active) return;
      setActive(card);
      setOrigin(nextOrigin);
    },
    [active],
  );

  const onClosed = useCallback(() => {
    setActive(null);
    setOrigin(null);
  }, []);

  return (
    <>
      <ul
        ref={listRef}
        className={[
          "home-what-i-do__grid mt-10 list-none items-stretch max-sm:mt-12 sm:mt-16",
          revealed ? "is-glitch-in" : "is-glitch-pending",
        ].join(" ")}
      >
        {HOME_WHAT_I_DO_CARDS.map((card, index) => (
          <li
            key={card.id}
            className="home-what-i-do-glitch min-w-0"
            style={{ "--glitch-stagger": `${index * 90}ms` } as CSSProperties}
          >
            <div className="home-what-i-do-glitch__base">
              <HomeWhatIDoCard
                card={card}
                expanded={active?.id === card.id}
                onExpand={(nextOrigin) => onExpand(card, nextOrigin)}
              />
            </div>
            <div
              className="home-what-i-do-glitch__layer home-what-i-do-glitch__layer--1"
              aria-hidden
            >
              <HomeWhatIDoCard card={card} decorative />
            </div>
            <div
              className="home-what-i-do-glitch__layer home-what-i-do-glitch__layer--2"
              aria-hidden
            >
              <HomeWhatIDoCard card={card} decorative />
            </div>
            <div
              className="home-what-i-do-glitch__layer home-what-i-do-glitch__layer--flash"
              aria-hidden
            >
              <HomeWhatIDoCard card={card} decorative />
            </div>
          </li>
        ))}
      </ul>

      {active && origin ? (
        <HomeWhatIDoDetails card={active} origin={origin} onClosed={onClosed} />
      ) : null}
    </>
  );
}
