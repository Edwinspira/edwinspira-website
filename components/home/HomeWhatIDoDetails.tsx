"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";

import {
  getFocusable,
  invertTransform,
  lockPageScroll,
  prefersReducedMotion,
  setPageInert,
  type ExpandOrigin,
} from "@/components/home/home-what-i-do-expand";
import { HomeWhatIDoSkillIcon } from "@/components/home/HomeWhatIDoSkillIcon";
import type { HomeWhatIDoCard as HomeWhatIDoCardData } from "@/lib/home-what-i-do";

type HomeWhatIDoDetailsProps = {
  card: HomeWhatIDoCardData;
  origin: ExpandOrigin;
  onClosed: () => void;
};

const EASE_OUT_SINE = "cubic-bezier(0.39, 0.575, 0.565, 1)";
const EASE_OUT_ELASTIC = "cubic-bezier(0.22, 1.4, 0.36, 1)";

/**
 * Expanding grid-item detail view adapted from Codrops:
 * https://github.com/codrops/ExpandingGridItemAnimation/
 * FLIP is driven by the Web Animations API (no anime.js).
 */
export function HomeWhatIDoDetails({
  card,
  origin,
  onClosed,
}: HomeWhatIDoDetailsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgDownRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const animationsRef = useRef<Animation[]>([]);
  const closingRef = useRef(false);
  const [portalReady, setPortalReady] = useState(false);
  const [phase, setPhase] = useState<"opening" | "open" | "closing">("opening");

  const stopAnimations = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.cancel());
    animationsRef.current = [];
  }, []);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setPhase("closing");

    const bgDown = bgDownRef.current;
    const img = imgRef.current;
    const reduced = prefersReducedMotion();

    const finish = () => {
      stopAnimations();
      origin.bg.style.opacity = "";
      origin.img.style.opacity = "";
      origin.trigger.classList.remove("is-expand-origin");
      origin.trigger.focus();
      onClosed();
    };

    if (!bgDown || !img || reduced) {
      finish();
      return;
    }

    const bgFrom = origin.bg.getBoundingClientRect();
    const imgFrom = origin.img.getBoundingClientRect();
    const bgTo = bgDown.getBoundingClientRect();
    const imgTo = img.getBoundingClientRect();

    stopAnimations();

    const bgAnim = bgDown.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: invertTransform(bgFrom, bgTo), opacity: 1 },
      ],
      { duration: 250, easing: EASE_OUT_SINE, fill: "forwards" },
    );
    const imgAnim = img.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: invertTransform(imgFrom, imgTo), opacity: 1 },
      ],
      { duration: 250, easing: EASE_OUT_SINE, fill: "forwards" },
    );
    animationsRef.current = [bgAnim, imgAnim];
    imgAnim.onfinish = finish;
  }, [onClosed, origin, stopAnimations]);

  useLayoutEffect(() => {
    setPortalReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!portalReady) return;

    origin.trigger.classList.add("is-expand-origin");
    origin.bg.style.opacity = "0";
    origin.img.style.opacity = "0";

    const bgDown = bgDownRef.current;
    const img = imgRef.current;
    if (!bgDown || !img) return;

    const reduced = prefersReducedMotion();
    if (reduced) {
      bgDown.style.opacity = "1";
      img.style.opacity = "1";
      setPhase("open");
      return;
    }

    const bgFrom = origin.bg.getBoundingClientRect();
    const imgFrom = origin.img.getBoundingClientRect();
    const bgTo = bgDown.getBoundingClientRect();
    const imgTo = img.getBoundingClientRect();
    const bgInvert = invertTransform(bgFrom, bgTo);
    const imgInvert = invertTransform(imgFrom, imgTo);

    bgDown.style.opacity = "1";
    img.style.opacity = "1";

    const bgAnim = bgDown.animate(
      [
        { transform: bgInvert, opacity: 1 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 250, easing: EASE_OUT_SINE, fill: "forwards" },
    );
    const imgAnim = img.animate(
      [
        { transform: imgInvert, opacity: 1 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 800, easing: EASE_OUT_ELASTIC, fill: "forwards" },
    );
    animationsRef.current = [bgAnim, imgAnim];
    imgAnim.onfinish = () => {
      if (!closingRef.current) setPhase("open");
    };

    return () => {
      stopAnimations();
    };
  }, [origin, portalReady, stopAnimations]);

  useEffect(() => {
    const unlock = lockPageScroll();
    setPageInert(true);
    closeRef.current?.focus();

    return () => {
      unlock();
      setPageInert(false);
      origin.bg.style.opacity = "";
      origin.img.style.opacity = "";
      origin.trigger.classList.remove("is-expand-origin");
    };
  }, [origin]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;
      const root = rootRef.current;
      if (!root) return;
      const focusable = getFocusable(root);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  const onBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) close();
  };

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
    }
  };

  if (!portalReady) return null;

  const accentStyle = {
    "--details-accent": card.accent,
  } as CSSProperties;

  return createPortal(
    <div
      ref={rootRef}
      id="what-i-do-details"
      className={[
        "home-what-i-do-details",
        phase === "closing" ? "is-closing" : "is-open",
      ].join(" ")}
      style={accentStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="what-i-do-details-title"
      onKeyDown={onDialogKeyDown}
    >
      <div
        className="home-what-i-do-details__bg home-what-i-do-details__bg--up"
        onClick={onBackdropClick}
        aria-hidden
      />
      <div
        ref={bgDownRef}
        className="home-what-i-do-details__bg home-what-i-do-details__bg--down"
      />

      <div ref={imgRef} className="home-what-i-do-details__img">
        <HomeWhatIDoSkillIcon id={card.id} />
      </div>

      <div className="home-what-i-do-details__copy">
        <p className="home-what-i-do-details__kicker font-mono">{"// SKILL"}</p>
        <h3
          id="what-i-do-details-title"
          className="home-what-i-do-details__title home-role-label font-semibold text-foreground"
        >
          {card.title}
        </h3>
        <span className="home-what-i-do-details__deco" aria-hidden>
          <HomeWhatIDoSkillIcon id={card.id} />
        </span>
        <p
          className="home-what-i-do-details__subtitle font-mono"
          style={{ color: card.accent }}
        >
          {card.subtitle}
        </p>
        <ul className="home-what-i-do-details__highlights font-mono">
          {card.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="home-what-i-do-details__description text-foreground/80">
          {card.body}
        </p>
        <Link href={card.workHref} className="home-what-i-do-details__cta font-mono">
          {card.workLabel} →
        </Link>
      </div>

      <button
        ref={closeRef}
        type="button"
        className="home-what-i-do-details__close"
        onClick={close}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="home-what-i-do-details__close-icon">
          <path d="M5 5 L19 19" />
          <path d="M19 5 L5 19" />
          <path d="M4 4 H9" />
          <path d="M15 4 H20" />
          <path d="M4 20 H9" />
          <path d="M15 20 H20" />
        </svg>
        <span className="sr-only">Close {card.title} details</span>
      </button>
    </div>,
    document.body,
  );
}
