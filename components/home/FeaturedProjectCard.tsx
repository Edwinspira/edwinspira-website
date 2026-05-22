import Image from "next/image";
import Link from "next/link";

import { CyberHudBracket } from "@/components/CyberDeco";
import { urlFor } from "@/lib/sanity/image";
import type { WorkListItem } from "@/lib/sanity/types";

const CATEGORY_LABELS: Record<WorkListItem["category"], string> = {
  software: "Software",
  art: "Art",
  video: "Video",
  sculpture3d: "3D Sculpture",
};

type FeaturedProjectCardProps = {
  work: WorkListItem;
  index: number;
};

export function FeaturedProjectCard({ work, index }: FeaturedProjectCardProps) {
  const coverUrl = work.coverImage ? urlFor(work.coverImage).width(640).height(360).url() : null;
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="featured-project-card relative flex h-full flex-col border border-[var(--home-stat-red)]/80 bg-black/40">
      <CyberHudBracket />
      <Link href={`/work/${work.slug}`} className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-[var(--home-stat-red)]/50 px-3 py-2 font-mono text-xs tracking-widest text-foreground uppercase">
          <span>{number}</span>
          <span className="text-[var(--home-stat-red)]" aria-hidden>
            +
          </span>
        </div>
        <div className="relative aspect-[16/10] w-full bg-foreground/5">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={work.coverImage?.alt ?? work.title}
              fill
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-foreground/5" aria-hidden />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-mono text-sm font-semibold tracking-[0.12em] text-foreground uppercase sm:text-base">
            {work.title}
          </h3>
          <p className="font-mono text-[0.65rem] tracking-[0.15em] text-muted uppercase">
            {CATEGORY_LABELS[work.category]}
          </p>
          <p className="mt-auto text-sm leading-relaxed text-foreground/80">{work.summary}</p>
        </div>
      </Link>
    </article>
  );
}
