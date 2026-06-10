import Image from "next/image";

import { ExternalLink } from "@/components/external-link";
import { PortableTextContent } from "@/components/portable-text";
import { VideoEmbed } from "@/components/video-embed";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage, WorkDetail } from "@/lib/sanity/types";
import { WORK_CATEGORY_LABELS } from "@/lib/work-labels";

const WORK_DETAIL_COVER_MAX_WIDTH = 2560;

type WorkDetailViewProps = {
  work: WorkDetail;
};

function coverImageDimensions(image?: SanityImage | null) {
  const width = image?.dimensions?.width;
  const height = image?.dimensions?.height;

  if (width && height) {
    return { width, height };
  }

  return { width: 1920, height: 1080 };
}

export function WorkDetailView({ work }: WorkDetailViewProps) {
  const coverDimensions = coverImageDimensions(work.coverImage);
  const coverUrl = work.coverImage
    ? urlFor(work.coverImage).width(WORK_DETAIL_COVER_MAX_WIDTH).fit("max").url()
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
        <div className="work-detail__cover mt-8 w-full border border-[var(--home-stat-red)]/50 bg-foreground/5">
          <Image
            src={coverUrl}
            alt={work.coverImage?.alt ?? work.title}
            width={coverDimensions.width}
            height={coverDimensions.height}
            priority
            sizes="(max-width: 1536px) 100vw, 90rem"
            className="block h-auto w-full"
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
