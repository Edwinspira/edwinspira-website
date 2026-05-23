import Image from "next/image";
import Link from "next/link";

import { CyberHudBracket } from "@/components/CyberDeco";
import { urlFor } from "@/lib/sanity/image";
import type { WorkListItem } from "@/lib/sanity/types";
import { WORK_CATEGORY_LABELS } from "@/lib/work-labels";

type WorkCardProps = {
  work: WorkListItem;
  /** Optional 1-based index label for featured-style grids */
  index?: number;
};

export function WorkCard({ work, index }: WorkCardProps) {
  const coverUrl = work.coverImage ? urlFor(work.coverImage).width(640).height(360).url() : null;
  const href = `/work/${work.slug}`;

  return (
    <article className="work-card relative flex h-full flex-col border border-[var(--home-stat-red)]/80 bg-black/40">
      <CyberHudBracket />
      <Link href={href} className="flex h-full flex-col">
        {index !== undefined ? (
          <div className="flex items-center gap-2 border-b border-[var(--home-stat-red)]/50 px-3 py-2 font-mono text-xs tracking-widest text-foreground uppercase">
            <span>{String(index).padStart(2, "0")}</span>
            <span className="text-[var(--home-stat-red)]" aria-hidden>
              +
            </span>
          </div>
        ) : null}
        <div className="relative aspect-[16/10] w-full bg-foreground/5">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={work.coverImage?.alt ?? work.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            {WORK_CATEGORY_LABELS[work.category]}
          </p>
          <p className="mt-auto text-sm leading-relaxed text-foreground/80">{work.summary}</p>
        </div>
      </Link>
    </article>
  );
}
