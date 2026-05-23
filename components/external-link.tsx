import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className = "" }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        "inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-[var(--home-stat-red)] uppercase underline underline-offset-4 transition-colors hover:text-foreground sm:text-sm"
      }
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}
