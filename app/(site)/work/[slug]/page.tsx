import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CyberSectionMarker } from "@/components/CyberDeco";
import { WorkDetailView } from "@/components/work/WorkDetail";
import { getWorkBySlug } from "@/lib/sanity/get-work-by-slug";
import { getWorkSlugs } from "@/lib/sanity/get-work-slugs";
import { urlFor } from "@/lib/sanity/image";

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getWorkSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    return { title: "Work not found" };
  }

  const coverUrl = work.coverImage
    ? urlFor(work.coverImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title: work.title,
    description: work.summary,
    openGraph: coverUrl
      ? {
          images: [{ url: coverUrl, alt: work.coverImage?.alt ?? work.title }],
        }
      : undefined,
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;

  if (!slug.trim()) {
    notFound();
  }

  const work = await getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-[90rem] px-[var(--home-pad)] py-16 sm:py-20">
        <p className="mb-8">
          <Link
            href="/work"
            className="font-mono text-xs tracking-[0.14em] text-muted uppercase transition-colors hover:text-[var(--home-stat-red)] sm:text-sm"
          >
            ← All work
          </Link>
        </p>

        <div className="mb-4 flex items-center gap-4">
          <CyberSectionMarker />
          <div className="home-section-rule flex-1" aria-hidden>
            <div className="home-section-rule__line" />
          </div>
        </div>

        <WorkDetailView work={work} />
      </div>
    </div>
  );
}
