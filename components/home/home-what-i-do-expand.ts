export type ExpandOrigin = {
  bg: HTMLElement;
  img: HTMLElement;
  trigger: HTMLButtonElement;
};

export function invertTransform(from: DOMRect, to: DOMRect): string {
  const scaleX = to.width === 0 ? 1 : from.width / to.width;
  const scaleY = to.height === 0 ? 1 : from.height / to.height;
  return `translateX(${from.left - to.left}px) translateY(${from.top - to.top}px) scaleX(${scaleX}) scaleY(${scaleY})`;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function lockPageScroll(): () => void {
  const html = document.documentElement;
  const { body } = document;
  const prevHtml = html.style.overflow;
  const prevBody = body.style.overflow;
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  return () => {
    html.style.overflow = prevHtml;
    body.style.overflow = prevBody;
  };
}

export function setPageInert(inert: boolean): void {
  const nodes = document.querySelectorAll("header, #main-content, footer");
  nodes.forEach((node) => {
    if (inert) {
      node.setAttribute("inert", "");
    } else {
      node.removeAttribute("inert");
    }
  });
}

export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}
