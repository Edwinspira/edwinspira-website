"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { HomeWhatIDoCard } from "@/components/home/HomeWhatIDoCard";
import { HOME_WHAT_I_DO_CARDS } from "@/lib/home-what-i-do";

/**
 * What I Do cards with scroll-triggered glitch appear.
 * Animation adapted from Codrops CSS Glitch Effect:
 * https://github.com/codrops/CSSGlitchEffect/
 */
export function HomeWhatIDoCards() {
  const listRef = useRef<HTMLUListElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches ?? false;

    if (reducedMotion) {
      setRevealed(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }

    let observer: IntersectionObserver;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          setRevealed(true);
          observer.disconnect();
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(root);
    } catch {
      setRevealed(true);
      return;
    }

    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={listRef}
      className={[
        "home-what-i-do__grid mt-10 list-none items-stretch max-sm:mt-12 sm:mt-16",
        revealed ? "is-glitch-in" : "is-glitch-pending",
      ].join(" ")}
    >
      {HOME_WHAT_I_DO_CARDS.map((card, index) => (
        <li
          key={card.title}
          className="home-what-i-do-glitch min-w-0"
          style={{ "--glitch-stagger": `${index * 90}ms` } as CSSProperties}
        >
          <div className="home-what-i-do-glitch__base">
            <HomeWhatIDoCard card={card} />
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
  );
}
