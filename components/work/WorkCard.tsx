import Image from "next/image";
import Link from "next/link";

import { CyberHudBracket } from "@/components/CyberDeco";
import { urlFor } from "@/lib/sanity/image";
import type { WorkListItem } from "@/lib/sanity/types";
import { workThumbnailCoverDimensions, workThumbnailImageVars } from "@/lib/work-thumbnail-display";
import {
  WORK_CATEGORY_EN_LABELS,
  WORK_CATEGORY_JP_LABELS,
} from "@/lib/work-labels";

type WorkCardProps = {
  work: WorkListItem;
  /** Optional 1-based index label for featured-style grids */
  index?: number;
};

export function WorkCard({ work, index }: WorkCardProps) {
  const thumbDimensions = workThumbnailCoverDimensions(work.thumbnailDisplay);
  const coverUrl = work.coverImage
    ? urlFor(work.coverImage)
        .width(thumbDimensions.width)
        .height(thumbDimensions.height)
        .fit("min")
        .quality(90)
        .auto("format")
        .url()
    : null;
  const thumbnailStyle = workThumbnailImageVars(work.thumbnailDisplay);
  const href = `/work/${work.slug}`;

  return (
    <article className="work-card group relative">
      <CyberHudBracket />
      <Link
        href={href}
        className="work-card__link block"
        aria-label={`${work.title} — ${work.summary}`}
      >
        {index !== undefined ? (
          <span className="work-card__index font-mono" aria-hidden>
            {String(index).padStart(2, "0")}
            <span className="text-[var(--home-stat-red)]">+</span>
          </span>
        ) : null}

        <div className="work-card__media relative aspect-[3/4] w-full bg-foreground/5">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={work.coverImage?.alt ?? work.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
              className="work-card__image object-cover"
              style={thumbnailStyle}
            />
          ) : (
            <div className="absolute inset-0 bg-foreground/5" aria-hidden />
          )}

          <div className="work-card__category" aria-hidden>
            <span className="work-card__category-jp">
              {WORK_CATEGORY_JP_LABELS[work.category]}
            </span>
            <span className="work-card__category-en">
              {WORK_CATEGORY_EN_LABELS[work.category]}
            </span>
          </div>

          <div className="work-card__reveal" aria-hidden>
            <div className="work-card__reveal-backdrop" />
            <div className="work-card__reveal-pixels" />
            <div className="work-card__reveal-scanlines" />
            <div className="work-card__reveal-slices" />
            <div className="work-card__reveal-content">
              <p className="work-card__reveal-kicker font-mono">{"// DATA"}</p>
              <h3 className="work-card__reveal-title font-mono">{work.title}</h3>
              <p className="work-card__reveal-summary">{work.summary}</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
