import Image from "next/image";

import { ExternalLink } from "@/components/external-link";
import { PortableTextContent } from "@/components/portable-text";
import { VideoEmbed } from "@/components/video-embed";
import { urlFor } from "@/lib/sanity/image";
import type { WorkDetail } from "@/lib/sanity/types";
import { WORK_CATEGORY_LABELS } from "@/lib/work-labels";

type WorkDetailViewProps = {
  work: WorkDetail;
};

export function WorkDetailView({ work }: WorkDetailViewProps) {
  const coverUrl = work.coverImage
    ? urlFor(work.coverImage).width(1920).fit("max").url()
    : null;

  return (
    <article className="work-detail">
      <header className="max-w-3xl">
        <p className="font-mono text-[0.65rem] tracking-[0.18em] text-[var(--home-stat-red)] uppercase sm:text-xs">
          {WORK_CATEGORY_LABELS[work.category]}
        </p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-[0.1em] text-foreground uppercase sm:text-3xl">
          {work.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground/85 sm:text-base">{work.summary}</p>
      </header>

      {coverUrl ? (
        <div className="work-detail__cover mt-8 w-full max-w-4xl border border-[var(--home-stat-red)]/50 bg-foreground/5">
          <Image
            src={coverUrl}
            alt={work.coverImage?.alt ?? work.title}
            width={1920}
            height={2560}
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="h-auto w-full"
          />
        </div>
      ) : null}

      {work.videoUrl ? (
        <div className="mt-8 max-w-4xl">
          <VideoEmbed url={work.videoUrl} title={work.title} />
        </div>
      ) : null}

      {work.body && work.body.length > 0 ? (
        <div className="mt-8">
          <PortableTextContent value={work.body} />
        </div>
      ) : null}

      {work.gallery && work.gallery.length > 0 ? (
        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2">
          {work.gallery.map((image, index) => {
            const imageUrl = urlFor(image).width(1200).fit("max").url();
            return (
              <li
                key={image.asset?._ref ?? `gallery-${index}`}
                className="overflow-hidden border border-[var(--home-stat-red)]/30 bg-foreground/5"
              >
                <Image
                  src={imageUrl}
                  alt={image.alt ?? `${work.title} gallery image ${index + 1}`}
                  width={1200}
                  height={900}
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="h-auto w-full"
                />
              </li>
            );
          })}
        </ul>
      ) : null}

      {work.externalUrl ? (
        <p className="mt-10">
          <ExternalLink href={work.externalUrl}>View project</ExternalLink>
        </p>
      ) : null}
    </article>
  );
}
