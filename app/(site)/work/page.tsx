import Link from "next/link";

import { CyberSectionMarker } from "@/components/CyberDeco";
import { CategoryFilter } from "@/components/work/CategoryFilter";
import { WorkEmptyState } from "@/components/work/WorkEmptyState";
import { WorkGrid } from "@/components/work/WorkGrid";
import { getWorks } from "@/lib/sanity/get-works";
import type { WorkCategory } from "@/lib/sanity/types";
import { isSanityConfigured } from "@/lib/sanity/is-configured";
import { isWorkCategory } from "@/lib/work-labels";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Work",
  description: `Project showcase for ${siteConfig.name} — software, art, video, and 3D sculpture.`,
};

type WorkPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const { category: categoryParam } = await searchParams;
  const activeCategory: WorkCategory | null =
    categoryParam && isWorkCategory(categoryParam) ? categoryParam : null;

  const allWorks = await getWorks();
  const works = activeCategory
    ? allWorks.filter((work) => work.category === activeCategory)
    : allWorks;

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-6xl px-[var(--home-pad)] py-16 sm:py-20">
        <div className="mb-4 flex items-center gap-4">
          <CyberSectionMarker />
          <div className="home-section-rule flex-1" aria-hidden>
            <div className="home-section-rule__line" />
          </div>
        </div>
        <h1 className="font-mono text-2xl font-medium tracking-[0.12em] text-foreground uppercase sm:text-3xl">
          {"// WORK"}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          {siteConfig.tagline}
        </p>

        <CategoryFilter activeCategory={activeCategory} />

        {!isSanityConfigured() ? (
          <WorkEmptyState
            title="CMS not configured"
            description="Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to your environment to load projects."
          />
        ) : allWorks.length === 0 ? (
          <WorkEmptyState
            title="No projects yet"
            description="Publish work entries in Sanity Studio to populate this page."
          />
        ) : works.length === 0 ? (
          <WorkEmptyState
            title="No projects in this category"
            description="Try another filter or view all projects."
          />
        ) : (
          <WorkGrid works={works} />
        )}

        <p className="mt-12">
          <Link
            href="/"
            className="font-mono text-xs tracking-[0.14em] text-muted uppercase transition-colors hover:text-[var(--home-stat-red)] sm:text-sm"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
