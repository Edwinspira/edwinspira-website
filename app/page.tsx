import Link from "next/link";

import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="font-mono text-xs tracking-widest text-accent uppercase">
        Creative-tech portfolio
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">{siteConfig.tagline}</p>
      <p className="mt-4 max-w-xl text-muted">{siteConfig.description}</p>
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/work"
          className="inline-flex items-center rounded-full border border-border bg-foreground/5 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          View work
        </Link>
      </div>
      <section className="mt-20 border-t border-border pt-12" aria-labelledby="coming-soon">
        <h2 id="coming-soon" className="font-mono text-xs tracking-widest text-muted uppercase">
          Coming soon
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {["Software", "Art", "Video edits", "3D sculpture"].map((category) => (
            <li
              key={category}
              className="rounded-lg border border-border bg-foreground/[0.02] px-5 py-4 text-sm text-muted"
            >
              {category}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
