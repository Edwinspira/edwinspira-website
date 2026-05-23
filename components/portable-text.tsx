import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-sm leading-relaxed text-foreground/85 last:mb-0 sm:text-base">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 font-mono text-lg font-semibold tracking-[0.1em] text-foreground uppercase">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 font-mono text-base font-semibold tracking-[0.08em] text-foreground uppercase">
        {children}
      </h3>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      return (
        <a
          href={href}
          className="text-[var(--home-stat-red)] underline underline-offset-2 transition-colors hover:text-foreground"
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-foreground/85 sm:text-base">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-foreground/85 sm:text-base">
        {children}
      </ol>
    ),
  },
};

type PortableTextContentProps = {
  value: PortableTextBlock[];
};

export function PortableTextContent({ value }: PortableTextContentProps) {
  return (
    <div className="portable-text max-w-3xl">
      <PortableText value={value} components={components} />
    </div>
  );
}
